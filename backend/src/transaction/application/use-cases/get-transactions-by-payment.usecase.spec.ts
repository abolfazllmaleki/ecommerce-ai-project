import { GetTransactionsByPaymentUseCase } from './get-transactions-by-payment.usecase';
import { ITransactionRepository } from '../../domain/transaction.repository.port';

describe('GetTransactionsByPaymentUseCase', () => {
  let usecase: GetTransactionsByPaymentUseCase;
  let repository: jest.Mocked<ITransactionRepository>;

  beforeEach(() => {
    repository = {
      findByPaymentId: jest.fn(),
    } as any;

    usecase = new GetTransactionsByPaymentUseCase(repository);
  });

  it('should return the transactions for a payment', async () => {
    const transactions = [
      { id: 'tx-1', paymentId: 'pay-1' },
      { id: 'tx-2', paymentId: 'pay-1' },
    ];

    repository.findByPaymentId.mockResolvedValue(transactions as any);

    await expect(
      usecase.execute('pay-1'),
    ).resolves.toEqual(transactions);

    expect(repository.findByPaymentId).toHaveBeenCalledWith('pay-1');
  });

  it('should return an empty array when no transactions exist', async () => {
    repository.findByPaymentId.mockResolvedValue([]);

    await expect(
      usecase.execute('pay-1'),
    ).resolves.toEqual([]);

    expect(repository.findByPaymentId).toHaveBeenCalledWith('pay-1');
  });
});
