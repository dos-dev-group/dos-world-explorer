import * as vrchat from 'vrchat';
import vrckey from '../../../secret/vrc.json';
import { WorldVrcRaw } from '../../types';

const configuration = new vrchat.Configuration({
  username: vrckey.id,
  password: vrckey.pw,
});

export async function testVrchatAPI(): Promise<WorldVrcRaw[]> {
  const worlds: WorldVrcRaw[] = [];
  const AuthenticationApi = new vrchat.AuthenticationApi(configuration);
  const WorldsApi = new vrchat.WorldsApi(configuration);
  await AuthenticationApi.getCurrentUser();
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

export async function getVrchatRencentWorlds(): Promise<WorldVrcRaw[]> {
  const worlds: WorldVrcRaw[] = [];
  const AuthenticationApi = new vrchat.AuthenticationApi(configuration);
  const WorldsApi = new vrchat.WorldsApi(configuration);
  await AuthenticationApi.getCurrentUser();
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
