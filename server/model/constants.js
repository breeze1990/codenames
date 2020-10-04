export const Team = Object.freeze({
  RED: Symbol('red'),
  BLUE: Symbol('blue'),
  NEUTRAL: Symbol('neutral'),
  ASSASSIN: Symbol('assassin'),
  of: (str) => Symbol(str),
  str: (team) => {
    switch (team) {
      case Team.RED:
        return 'red';
      case Team.BLUE:
        return 'blue';
      case Team.NEUTRAL:
        return 'neutral';
      case Team.ASSASSIN:
        return 'assassin';
    }
  },
});
