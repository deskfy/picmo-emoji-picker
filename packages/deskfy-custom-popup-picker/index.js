import { createPopup } from './src/index';

const trigger = document.querySelector('#trigger');

const picker = createPopup({}, {
  position: 'bottom-end'
});

trigger.addEventListener('click', () => {
  picker.toggle({
    triggerElement: trigger,
    referenceElement: trigger
  });
});

picker.addEventListener('emoji:select', (selection) => {
  trigger.innerHTML = selection.emoji;
  trigger.nextElementSibling.textContent = JSON.stringify(selection, null, 2);
});
