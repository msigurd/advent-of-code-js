import SOLUTION_CLASSES_MAP from './SOLUTION_CLASSES_MAP.js';

self.onmessage = ({ data: { selectedDay, selectedPart, puzzleInput } }) => {
  const startTime = Date.now();
  const result = SOLUTION_CLASSES_MAP[selectedDay][selectedPart].process(puzzleInput);
  const elapsedTime = Date.now() - startTime;
  console.log(`Done in ${elapsedTime / 1000} sec`);
  self.postMessage(result);
};
