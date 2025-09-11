const service = require('../tags.service.js');

const mockCreate = jest.fn();
const mockFindAll = jest.fn();
const mockFindOne = jest.fn();
const mockUpdate = jest.fn();
const mockDestroy = jest.fn();

jest.mock('../../models', () => ({
  tags: {
    create: (...args) => mockCreate(...args),
    findAll: (...args) => mockFindAll(...args),
    findOne: (...args) => mockFindOne(...args),
    update: (...args) => mockUpdate(...args),
    destroy: (...args) => mockDestroy(...args),
  },
}));

const { Op } = require('sequelize');

describe('tagsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a tag', async () => {
    const fakeData = { id: 1, name: 'Tag', user_id: 2 };
    mockCreate.mockResolvedValue(fakeData);

    const result = await service.create({ name: 'Tag', user_id: 2 });
    expect(mockCreate).toHaveBeenCalledWith({ name: 'Tag', user_id: 2 });
    expect(result).toBe(fakeData);
  });

  it('should find all tags with no filters', async () => {
    const fakeData = [{ id: 1 }, { id: 2 }];
    mockFindAll.mockResolvedValue(fakeData);

    const result = await service.findAll();
    expect(mockFindAll).toHaveBeenCalledWith({ where: {} });
    expect(result).toBe(fakeData);
  });

  it('should find all tags with user_id filter', async () => {
    const fakeData = [{ id: 1, user_id: 2 }];
    mockFindAll.mockResolvedValue(fakeData);

    const result = await service.findAll({ filters: { user_id: 2 } });
    expect(mockFindAll).toHaveBeenCalledWith({ where: { user_id: { [Op.eq]: 2 } } });
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

  it('should update a tag by id', async () => {
    mockUpdate.mockResolvedValue([1]);
    const fakeData = { id: 1, name: 'Updated', user_id: 2 };
    mockFindOne.mockResolvedValue(fakeData);

    const result = await service.update(1, { name: 'Updated', user_id: 2 });
    expect(mockUpdate).toHaveBeenCalledWith({ name: 'Updated', user_id: 2 }, { where: { id: 1 } });
    expect(mockFindOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toBe(fakeData);
  });

  it('should update a tag by unique_code', async () => {
    mockUpdate.mockResolvedValue([1]);
    const fakeData = { id: 1, unique_code: 'abc', name: 'Updated', user_id: 2 };
    mockFindOne.mockResolvedValue(fakeData);

    const result = await service.update('abc', { name: 'Updated', user_id: 2 });
    expect(mockUpdate).toHaveBeenCalledWith(
      { name: 'Updated', user_id: 2 },
      { where: { unique_code: 'abc' } }
    );
    expect(mockFindOne).toHaveBeenCalledWith({ where: { unique_code: 'abc' } });
    expect(result).toBe(fakeData);
  });

  it('should throw if update does not find a record', async () => {
    mockUpdate.mockResolvedValue([0]);
    await expect(service.update(1, { name: 'Updated', user_id: 2 })).rejects.toEqual('Not found!');
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
