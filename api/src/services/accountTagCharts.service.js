const models = require('../models');

exports.serviceName = 'accountTagCharts';

exports.create = async ({ account_id, tag_chart_id }, options = {}) => {
  try {
    const accountTagChartModel = models.account_tag_charts;

    const result = await accountTagChartModel.create(
      {
        account_id,
        tag_chart_id,
      },
      options
    );

    return result;
  } catch (err) {
    console.error('Error creating account tag chart:', err);
    throw err;
  }
};
