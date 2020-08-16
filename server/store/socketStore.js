import { extend } from 'lodash';

const socketData = {};

export function add(id, data) {
  if (!socketData[id]) {
    socketData[id] = {};
  }
  socketData[id] = extend(socketData[id], data);
}

export function get(id) {
  return socketData[id];
}

export function remove(id) {
  const data = socketData[id];
  delete socketData[id];
  return data;
}
