const models = require('../models');

exports.serviceName = 'accountTagCharts';

exports.create = async ({ accountId, tagChartId }, options = {}) => {
  try {
    const accountTagChartModel = models.account_tag_charts;

    const result = await accountTagChartModel.create(
      {
        accountId,
        tagChartId,
      },
      options
    );

    return result;
  } catch (err) {
    console.error('Error creating account tag chart:', err);
    throw err;
  }
};
