import { reject } from 'lodash';
import Word from '../model/word';
import { Team } from '../model/constants';

const mysql = require('mysql');
const dbConfig = require('../config/db').db;
const path = require('path');
const log = require('../config/loggerFactory').getLogger(
    path.basename(__filename)
);

export function getWords(row, col) {
    let _resolve;
    let _reject;
    let p = new Promise((resolve, reject) => {
        _resolve = resolve;
        _reject = reject;
    });
    let connection = mysql.createConnection(dbConfig);
    connection.query('SELECT word from words ORDER BY RAND()', function (error, results, fields) {
        if (error) {
            _reject(error);
        } else {
            // get words from db
            let dbWords = [];
            for(let i=0;i<results.length;i++) {
                dbWords.push(results[i].word);
            }
            // form the matrix
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
            let idx = 0;
            for (let i = 0; i < row; i++) {
              words.push([]);
              for (let j = 0; j < col; j++) {
                words[i].push(
                  new Word(
                    dbWords[idx],
                    teamAssign[i * row + j]
                  )
                );
                idx++;
              }
            }

            _resolve(words);    
        }
    });
    connection.end();
    return p;
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
  