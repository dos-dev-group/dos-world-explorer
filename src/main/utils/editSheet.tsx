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
}

async function getWorldData(type: string) {
  const sheets = google.sheets({ version: 'v4', auth: client });
  const authClient = client.authorize();
  const request = {
    spreadsheetId: sheetId,
    range: type,
    valueRenderOption: 'FORMULA',
  };
  try {
    const response = (await sheets.spreadsheets.values.get(request)).data;
    // TODO: Change code below to process the `response` object:
    console.log(response.values);
    return response.values;
  } catch (err) {
    console.error(err);
    return [[]];
  }
}

async function protectSheet(typeId: number): Promise<number> {
  console.log('protectSheet!!');
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
    //console.error(err);
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
  typeId: number,
): Promise<boolean> {
  const protectedRangeId = await protectSheet(typeId);
  if (protectedRangeId < 0) {
    console.log('시트 수정중');
    return false;
  }
  const sheets = google.sheets({ version: 'v4', auth: client });
  const authClient = client.authorize();
  const moverequest = {
    spreadsheetId: sheetId,
    resource: {
      requests: [
        {
          cutPaste: {
            source: {
              sheetId: typeId,
              startColumnIndex: 0,
              startRowIndex: 1,
            },
            destination: {
              sheetId: typeId,
              columnIndex: 0,
              rowIndex: 2,
            },
            pasteType: 'PASTE_NORMAL',
          },
        },
      ],
    },
  };
  await sheets.spreadsheets.batchUpdate(moverequest);

  const values = [
    [
      '=Image("' + world.imageUrl + '",2)',
      world.name,
      world.author,
      world.description,
      '#' + world.tags.join(' #'),
      '★'.repeat(world.score),
      world.url,
    ],
  ];

  const addrequest = {
    spreadsheetId: sheetId,
    range: 'test!A2:G2',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: values,
    },
  };

  await sheets.spreadsheets.values.update(addrequest);

  await unprotectSheet(protectedRangeId);

  return true;
}

export async function removeEditSheet(
  world: World,
  typeId: number,
  worldData: WorldData,
): Promise<boolean> {
  const sheets = google.sheets({ version: 'v4', auth: client });
  const authClient = client.authorize();
  let index = -1;
  console.log(world);
  console.log('===============================');
  for (let i = 0; i < worldData.length; i++) {
    // console.log(i);
    if (typeId === worldData[i].typeId) {
      for (let j = 0; j < worldData[i].worlds.length; j++) {
        //console.log(worldData[i].worlds[j]);
        if (world === worldData[i].worlds[j]) {
          index = j;
          //console.log('find');
        }
      }
    }
  }

  if (index !== -1) {
    const protectedRangeId = await protectSheet(typeId);
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
  //console.log(world);
  return false;
}

export async function modifyEditSheet(
  world: World,
  newWorld: World,
  type: string,
  worldData: WorldData,
): Promise<boolean> {
  const protectedRangeId = await protectSheet(typeId);
  const sheets = google.sheets({ version: 'v4', auth: client });
  const authClient = client.authorize();
  let index = -1;
  console.log(world);
  console.log('===============================');
  for (let i = 0; i < worldData.length; i++) {
    // console.log(i);
    if (type === worldData[i].type) {
      for (let j = 0; j < worldData[i].worlds.length; j++) {
        //console.log(worldData[i].worlds[j]);
        if (world === worldData[i].worlds[j]) {
          index = j + 2;
          //console.log('find');
        }
      }
    }
  }

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
      ],
    ];

    const request = {
      spreadsheetId: sheetId,
      range: type + '!A' + index + ':G' + index,
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
