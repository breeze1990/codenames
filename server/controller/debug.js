import * as gameDao from '../dao/gameDao';

module.exports = function (app) {
  app.get('/debug/game', (req, res) => {
    res.json(gameDao.getGameStore());
  });
};
