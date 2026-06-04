import SOLUTION_CLASSES_MAP from './SOLUTION_CLASSES_MAP.js';

self.onmessage = ({ data: { selectedDay, puzzleInput } }) => {
  const result = SOLUTION_CLASSES_MAP[selectedDay].process(puzzleInput);
  self.postMessage(result);
};
