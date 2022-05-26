/* eslint-disable @typescript-eslint/naming-convention */
import axios, { AxiosError } from 'axios';
import { World, WorldData } from '@src/types';
import { NoDataError } from './error';

const sheetUrl =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vS5aaBlO_r5xaHXz7uac1ya_D_yTQTLMY7KrHinZVLobJ66l7f0999AIsCYoY5gAlhTEbzBIrmBbDA2/pubhtml';

const domparser = new DOMParser();
// eslint-disable-next-line consistent-return
export const getHtml = async () => {
  // console.log(sheetUrl + '?_=' + new Date().getTime());
  try {
    const html = await axios.get(sheetUrl + '?_=' + new Date().getTime(), {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    return html;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export async function test() {
  try {
    const html = await axios.get(sheetUrl + '?_=' + new Date().getTime());
    console.log(html.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default function getSheetWorldData() {
  const worldData: WorldData = [];
  return getHtml()
    .then((html) => {
      if (!html) throw new NoDataError();

      const doc = domparser.parseFromString(html.data, 'text/html');
      // console.log(doc);
      const raws = doc
        .getElementsByTagName('tbody')[0]
        .getElementsByTagName('tr');
      for (let i = 1; i < raws.length; i++) {
        const row = raws[i].getElementsByTagName('td');
        // console.log(rows);
        const world: World = {
          key: row[9].textContent || '', // 키 값
          name: row[1].textContent || '', // 월드 이름
          author: row[2].textContent || '', // 제작자 이름
          description: row[3].textContent || '', // 설명
          tags:
            row[4].textContent!.replaceAll(' ', '').slice(1).split('#') || [], // 태그
          score: row[5].textContent?.length || 0, // 별점
          url: row[6].textContent || '', // 링크
          imageUrl:
            row[0].getElementsByTagName('img')[0].getAttribute('src') || '', // 이미지
          date: new Date(row[8].textContent + 'z' || ''), // 기록 날짜
          type: row[7].textContent || '', // 카테고리
        };
        // console.log(world);
        worldData.push(world);
      }
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
      return worldData;
    });
}
