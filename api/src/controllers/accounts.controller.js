const { startOfMonth, endOfMonth } = require('date-fns');

const accountsService = require('../services')['accountsService'];
const debitTransactionService = require('../services/debitTransactions.service');
const debitTransactionTagService = require('../services/debitTransactionTags.service');
const creditTransactionService = require('../services/creditTransactions.service');
const creditTransactionTagService = require('../services/creditTransactionTags.service');
const tagService = require('../services/tags.service');

exports.create = async (req, res) => {
  try {
    const postData = req.body;
    const user_id = req.user.user_id;

    const data = await accountsService.create({
      ...postData,
      user_id,
    });

    res.json({
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const defaultFilters = {
      user_id,
    };

    const data = await accountsService.findAll({
      filters: { ...defaultFilters },
    });

    res.json({
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.findTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const accountDetails = req.account;

    let data = null;

    // TODO: check on how we could put this as param
    const includes = {
      tags: {},
    };

    if (accountDetails.type === 'CREDIT') {
      data = await creditTransactionService.findOne(transactionId, { includes });
    }

    if (accountDetails.type === 'DEPOSIT') {
      data = await debitTransactionService.findOne(transactionId);
    }

    if (data) {
      res.json({
        data,
      });
      return;
    }

    res.status(401).json({
      message: 'Bad request',
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.findTransactions = async (req, res) => {
  try {
    const { filters, includes } = req.body;
    const accountDetails = req.account;

    let data;

    if (accountDetails.type === 'CREDIT') {
      data = await creditTransactionService.findAll({
        filters: {
          ...filters,
          account_id: accountDetails.id,
        },
        includes,
      });
    }

    if (accountDetails.type === 'DEPOSIT') {
      data = await debitTransactionService.findAll({
        filters: {
          ...filters,
          account_id: accountDetails.id,
        },
        includes,
      });
    }

    if (data) {
      res.json({
        data,
      });
      return;
    }

    res.status(401).json({
      message: 'Bad request',
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.cashflow = async (req, res) => {
  try {
    const { group_by = 'month', fields = ['inflow', 'outflow', 'total'], filters = {} } = req.body;
    const accountDetails = req.account;

    let data;

    const defaultStartDate = startOfMonth(new Date());
    const defaultEndDate = endOfMonth(new Date());

    let defaultDateRange = {
      start_date: defaultStartDate,
      end_date: defaultEndDate,
    };

    if (accountDetails.type === 'CREDIT') {
      data = await creditTransactionService.getCashflow({
        account_id: accountDetails.id,
        date_range: filters.transaction_date || defaultDateRange,
        group_by,
        fields,
      });
    }

    if (accountDetails.type === 'DEPOSIT') {
      data = await debitTransactionService.getCashflow({
        account_id: accountDetails.id,
        date_range: filters.transaction_date || defaultDateRange,
        group_by,
        fields,
      });
    }

    if (!data) {
      res.status(400).json({
        message: 'Bad request',
      });
      return;
    }

    res.json({
      data,
    });
  } catch (err) {
    console.log('err', err);
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.transactionAnalytics = async (req, res) => {
  try {
    const { filters } = req.body;
    const { transaction_date, post_date, tags } = filters; // TODO: check what should happen if there's transaction and post dates passed as filters
    const accountDetails = req.account;

    let data;

    const defaultStartDate = startOfMonth(new Date());
    const defaultEndDate = endOfMonth(new Date());

    let defaultDateRange = {
      start_date: defaultStartDate,
      end_date: defaultEndDate,
    };

    if (accountDetails.type === 'CREDIT') {
      const totalOutflow = await creditTransactionService.getTotalOutflow({
        account_id: accountDetails.id,
        post_date: post_date || defaultDateRange,
        tags,
      });

      data = {
        totalOutflow: totalOutflow || 0,
        totalInflow: 0,
        total: totalOutflow * -1,
      };
    }

    if (accountDetails.type === 'DEPOSIT') {
      const totalOutflow = await debitTransactionService.getTotalOutflow({
        account_id: accountDetails.id,
        date_range: transaction_date || defaultDateRange,
      });
      const totalInflow = await debitTransactionService.getTotalInflow({
        account_id: accountDetails.id,
        date_range: transaction_date || defaultDateRange,
      });

      data = {
        totalOutflow: totalOutflow || 0,
        totalInflow: totalInflow || 0,
        total: totalInflow - totalOutflow,
      };
    }

    if (!data) {
      res.status(400).json({
        message: 'Bad request',
      });
      return;
    }

    res.json({
      data,
    });
  } catch (err) {
    console.log('err', err);
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const data = req.account;

    res.json({
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const putData = req.body;

    const data = await accountsService.update(id, putData);

    res.json({
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await accountsService.delete(id);

    res.json({
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.parseStatement = async (req, res) => {
  try {
    const file = req.file;
    const account = req.account;

    let parsedData = null;

    if (account.type === 'DEPOSIT') {
      parsedData = await debitTransactionService.parseStatement(file);
    }

    if (account.type === 'CREDIT') {
      parsedData = await creditTransactionService.parseStatement(file);
    }

    if (!parsedData) {
      throw 'Error in parsing statement';
    }

    res.json({
      data: parsedData,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.bulkCreateTransactions = async (req, res) => {
  try {
    const { records } = req.body;
    const account = req.account;

    let data = null;

    switch (account.type) {
      case 'CREDIT':
        data = await creditTransactionService.bulkCreate({
          records,
          account_id: account.id,
        });
        break;
      case 'DEPOSIT':
        data = await debitTransactionService.bulkCreate({
          records,
          account_id: account.id,
        });
        break;

      default:
        break;
    }

    if (!data) {
      res.status(400).json({
        message: 'Bad request',
      });
      return;
    }

    res.json({
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.createTransactionTag = async (req, res) => {
  try {
    const { transaction_id, tag_id } = req.body;
    const account = req.account;

    let transaction = null;

    switch (account.type) {
      case 'CREDIT':
        transaction = await creditTransactionService.findOne(transaction_id);
        break;
      case 'DEPOSIT':
        transaction = await debitTransactionService.findOne(transaction_id);
        break;
      default:
        break;
    }

    if (!transaction) {
      res.status(400).json({
        message: 'Bad request: Transaction not found.',
      });
      return;
    }

    const tag = await tagService.findOne(tag_id);

    if (!tag) {
      res.status(400).json({
        message: 'Bad request: tag not found.',
      });
      return;
    }

    let data = null;

    switch (account.type) {
      case 'CREDIT':
        data = await creditTransactionTagService.create({
          credit_transaction_id: transaction.id,
          tag_id: tag.id,
        });
        break;
      case 'DEPOSIT':
        data = await debitTransactionTagService.create({
          debit_transaction_id: transaction.id,
          tag_id: tag.id,
        });
        break;
      default:
        break;
    }

    if (!data) {
      res.status(400).json({
        message: 'Bad request',
      });
    }

    res.json({
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.deleteTransactionTag = async (req, res) => {
  try {
    const { transactionId, tagId } = req.params;
    const account = await req.account;

    let data = null;

    switch (account.type) {
      case 'CREDIT':
        data = await creditTransactionTagService.deleteByTransactionAndTag({
          transactionId,
          tagId,
        });
        break;
      case 'DEPOSIT':
        data = await debitTransactionTagService.deleteByTransactionAndTag({
          transactionId,
          tagId,
        });
        break;
    }

    if (!data) {
      res.status(400).json({
        message: 'Bad request',
      });
      return;
    }

    res.json({
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getTotalPerTag = async (req, res) => {
  try {
    const { filters } = req.body; // check param names
    const accountDetails = req.account;

    let data = [];

    if (accountDetails.type === 'CREDIT') {
      data = await creditTransactionService.getTotalPerTag({
        filters: {
          ...filters,
          account_id: accountDetails.id,
        },
      });
    }

    if (accountDetails.type === 'DEPOSIT') {
      res.status(400).json({
        message: 'Not yet handled',
      });
      return;
    }

    res.json({
      data,
    });
  } catch (err) {
    throw err;
  }
};
