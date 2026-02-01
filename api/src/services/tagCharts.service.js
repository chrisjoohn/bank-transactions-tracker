const models = require('../models');

exports.serviceName = 'tagCharts';

exports.create = async ({ title, chartType, data, preFilter, series }, options = {}) => {
  try {
    const TagChartsModel = models.tag_charts;
    const postData = {
      title,
      chartType,
      data,
      preFilter,
      series,
    };

    const result = await TagChartsModel.create(postData, options);
    return result;
  } catch (error) {
    console.error('Error creating tag chart:', error);
    throw error;
  }
};
