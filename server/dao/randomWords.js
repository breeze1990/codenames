import Word from '../model/word';
import { Team } from '../model/constants';

export function getWords(row, col) {
  const total = row * col;
  const blue = Math.floor((total * 0.6) / 2);
  const red = blue + 1;
  let teamAssign = Array(total).fill(Team.NEUTRAL);
  for (let i = 0; i < red; i++) {
    teamAssign[i] = Team.RED;
  }
  for (let j = red; j < red + blue; j++) {
    teamAssign[j] = Team.BLUE;
  }
  teamAssign[red + blue] = Team.ASSASSIN;
  teamAssign = shuffle(teamAssign, total);
  const words = [];
  for (let i = 0; i < row; i++) {
    words.push([]);
    for (let j = 0; j < col; j++) {
      words[i].push(
        new Word(
          Math.random().toString(36).substring(2, 15),
          teamAssign[i * row + j]
        )
      );
    }
  }
  return words;
}

function shuffle(arr, total) {
  for (let i = 0; i < 100; i++) {
    const l = Math.floor(Math.random() * total);
    const r = Math.floor(Math.random() * total);
    let tmp = arr[l];
    arr[l] = arr[r];
    arr[r] = tmp;
  }
  return arr;
}
