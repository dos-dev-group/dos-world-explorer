/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable promise/catch-or-return */
import { World, WorldSheet, WorldData } from 'util/types';

const axios = require('axios');
const cheerio = require('cheerio');

const log = console.log;

const sheetUrl =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vS5aaBlO_r5xaHXz7uac1ya_D_yTQTLMY7KrHinZVLobJ66l7f0999AIsCYoY5gAlhTEbzBIrmBbDA2/pubhtml';

// eslint-disable-next-line consistent-return
const getHtml = async () => {
  try {
    const get = await axios.get(sheetUrl);
    return get;
  } catch (error) {
    console.error(error);
  }
};

// eslint-disable-next-line import/prefer-default-export
export function getSheetWorldData() {
  const worldData: WorldData = [];
  getHtml().then((html) => {
    const category: any = [];
    const $ = cheerio.load(html.data);
    const $categoryList = $('#sheet-menu > li');

    // log($categoryList);

    // eslint-disable-next-line promise/always-return
    for (let i = 0; i < $categoryList.length; i++) {
      const worlds: any[] = [];
      // log(i);
      category[i] = {
        id: $categoryList[i].attribs.id.split('-')[2],
        name: $categoryList[i].children[0].children[0].data,
      };
      // log($categoryList[i].attribs.id.split('-')[2]);
      // log($categoryList[i].children[0].children[0].data);
      const $worldList = $(
        '#sheets-viewport #' + category[i].id + ' > div > table > tbody',
      )[0].children;
      // log($worldList);
      // eslint-disable-next-line no-plusplus
      for (let j = 1; j < $worldList.length; j++) {
        if ($worldList[j].children[1].children.length == 0) {
          break;
        }
        try {
          const world = {
            category: category[i].name,
            img_url:
              $worldList[j].children[1].children[0].children[0].attribs.src,
            name: $worldList[j].children[2].children[0].data,
            author: $worldList[j].children[2].children[2].data.substring(
              5,
              $worldList[j].children[2].children[2].data.length - 1,
            ),
            description: $worldList[j].children[3].children[0].data,
            tags:
              $worldList[j].children[3].children.length > 2
                ? $worldList[j].children[3].children[2].data
                    .replace(' ', '')
                    .substring(1)
                    .split('#')
                : [],
            score: $worldList[j].children[4].children[0].data.length,
            url:
              $worldList[j].children[5].children[0].type === 'text'
                ? '소실'
                : $worldList[j].children[5].children[0].children[0].data,
          };
          // log(world);
          worlds.push(world);
        } catch {
          log(j, worlds[worlds.length - 1]);
          log($worldList[j]);
          const world = {
            category: category[i].name,
            img_url:
              $worldList[j].children[1].children[0].children[0].attribs.src,
            name: $worldList[j].children[2].children[0].data,
            author: $worldList[j].children[2].children[2].data.substring(
              5,
              $worldList[j].children[2].children[2].data.length - 1,
            ),
            description: $worldList[j].children[3].children[0].data,
            tags:
              $worldList[j].children[3].children.length > 2
                ? $worldList[j].children[3].children[2].data
                    .replace(' ', '')
                    .substring(1)
                    .split('#')
                : [],
            score: $worldList[j].children[4].children[0].data.length,
            url:
              $worldList[j].children[5].children[0].type === 'text'
                ? '소실'
                : $worldList[j].children[5].children[0].children[0].data,
          };

          break;
        }

        if ($worldList[j].children[6].children.length == 0) {
          break;
        }
        try {
          const world = {
            category: category[i].name,
            img_url:
              $worldList[j].children[6].children[0].children[0].attribs.src,
            name: $worldList[j].children[7].children[0].data,
            author: $worldList[j].children[7].children[2].data.substring(
              5,
              $worldList[j].children[7].children[2].data.length - 1,
            ),
            description: $worldList[j].children[8].children[0].data,
            tags:
              $worldList[j].children[8].children.length > 2
                ? $worldList[j].children[8].children[2].data
                    .replace(' ', '')
                    .substring(1)
                    .split('#')
                : [],
            score: $worldList[j].children[9].children[0].data.length,
            url:
              $worldList[j].children[10].children[0].type === 'text'
                ? '소실'
                : $worldList[j].children[10].children[0].children[0].data,
          };
          // log(world);
          worlds.push(world);
        } catch {
          log(j, worlds[worlds.length - 1]);
          log($worldList[j]);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const world = {
            img_url:
              $worldList[j].children[6].children[0].children[0].attribs.src,
            name: $worldList[j].children[7].children[0].data,
            author: $worldList[j].children[7].children[2].data.substring(
              5,
              $worldList[j].children[7].children[2].data.length - 1,
            ),
            description: $worldList[j].children[8].children[0].data,
            tags:
              $worldList[j].children[8].children.length > 2
                ? $worldList[j].children[8].children[2].data
                    .replace(' ', '')
                    .substring(1)
                    .split('#')
                : [],
            score: $worldList[j].children[9].children[0].data.length,
            url:
              $worldList[j].children[10].children[0].type === 'text'
                ? '소실'
                : $worldList[j].children[10].children[0].children[0].data,
          };

          break;
        }
      }
      const WorldSheet = {
        type: category[i].name,
        worlds: worlds,
      };
      // log(WorldSheet);
      worldData.push(WorldSheet);
    }
  });
  return worldData;
}
