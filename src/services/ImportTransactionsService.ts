import csv from 'csvtojson';
import { getCustomRepository, getRepository, In } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

class ImportTransactionsService {
  async execute(file:string): Promise<Transaction[]> {
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactions = await csv().fromFile(file);

    const categories: string[] = transactions.map(tr=>tr.category);

    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      }
    });

    const existentCategoriesTitles = existentCategories.map((category:Category)=>category.title);


    const categoriesToAdd = categories
      .filter(category => !existentCategoriesTitles.includes(category))
      .filter((value, index, self)=>self.indexOf(value)===index);

    const newCategories = categoriesRepository.create(
      categoriesToAdd.map( title => ({ title, }) ),
    );

    
    await categoriesRepository.save(newCategories);
    
    const finalCategories = [...newCategories, ...existentCategories];


    const createdTransactions = transactionsRepository.create(
      transactions.map( transaction => ({
        title:transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find( category => category.title === transaction.category)
      })),
    );

    const savedTransactions = await transactionsRepository.save(createdTransactions);


    return savedTransactions;

    


    
    
  }
}

export default ImportTransactionsService;
