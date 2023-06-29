import {
  doStuffByInterval,
  doStuffByTimeout,
  readFileAsynchronously,
} from './index';

import fs from 'fs';
import fsPromises from 'fs/promises';

import path from 'node:path';

const callbackForTest = () => 1;
const timer = 1000;

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(callbackForTest, timer);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledWith(callbackForTest, timer);
  });

  test('should call callback only after timeout', () => {
    jest.spyOn(global, 'setTimeout');
    const callbackForTest = jest.fn(() => () => 2023);
    doStuffByTimeout(callbackForTest, timer);
    jest.advanceTimersByTime(500);
    expect(callbackForTest).toHaveBeenCalledTimes(0);
    jest.advanceTimersByTime(500);
    expect(callbackForTest).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    jest.spyOn(global, 'setInterval');
    doStuffByInterval(callbackForTest, timer);
    expect(setInterval).toHaveBeenCalled();
    expect(setInterval).toHaveBeenCalledWith(callbackForTest, timer);
  });

  test('should call callback multiple times after multiple intervals', () => {
    jest.spyOn(global, 'setInterval');
    const callbackForTest = jest.fn(() => () => 2023);
    doStuffByInterval(callbackForTest, timer);
    jest.advanceTimersByTime(500);
    expect(callbackForTest).toHaveBeenCalledTimes(0);
    jest.advanceTimersByTime(500);
    expect(callbackForTest).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(3000);
    expect(callbackForTest).toHaveBeenCalledTimes(4);
  });
});

describe('readFileAsynchronously', () => {
  const pathToFile = 'index.ts';
  test('should call join with pathToFile', async () => {
    const join = jest
      .spyOn(path, 'join')
      .mockImplementation((...pathSting: string[]) => pathSting.join('/'));
    await readFileAsynchronously(pathToFile);
    expect(join).toBeCalledWith(__dirname, pathToFile);
    jest.unmock('path');
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    await expect(readFileAsynchronously(pathToFile)).resolves.toBe(null);
    jest.unmock('fs');
  });

  test('should return file content if file exists', async () => {
    const fileExist = 'Hi there';
    jest
      .spyOn(fsPromises, 'readFile')
      .mockReturnValue(Promise.resolve(fileExist));
    await expect(readFileAsynchronously(pathToFile)).resolves.toBe(fileExist);
  });
});
