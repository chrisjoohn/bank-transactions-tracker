const express = require('express');

const router = express.Router();

module.exports = (app) => {
  const route = 'debit_transactions';

  const controller = require(`../controllers/debitTransactions.controller`);

  router.get(`/${route}`, controller.findAll);
  router.get(`/${route}/:id`, controller.findOne);
  router.post(`/${route}`, controller.create);
  router.put(`/${route}/:id`, controller.update);
  router.delete(`/${route}/:id`, controller.delete);

  app.use(`/`, router);
};
