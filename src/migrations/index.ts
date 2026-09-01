import * as migration_20260826_210222 from './20260826_210222';
import * as migration_20260901_add_visibility from './20260901_add_visibility';

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
];
