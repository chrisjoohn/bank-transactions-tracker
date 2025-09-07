const service = require('../accounts.service.js');

const mockCreate = jest.fn();
const mockFindAll = jest.fn();
const mockFindOne = jest.fn();
const mockUpdate = jest.fn();
const mockDestroy = jest.fn();

jest.mock('../../models', () => ({
  accounts: {
    create: (...args) => mockCreate(...args),
    findAll: (...args) => mockFindAll(...args),
    findOne: (...args) => mockFindOne(...args),
    update: (...args) => mockUpdate(...args),
    destroy: (...args) => mockDestroy(...args),
  },
}));

describe('accountsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an account', async () => {
    const fakeData = { id: 1, name: 'Test', user_id: 2, description: 'desc', type: 'savings' };
    mockCreate.mockResolvedValue(fakeData);

    const result = await service.create({ user_id: 2, name: 'Test', description: 'desc', type: 'savings' });
    expect(mockCreate).toHaveBeenCalledWith({ user_id: 2, name: 'Test', description: 'desc', type: 'savings' });
    expect(result).toBe(fakeData);
  });

  it('should find all accounts with filters', async () => {
    const fakeData = [{ id: 1 }, { id: 2 }];
    mockFindAll.mockResolvedValue(fakeData);

    const result = await service.findAll({ filters: { user_id: 2 } });
    expect(mockFindAll).toHaveBeenCalledWith({ where: { user_id: 2 } });
    expect(result).toBe(fakeData);
  });

  it('should find all accounts with no filters', async () => {
    const fakeData = [{ id: 1 }, { id: 2 }];
    mockFindAll.mockResolvedValue(fakeData);

    const result = await service.findAll({});
    expect(mockFindAll).toHaveBeenCalledWith({ where: {} });
    expect(result).toBe(fakeData);
  });

  it('should find one account by id', async () => {
    const fakeData = { id: 1 };
    mockFindOne.mockResolvedValue(fakeData);

    const result = await service.findOne(1);
    expect(mockFindOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toBe(fakeData);
  });

  it('should find one account by unique_code', async () => {
    const fakeData = { id: 1, unique_code: 'abc' };
    mockFindOne.mockResolvedValue(fakeData);

    const result = await service.findOne('abc');
    expect(mockFindOne).toHaveBeenCalledWith({ where: { unique_code: 'abc' } });
    expect(result).toBe(fakeData);
  });

  it('should find one account with filters', async () => {
    const fakeData = { id: 1, unique_code: 'abc' };
    mockFindOne.mockResolvedValue(fakeData);

    const result = await service.findOne('abc', { user_id: 2 });
    expect(mockFindOne).toHaveBeenCalledWith({ where: { unique_code: 'abc', user_id: 2 } });
    expect(result).toBe(fakeData);
  });

  it('should update an account by id', async () => {
    mockUpdate.mockResolvedValue([1]);
    const fakeData = { id: 1, name: 'Updated', description: 'desc', type: 'savings' };
    mockFindOne.mockResolvedValue(fakeData);

    const result = await service.update(1, { name: 'Updated', description: 'desc', type: 'savings' });
    expect(mockUpdate).toHaveBeenCalledWith(
      { name: 'Updated', description: 'desc', type: 'savings' },
      { where: { id: 1 } }
    );
    expect(mockFindOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toBe(fakeData);
  });

  it('should update an account by unique_code', async () => {
    mockUpdate.mockResolvedValue([1]);
    const fakeData = { id: 1, unique_code: 'abc', name: 'Updated', description: 'desc', type: 'savings' };
    mockFindOne.mockResolvedValue(fakeData);

    const result = await service.update('abc', { name: 'Updated', description: 'desc', type: 'savings' });
    expect(mockUpdate).toHaveBeenCalledWith(
      { name: 'Updated', description: 'desc', type: 'savings' },
      { where: { unique_code: 'abc' } }
    );
    expect(mockFindOne).toHaveBeenCalledWith({ where: { unique_code: 'abc' } });
    expect(result).toBe(fakeData);
  });

  it('should throw if update does not find a record', async () => {
    mockUpdate.mockResolvedValue([0]);

    await expect(
      service.update(1, { name: 'Updated', description: 'desc', type: 'savings' })
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
});