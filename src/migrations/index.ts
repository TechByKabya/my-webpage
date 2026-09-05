import * as migration_20260826_210222 from './20260826_210222';
import * as migration_20260901_add_visibility from './20260901_add_visibility';
import * as migration_20260905_add_og_image_to_site_settings from './20260905_add_og_image_to_site_settings';

export const migrations = [
  {
    up: migration_20260826_210222.up,
    down: migration_20260826_210222.down,
    name: '20260826_210222'
  },
  {
    up: migration_20260901_add_visibility.up,
    down: migration_20260901_add_visibility.down,
    name: '20260901_add_visibility'
  },
  {
    up: migration_20260905_add_og_image_to_site_settings.up,
    down: migration_20260905_add_og_image_to_site_settings.down,
    name: '20260905_add_og_image_to_site_settings'
  },
];
