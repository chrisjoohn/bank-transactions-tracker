const express = require('express');
const multer = require('multer');

const router = express.Router();

// middlewares
const checkAccountMiddleware = require('../tools/middlewares/accounts/checkAccount');

module.exports = (app) => {
  const route = 'accounts';

  const controller = require(`../controllers/accounts.controller`);

  const upload = multer({ storage: multer.memoryStorage() });

  router.use(`/${route}/:id`, checkAccountMiddleware);

  /**
   * TODO: move transaction-related endpoints here to transactions endpoint
   */
  router.get(`/${route}/:id`, controller.findOne);
  router.get(`/${route}`, controller.findAll);
  router.get(`/${route}/:id/transactions/:transactionId`, controller.findTransaction);

  router.post(`/${route}/:id/transactions/cashflow`, controller.cashflow);
  router.post(`/${route}/:id/transactions/analytics`, controller.transactionAnalytics);
  router.post(`/${route}/:id/analytics/total-per-tag`, controller.getTotalPerTag);

  // chart-related endpoints
  router.post(`/${route}/:id/charts`, controller.createChart);
  router.get(`/${route}/:id/charts`, controller.findCharts);


  router.post(`/${route}/:id/transaction-tags`, controller.createTransactionTag);
  router.post(`/${route}/:id/parse-statement`, upload.single('file'), controller.parseStatement);
  router.post(`/${route}/:id/transactions/bulk-create`, controller.bulkCreateTransactions);
  router.post(`/${route}/:id/transactions`, controller.findTransactions); // find account transactions
  router.post(`/${route}`, controller.create);

  router.put(`/${route}/:id`, controller.update);

  router.delete(
    `/${route}/:id/transaction/:transactionId/tags/:tagId`,
    controller.deleteTransactionTag
  );
  router.delete(`/${route}/:id`, controller.delete);

  app.use(`/`, router);
};
