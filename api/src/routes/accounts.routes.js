const express = require('express');

const router = express.Router();

module.exports = (app) => {
  const route = 'accounts';

  const controller = require(`../controllers/accounts.controller`);

  router.get(`/${route}/:id/transactions/analytics`, controller.transactionAnalytics);
  router.get(`/${route}/:id`, controller.findOne);
  router.get(`/${route}`, controller.findAll);

  router.post(`/${route}/:id/transactions`, controller.findTransactions);
  router.post(`/${route}`, controller.create);

  router.put(`/${route}/:id`, controller.update);

  router.delete(`/${route}/:id`, controller.delete);

  app.use(`/`, router);
};
