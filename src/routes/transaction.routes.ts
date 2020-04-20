import { Router } from 'express';
import { uuid } from 'uuidv4';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

const transactionsRepository = new TransactionsRepository();

transactionRouter.get('/', (request, response) => {
  try {
    const transactions = transactionsRepository.all();
    return response.json(transactions);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request, response) => {
  try {
    const { title, value, type } = request.body;
    const createTransaction = new CreateTransactionService(
      transactionsRepository,
    );

    const transaction = {
      id: uuid(),
      title,
      value,
      type,
    };

    const transactionCreated = createTransaction.execute(transaction);

    return response.json(transactionCreated);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
