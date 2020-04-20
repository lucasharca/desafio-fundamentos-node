import { response } from 'express';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface RetornoTransactions {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): RetornoTransactions {
    const retornoTransaction = {
      transactions: this.transactions,
      balance: this.getBalance(),
    };
    return retornoTransaction;
  }

  public getBalance(): Balance {
    function reduceArray(array: Transaction[]): number {
      const newArray = array.map(arr => arr.value);
      const totalValue = newArray.reduce((a, b) => a + b, 0);
      return totalValue;
    }

    const incomeArray = this.transactions.filter(
      transaction => transaction.type === 'income',
    );
    const outcomeArray = this.transactions.filter(
      transaction => transaction.type === 'outcome',
    );

    const income = reduceArray(incomeArray);
    const outcome = reduceArray(outcomeArray);
    const total = income - outcome;

    const balance: Balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }

  public create({ title, value, type }: TransactionDTO): Transaction {
    const transaction = new Transaction({ title, type, value });
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
