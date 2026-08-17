import { CreateTransactionUseCase } from './create-transaction.usecase';
import { ITransactionRepository } from '../../domain/transaction.repository.port';
import {
  TransactionStatus,
  TransactionType,
} from '../../domain/transaction.entity';

describe('CreateTransactionUseCase', () => {
  let usecase: CreateTransactionUseCase;
  let repository: jest.Mocked<ITransactionRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findByPaymentIdAndType: jest.fn(),
    } as any;

    usecase = new CreateTransactionUseCase(repository);
  });

  it('should create a new request transaction', async () => {
    const input = {
      paymentId: 'pay-1',
      orderId: 'order-1',
      type: TransactionType.REQUEST,
      amount: 1000,
    };

    const created = {
      id: 'tx-1',
      paymentId: 'pay-1',
    };

    repository.findByPaymentIdAndType.mockResolvedValue(null);
    repository.create.mockResolvedValue(created as any);

    await expect(
      usecase.execute(input),
    ).resolves.toEqual(created);

    expect(repository.findByPaymentIdAndType).toHaveBeenCalledWith(
      'pay-1',
      TransactionType.REQUEST,
    );

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        paymentId: 'pay-1',
        orderId: 'order-1',
        type: TransactionType.REQUEST,
        amount: 1000,
        status: TransactionStatus.PENDING,
      }),
    );
  });

  it('should return the existing request transaction without creating a new one', async () => {
    const existing = {
      id: 'tx-existing',
      paymentId: 'pay-1',
    };

    repository.findByPaymentIdAndType.mockResolvedValue(existing as any);

    await expect(
      usecase.execute({
        paymentId: 'pay-1',
        orderId: 'order-1',
        type: TransactionType.REQUEST,
        amount: 1000,
      }),
    ).resolves.toEqual(existing);

    expect(repository.create).not.toHaveBeenCalled();
  });

  it('should create non-request transactions without looking up existing ones', async () => {
    const created = {
      id: 'tx-2',
      type: TransactionType.VERIFY,
    };

    repository.create.mockResolvedValue(created as any);

    await expect(
      usecase.execute({
        paymentId: 'pay-1',
        orderId: 'order-1',
        type: TransactionType.VERIFY,
        amount: 1000,
        status: TransactionStatus.SUCCESS,
      }),
    ).resolves.toEqual(created);

    expect(repository.findByPaymentIdAndType).not.toHaveBeenCalled();

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        type: TransactionType.VERIFY,
        status: TransactionStatus.SUCCESS,
      }),
    );
  });

  it('should return the existing transaction on a duplicate key error', async () => {
    const duplicateError: any = new Error('E11000 duplicate key');
    duplicateError.code = 11000;

    const existing = {
      id: 'tx-existing',
      paymentId: 'pay-1',
    };

    repository.findByPaymentIdAndType
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(existing as any);
    repository.create.mockRejectedValue(duplicateError);

    await expect(
      usecase.execute({
        paymentId: 'pay-1',
        orderId: 'order-1',
        type: TransactionType.REQUEST,
        amount: 1000,
      }),
    ).resolves.toEqual(existing);

    expect(repository.findByPaymentIdAndType).toHaveBeenCalledTimes(2);
  });

  it('should rethrow a duplicate key error when no existing transaction is found', async () => {
    const duplicateError: any = new Error('E11000 duplicate key');
    duplicateError.code = 11000;

    repository.findByPaymentIdAndType
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    repository.create.mockRejectedValue(duplicateError);

    await expect(
      usecase.execute({
        paymentId: 'pay-1',
        orderId: 'order-1',
        type: TransactionType.REQUEST,
        amount: 1000,
      }),
    ).rejects.toThrow('E11000 duplicate key');
  });

  it('should rethrow unexpected errors', async () => {
    const error = new Error('Database error');

    repository.findByPaymentIdAndType.mockResolvedValue(null);
    repository.create.mockRejectedValue(error);

    await expect(
      usecase.execute({
        paymentId: 'pay-1',
        orderId: 'order-1',
        type: TransactionType.REQUEST,
        amount: 1000,
      }),
    ).rejects.toThrow('Database error');

    expect(repository.findByPaymentIdAndType).toHaveBeenCalledTimes(1);
  });
});
