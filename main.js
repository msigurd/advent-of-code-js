import SOLUTION_CLASSES_MAP from './javascript/SOLUTION_CLASSES_MAP.js';

const FORM_EL = document.getElementById('form');
const DAY_SELECT_EL = document.getElementById('day-select');
const FILE_INPUT_EL = document.getElementById('file-input');
const PUZZLE_INPUT_EL = document.getElementById('puzzle-input');
const PROCESS_BTN = document.getElementById('process-btn');
const RESULT_GROUP_EL = document.getElementById('result-group');
const RESULT_INPUT_EL = document.getElementById('result-input');
const COPY_RESULT_BTN = document.getElementById('copy-result-btn');
const ERROR_MESSAGES_EL = document.getElementById('error-messages');
const ERROR_TEMPLATE = document.getElementById('error-template');

enableAvailableOptions();

function process() {
  clearErrors();
  emptyResult();

  const selectedDay = DAY_SELECT_EL.value;
  const puzzleInput = PUZZLE_INPUT_EL.value;

  toggleValidationError(DAY_SELECT_EL, !selectedDay);
  toggleValidationError(PUZZLE_INPUT_EL, !puzzleInput);

  if (!selectedDay || !puzzleInput) return;

  addSpinner();

  try {
    const result = solutionClass(selectedDay).process(puzzleInput);
    showResult(result);
  } catch (error) {
    showErrors(`${error.message}.\nOpen console for stack trace.`);
    throw error;
  } finally {
    removeSpinner();
  }
}

function solutionClass(day) {
  return SOLUTION_CLASSES_MAP[day];
}

function enableAvailableOptions() {
  DAY_SELECT_EL.querySelectorAll('option').forEach(optionEl => {
    if (SOLUTION_CLASSES_MAP[optionEl.value]) {
      optionEl.disabled = false;
    }
  });
}

async function copyTextFromFile() {
  const file = FILE_INPUT_EL.files[0];
  if (!file) return;

  const textFromFile = await file.text();
  PUZZLE_INPUT_EL.value = textFromFile.trim();
}

function handleManualPuzzleInput() {
  if (FILE_INPUT_EL.value) {
    FILE_INPUT_EL.value = '';
  }
}

function addSpinner() {
  FORM_EL.setAttribute('data-spinner', 'large overlay');
  FORM_EL.setAttribute('aria-busy', 'true');
}

function removeSpinner() {
  FORM_EL.removeAttribute('data-spinner');
  FORM_EL.setAttribute('aria-busy', 'false');
}

function showResult(result) {
  RESULT_INPUT_EL.value = result;
  RESULT_GROUP_EL.disabled = false;
}

function emptyResult() {
  RESULT_INPUT_EL.value = '';
  RESULT_GROUP_EL.disabled = true;
}

async function copyResult() {
  await navigator.clipboard.writeText(RESULT_INPUT_EL.value);
  COPY_RESULT_BTN.innerText = 'Copied';
  setTimeout(() => COPY_RESULT_BTN.innerText = 'Copy', 3000);
}

function showErrors(...messages) {
  const fragment = new DocumentFragment();

  for (const message of messages) {
    const errorClone = ERROR_TEMPLATE.content.cloneNode(true);
    errorClone.querySelector('.error-description').innerText = message;
    fragment.append(errorClone);
  }

  ERROR_MESSAGES_EL.replaceChildren(fragment);
}

function clearErrors() {
  ERROR_MESSAGES_EL.replaceChildren();
}

function toggleValidationError(el, isError) {
  if (isError) {
    el.parentNode.setAttribute('data-field', 'error');
    el.setAttribute('aria-invalid', 'true');
  } else {
    el.parentNode.setAttribute('data-field', '');
    el.removeAttribute('aria-invalid');
  }
}

FILE_INPUT_EL.addEventListener('change', copyTextFromFile);
PROCESS_BTN.addEventListener('click', process);
PUZZLE_INPUT_EL.addEventListener('input', handleManualPuzzleInput);
COPY_RESULT_BTN.addEventListener('click', copyResult);
