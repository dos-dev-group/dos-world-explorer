import CryptoJS from 'crypto-js';

const store = window.localStorage;
const HASH = `5be6c1a294239773a3a1d98cccacecb95c534390f5df051c9d91363997c40754d349aba26c1e59498fd7a1e8b63fcb23f594043978b97d619bfc68df9a050331dfa4756bc182c4a1e8cd679dd1d8b090d0e59337ba46f6183aa558b752b9fad27ce088f77dc96ffcb5e4ffa19860cbe0d1dcab5fde6f29376180ab826f814227af70767617b82e39494543f37bcffcdd773907a60f8d1a05a638485c1962f53e`;

export function saveAccount(id: string, pw: string) {
  const crypto = CryptoJS.AES.encrypt(pw, HASH).toString();
  store.setItem('id', id);
  store.setItem('pw', crypto);
}

export function loadAccount() {
  const id = String(store.getItem('id'));
  let pw = String(store.getItem('pw'));
  pw = CryptoJS.AES.decrypt(pw, HASH).toString(CryptoJS.enc.Utf8);

  return { id, pw };
}
