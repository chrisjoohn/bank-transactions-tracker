const service = require('../debitTransactions.service.js');

const mockCreate = jest.fn();
const mockBulkCreate = jest.fn();
const mockFindAll = jest.fn();
const mockFindOne = jest.fn();
const mockUpdate = jest.fn();
const mockDestroy = jest.fn();
const mockSum = jest.fn();

jest.mock('../../models', () => ({
  debit_transactions: {
    create: (...args) => mockCreate(...args),
    bulkCreate: (...args) => mockBulkCreate(...args),
    findAll: (...args) => mockFindAll(...args),
    findOne: (...args) => mockFindOne(...args),
    update: (...args) => mockUpdate(...args),
    destroy: (...args) => mockDestroy(...args),
    sum: (...args) => mockSum(...args),
  },
}));

const mockFindOneAccount = jest.fn();
jest.mock('../accounts.service', () => ({
  findOne: (...args) => mockFindOneAccount(...args),
}));

jest.mock('../../tools/createHash', () => ({
  createHashFromObj: jest.fn(() => 'hash123'),
}));

jest.mock('../../tools/parsers/bankStatementParser', () => jest.fn(() => Promise.resolve({ data: [{ foo: 'bar' }] })));

const { Op } = require('sequelize');

describe('debitTransactionsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a debit transaction', async () => {
      const fakeData = { id: 1, account_id: 2, amount: 100 };
      mockCreate.mockResolvedValue(fakeData);

      const result = await service.create({
        account_id: 2,
        description: 'desc',
        transaction_date: '2023-01-01',
        transaction_type: 'OUTFLOW',
        amount: 100,
      });

      expect(mockCreate).toHaveBeenCalledWith({
        account_id: 2,
        description: 'desc',
        transaction_date: '2023-01-01',
        transaction_type: 'OUTFLOW',
        amount: 100,
      });
      expect(result).toBe(fakeData);
    });
  });

  describe('bulkCreate', () => {
    it('should bulk create debit transactions with hashes', async () => {
      mockBulkCreate.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      const records = [
        { description: 'desc1', transaction_date: '2023-01-01', transaction_type: 'OUTFLOW', amount: 10 },
        { description: 'desc2', transaction_date: '2023-01-02', transaction_type: 'INFLOW', amount: 20 },
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
    it('should find all debit transactions with no filters', async () => {
      mockFindAll.mockResolvedValue([{ id: 1 }]);
      const result = await service.findAll({ filters: {} });
      expect(mockFindAll).toHaveBeenCalledWith({ where: {} });
      expect(result).toEqual([{ id: 1 }]);
    });

    it('should filter by account_id', async () => {
      mockFindOneAccount.mockResolvedValue({ id: 7 });
      mockFindAll.mockResolvedValue([{ id: 1 }]);
      const result = await service.findAll({ filters: { account_id: 7 } });
      expect(mockFindOneAccount).toHaveBeenCalledWith(7);
      expect(mockFindAll).toHaveBeenCalledWith({
        where: { account_id: { [Op.eq]: 7 } },
      });
      expect(result).toEqual([{ id: 1 }]);
    });

    it('should throw if account_id filter not found', async () => {
      mockFindOneAccount.mockResolvedValue(null);
      await expect(service.findAll({ filters: { account_id: 99 } })).rejects.toThrow(
        'Cannot find account: 99'
      );
    });

    it('should filter by date_range', async () => {
      mockFindAll.mockResolvedValue([{ id: 1 }]);
      const result = await service.findAll({
        filters: { date_range: { start_date: '2023-01-01', end_date: '2023-01-31' } },
      });
      expect(mockFindAll).toHaveBeenCalledWith({
        where: { transaction_date: { [Op.between]: ['2023-01-01', '2023-01-31'] } },
      });
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  describe('findOne', () => {
    it('should find one by id', async () => {
      mockFindOne.mockResolvedValue({ id: 1 });
      const result = await service.findOne(1);
      expect(mockFindOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({ id: 1 });
    });

    it('should find one by unique_code', async () => {
      mockFindOne.mockResolvedValue({ id: 1, unique_code: 'abc' });
      const result = await service.findOne('abc');
      expect(mockFindOne).toHaveBeenCalledWith({ where: { unique_code: 'abc' } });
      expect(result).toEqual({ id: 1, unique_code: 'abc' });
    });
  });

  describe('update', () => {
    it('should update a debit transaction by id', async () => {
      mockUpdate.mockResolvedValue([1]);
      mockFindOne.mockResolvedValue({ id: 1, description: 'updated' });

      const result = await service.update(1, {
        account_id: 2,
        description: 'updated',
        transaction_date: '2023-01-01',
        transaction_type: 'OUTFLOW',
        amount: 100,
      });

      expect(mockUpdate).toHaveBeenCalledWith(
        {
          account_id: 2,
          description: 'updated',
          transaction_date: '2023-01-01',
          transaction_type: 'OUTFLOW',
          amount: 100,
        },
        { where: { id: 1 } }
      );
      expect(mockFindOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({ id: 1, description: 'updated' });
    });

    it('should update a debit transaction by unique_code', async () => {
      mockUpdate.mockResolvedValue([1]);
      mockFindOne.mockResolvedValue({ id: 1, unique_code: 'abc', description: 'updated' });

      const result = await service.update('abc', {
        account_id: 2,
        description: 'updated',
        transaction_date: '2023-01-01',
        transaction_type: 'OUTFLOW',
        amount: 100,
      });

      expect(mockUpdate).toHaveBeenCalledWith(
        {
          account_id: 2,
          description: 'updated',
          transaction_date: '2023-01-01',
          transaction_type: 'OUTFLOW',
          amount: 100,
        },
        { where: { unique_code: 'abc' } }
      );
      expect(mockFindOne).toHaveBeenCalledWith({ where: { unique_code: 'abc' } });
      expect(result).toEqual({ id: 1, unique_code: 'abc', description: 'updated' });
    });

    it('should throw if update does not find a record', async () => {
      mockUpdate.mockResolvedValue([0]);
      await expect(
        service.update(1, {
          account_id: 2,
          description: 'updated',
          transaction_date: '2023-01-01',
          transaction_type: 'OUTFLOW',
          amount: 100,
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
    it('should parse statement using bankStatementParser', async () => {
      const file = { buffer: Buffer.from('') };
      const result = await service.parseStatement(file);
      expect(result).toEqual([{ foo: 'bar' }]);
    });
  });

  describe('getTotalOutflow', () => {
    it('should sum outflow for account and date_range', async () => {
      mockSum.mockResolvedValue(1000);
      const result = await service.getTotalOutflow({
        account_id: 1,
        date_range: { start_date: '2023-01-01', end_date: '2023-01-31' },
      });
      expect(mockSum).toHaveBeenCalledWith('amount', {
        where: {
          account_id: 1,
          transaction_type: 'OUTFLOW',
          transaction_date: { [Op.between]: ['2023-01-01', '2023-01-31'] },
        },
      });
      expect(result).toBe(1000);
    });
  });

  describe('getTotalInflow', () => {
    it('should sum inflow for account and date_range', async () => {
      mockSum.mockResolvedValue(500);
      const result = await service.getTotalInflow({
        account_id: 1,
        date_range: { start_date: '2023-01-01', end_date: '2023-01-31' },
      });
      expect(mockSum).toHaveBeenCalledWith('amount', {
        where: {
          account_id: 1,
          transaction_type: 'INFLOW',
          transaction_date: { [Op.between]: ['2023-01-01', '2023-01-31'] },
        },
      });
      expect(result).toBe(500);
    });
  });
});