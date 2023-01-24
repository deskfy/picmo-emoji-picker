import { css, unsafeCSS } from 'lit';
import { library, dom, config, IconName } from '@fortawesome/fontawesome-svg-core';

import { 
  faClock,
  faFaceGrin,
  faFlag,
  faGamepad,
  faGhost,
  faIcons,
  faLightbulb,
  faMugSaucer,
  faPlane,
  faRobot,
  faMagnifyingGlass,
  faTree,
  faUsers,
  faXmark
} from '@fortawesome/free-solid-svg-icons';

import { CategoryKey } from '../types';

config.autoAddCss = false;

library.add(
  faClock,
  faFaceGrin,
  faFlag,
  faGamepad,
  faGhost,
  faIcons,
  faLightbulb,
  faMugSaucer,
  faPlane,
  faRobot,
  faMagnifyingGlass,
  faTree,
  faUsers,
  faXmark
);

const iconCss = dom.css();

export const iconStyles = css`${unsafeCSS(iconCss)}`;

export const categoryIcons: Record<CategoryKey, IconName> = {
  'recents': 'clock',
  'smileys-emotion': 'face-grin',
  'people-body': 'users',
  'animals-nature': 'tree',
  'food-drink': 'mug-saucer',
  'activities': 'gamepad',
  'travel-places': 'plane',
  'objects': 'lightbulb',
  'symbols': 'icons',
  'flags': 'flag',
  'custom': 'robot'
};
