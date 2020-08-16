export const Team = Object.freeze({
  RED: Symbol("red"),
  BLUE: Symbol("blue"),
  NEUTRAL: Symbol("NEUTRAL"),
  of: (str) => Symbol(str),
});
