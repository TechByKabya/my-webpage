import * as migration_20260826_210222 from './20260826_210222';

export const migrations = [
  {
    up: migration_20260826_210222.up,
    down: migration_20260826_210222.down,
    name: '20260826_210222'
  },
];
