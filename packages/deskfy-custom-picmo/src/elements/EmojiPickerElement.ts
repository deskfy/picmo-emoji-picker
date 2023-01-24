import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { cache } from 'lit/directives/cache.js';

import { contextProvider } from '@lit-labs/context';
import { LATEST_EMOJI_VERSION } from 'emojibase';

import { i18nContext } from './I18nContext';
import { DataStore } from '../data/DataStore';
import { EmojiRecord, PickerOptions } from '../types';

import { Category } from '../types';

import { determineEmojiVersion } from '../emojiSupport';
import { lightTheme, darkTheme } from './themes';
import { Bundle } from '../i18n/bundle';
import { emojiPickerContext, PickerContextData } from './EmojiPickerContext';
import { dataContext } from './EmojiDataContext';
import { optionsContext } from './OptionsContext';
import { SearchEvent } from './events';

import { EventBus } from '../EventBus';

@customElement('picmo-emoji-picker')
export class EmojiPickerElement extends LitElement {
  static styles = [
    lightTheme,
    css`
      :host {
        --border-radius: 5px;
        --emojis-per-row: 8;
        --emoji-size: 2rem;
        --emoji-size-multiplier: 1.3;

        --search-height: 2em;

        --emoji-font: 'Segoe UI Emoji', 'Segoe UI Symbol', 'Segoe UI', 'Apple Color Emoji', 'Twemoji Mozilla', 'Noto Color Emoji', 'EmojiOne Color', 'Android Emoji';
        --ui-font: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
        --ui-font-size: 16px;

        --category-tabs-height: calc(1.5em + 4px + 4px + 1px);

        --emoji-preview-margin: 4px;
        --emoji-preview-height: calc(var(--emoji-preview-size) + 1em + 1px);
        --emoji-preview-height-full: calc(var(--emoji-preview-height) + var(--emoji-preview-margin));
        --emoji-preview-size: 2.75em;

        --picker-width: calc(var(--emojis-per-row) * var(--emoji-size) * var(--emoji-size-multiplier) + 2.75rem);
        --row-count: 6;
        --category-name-height: 2rem;
        --emoji-area-height: calc(
          (var(--row-count) * var(--emoji-size) * var(--emoji-size-multiplier)) + var(--category-name-height)
        );
      }

      .skeletonGrid {
        display: grid;
        grid-template-columns: repeat(var(--emojis-per-row), calc(var(--emoji-size) * var(--emoji-size-multiplier)));
        grid-auto-rows: calc(var(--emoji-size) * var(--emoji-size-multiplier));
        justify-content: space-between;
        gap: 1px;
        padding: 0 0.5em;
      }

      .skeletonCategory {
        margin: 0.5rem;
        margin-top: 0;
      }

      .picker {
        background: var(--background-color);
        width: var(--picker-width);
        border-radius: var(--border-radius);
        border: 1px solid var(--border-color);
        font-family: var(--ui-font);
        font-size: var(--ui-font-size);
        overflow: hidden;
        position: relative;
        width: var(--picker-width);
        display: grid;
        gap: 8px;
      }

      .picker > * {
        font-family: var(--ui-font);
      }
    `
  ];

  @contextProvider({ context: i18nContext })
  @property({ attribute: false })
  bundle: Bundle;

  @contextProvider({ context: emojiPickerContext })
  @property({ attribute: false })
  contextData: PickerContextData;

  @contextProvider({ context: dataContext })
  @property({ attribute: false })
  emojiData: DataStore;

  @contextProvider({ context: optionsContext })
  @property({ attribute: false })
  options: PickerOptions;
  customEmojis: EmojiRecord[];

  @state()
  private categories: Category[];

  @state()
  private searchResults: EmojiRecord[] | null = null;

  private events = new EventBus();

  constructor(
    options: PickerOptions, 
    pickerId: string,
    customEmojis: EmojiRecord[],
    emojiDataPromise: Promise<DataStore>) {
    super();

    this.bundle = new Bundle(options.i18n);

    this.contextData = { 
      pickerId,
      events: this.events,
      emojiVersion: options.emojiVersion === 'auto' ? 
        determineEmojiVersion() || parseFloat(LATEST_EMOJI_VERSION) :
        this.options.emojiVersion as number
    };
    this.options = options;
    this.customEmojis = customEmojis;

    emojiDataPromise.then(emojiData => {
      this.emojiData = emojiData;
      return emojiData.getCategories(this.options);
    }).then(categories => {
      this.categories = categories;
    });

    this.events.register('search', this.onSearch, this);
    this.events.register('emoji:select', this.selectEmoji, this);
  }

  private async selectEmoji(emoji: EmojiRecord) {
    this.dispatchEvent(new CustomEvent('emoji:select', {
      bubbles: true,
      composed: true,
      detail: await this.options.renderer.doEmit(emoji)
    }));

    this.options.recentsProvider.addOrUpdateRecent(emoji, this.options.maxRecents);
    this.events.dispatch('recents:update');

    // TODO variant popup
  }

  private async onSearch(searchQuery: string) {
    if (!searchQuery) {
      this.searchResults = null;
      return;
    }

    this.searchResults = await this.emojiData.searchEmojis(
      searchQuery,
      this.customEmojis,
      this.contextData.emojiVersion,
      this.categories
    );
  }

  private renderSearchResults() {
    return this.searchResults?.length ?
      html`<picmo-emojis .emojis=${this.searchResults}></picmo-emojis>` :
      html`<picmo-search-not-found></picmo-search-not-found>`;
  }

  private renderEmojiArea() {
    if (this.categories) {
      return this.categories.map(category =>
        category.key === 'recents' ?
          html`<picmo-recent-emojis .category=${category}></picmo-recent-emojis>` :
          html`<picmo-emoji-category .category=${category}></picmo-emoji-category>`
      );
    }

    const emojis: TemplateResult[] = [];
    const emojiCount = this.options.emojisPerRow * this.options.visibleRows;
    for (let i = 0; i < emojiCount; i++) {
      emojis.push(html`<picmo-skeleton width="var(--emoji-size)" height="var(--emoji-size)" borderRadius="50%"></picmo-skeleton>`);
    }

    return html`
      <div class="skeletonCategory"><picmo-skeleton width="50%" height="1rem" borderRadius="0"></picmo-skeleton></div>
      <div class="skeletonGrid">
        ${emojis}
      </div>
    `;
  }

  private renderContent() {
    return cache(this.searchResults ? this.renderSearchResults() : this.renderEmojiArea());
  }

  private renderPicker() {
    return html`
      <div class="picker lightTheme">
        <picmo-header .categories=${this.categories}></picmo-header>
        <div class="content">
          <picmo-emoji-area @select=${this.selectEmoji}>
            ${this.renderContent()}
          </picmo-emoji-area>
        </div>
        <picmo-preview></picmo-preview>
      </div>
    `;
  }

  render() {
    return this.renderPicker();
  } 
}