import axios, { AxiosInstance } from 'axios';
import { throttledGetDataFromApi } from './index';

const axiosInstase: AxiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

const fetchData = ['bababu', 'bibaba', 'bobobe', 'bebeby'];

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    const result = {
      baseURL: 'https://jsonplaceholder.typicode.com',
    };
    const create = jest.spyOn(axios, 'create').mockReturnValue(axiosInstase);
    await throttledGetDataFromApi('/todos/1');
    expect(create).toHaveBeenCalledWith(result);
    jest.unmock('axios');
  });

  test('should perform request to correct provided url', async () => {
    const uncorrectURL = '/todossss/1';
    const correctURL = '/todos/1';
    const getSpy = jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockImplementation(() => Promise.resolve({ data: fetchData }));
    jest.useFakeTimers();
    jest.advanceTimersByTime(5005);

    await throttledGetDataFromApi(uncorrectURL);
    expect(getSpy.mock.calls[0]?.[0]).toStrictEqual(uncorrectURL);
    jest.advanceTimersByTime(10005);
    await throttledGetDataFromApi(correctURL);
    expect(getSpy.mock.calls[1]?.[0]).toStrictEqual(correctURL);
  });

  test('should return response data', async () => {
    jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockReturnValue(Promise.resolve({ data: fetchData }));
    jest.useFakeTimers();
    jest.advanceTimersByTime(5005);

    await expect(throttledGetDataFromApi('/todos/1')).resolves.toStrictEqual(
      fetchData,
    );
  });
});
