import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { EmojiRecord } from '../types';

import { PicMoElement } from './PicMoElement';

@customElement('picmo-emoji')
export class Emoji extends PicMoElement {
  static styles = css`
    :host {
      width: 100%;
    }

    .emojiButton {
      background: transparent;
      border: none;
      border-radius: 15px;
      cursor: pointer;
      display: flex;
      font-family: var(--emoji-font);
      font-size: var(--emoji-size);
      height: 100%;
      justify-content: center;
      margin: 0;
      overflow: hidden;
      padding: 0;
      width: 100%;
    }

    .emojiButton:hover {
      background: var(--hover-background-color);
    }

    .emojiButton:focus {
      border-radius: 0;
      background: var(--focus-indicator-background-color);
      outline: 1px solid var(--focus-indicator-color);
    }
  `;

  @property()
  emoji: EmojiRecord;

  content: Element;

  render() {
    this.content = this.options.renderer.doRender(this.emoji);

    return html`
      <button
        type="button"
        class="emojiButton"
        title="${this.emoji.label}"
        data-emoji="${this.emoji.emoji}"
        tabindex="-1">
        ${this.content}
      </button>
    `;
  }
}
