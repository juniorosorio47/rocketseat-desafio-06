import { EntityRepository, getRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

export interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {

  public async getBalance(): Promise<Balance> {
    let totalIncome = 0;
    let totalOutcome = 0;

    const transactionsRepository = getRepository(Transaction);

    const transactions = await transactionsRepository.find();

    const incomeTransactions = transactions.filter(tr=> tr.type=='income' );
    const outcomeTransactions = transactions.filter(tr=> tr.type=='outcome' );

    for(let i = 0; i < incomeTransactions.length; i++) {
      totalIncome += Number(incomeTransactions[i].value);
    }

    for(let i = 0; i < outcomeTransactions.length; i++) {
      totalOutcome += Number(outcomeTransactions[i].value);
    }

    return {
      income:totalIncome,
      outcome: totalOutcome,
      total: totalIncome - totalOutcome
    }


    
  }
}

export default TransactionsRepository;
