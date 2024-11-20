const bankStatementParser = require('../tools/parsers/bankStatementParser');

const models = require('../models');

// required name to be used on exporting services on index
exports.serviceName = 'debitTransactionsService';

exports.create = async ({
  account_id,
  description,
  transaction_date,
  transaction_type,
  amount,
}) => {
  try {
    const debitTransactionsModel = models.debit_transactions;

    const postData = {
      account_id,
      description,
      transaction_date,
      transaction_type,
      amount,
    };

    const data = await debitTransactionsModel.create(postData);

    return data;
  } catch (err) {
    console.log('Error in create debitTransactions service: ', err);
    throw err;
  }
};

exports.findAll = async () => {
  try {
    const debitTransactionsModel = models.debit_transactions;

    const data = await debitTransactionsModel.findAll();
    return data;
  } catch (err) {
    console.log('Error in find all debitTransactions service: ', err);
    throw err;
  }
};

exports.findOne = async (id) => {
  try {
    const debitTransactionsModel = models.debit_transactions;

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const data = await debitTransactionsModel.findOne({
      where: { [keyField]: id },
    });

    return data;
  } catch (err) {
    console.log('Error in find one debitTransactions service: ', err);
    throw err;
  }
};

exports.update = async (
  id,
  { account_id, description, transaction_date, transaction_type, amount }
) => {
  try {
    const debitTransactionsModel = models.debit_transactions;

    const putData = {
      account_id,
      description,
      transaction_date,
      transaction_type,
      amount,
    };

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const [updated] = await debitTransactionsModel.update(putData, {
      where: {
        [keyField]: id,
      },
    });

    if (!updated) {
      throw 'Not found!';
    }

    const data = await debitTransactionsModel.findOne({
      where: { [keyField]: id },
    });

    return data;
  } catch (err) {
    console.log('Error in update debitTransactions service: ', err);
    throw err;
  }
};

exports.delete = async (id) => {
  try {
    const debitTransactionsModel = models.debit_transactions;

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const data = await debitTransactionsModel.destroy({
      where: { [keyField]: id },
    });

    return data;
  } catch (err) {
    console.log('Error in delete debitTransactions service: ', err);
    throw err;
  }
};

exports.parseStatement = async (file) => {
  try {

    // keywords
    const keywordsToSkip = ['BEGINNING', 'BALANCE'];
    const startKeywords = ['DATE', 'BALANCE', 'AMOUNT'];
    const endKeywords = ['BALANCETHISSTATEMENT'];

    const colPositions = {
      date: [30, 60],
      description: [60, 115],
      ref: [195, 216],
      details: [220, 360],
      debit_amount: [400, 435],
      credit_amount: [470, 500],
    };

    const options = {
      keywordsToSkip,
      startKeywords,
      endKeywords,
      colPositions,
    };

    const { data } = await bankStatementParser(file.buffer, options);

    return data;
  } catch (err) {
    throw err;
  }
};
