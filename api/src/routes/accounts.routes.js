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
   * TODO: re-group routes for better readability
   */
  router.get(`/${route}/:id`, controller.findOne); // -- GET one account
  router.get(`/${route}`, controller.findAll); // -- GET all accounts
  router.get(`/${route}/:id/transactions/:transactionId`, controller.findTransaction); // -- GET one transaction

  router.post(`/${route}/:id/analytics/basic`, controller.transactionAnalytics); // -- GET basic analytics;
  router.post(`/${route}/:id/analytics/total-per-tag`, controller.getTotalPerTag); // -- GET analytics data per tag
  router.post(`/${route}/:id/transaction-tags`, controller.createTransactionTag); // -- GET transaction tags
  router.post(`/${route}/:id/parse-statement`, upload.single('file'), controller.parseStatement); // -- parse data from pdf/csv statement
  router.post(`/${route}/:id/transactions/bulk-create`, controller.bulkCreateTransactions); // -- CREATE multiple transactions
  router.post(`/${route}/:id/transactions`, controller.findTransactions); // -- GET all account transactions
  router.post(`/${route}`, controller.create); // -- CREATE account

  router.put(`/${route}/:id`, controller.update); // -- UPDATE account

  router.delete(
    `/${route}/:id/transaction/:transactionId/tags/:tagId`, // -- DELETE transaction tag
    controller.deleteTransactionTag
  );
  router.delete(`/${route}/:id`, controller.delete); // -- DELETE account

  app.use(`/`, router);
};
