const models = require('../models');

const debitTransactionService = require('./debitTransactions.service');
const tagService = require('./tags.service');

// required name to be used on exporting services on index
exports.serviceName = 'debitTransactionTagService';

exports.create = async ({ tag_id, debit_transaction_id }) => {
  try {
    const debitTransactionTagsModel = models.debit_transaction_tags;

    const postData = {
      tag_id,
      debit_transaction_id,
    };

    const data = await debitTransactionTagsModel.create(postData);

    return data;
  } catch (err) {
    console.log('Error in create debit_transaction_tags service: ', err);
    throw err;
  }
};

exports.findAll = async () => {
  try {
    const debitTransactionTagsModel = models.debit_transaction_tags;

    const data = await debitTransactionTagsModel.findAll();
    return data;
  } catch (err) {
    console.log('Error in find all debit_transaction_tags service: ', err);
    throw err;
  }
};

exports.findOne = async (id) => {
  try {
    const debitTransactionTagsModel = models.debit_transaction_tags;

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const data = await debitTransactionTagsModel.findOne({ where: { [keyField]: id } });

    return data;
  } catch (err) {
    console.log('Error in find one debit_transaction_tags service: ', err);
    throw err;
  }
};

exports.delete = async (id) => {
  try {
    const debitTransactionTagsModel = models.debit_transaction_tags;

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const data = await debitTransactionTagsModel.destroy({ where: { [keyField]: id } });

    return data;
  } catch (err) {
    console.log('Error in delete debit_transaction_tags service: ', err);
    throw err;
  }
};

exports.deleteByTransactionAndTag = async ({ transactionId, tagId }) => {
  try {
    const debitTransactionTagsModel = models.debit_transaction_tags;

    const debitTransacton = await debitTransactionService.findOne(transactionId);
    const tag = await tagService.findOne(tagId);

    if (!debitTransacton || !tag) {
      throw 'Cannot find transaction and/or tag!';
    }

    const data = await debitTransactionTagsModel.destroy({
      where: { debit_transaction_id: debitTransacton.id, tag_id: tag.id },
    });

    return data;
  } catch (err) {
    console.log('Error in deleteByTransactionAndTag debit_transaction_tags service: ', err);
    throw err;
  }
};
