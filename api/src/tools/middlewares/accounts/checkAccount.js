const accountService = require('../../../services/accounts.service');

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_id } = req.user;

    const accountDetails = await accountService.findOne(id, { user_id });

    if (!accountDetails) {
      res.status(400).json({
        message: 'Bad request: account not found',
      });
      return;
    }

    req.account = accountDetails;
    next();
  } catch (err) {
    console.log('checkAccount - middleware - err:', err);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};
