const fs = require('fs')
import { addWord, closePool } from '../dao/mysqlWords';

fs.readFile('../resources/words.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    const operations = [];
    const words = data.split("\n");
    console.log(`${words.length} words`);
    for (let i = 0; i < words.length; i++) {
        // console.log(words[i], words[i].length);
        operations.push(addWord(words[i], 'zh').then(
            r => {
                return r;
            },
            err => {
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log(words[i])
                    return err;
                }
                console.error(err);
                throw err;

            }
        ));
    }
    Promise.all(operations).then(values => {
        console.log('end');
        closePool();
    })

})
