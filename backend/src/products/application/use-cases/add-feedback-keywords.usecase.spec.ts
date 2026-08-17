import { NotFoundException } from '@nestjs/common';
import { AddFeedbackKeywordsUseCase } from './add-feedback-keywords.usecase';
import { IProductRepository } from '../../domain/product.repository.port';

describe('AddFeedbackKeywordsUseCase', () => {
  let useCase: AddFeedbackKeywordsUseCase;
  let productRepository: jest.Mocked<IProductRepository>;

  beforeEach(() => {
    productRepository = {
      addFeedbackKeywords: jest.fn(),
    } as any;

    useCase = new AddFeedbackKeywordsUseCase(productRepository);
  });

  it('should add feedback keywords and return the updated product', async () => {
    const id = '1';
    const keywords = ['great', 'fast-delivery'];

    const updated = {
      id: '1',
      userFeedbackKeywords: ['great', 'fast-delivery'],
    };

    productRepository.addFeedbackKeywords.mockResolvedValue(updated as any);

    await expect(useCase.execute(id, keywords)).resolves.toEqual(updated);

    expect(productRepository.addFeedbackKeywords).toHaveBeenCalledTimes(1);
    expect(productRepository.addFeedbackKeywords).toHaveBeenCalledWith(
      id,
      keywords,
    );
  });

  it('should throw NotFoundException when the product does not exist', async () => {
    productRepository.addFeedbackKeywords.mockResolvedValue(null);

    await expect(useCase.execute('missing', ['x'])).rejects.toThrow(
      new NotFoundException('محصول یافت نشد'),
    );
  });
});
