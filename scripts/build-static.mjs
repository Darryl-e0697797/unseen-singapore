import { spawnSync } from 'node:child_process';
const result = spawnSync('npm', ['run', 'build'], {
  stdio: 'inherit',
  env: { ...process.env, UNSEEN_STATIC_EXPORT: '1' },
});
process.exit(result.status ?? 1);
