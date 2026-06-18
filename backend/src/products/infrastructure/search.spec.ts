import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { ProductRepository } from "./product.repository";

describe('tests for search method', () => {

  let productRepo: ProductRepository;

    let modelMock: any;
    let queryMock: any;
    let execMock: any;
    let countExecMock: any;

  beforeEach(() => {

    execMock = jest.fn();
    countExecMock = jest.fn();

    queryMock = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: execMock,
    };

    modelMock = {
      find: jest.fn().mockReturnValue(queryMock),
      countDocuments: jest.fn().mockReturnValue({
        exec: countExecMock,
      }),
    };

    productRepo = new ProductRepository(modelMock);
  });


  it('should calculate skip and limit correctly', async () => {

    const page = 3;
    const limit = 20;

    execMock.mockResolvedValue([]);
    countExecMock.mockResolvedValue(0);

    await productRepo.search({ page, limit });

    expect(queryMock.skip).toHaveBeenCalledWith(40);
    expect(queryMock.limit).toHaveBeenCalledWith(20);

  });
  it('should build text search filter when query is provided', async () => {
    const query="text"

    execMock.mockResolvedValue([]);
    countExecMock.mockResolvedValue(0);

    await productRepo.search({query});

    const filterPassed = modelMock.find.mock.calls[0][0]

    expect(filterPassed).toEqual({
      $text: { $search: query }
    })
  })
  it('should build query for min/max price', async () => {
  const minPrice = 100;
  const maxPrice = 1000;

  execMock.mockResolvedValue([]);
  countExecMock.mockResolvedValue(0);

  await productRepo.search({ minPrice, maxPrice });

  expect(modelMock.find).toHaveBeenCalled();

  const filterPassed = modelMock.find.mock.calls[0][0];

  expect(filterPassed.price).toEqual({
    $gte: minPrice,
    $lte: maxPrice,
  });
});

});
