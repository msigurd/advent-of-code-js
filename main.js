import SOLUTION_CLASSES_MAP from './javascript/SOLUTION_CLASSES_MAP.js';

const PUZZLE_INPUT_PROCESSOR = new Worker('./javascript/puzzle-input-processor.js', { type: 'module' });
const FORM_EL = document.getElementById('form');
const DAY_SELECT_EL = document.getElementById('day-select');
const PART_SELECT_EL = document.getElementById('part-select');
const FILE_INPUT_EL = document.getElementById('file-input');
const PUZZLE_INPUT_EL = document.getElementById('puzzle-input');
const PROCESS_BTN = document.getElementById('process-btn');
const RESULT_GROUP_EL = document.getElementById('result-group');
const RESULT_INPUT_EL = document.getElementById('result-input');
const COPY_RESULT_BTN = document.getElementById('copy-result-btn');
const ERROR_MESSAGES_EL = document.getElementById('error-messages');
const ERROR_TEMPLATE = document.getElementById('error-template');

initialize();

function initialize() {
  renderDayOptions();
  readDayParam();
  renderPartOptions();
  readPartParam();
  togglePartSelect();
}

function process() {
  clearErrors();
  emptyResult();

  const selectedDay = Number(DAY_SELECT_EL.value);
  const selectedPart = Number(PART_SELECT_EL.value);
  const puzzleInput = PUZZLE_INPUT_EL.value;

  toggleValidationError(DAY_SELECT_EL, !selectedDay);
  toggleValidationError(PART_SELECT_EL, !selectedPart);
  toggleValidationError(PUZZLE_INPUT_EL, !puzzleInput);

  if (!selectedDay || !selectedPart || !puzzleInput) return;

  addSpinner();
  PUZZLE_INPUT_PROCESSOR.postMessage({ selectedDay, selectedPart, puzzleInput });
}

function renderDayOptions() {
  const days = Object.keys(SOLUTION_CLASSES_MAP);
  renderOptions('Day', DAY_SELECT_EL, days);
}

function renderPartOptions(day = undefined) {
  const dayObject = SOLUTION_CLASSES_MAP[day || DAY_SELECT_EL.value];
  const parts = dayObject ? Object.keys(dayObject) : [];
  renderOptions('Part', PART_SELECT_EL, parts);
}

function readDayParam() {
  DAY_SELECT_EL.value = readUrlParam('day') || '';
}

function readPartParam() {
  PART_SELECT_EL.value = readUrlParam('part') || '';
}

function togglePartSelect(on = undefined) {
  PART_SELECT_EL.disabled = on || !DAY_SELECT_EL.value;
}

async function copyTextFromFile() {
  const file = FILE_INPUT_EL.files[0];
  if (!file) return;

  const textFromFile = await file.text();
  PUZZLE_INPUT_EL.value = textFromFile.trim();
}

function handleFormChange() {
  const hasAllValues = DAY_SELECT_EL.value && PART_SELECT_EL.value && (PUZZLE_INPUT_EL.value || FILE_INPUT_EL.value);
  PROCESS_BTN.disabled = !hasAllValues;
}

function handleDaySelect({ target: { value } }) {
  renderPartOptions(value);
  togglePartSelect(!value);
  setUrlParam('day', value);
  if (!value) setUrlParam('part', '');
}

function handlePartSelect({ target: { value } }) {
  setUrlParam('part', value);
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

function renderOptions(name, optionEl, optionValues) {
  const fragment = new DocumentFragment();

  const placeholderOptionEl = createOptionEl('', `Select a ${name.toLowerCase()}`);
  fragment.append(placeholderOptionEl);

  for (const optionValue of optionValues) {
    const optionEl = createOptionEl(optionValue, `${name} ${optionValue}`);
    fragment.append(optionEl);
  }

  optionEl.replaceChildren(fragment);
}

function createOptionEl(value, text) {
  const optionEl = document.createElement('option');
  optionEl.value = value;
  optionEl.textContent = text;
  return optionEl;
}

function readUrlParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

function setUrlParam(key, value) {
  const url = new URL(window.location);
  value ? url.searchParams.set(key, value) : url.searchParams.delete(key);
  window.history.replaceState({}, '', url);
}

PUZZLE_INPUT_PROCESSOR.onmessage = ({ data }) => {
  showResult(data);
  removeSpinner();
};

PUZZLE_INPUT_PROCESSOR.onerror = (error) => {
  showErrors(`${error.message}.\nOpen console for stack trace.`);
  removeSpinner();
};

FILE_INPUT_EL.addEventListener('change', copyTextFromFile);
PROCESS_BTN.addEventListener('click', process);
DAY_SELECT_EL.addEventListener('change', handleDaySelect);
PART_SELECT_EL.addEventListener('change', handlePartSelect);
PUZZLE_INPUT_EL.addEventListener('input', handleManualPuzzleInput);
DAY_SELECT_EL.addEventListener('change', handleFormChange);
PART_SELECT_EL.addEventListener('change', handleFormChange);
PUZZLE_INPUT_EL.addEventListener('input', handleFormChange);
FILE_INPUT_EL.addEventListener('change', handleFormChange);
COPY_RESULT_BTN.addEventListener('click', copyResult);
