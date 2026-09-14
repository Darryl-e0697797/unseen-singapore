import { cpSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const result = spawnSync('npm', ['run', 'build'], {
  stdio: 'inherit',
  env: { ...process.env, UNSEEN_STATIC_EXPORT: '1' },
});
if (result.status === 0) {
  rmSync('out', { recursive: true, force: true });
  cpSync('apps/web/.next-static', 'out', { recursive: true });
}
process.exit(result.status ?? 1);
