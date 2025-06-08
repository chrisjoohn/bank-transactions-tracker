const { startOfMonth, endOfMonth } = require('date-fns');

const accountsService = require('../services')['accountsService'];
const debitTransactionService = require('../services/debitTransactions.service');
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
    const { id, transactionId } = req.params;
    const user_id = req.user.user_id;

    const accountDetails = await accountsService.findOne(id, { user_id });

    /**
     * TODO: update these to just be thrown from API services and be caught and error parsed
     */
    if (!accountDetails) {
      res.status(400).json({
        message: 'Bad request: Account not found!',
      });
      return;
    }

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
    const { id } = req.params;
    const user_id = req.user.user_id;
    const { filters, includes } = req.body;

    const accountDetails = await accountsService.findOne(id, { user_id });

    if (!accountDetails) {
      res.status(400).json({
        message: 'Bad request: Account not found!',
      });
      return;
    }

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

exports.transactionAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const { filters } = req.body;
    const { transaction_date, post_date, tags } = filters; // TODO: check what should happen if there's transaction and post dates passed as filters

    const user_id = req.user.user_id;
    const accountDetails = await accountsService.findOne(id, { user_id });

    if (!accountDetails) {
      res.status(400).json({
        message: 'Bad request: Account not found!',
      });
      return;
    }

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
    const { id } = req.params;
    const user_id = req.user.user_id;

    const data = await accountsService.findOne(id, { user_id });

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
    const { user_id } = req.user;

    const putData = req.body;

    const toUpdate = await accountsService.findOne(id, { user_id });
    if (!toUpdate) {
      res.status(400).json({
        message: `Can't find record to update: ${id}`,
      });
      return;
    }

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
    const { user_id } = req.user;

    const toDelete = await accountsService.findOne(id, { user_id });
    if (!toDelete) {
      res.status(400).json({
        message: `Can't find record to update: ${id}`,
      });
      return;
    }

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
    const { id } = req.params;
    const { user_id } = req.user;
    const file = req.file;

    const account = await accountsService.findOne(id, { user_id });
    if (!account) {
      res.status(400).json({
        message: 'Bad request: Account not found!',
      });
      return;
    }

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
    const { id } = req.params;
    const { user_id } = req.user;
    const { records } = req.body;

    const account = await accountsService.findOne(id, { user_id }); // TODO: check if we can incorporate that we'll always just query user data without passing filters

    if (!account) {
      // TODO: check if we can create a generic one for this one
      // so that we're not doing this everytime
      res.status(400).json({
        message: 'Bad request: Account not found!',
      });
      return;
    }

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
    const { id } = req.params;
    const { user_id } = req.user;
    const { transaction_id, tag_id } = req.body;

    const account = await accountsService.findOne(id, { user_id });

    if (!account) {
      res.status(400).json({
        message: 'Bad request: Account not found!',
      });
      return;
    }

    let transaction = null;

    switch (account.type) {
      case 'CREDIT':
        transaction = await creditTransactionService.findOne(transaction_id);
        break;
      case 'DEPOSIT':
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
    const { id, transactionId, tagId } = req.params;
    const { user_id } = req.user;

    const account = await accountsService.findOne(id, { user_id });

    if (!account) {
      res.status(400).json({
        message: 'Bad request: Account not found!',
      });
      return;
    }

    let data = null;

    switch (account.type) {
      case 'CREDIT':
        data = await creditTransactionTagService.deleteByTransactionAndTag({
          transactionId,
          tagId,
        });
        break;
      case 'DEPOSIT':
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
