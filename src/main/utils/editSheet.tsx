import { google } from 'googleapis';
import * as vrchat from 'vrchat';
import {
  World,
  WorldData,
  WorldInput,
  WorldOutput,
  EditResult,
} from '../../types';
import keys from '../../../secret/sheetAuth.json';
import vrckey from '../../../secret/vrc.json';
import sheetData from '../../../secret/sheetData.json';
import protectList from '../../../secret/protectList.json';

const configuration = new vrchat.Configuration({
  username: vrckey.id,
  password: vrckey.pw,
});

const spreadsheetId = sheetData.spreadsheetId;
const sheetId = sheetData.sheetId;
const sheetName = sheetData.sheetName;

const client = new google.auth.JWT(keys.client_email, '', keys.private_key, [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
]);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function testEditSheet() {
  // console.log(await getWorldData());
}

export async function autoFile(worldUrl: string): Promise<WorldOutput> {
  const AuthenticationApi = new vrchat.AuthenticationApi(configuration);
  const WorldsApi = new vrchat.WorldsApi(configuration);
  await AuthenticationApi.getCurrentUser();
  const worldId = worldUrl.replace('https://vrchat.com/home/world/', '');
  const worldData = (await WorldsApi.getWorld(worldId)).data;
  const nowTime = new Date();
  console.log(worldId);
  console.log(worldData.thumbnailImageUrl);
  console.log(worldData.name);
  console.log(worldData.authorName);
  console.log(nowTime.toISOString().replace('T', ' ').split('.')[0]);
  return {
    key: worldId,
    name: worldData.name,
    author: worldData.authorName,
    imageUrl: worldData.thumbnailImageUrl,
    date: nowTime,
  };
}

async function getWorldData(): Promise<WorldData> {
  const sheets = google.sheets({ version: 'v4', auth: client });
  const authClient = client.authorize();
  //console.log(types);
  const sheetRequest = {
    spreadsheetId: spreadsheetId,
    range: 'sheet1',
    valueRenderOption: 'FORMULA',
    dateTimeRenderOption: 'FORMATTED_STRING',
  };
  const sheetResponse = await sheets.spreadsheets.values.get(sheetRequest);
  const worldData: World[] = [];
  const vaules = sheetResponse.data.values || [[]];
  vaules.slice(1).forEach((vaule) => {
    const world: World = {
      key: vaule[9], // 월드 고유ID
      name: vaule[1],
      author: vaule[2],
      description: vaule[3],
      tags: vaule[4].replace(' ', '').substr(1).split('#'),
      score: vaule[5].length,
      url: vaule[6],
      imageUrl: vaule[0].slice(8, -4),
      date: new Date(vaule[8] + 'z'),
      type: vaule[7],
    };
    // console.log(world);
    worldData.push(world);
  });
  return worldData;
}

async function protectSheet(sheetID: number): Promise<number> {
  console.log(sheetID, 'protectSheet!!');
  const sheets = google.sheets({ version: 'v4', auth: client });
  const authClient = client.authorize();
  const request = {
    spreadsheetId: spreadsheetId,
    resource: {
      requests: [
        {
          addProtectedRange: {
            protectedRange: {
              range: {
                sheetId: sheetID,
              },
              editors: {
                users: [sheetData.admin_email.concat([keys.client_email])],
              },
            },
          },
        },
      ],
    },
  };
  try {
    const response: any = (await sheets.spreadsheets.batchUpdate(request)).data;
    // TODO: Change code below to process the `response` object:
    //console.log(JSON.stringify(response, null, 2));
    // console.log(
    //   response.replies[0].addProtectedRange?.protectedRange?.protectedRangeId,
    // );
    return response.replies[0].addProtectedRange?.protectedRange
      ?.protectedRangeId;
    //console.log(response);
  } catch (err: any) {
    console.error(err);
    //console.log(err.response.data);
    return -1;
  }
}

async function unprotectSheet(protectedRangeId: number) {
  console.log('unprotectSheet!!');
  const sheets = google.sheets({ version: 'v4', auth: client });
  const authClient = client.authorize();
  const request = {
    spreadsheetId: spreadsheetId,
    resource: {
      requests: [
        {
          deleteProtectedRange: {
            protectedRangeId: protectedRangeId,
          },
        },
      ],
    },
  };
  try {
    const response: any = (await sheets.spreadsheets.batchUpdate(request)).data;
    // TODO: Change code below to process the `response` object:
    //console.log(JSON.stringify(response, null, 2));
    // console.log(
    //   response.replies[0].addProtectedRange?.protectedRange?.protectedRangeId,
    // );
    //console.log(response);
  } catch (err: any) {
    //console.error(err);
    //console.log(err.response.data);
  }
  return 0;
}

function overLapCheck(worldData: WorldData, key: string) {
  for (let i = 0; i < worldData.length; i++) {
    if (key === worldData[i].key) {
      return true;
    }
  }
  return false;
}

export async function addEditSheet(
  worldInput: WorldInput,
): Promise<EditResult> {
  const sheets = google.sheets({ version: 'v4', auth: client });
  const authClient = client.authorize();
  const protectedRangeId = await protectSheet(sheetId);
  if (protectedRangeId < 0) {
    console.log('시트 수정중');
    return EditResult.PROTECTED;
  }
  const worldData = await getWorldData();
  const worldOutput = await autoFile(worldInput.url);
  if (overLapCheck(worldData, worldOutput.key)) {
    return EditResult.ALREADYEXIST;
  }
  try {
    const values = [
      [
        '=Image("' + worldOutput.imageUrl + '",2)',
        worldOutput.name,
        worldOutput.author,
        worldInput.description,
        '#' + worldInput.tags.join(' #'),
        '★'.repeat(worldInput.score),
        worldInput.url,
        worldInput.type,
        worldOutput.date.toISOString().replace('T', ' ').split('.')[0],
        worldOutput.key,
      ],
    ];
    console.log('test');
    const addrequest = {
      spreadsheetId: spreadsheetId,
      range: sheetName,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: values,
      },
    };
    await sheets.spreadsheets.values.append(addrequest);
    await unprotectSheet(protectedRangeId);
    return EditResult.SUCCESS;
  } catch (e) {
    console.log(e);
    await unprotectSheet(protectedRangeId);
    return EditResult.UNKNOWN;
  }
}

export async function removeEditSheet(key: string): Promise<EditResult> {
  const sheets = google.sheets({ version: 'v4', auth: client });
  const authClient = client.authorize();
  const protectedRangeId = await protectSheet(sheetId);
  if (protectedRangeId < 0) {
    console.log('시트 수정중');
    return EditResult.PROTECTED;
  }
  const worldData = await getWorldData();
  let index = -1;
  for (let i = 0; i < worldData.length; i++) {
    if (key === worldData[i].key) {
      index = i;
      break;
    }
  }

  try {
    if (index !== -1) {
      const request = {
        spreadsheetId: spreadsheetId,
        resource: {
          requests: [
            {
              deleteDimension: {
                range: {
                  dimension: 'ROWS',
                  sheetId: sheetId,
                  startIndex: index + 1,
                  endIndex: index + 2,
                },
              },
            },
          ],
        },
      };
      await sheets.spreadsheets.batchUpdate(request);
      await unprotectSheet(protectedRangeId);
      return EditResult.SUCCESS;
    }
    await unprotectSheet(protectedRangeId);
    return EditResult.NOTEXIST;
  } catch (e) {
    await unprotectSheet(protectedRangeId);
    console.log(e);
    return EditResult.UNKNOWN;
  }
}

export async function modifyEditSheet(
  key: string,
  worldInput: WorldInput,
): Promise<EditResult> {
  const sheets = google.sheets({ version: 'v4', auth: client });
  const authClient = client.authorize();
  const protectedRangeId = await protectSheet(sheetId);
  if (protectedRangeId < 0) {
    console.log('시트 수정중');
    return EditResult.PROTECTED;
  }
  const worldData = await getWorldData();
  let index = -1;
  for (let i = 0; i < worldData.length; i++) {
    if (key === worldData[i].key) {
      index = i;
      break;
    }
  }

  try {
    if (index !== -1) {
      const values = [
        [
          worldInput.description,
          '#' + worldInput.tags.join(' #'),
          '★'.repeat(worldInput.score),
          worldInput.url,
          worldInput.type,
        ],
      ];

      const request = {
        spreadsheetId: spreadsheetId,
        range: sheetName + '!D' + (index + 2) + ':H' + (index + 2),
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: values,
        },
      };
      await sheets.spreadsheets.values.update(request);
      await unprotectSheet(protectedRangeId);
      return EditResult.SUCCESS;
    }
    await unprotectSheet(protectedRangeId);
    //console.log(world);
    return EditResult.NOTEXIST;
  } catch (e) {
    await unprotectSheet(protectedRangeId);
    console.log(e);
    return EditResult.UNKNOWN;
  }
}
