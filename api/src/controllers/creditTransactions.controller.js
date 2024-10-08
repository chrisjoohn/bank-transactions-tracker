const creditTransactionsService = require('../services')['creditTransactionsService'];

exports.create = async (req, res) => {
  try {
    const postData = req.body;

    const data = await creditTransactionsService.create(postData);

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
    const data = await creditTransactionsService.bulkCreate({ records, account_id });

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
    const { filters } = req.body;

    const data = await creditTransactionsService.findAll({ filters, });
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
    const data = await creditTransactionsService.findOne(id);

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

    const data = await creditTransactionsService.update(id, putData);

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
    const data = await creditTransactionsService.delete(id);

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

    const data = await creditTransactionsService.parseStatement(file);

    res.json({
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
