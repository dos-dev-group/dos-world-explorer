// /* eslint-disable promise/no-nesting */
import * as vrchat from 'vrchat';
import { v4 } from 'uuid';
import { constants } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';
import { app, shell } from 'electron';
import { User, UserState, WorldVrcRaw } from '../../types';
// import vrckey from '../../../secret/vrc.json';

const NONCE = v4();
const VRCHATAPIKEY = 'JlE5Jldo5Jibnk5O5hTx6XVqsJu4WJ26';

const FAV_PATH = path.join(
  app.getPath('documents'),
  app.getName(),
  'VRCToken.json',
);

// export function saveToken(VRCToken: { token: string }) {
//   return fs
//     .access(FAV_PATH, constants.R_OK)
//     .catch(() => fs.mkdir(path.dirname(FAV_PATH), { recursive: true }))
//     .then(() => fs.writeFile(FAV_PATH, JSON.stringify(VRCToken, null, 2)))
//     .then(() => VRCToken);
// }

// export function loadToken(): Promise<{ token: string }> {
//   return fs.readFile(FAV_PATH).then((v: Buffer) => JSON.parse(v.toString()));
// }

let authenticationApi = new vrchat.AuthenticationApi();

let user;

// login(vrckey.id, vrckey.pw)
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err));

export async function login(id: string, pw: string): Promise<boolean> {
  authenticationApi = new vrchat.AuthenticationApi(
    new vrchat.Configuration({
      apiKey: VRCHATAPIKEY,
      username: id,
      password: pw,
    }),
  );

  return authenticationApi
    .getCurrentUser()
    .then(async (res) => {
      user = res.data;
      console.log(user);
      console.log('login success');
      console.log('api displayName :', res.data.displayName);
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      return false;
    });
}

function authCheck() {
  authenticationApi = new vrchat.AuthenticationApi();
  authenticationApi
    .verifyAuthToken()
    .then(async (res) => {
      console.log(res.data);
      if (!res.data.ok) {
        authenticationApi = new vrchat.AuthenticationApi();
        user = await authenticationApi.getCurrentUser();
      }
    })
    .catch(async (err) => {
      console.log(err.response.data);
      authenticationApi = new vrchat.AuthenticationApi();
      user = await authenticationApi.getCurrentUser();
    });
}

export async function testVrchatAPI(): Promise<any> {
  return true;
  // return getFriednList();
  // return getFriednList(); // 친구 목록 로딩 TODO 1

  // return generatedWorldInstanceInfo('12345', 'friends', user.data.id, 'jp'); // 인스턴스 생성 TODO 2

  //############################################################################################################################################################

  // const users: User[] = [];
  // users.push({
  //   name: 'test',
  //   id: user.data.id,
  //   currentAvatarThumbnailImageUrl: 'test',
  //   state: UserState.ONLINE,
  // });
  // const instanceId = generatedWorldInstanceInfo(
  //   '12345',
  //   'friends',
  //   user.data.id,
  //   'jp',
  // );
  // sendInvites(users, 'wrld_b02e2bbe-c0c4-46f9-aca2-1d0133eb374f', instanceId); 친구리스트를 받아서 리스트안에 있는 사람들한테 초대 보내기 TODO 3

  //############################################################################################################################################################

  // return genWorldInstanceName('wrld_b02e2bbe-c0c4-46f9-aca2-1d0133eb374f'); // 월드 인스턴스 ID 생성 TODO 4
}

export async function getFriednList(cnt = 0): Promise<User[]> {
  authCheck();
  const friendsApi = new vrchat.FriendsApi();
  const friendsData = (await friendsApi.getFriends(cnt)).data;
  const users: User[] = [];
  for (let i = 0; i < friendsData.length; i++) {
    let staus = UserState.OFFLINE;
    if (friendsData[i].location !== '') {
      if (friendsData[i].status === 'active') staus = UserState.ONLINE;
      else if (friendsData[i].status === 'join me') staus = UserState.JOIN_ME;
      else if (friendsData[i].status === 'ask me') staus = UserState.ASK_ME;
      else if (friendsData[i].status === 'busy') staus = UserState.BUSY;
    } else staus = UserState.ACTIVE;

    const friend: User = {
      name: friendsData[i].displayName,
      id: friendsData[i].id,
      currentAvatarThumbnailImageUrl:
        friendsData[i].currentAvatarThumbnailImageUrl,
      state: staus,
    };
    if (friendsData[i].userIcon !== '')
      friend.userIcon = friendsData[i].userIcon;
    users.push(friend);
  }
  if (users.length >= 100) {
    users.push(...(await getFriednList(cnt + 100)));
  }
  return [...new Set(users)];
}

export function generatedWorldInstanceInfo(
  instanceName: string,
  instanceType: string,
  ownerId: string,
  region: string,
): string {
  let link = '';
  link += instanceName;
  if (instanceType !== 'public') {
    if (instanceType === 'friends+') {
      link += '~hidden(' + ownerId + ')';
    } else if (instanceType === 'friends') {
      link += '~friends(' + ownerId + ')';
    } else if (instanceType === 'invite+') {
      link += '~private(' + ownerId + ')~canRequestInvite';
    } else if (instanceType === 'invite') {
      link += '~private(' + ownerId + ')';
    }
  }
  link += '~region(' + region + ')';
  if (instanceType !== 'public') {
    link += '~nonce(' + NONCE + ')';
  }
  return link;
}

export async function sendInvites(
  userList: User[],
  worldId: string,
  instanceId: string,
): Promise<string> {
  authCheck();
  const inviteApi = new vrchat.InviteApi();
  for (let i = 0; i < userList.length; i++) {
    inviteApi
      .inviteUser(userList[i].id, {
        instanceId: worldId + ':' + instanceId,
      })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err.response));
  }
  return 'ok!';
}

export async function genWorldInstanceName(worldId: string): Promise<string> {
  let randInt = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0');
  console.log(randInt);
  const worldInstaceInfo = await getWorldInstanceInfo(worldId);
  if (worldInstaceInfo.includes(randInt)) {
    randInt = await genWorldInstanceName(worldId);
  }
  return randInt;
}

export async function getWorldInfo(
  worldId: string,
): Promise<{ name: string; authorName: string; thumbnailImageUrl: string }> {
  authCheck();
  const WorldsApi = new vrchat.WorldsApi();
  const worldData = (await WorldsApi.getWorld(worldId)).data;

  return {
    name: worldData.name,
    authorName: worldData.authorName,
    thumbnailImageUrl: worldData.thumbnailImageUrl,
  };
}

async function getWorldInstanceInfo(worldId: string): Promise<string[]> {
  authCheck();
  const worldsApi = new vrchat.WorldsApi();
  const worldInstanceInfo = [];
  const worldInstance =
    (await worldsApi.getWorld(worldId)).data.instances || [];
  for (let i = 0; i < worldInstance.length; i++) {
    worldInstanceInfo.push(worldInstance[i][0].split('~')[0]);
  }
  return worldInstanceInfo;
}

export async function getNowinstancePeople() {
  console.log();
}

export async function getVrchatRencentWorlds(): Promise<WorldVrcRaw[]> {
  const worlds: WorldVrcRaw[] = [];
  authCheck();
  const WorldsApi = new vrchat.WorldsApi();
  await authenticationApi.getCurrentUser();
  await WorldsApi.getRecentWorlds()
    .then((res) => {
      const worldRowdata = res.data;
      for (let i = 0; i < worldRowdata.length; i++) {
        worlds.push({
          key: worldRowdata[i].id, // key
          name: worldRowdata[i].name, // name
          author: worldRowdata[i].authorName, // author
          url: 'https://vrchat.com/home/world/' + worldRowdata[i].id, // url
          imageUrl: worldRowdata[i].imageUrl, // imageUrl
        });
      }
      return worlds;
    })
    .catch((err) => console.log(err));
  return worlds;
}
