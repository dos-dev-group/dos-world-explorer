import { WorldPartial } from '@src/types';
import { LimitedWorld } from 'vrchat';

export default function convertLimitedWorldToDosWorld(
  worldRowdata: LimitedWorld,
): WorldPartial {
  return {
    key: worldRowdata.id, // key
    name: worldRowdata.name, // name
    author: worldRowdata.authorName, // author
    url: 'https://vrchat.com/home/world/' + worldRowdata.id, // url
    imageUrl: worldRowdata.imageUrl, // imageUrl
  };
}
