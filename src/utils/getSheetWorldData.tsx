/* eslint-disable @typescript-eslint/naming-convention */
import axios, { AxiosError } from 'axios';
import { NoDataError } from './error';
import { WorldData } from './types';

//const axios = require('axios');

// const log = console.log;

const sheetUrl =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vS5aaBlO_r5xaHXz7uac1ya_D_yTQTLMY7KrHinZVLobJ66l7f0999AIsCYoY5gAlhTEbzBIrmBbDA2/pubhtml';

const domparser = new DOMParser();
// eslint-disable-next-line consistent-return
const getHtml = async () => {
  try {
    const html = await axios.get(sheetUrl);
    return html;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default function getSheetWorldData() {
  return getHtml()
    .then((html) => {
      if (!html) throw new NoDataError();

      const doc = domparser.parseFromString(html.data, 'text/html');
      // console.log(doc);
      const sheetList = doc
        .getElementById('sheet-menu')!
        .getElementsByTagName('li');

      const worldData: WorldData = [];
      for (let i = 0; i < sheetList.length; i++) {
        const c_id = sheetList[i].getAttribute('id')?.split('-')[2]; // 1925914555
        const c_name = sheetList[i].getElementsByTagName('a')[0].textContent; // 풍경
        if (!c_name) continue;

        const worlds = [];
        const sheetData = doc
          .getElementById(c_id!)!
          .getElementsByTagName('tbody')[0]
          .getElementsByTagName('tr');
        for (let j = 1; j < sheetData.length; j++) {
          const row_data = sheetData[j].getElementsByTagName('td');
          if (row_data[1].textContent === '') break;
          let temp_data = row_data[1].textContent?.split('[제작자:');
          // eslint-disable-next-line @typescript-eslint/no-shadow
          let world = {
            key:
              sheetData[j].getElementsByTagName('th')[0].getAttribute('id') +
              '1',
            name: temp_data?.[0] || '없음',
            author: temp_data?.[1].slice(0, -1) || '없음',
            description: row_data[2].childNodes[0]?.textContent || '없음',
            tags:
              // eslint-disable-next-line no-nested-ternary
              row_data[2].childNodes.length === 3
                ? row_data[2].childNodes[2].textContent
                  ? row_data[2].childNodes[2].textContent
                      .replace(' ', '')
                      .slice(1)
                      .split('#')
                  : []
                : [],
            score: row_data[3].textContent?.length || 0,
            url: row_data[4].textContent || '소실',
            imageUrl:
              row_data[0].getElementsByTagName('img')[0].getAttribute('src') ||
              '',
          };
          // console.log(world);
          worlds.push(world);
          if (row_data[6].textContent === '') break;

          temp_data = row_data[6].textContent?.split('[제작자:');
          world = {
            key:
              sheetData[j].getElementsByTagName('th')[0].getAttribute('id') +
              '2', // 월드 고유ID
            name: temp_data?.[0] || '없음',
            author: temp_data?.[1].slice(0, -1) || '없음',
            description: row_data[7].childNodes[0].textContent || '없음',
            tags:
              // eslint-disable-next-line no-nested-ternary
              row_data[7].childNodes.length === 3
                ? row_data[7].childNodes[2].textContent
                  ? row_data[7].childNodes[2].textContent
                      .replace(' ', '')
                      .slice(1)
                      .split('#')
                  : []
                : [],
            score: row_data[8].textContent?.length || 0,
            url: row_data[9].textContent || '소실',
            imageUrl:
              row_data[5].getElementsByTagName('img')[0].getAttribute('src') ||
              '',
          };
          // console.log(world);
          worlds.push(world);
        }
        const worldSheet = {
          type: c_name,
          worlds: worlds,
        };

        worldData.push(worldSheet);
      }
      // console.log('worldData', worldData);
      return worldData;
    })
    .catch((reason) => {
      if (reason instanceof AxiosError) {
        console.warn('Error: Fail Fetch html', reason);
      } else if (reason instanceof NoDataError) {
        console.warn('Error: Success Fetch html but No Data', reason);
      } else {
        console.warn('Error: Unknown Error', reason);
      }
      return undefined;
    });
}
