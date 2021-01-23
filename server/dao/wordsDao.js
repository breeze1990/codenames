import { getWords as getMysqlWords } from './mysqlWords';
import { getWords as getRandomWords } from './randomWords';

// let getWords = getRandomWords;
let getWords = getMysqlWords;
getMysqlWords(2,3);
export default getWords;
