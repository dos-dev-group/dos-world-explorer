import { google } from 'googleapis';
import { World, WorldData } from '@src/types';
import keys from '../../../secret/sheetAuth.json';
import admins from '../../../secret/admins.json';

const sheetId = '1I21zFSuifsHAYs0mZe0ZoEhwXb35AfNSt6P9HcOizCo';

const client = new google.auth.JWT(keys.client_email, '', keys.private_key, [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
]);

enum EditResult {
  success = 0,
  protected = 1,
  unknown = 2,
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function testEditSheet(typeId: number) {
  const worldData = await getWorldData();
  console.log(worldData.length);
  for (let i = 0; i < worldData.length; i++) {
    console.log(worldData[i].type, worldData[i].worlds[0]);
  }
}

async function getWorldData(): Promise<WorldData> {
  const sheets = google.sheets({ version: 'v4', auth: client });
  const authClient = client.authorize();
  const request = {
    spreadsheetId: sheetId,
  };
  const response = (await sheets.spreadsheets.get(request)).data;
  // TODO: Change code below to process the `response` object:
  //console.log(JSON.stringify(response.sheets, null, 2));
  const types = response.sheets || [];
  //console.log(types);
  const worldData: WorldData = [];
  const promises = types.map(async (item, index) => {
    const type = item.properties!.title || '';
    const typeId = item.properties!.sheetId || -1;
    //console.log(type, typeId);
    const sheetRequest = {
      spreadsheetId: sheetId,
      range: type,
      valueRenderOption: 'FORMULA',
      dateTimeRenderOption: 'FORMATTED_STRING',
    };
    const sheetResponse = await sheets.spreadsheets.values.get(sheetRequest);
    const worlds: World[] = [];
    const vaules = sheetResponse.data.values || [[]];
    vaules.slice(1).forEach((vaule) => {
      const world: World = {
        key: vaule[8], // 월드 고유ID
        name: vaule[1],
        author: vaule[2],
        description: vaule[3],
        tags: vaule[4].replace(' ', '').substr(1).split('#'),
        score: vaule[5].length,
        url: vaule[6],
        imageUrl: vaule[0].slice(8, -4),
        date: new Date(vaule[7] + 'z'),
      };
      worlds.push(world);
    });
    worldData[index] = {
      type: type,
      typeId: typeId,
      worlds: worlds,
    };
    // console.log(worldData[index].type);
  });
  await Promise.all(promises);
  return worldData;
}
async function protectSheet(typeId: number): Promise<number> {
  console.log(typeId, 'protectSheet!!');
  const sheets = google.sheets({ version: 'v4', auth: client });
  const authClient = client.authorize();
  const request = {
    spreadsheetId: sheetId,
    resource: {
      requests: [
        {
          addProtectedRange: {
            protectedRange: {
              range: {
                sheetId: typeId,
              },
              editors: {
                users: [admins.admin_email.concat([keys.client_email])],
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
    spreadsheetId: sheetId,
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

export async function addEditSheet(
  world: World,
  type: string,
  typeId: number,
): Promise<boolean> {
  const protectedRangeId = await protectSheet(typeId);
  //console.log(protectedRangeId);
  if (protectedRangeId < 0) {
    console.log('시트 수정중');
    return false;
  }
  const sheets = google.sheets({ version: 'v4', auth: client });
  const authClient = client.authorize();
  const values = [
    [
      '=Image("' + world.imageUrl + '",2)',
      world.name,
      world.author,
      world.description,
      '#' + world.tags.join(' #'),
      '★'.repeat(world.score),
      world.url,
      world.date.toISOString().replace('T', ' ').split('.')[0],
      world.key,
    ],
  ];
  console.log('test');
  const addrequest = {
    spreadsheetId: sheetId,
    range: type,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: values,
    },
  };

  await sheets.spreadsheets.values.append(addrequest);

  await unprotectSheet(protectedRangeId);

  return true;
}

export async function removeEditSheet(
  world: World,
  type: string,
  typeId: number,
): Promise<boolean> {
  const protectedRangeId = await protectSheet(typeId);
  const sheets = google.sheets({ version: 'v4', auth: client });
  const authClient = client.authorize();
  let index = -1;
  //console.log(world);
  //console.log('===============================');
  const worldData = await getWorldData();
  worldData.forEach((worldSheet) => {
    if (typeId === worldSheet.typeId) {
      for (let i = 0; i < worldSheet.worlds.length; i++) {
        if (world.key === worldSheet.worlds[i].key) {
          index = i;
          break;
        }
      }
    }
  });

  if (index !== -1) {
    if (protectedRangeId < 0) return false;
    const request = {
      spreadsheetId: sheetId,
      resource: {
        requests: [
          {
            cutPaste: {
              source: {
                sheetId: typeId,
                startColumnIndex: 0,
                startRowIndex: index + 2,
              },
              destination: {
                sheetId: typeId,
                columnIndex: 0,
                rowIndex: index + 1,
              },
              pasteType: 'PASTE_NORMAL',
            },
          },
        ],
      },
    };
    await sheets.spreadsheets.batchUpdate(request);
    await unprotectSheet(protectedRangeId);
    return true;
  }
  await unprotectSheet(protectedRangeId);
  return false;
}

export async function modifyEditSheet(
  world: World,
  newWorld: World,
  type: string,
  typeId: number,
): Promise<boolean> {
  const protectedRangeId = await protectSheet(typeId);
  const sheets = google.sheets({ version: 'v4', auth: client });
  const authClient = client.authorize();
  let index = -1;
  //console.log(world);
  //console.log('===============================');
  const worldData = await getWorldData();
  worldData.forEach((worldSheet) => {
    if (typeId === worldSheet.typeId) {
      console.log('sheet find !!!!!');
      for (let i = 0; i < worldSheet.worlds.length; i++) {
        console.log(worldSheet.worlds[i]);
        if (world.key === worldSheet.worlds[i].key) {
          index = i;
          console.log('world find !!!!!');
          break;
        }
      }
    }
  });

  if (index !== -1) {
    const values = [
      [
        '=Image("' + newWorld.imageUrl + '",2)',
        newWorld.name,
        newWorld.author,
        newWorld.description,
        '#' + newWorld.tags.join(' #'),
        '★'.repeat(newWorld.score),
        newWorld.url,
        newWorld.date.toISOString().replace('T', ' ').split('.')[0],
        newWorld.key,
      ],
    ];

    const request = {
      spreadsheetId: sheetId,
      range: type + '!A' + index + ':I' + index,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: values,
      },
    };
    await sheets.spreadsheets.values.update(request);
    await unprotectSheet(protectedRangeId);
    return true;
  }
  await unprotectSheet(protectedRangeId);
  //console.log(world);
  return false;
}
