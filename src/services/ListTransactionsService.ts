// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository, { Balance } from '../repositories/TransactionsRepository';
import { getCustomRepository } from 'typeorm';

interface IResponse {
    transactions: Transaction[];
    balance: Balance;
}

class ListTransactionsService {
  public async execute(): Promise<IResponse> {

    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactions = await transactionsRepository.find({ relations: ["category"]});

    const balance = await transactionsRepository.getBalance();

    return {
      transactions,
      balance
    };

  }
}

export default ListTransactionsService;
