const creditTransactionTagsService = require('../services')['creditTransactionTagsService'];

exports.create = async (req, res) => {
  try {
    const postData = req.body;

    const data = await creditTransactionTagsService.create(postData);

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
    const data = await creditTransactionTagsService.findAll();
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
    const data = await creditTransactionTagsService.findOne(id);

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

    const data = await creditTransactionTagsService.update(id, putData);

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
    const data = await creditTransactionTagsService.delete(id);

    res.json({
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
