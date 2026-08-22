import SOLUTION_CLASSES_MAP from './SOLUTION_CLASSES_MAP.js';

self.onmessage = ({ data: { selectedDay, selectedPart, puzzleInput } }) => {
  const result = SOLUTION_CLASSES_MAP[selectedDay][selectedPart].process(puzzleInput);
  self.postMessage(result);
};
