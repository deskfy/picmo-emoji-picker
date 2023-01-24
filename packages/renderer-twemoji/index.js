import { createPicker } from 'deskfy-custom-picmo';
import { TwemojiRenderer } from './src/index';

const rootElement = document.querySelector('#picker');
const selectionContainer = document.querySelector('#selection-outer');
const emoji = document.querySelector('#selection-emoji');
const name = document.querySelector('#selection-name');

const picker = createPicker({
  rootElement,
  renderer: new TwemojiRenderer()
});

picker.addEventListener('emoji:select', (selection) => {
  emoji.innerHTML = selection.emoji;
  name.textContent = selection.label;

  selectionContainer.classList.remove('empty');
});
