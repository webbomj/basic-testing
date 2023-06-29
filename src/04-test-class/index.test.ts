import {
  BankAccount,
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';

import lodash from 'lodash';

describe('BankAccount', () => {
  let newBankAccount: BankAccount;
  let balance = 777;
  let anotherBankAccount: BankAccount;

  beforeEach(() => {
    newBankAccount = getBankAccount(balance);
    anotherBankAccount = getBankAccount(200);
  });

  test('should create account with initial balance', () => {
    expect(newBankAccount).toBeInstanceOf(BankAccount);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const errorMessage = `Insufficient funds: cannot withdraw more than ${balance}`;
    const withdrawMoney = 999;

    expect(() => newBankAccount.withdraw(withdrawMoney)).toThrow(
      InsufficientFundsError,
    );
    expect(() => newBankAccount.withdraw(withdrawMoney)).toThrow(errorMessage);
  });

  test('should throw error when transferring more than balance', () => {
    const transferMoney = 999;
    const errorMessage = `Insufficient funds: cannot withdraw more than ${balance}`;

    expect(() =>
      newBankAccount.transfer(transferMoney, anotherBankAccount),
    ).toThrow(errorMessage);
  });

  test('should throw error when transferring to the same account', () => {
    const transferMoney = 999;

    expect(() =>
      newBankAccount.transfer(transferMoney, newBankAccount),
    ).toThrow(TransferFailedError);
    expect(() =>
      newBankAccount.transfer(transferMoney, newBankAccount),
    ).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const depositMoney = 100;
    const newBalance = balance + depositMoney;
    newBankAccount.deposit(depositMoney);

    expect(newBankAccount.getBalance()).toBe(newBalance);
  });

  test('should withdraw money', () => {
    const withdrawMoney = 100;
    const newBalance = balance - withdrawMoney;
    newBankAccount.withdraw(withdrawMoney);

    expect(newBankAccount.getBalance()).toBe(newBalance);
  });

  test('should transfer money', () => {
    const transferMoney = 100;
    const resultAnotherBankAccount =
      anotherBankAccount.getBalance() + transferMoney;
    const resultNewBankAccount = newBankAccount.getBalance() - transferMoney;
    newBankAccount.transfer(transferMoney, anotherBankAccount);

    expect(anotherBankAccount.getBalance()).toBe(resultAnotherBankAccount);
    expect(newBankAccount.getBalance()).toBe(resultNewBankAccount);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    jest.spyOn(lodash, 'random').mockImplementation(() => 1);
    expect.assertions(1);
    await expect(newBankAccount.fetchBalance()).resolves.toBe(1);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest.spyOn(lodash, 'random').mockImplementation(() => 1);
    await newBankAccount.synchronizeBalance();
    expect(newBankAccount.getBalance()).toBe(1);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(lodash, 'random').mockImplementation(() => 0);
    await expect(newBankAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
