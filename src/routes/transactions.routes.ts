import { Request, Response, Router } from 'express';
import AppError from '../errors/AppError';
import multer from 'multer';

import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import ListTransactionsService from '../services/ListTransactionsService';

import uploadConfig from '../config/upload';

const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request:Request, response:Response) => {

  const listTransactionsService = new ListTransactionsService();

  const transactions = await listTransactionsService.execute();

  return response.json(transactions);

});

transactionsRouter.post('/', async (request:Request, response:Response) => {
  
  const { title, type, value, category } = request.body;

  const createTransactionService = new CreateTransactionService();

  const newTransaction = await createTransactionService.execute({ title, type, value, category });

  if(newTransaction instanceof AppError){
    return response.status(400).send({status: 'error', message:"tatata"});
  }

  return response.json(newTransaction);

});

transactionsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id;

  const deleteTransactionsService = new DeleteTransactionService();
  try{
    await deleteTransactionsService.execute(id);
    
    return response.send();

  }catch(err){
    return response.status(400);
  }

});

transactionsRouter.post(
  '/import', 
  // @ts-ignore
  upload.single('file'),
  async (request:Request, response:Response) => {

  const importTransactionsService = new ImportTransactionsService();
  
  const transactions = await importTransactionsService.execute(request.file.path);

  return response.json(transactions)
});

export default transactionsRouter;
