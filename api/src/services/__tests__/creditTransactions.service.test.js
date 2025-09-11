const service = require('../creditTransactions.service.js');

const mockFindAllTags = jest.fn();

const mockFindOneAccount = jest.fn();

const mockCreate = jest.fn();
const mockBulkCreate = jest.fn();
const mockFindAll = jest.fn();
const mockFindOne = jest.fn();
const mockUpdate = jest.fn();
const mockDestroy = jest.fn();
const mockSum = jest.fn();

jest.mock('../../models', () => ({
  credit_transactions: {
    create: (...args) => mockCreate(...args),
    bulkCreate: (...args) => mockBulkCreate(...args),
    findAll: (...args) => mockFindAll(...args),
    findOne: (...args) => mockFindOne(...args),
    update: (...args) => mockUpdate(...args),
    destroy: (...args) => mockDestroy(...args),
    sum: (...args) => mockSum(...args),
  },
  credit_transaction_tags: {
    findAll: jest.fn(),
  },
  tags: {
    findAll: (...args) => mockFindAllTags(...args),
  },
}));

jest.mock('../accounts.service', () => ({
  findOne: (...args) => mockFindOneAccount(...args),
}));

jest.mock('../../tools/createHash', () => ({
  createHashFromObj: jest.fn(() => 'hash123'),
}));

jest.mock('../../tools/parsers/bankStatementParser', () =>
  jest.fn(() => Promise.resolve({ data: [{ foo: 'bar' }] }))
);
jest.mock('../../tools/parsers/csvStatementParser', () =>
  jest.fn(() => Promise.resolve([{ foo: 'csv' }]))
);

const sequelize = require('sequelize');
const { Op } = sequelize;

describe('creditTransactionsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a credit transaction if account exists', async () => {
      mockFindOneAccount.mockResolvedValue({ id: 1 });
      mockCreate.mockResolvedValue({ id: 10 });

      const result = await service.create({
        account_id: 1,
        description: 'desc',
        transaction_date: '2023-01-01',
        post_date: '2023-01-02',
      });

      expect(mockFindOneAccount).toHaveBeenCalledWith(1);
      expect(mockCreate).toHaveBeenCalledWith({
        account_id: 1,
        description: 'desc',
        transaction_date: '2023-01-01',
        post_date: '2023-01-02',
      });
      expect(result).toEqual({ id: 10 });
    });

    it('should throw if account does not exist', async () => {
      mockFindOneAccount.mockResolvedValue(null);

      await expect(
        service.create({
          account_id: 1,
          description: 'desc',
          transaction_date: '2023-01-01',
          post_date: '2023-01-02',
        })
      ).rejects.toThrow('Cannot find account: 1');
    });
  });

  describe('bulkCreate', () => {
    it('should bulk create credit transactions with hashes', async () => {
      mockBulkCreate.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      const records = [
        { description: 'desc1', transaction_date: '2023-01-01', post_date: '2023-01-02' },
        { description: 'desc2', transaction_date: '2023-01-03', post_date: '2023-01-04' },
      ];
      const result = await service.bulkCreate({ records, account_id: 5 });

      expect(mockBulkCreate).toHaveBeenCalledWith([
        { ...records[0], account_id: 5, unique_code: 'hash123' },
        { ...records[1], account_id: 5, unique_code: 'hash123' },
      ]);
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('should throw if account_id is missing', async () => {
      await expect(service.bulkCreate({ records: [] })).rejects.toThrow('Account ID is required');
    });
  });

  describe('findAll', () => {
    it('should find all credit transactions with no filters', async () => {
      mockFindAll.mockResolvedValue([{ id: 1 }]);
      const result = await service.findAll({ filters: {}, includes: {} });
      expect(mockFindAll).toHaveBeenCalled();
      expect(result).toEqual([{ id: 1 }]);
    });

    it('should filter by account_id', async () => {
      mockFindOneAccount.mockResolvedValue({ id: 7 });
      mockFindAll.mockResolvedValue([{ id: 1 }]);
      const result = await service.findAll({ filters: { account_id: 7 }, includes: {} });
      expect(mockFindOneAccount).toHaveBeenCalledWith(7);
      expect(mockFindAll).toHaveBeenCalled();
      expect(result).toEqual([{ id: 1 }]);
    });

    it('should throw if account_id filter not found', async () => {
      mockFindOneAccount.mockResolvedValue(null);
      await expect(service.findAll({ filters: { account_id: 99 }, includes: {} })).rejects.toThrow(
        'Cannot find account: 99'
      );
    });

    it('should filter by transaction_date', async () => {
      mockFindAll.mockResolvedValue([{ id: 1 }]);
      const result = await service.findAll({
        filters: { transaction_date: { start_date: '2023-01-01', end_date: '2023-01-31' } },
        includes: {},
      });
      expect(mockFindAll).toHaveBeenCalled();
      expect(result).toEqual([{ id: 1 }]);
    });

    it('should filter by post_date', async () => {
      mockFindAll.mockResolvedValue([{ id: 1 }]);
      const result = await service.findAll({
        filters: { post_date: { start_date: '2023-01-01', end_date: '2023-01-31' } },
        includes: {},
      });
      expect(mockFindAll).toHaveBeenCalled();
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  describe('findOne', () => {
    it('should find one by id', async () => {
      mockFindOne.mockResolvedValue({ id: 1 });
      const result = await service.findOne(1);
      expect(mockFindOne).toHaveBeenCalledWith({ where: { id: 1 }, include: [] });
      expect(result).toEqual({ id: 1 });
    });

    it('should find one by unique_code', async () => {
      mockFindOne.mockResolvedValue({ id: 1, unique_code: 'abc' });
      const result = await service.findOne('abc');
      expect(mockFindOne).toHaveBeenCalledWith({ where: { unique_code: 'abc' }, include: [] });
      expect(result).toEqual({ id: 1, unique_code: 'abc' });
    });
  });

  describe('update', () => {
    it('should update a credit transaction by id', async () => {
      mockUpdate.mockResolvedValue([1]);
      mockFindOne.mockResolvedValue({ id: 1, description: 'updated' });

      const result = await service.update(1, {
        account_id: 2,
        description: 'updated',
        transaction_date: '2023-01-01',
        post_date: '2023-01-02',
      });

      expect(mockUpdate).toHaveBeenCalledWith(
        {
          account_id: 2,
          description: 'updated',
          transaction_date: '2023-01-01',
          post_date: '2023-01-02',
        },
        { where: { id: 1 } }
      );
      expect(mockFindOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({ id: 1, description: 'updated' });
    });

    it('should throw if update does not find a record', async () => {
      mockUpdate.mockResolvedValue([0]);
      await expect(
        service.update(1, {
          account_id: 2,
          description: 'updated',
          transaction_date: '2023-01-01',
          post_date: '2023-01-02',
        })
      ).rejects.toEqual('Not found!');
    });
  });

  describe('delete', () => {
    it('should delete by id', async () => {
      mockDestroy.mockResolvedValue(1);
      const result = await service.delete(1);
      expect(mockDestroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(1);
    });

    it('should delete by unique_code', async () => {
      mockDestroy.mockResolvedValue(1);
      const result = await service.delete('abc');
      expect(mockDestroy).toHaveBeenCalledWith({ where: { unique_code: 'abc' } });
      expect(result).toBe(1);
    });
  });

  describe('parseStatement', () => {
    it('should parse csv statement', async () => {
      const file = { mimeType: 'text/csv', originalname: 'foo.csv', buffer: Buffer.from('') };
      const result = await service.parseStatement(file);
      expect(result).toEqual([{ foo: 'csv' }]);
    });

    it('should parse pdf statement', async () => {
      const file = {
        mimeType: 'application/pdf',
        originalname: 'foo.pdf',
        buffer: Buffer.from(''),
      };
      const result = await service.parseStatement(file);
      expect(result).toEqual([{ foo: 'bar' }]);
    });
  });

  describe('getTotalOutflow', () => {
    it('should sum outflow for account and post_date', async () => {
      mockSum.mockResolvedValue(1000);
      require('../../models').credit_transaction_tags.findAll.mockResolvedValue([]);
      const result = await service.getTotalOutflow({
        account_id: 1,
        post_date: { start_date: '2023-01-01', end_date: '2023-01-31' },
        tags: [],
      });
      expect(mockSum).toHaveBeenCalled();
      expect(result).toBe(1000);
    });

    it('should sum outflow for account, post_date, and tags', async () => {
      mockSum.mockResolvedValue(500);
      require('../../models').credit_transaction_tags.findAll.mockResolvedValue([
        { credit_transaction_id: 1 },
        { credit_transaction_id: 2 },
      ]);
      const result = await service.getTotalOutflow({
        account_id: 1,
        post_date: { start_date: '2023-01-01', end_date: '2023-01-31' },
        tags: [10, 20],
      });
      expect(mockSum).toHaveBeenCalled();
      expect(result).toBe(500);
    });
  });

  describe('getTotalPerTag', () => {
    it('should get total per tag', async () => {
      mockFindAllTags.mockResolvedValue([
        { id: 1, name: 'Tag1', total_amount: 100, count: 2 },
        { id: 2, name: 'Tag2', total_amount: 200, count: 3 },
      ]);
      require('../../models').credit_transaction_tags.findAll.mockResolvedValue([
        { credit_transaction_id: 1 },
        { credit_transaction_id: 2 },
      ]);
      const result = await service.getTotalPerTag({
        filters: {
          account_id: 1,
          post_date: { start_date: '2023-01-01', end_date: '2023-01-31' },
          tags: [1, 2],
        },
      });
      expect(mockFindAllTags).toHaveBeenCalled();
      expect(result).toEqual([
        { id: 1, name: 'Tag1', total_amount: 100, count: 2 },
        { id: 2, name: 'Tag2', total_amount: 200, count: 3 },
      ]);
    });
  });
});
