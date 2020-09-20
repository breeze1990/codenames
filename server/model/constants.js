export const Team = Object.freeze({
  RED: Symbol('red'),
  BLUE: Symbol('blue'),
  NEUTRAL: Symbol('neutral'),
  of: (str) => Symbol(str),
  str: (team) => {
    switch (team) {
      case Team.RED:
        return 'red';
      case Team.BLUE:
        return 'blue';
      case Team.NEUTRAL:
        return 'neutral';
    }
  },
});
