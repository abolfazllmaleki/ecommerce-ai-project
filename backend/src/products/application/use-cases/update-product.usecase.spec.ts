import { UpdateProductUseCase } from "./update-product.usecase";
import { IProductRepository } from "../../domain/product.repository.port";
import { CacheInvalidatorPort } from "../../../shared/caching/application/ports/cache-invalidator.port";
import { error } from "console";

describe("updateProductUseCase", () => {
    let useCase: UpdateProductUseCase;
    let productRepository: jest.Mocked<IProductRepository>;
    let cacheInvalidator: jest.Mocked<CacheInvalidatorPort>;

    beforeEach(() => {
    productRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    } as any;

    cacheInvalidator = {
      invalidateProduct: jest.fn(),
      invalidateProductLists: jest.fn(),
    } as any;

    useCase = new UpdateProductUseCase(
      productRepository,
      cacheInvalidator,
    );
  });

    it("update product with no error", async () => {
    const id = "1";

    const updateProductDto = {
      name: "x",
    };

    const current = {
      id: "1",
      updateBasicInfo: jest.fn(),
      updatePrice: jest.fn(),
      updateStock: jest.fn(),
    };

    const saved = {
      id: "1",
      name: "x",
    };

    productRepository.findById.mockResolvedValue(current as any);
    productRepository.update.mockResolvedValue(saved as any);

    await expect(
      useCase.execute(id, updateProductDto),
    ).resolves.toEqual(saved);

    expect(current.updateBasicInfo).toHaveBeenCalled();

    expect(cacheInvalidator.invalidateProduct).toHaveBeenCalledTimes(1);
    expect(cacheInvalidator.invalidateProductLists).toHaveBeenCalledTimes(1);
  });

    it('should throw error if product not found', async () => {
    const id = '1';

    const updateProductDto = {
        name: 'x',
    };

    productRepository.findById.mockResolvedValue(null);

await expect(
  useCase.execute(id, updateProductDto),
).rejects.toThrow('Product Not Found');



  })
});