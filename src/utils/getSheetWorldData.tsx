import axios from 'axios';

//const axios = require('axios');

const log = console.log;

const sheetUrl =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vS5aaBlO_r5xaHXz7uac1ya_D_yTQTLMY7KrHinZVLobJ66l7f0999AIsCYoY5gAlhTEbzBIrmBbDA2/pubhtml';

const domparser = new DOMParser()​​;

// eslint-disable-next-line consistent-return
const getHtml = async () => {
  try {
    const html = await axios.get(sheetUrl);
    return html;
  } catch (error) {
    console.error(error);
  }
};

export function getSheetWorldData() {
 // eslint-disable-next-line promise/always-return
 const worldData: any[] = [];
 getHtml().then((html) => {
  const doc = domparser.parseFromString(html.data, 'text/html')
  //console.log(doc);
  const sheetList = doc.getElementById('sheet-menu')!.getElementsByTagName('li');
  for(let i=0;i<sheetList.length;i++){
    const c_id = sheetList[i].getAttribute('id')?.split('-')[2];
    const c_name = sheetList[i].getElementsByTagName('a')[0].textContent;
    const worlds =[];
    const sheetData = doc.getElementById(c_id)!.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    for(let j=1;j<sheetData.length;j++){
      const row_data = sheetData[j].getElementsByTagName('td')
      if (row_data[1].textContent === '')
        break
      let temp_data = row_data[1].textContent.split('[제작자:')
      // eslint-disable-next-line @typescript-eslint/no-shadow
      let world ={
        key: row_data[4].textContent?.replace('https://vrchat.com/home/world/',''), // 월드 고유ID
        name: temp_data[0],
        author: temp_data[1].slice(0, -1),
        description: row_data[2].childNodes[0].data,
        tags: row_data[2].childNodes.length == 3 ? row_data[2].childNodes[2].data.replace(' ','').slice(1).split('#') : [],
        score: row_data[3].textContent?.length,
        url: row_data[4].textContent,
        imageUrl: row_data[0].getElementsByTagName('img')[0].getAttribute('src'),
      };
      //console.log(world);
      worlds.push(world);
      if (row_data[6].textContent === '')
        break

      temp_data = row_data[6].textContent.split('[제작자:')
      world ={
        key: row_data[9].textContent?.replace('https://vrchat.com/home/world/',''), // 월드 고유ID
        name: temp_data[0],
        author: temp_data[1].slice(0, -1),
        description: row_data[7].childNodes[0].data,
        tags: row_data[7].childNodes.length == 3 ? row_data[7].childNodes[2].data.replace(' ','').slice(1).split('#') : [],
        score: row_data[8].textContent?.length,
        url: row_data[9].textContent,
        imageUrl: row_data[5].getElementsByTagName('img')[0].getAttribute('src'),
      };
      //console.log(world);
      worlds.push(world);
    }
    const worldSheet = {
      type: c_name,
      worlds: worlds,
    };
    worldData.push(worldSheet);

  }

  });
  return worldData;
}
