import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import getSheetWorldData from 'utils/getSheetWorldData';
import App from '../renderer/App';

jest.setTimeout(300000);

describe('App', () => {
  it('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });
});

describe('getSheetWorldData', () => {
  it('crawling world sheet', async () => {
    return getSheetWorldData()
      .then((result) => console.log('result', result))
      .catch((err) => console.log('error', err));
  });
});

describe('name1', () => {
  it('name it1', async () => {
    // return fsafsafas()
  });
});

describe('name2', () => {
  it('name it1', async () => {
    // return fsafsaf()
  });
});
