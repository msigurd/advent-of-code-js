export default class Solution {
  static process(input) {
    return new this(input).process();
  }

  constructor(input) {
    if (!input) throw new Error('Puzzle input can not be empty');
    if (!input.trim()) throw new Error('Puzzle input must contain characters');

    this.input = input;
  }

  process() {
    throw new Error('`process` method not implemented');
  }
}
