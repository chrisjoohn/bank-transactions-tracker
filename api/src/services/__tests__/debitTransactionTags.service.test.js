const service = require('../debitTransactionTags.service.js');

const mockCreate = jest.fn();
const mockFindAll = jest.fn();
const mockFindOne = jest.fn();
const mockDestroy = jest.fn();

jest.mock('../../models', () => ({
  debit_transaction_tags: {
    create: (...args) => mockCreate(...args),
    findAll: (...args) => mockFindAll(...args),
    findOne: (...args) => mockFindOne(...args),
    destroy: (...args) => mockDestroy(...args),
  },
}));

describe('debitTransactionTagService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a debit transaction tag', async () => {
    const fakeData = { id: 1, tag_id: 2, debit_transaction_id: 3 };
    mockCreate.mockResolvedValue(fakeData);

    const result = await service.create({ tag_id: 2, debit_transaction_id: 3 });
    expect(mockCreate).toHaveBeenCalledWith({ tag_id: 2, debit_transaction_id: 3 });
    expect(result).toBe(fakeData);
  });

  it('should find all debit transaction tags', async () => {
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