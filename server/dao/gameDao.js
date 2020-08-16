import GameStore from '../store/gameStore';

const gameStore = new GameStore();

export function joinGame(user, room) {
  gameStore.joinGame(user, room);
}

export function getGameStore() {
  return gameStore;
}
