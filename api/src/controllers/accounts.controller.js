const accountsService = require('../services')['accountsService']

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
        message: `Can't find record to update: ${id}`
      })
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
