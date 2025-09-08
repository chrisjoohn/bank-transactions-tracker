const service = require('../creditTransactionTags.service.js');

const mockCreate = jest.fn();
const mockFindAll = jest.fn();
const mockFindOne = jest.fn();
const mockUpdate = jest.fn();
const mockDestroy = jest.fn();

const mockTagFindOne = jest.fn();
const mockCreditTrxFindOne = jest.fn();

jest.mock('../../models', () => ({
  credit_transaction_tags: {
    create: (...args) => mockCreate(...args),
    findAll: (...args) => mockFindAll(...args),
    findOne: (...args) => mockFindOne(...args),
    update: (...args) => mockUpdate(...args),
    destroy: (...args) => mockDestroy(...args),
  },
  tags: {
    findOne: (...args) => mockTagFindOne(...args),
  },
  credit_transactions: {
    findOne: (...args) => mockCreditTrxFindOne(...args),
  },
}));

describe('creditTransactionTagsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a credit transaction tag', async () => {
    const fakeData = { id: 1, tag_id: 2, credit_transaction_id: 3 };
    mockCreate.mockResolvedValue(fakeData);

    const result = await service.create({ tag_id: 2, credit_transaction_id: 3 });
    expect(mockCreate).toHaveBeenCalledWith({ tag_id: 2, credit_transaction_id: 3 });
    expect(result).toBe(fakeData);
  });

  it('should find all credit transaction tags', async () => {
    const fakeData = [{ id: 1 }, { id: 2 }];
    mockFindAll.mockResolvedValue(fakeData);

    const result = await service.findAll();
    expect(mockFindAll).toHaveBeenCalled();
    expect(result).toBe(fakeData);
  });

  it('should find one by id', async () => {
    const fakeData = { id: 1 };
    mockFindOne.mockResolvedValue(fakeData);

    const result = await service.findOne(1);
    expect(mockFindOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toBe(fakeData);
  });

  it('should find one by unique_code', async () => {
    const fakeData = { id: 1, unique_code: 'abc' };
    mockFindOne.mockResolvedValue(fakeData);

    const result = await service.findOne('abc');
    expect(mockFindOne).toHaveBeenCalledWith({ where: { unique_code: 'abc' } });
    expect(result).toBe(fakeData);
  });

  it('should update by id', async () => {
    mockUpdate.mockResolvedValue([1]);
    const fakeData = { id: 1, tag_id: 2, credit_transaction_id: 3 };
    mockFindOne.mockResolvedValue(fakeData);

    const result = await service.update(1, { tag_id: 2, credit_transaction_id: 3 });
    expect(mockUpdate).toHaveBeenCalledWith(
      { tag_id: 2, credit_transaction_id: 3 },
      { where: { id: 1 } }
    );
    expect(mockFindOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toBe(fakeData);
  });

  it('should update by unique_code', async () => {
    mockUpdate.mockResolvedValue([1]);
    const fakeData = { id: 1, unique_code: 'abc', tag_id: 2, credit_transaction_id: 3 };
    mockFindOne.mockResolvedValue(fakeData);

    const result = await service.update('abc', { tag_id: 2, credit_transaction_id: 3 });
    expect(mockUpdate).toHaveBeenCalledWith(
      { tag_id: 2, credit_transaction_id: 3 },
      { where: { unique_code: 'abc' } }
    );
    expect(mockFindOne).toHaveBeenCalledWith({ where: { unique_code: 'abc' } });
    expect(result).toBe(fakeData);
  });

  it('should throw if update does not find a record', async () => {
    mockUpdate.mockResolvedValue([0]);
    await expect(
      service.update(1, { tag_id: 2, credit_transaction_id: 3 })
    ).rejects.toEqual('Not found!');
  });

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

  describe('deleteByTransactionAndTag', () => {
    it('should delete by transaction and tag ids', async () => {
      mockCreditTrxFindOne.mockResolvedValue({ id: 10 });
      mockTagFindOne.mockResolvedValue({ id: 20 });
      mockDestroy.mockResolvedValue(1);

      const result = await service.deleteByTransactionAndTag({ transactionId: 10, tagId: 20 });
      expect(mockCreditTrxFindOne).toHaveBeenCalledWith({ where: { id: 10 } });
      expect(mockTagFindOne).toHaveBeenCalledWith({ where: { id: 20 } });
      expect(mockDestroy).toHaveBeenCalledWith({ where: { credit_transaction_id: 10, tag_id: 20 } });
      expect(result).toBe(1);
    });

    it('should delete by transaction unique_code and tag unique_code', async () => {
      mockCreditTrxFindOne.mockResolvedValue({ id: 11 });
      mockTagFindOne.mockResolvedValue({ id: 22 });
      mockDestroy.mockResolvedValue(1);

      const result = await service.deleteByTransactionAndTag({ transactionId: 'trx-abc', tagId: 'tag-xyz' });
      expect(mockCreditTrxFindOne).toHaveBeenCalledWith({ where: { unique_code: 'trx-abc' } });
      expect(mockTagFindOne).toHaveBeenCalledWith({ where: { unique_code: 'tag-xyz' } });
      expect(mockDestroy).toHaveBeenCalledWith({ where: { credit_transaction_id: 11, tag_id: 22 } });
      expect(result).toBe(1);
    });

    it('should throw if transaction not found', async () => {
      mockCreditTrxFindOne.mockResolvedValue(null);
      mockTagFindOne.mockResolvedValue({ id: 22 });

      await expect(
        service.deleteByTransactionAndTag({ transactionId: 999, tagId: 22 })
      ).rejects.toThrow('Cannot find transaction');
    });

    it('should throw if tag not found', async () => {
      mockCreditTrxFindOne.mockResolvedValue({ id: 11 });
      mockTagFindOne.mockResolvedValue(null);

      await expect(
        service.deleteByTransactionAndTag({ transactionId: 11, tagId: 999 })
      ).rejects.toThrow('Cannot find tag');
    });
  });
});