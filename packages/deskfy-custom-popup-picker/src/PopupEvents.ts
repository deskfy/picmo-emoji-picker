import { ExternalEvent } from '../../deskfy-custom-picmo';

export type PopupEvent = 
  ExternalEvent |
  'picker:open' |
  'picker:close';
