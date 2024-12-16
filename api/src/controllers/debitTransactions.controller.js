const debitTransactionsService = require('../services')['debitTransactionsService'];
const accountsService = require('../services/accounts.service');

exports.create = async (req, res) => {
  try {
    const postData = req.body;

    const data = await debitTransactionsService.create(postData);

    res.json({
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.bulkCreate = async (req, res) => {
  try {
    const { records, account_id } = req.body;
    const user_id = req.user.user_id;

    // need to update finding accounts by user
    const accountDetails = await accountsService.findOne(account_id, { user_id });

    if (!accountDetails || accountDetails.type !== 'DEPOSIT') {
      res.status(400).json({
        message: 'Bad request: Account not found!'
      });
      return;
    }

    const data = await debitTransactionsService.bulkCreate({ records, account_id: accountDetails.id });

    res.json({
      data
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message
    })
  }
}

exports.findAll = async (req, res) => {
  try {
    const data = await debitTransactionsService.findAll();
    res.json({
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await debitTransactionsService.findOne(id);

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

    const data = await debitTransactionsService.update(id, putData);

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
    const data = await debitTransactionsService.delete(id);

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

    if (!file) {
      res.status(400).json({
        message: `There's no file uploaded!`,
      });
      return;
    }

    const data = await debitTransactionsService.parseStatement(file);

    res.json({
      data,
    });
  } catch (err) {
    // console.log('err', err);
    res.status(500).json({
      message: err.message,
    });
  }
};
