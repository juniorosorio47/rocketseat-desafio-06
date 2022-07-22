// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';
import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

export interface ICreateTransactionDTO{
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}


class CreateTransactionService {
  public async execute({ title, value, type, category }: ICreateTransactionDTO): Promise<Transaction | AppError> {

    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    

    if(type=='outcome'){
      const balance = await transactionsRepository.getBalance();

      if(balance.total-value < 0){
        return new AppError("Outcome value greater than total income.", 400);
      }

    }

    let transactionCategory = await categoriesRepository.findOne({ where: { title: category } });

    if(!transactionCategory){
      transactionCategory = categoriesRepository.create({
        title: category
      });

      await categoriesRepository.save(transactionCategory);

    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
