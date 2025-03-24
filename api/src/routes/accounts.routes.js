const express = require('express');
const multer = require('multer');

const router = express.Router();

module.exports = (app) => {
  const route = 'accounts';

  const controller = require(`../controllers/accounts.controller`);

  const upload = multer({ storage: multer.memoryStorage() });

  router.get(`/${route}/:id/transactions/analytics`, controller.transactionAnalytics);
  router.get(`/${route}/:id`, controller.findOne);
  router.get(`/${route}`, controller.findAll);

  router.post(`/${route}/:id/parse-statement`, upload.single('file'), controller.parseStatement);
  router.post(`/${route}/:id/transactions/bulk-create`, controller.bulkCreateTransactions);
  router.post(`/${route}/:id/transactions`, controller.findTransactions); // find account transactions
  router.post(`/${route}`, controller.create);

  router.put(`/${route}/:id`, controller.update);

  router.delete(`/${route}/:id`, controller.delete);

  app.use(`/`, router);
};
