import { toElement } from './common';
import { createPopup } from '../../packages/deskfy-custom-popup-picker/src/index';

function handleEmojiSelection(button: HTMLButtonElement) {
  return selection => {
    const { emoji, url } = selection;
    button.classList.remove('empty');

    if (url) {
      const img = document.createElement('img');
      img.src = url;
      button.replaceChildren(img);
    } else {
      button.replaceChildren(emoji);
    }
  };
}

export function createPicker(options: any = {}) {
  const rootElement = toElement(/* html */`
    <div>
      <button type="button" class="emoji-button empty"></button>
    </div>
  `);

  const button = rootElement.querySelector<HTMLButtonElement>('.emoji-button') as HTMLButtonElement;

  const picker = createPopup(
    options,
    {
      position: 'auto',
      className: 'custom-popup',
      triggerElement: button,
      referenceElement: button
    }
  );

  window.parent.addEventListener(
    'click',
    () => {
      if (picker.isOpen) {
        picker.close();
      }
    },
    { once: true }
  );

  button.addEventListener('click', () => {
    picker.toggle();
  });

  picker.addEventListener('emoji:select', handleEmojiSelection(button));
  picker.addEventListener('emoji:select', options.emojiSelect);
  picker.addEventListener('picker:open', options.pickerOpen);
  picker.addEventListener('picker:close', options.pickerClose);
  
  return rootElement;
}