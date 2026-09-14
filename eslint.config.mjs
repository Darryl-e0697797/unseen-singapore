import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  { settings: { next: { rootDir: 'apps/web/' } } },
  globalIgnores([
    '**/.next/**',
    '**/.next-static/**',
    'apps/web/out/**',
    '**/next-env.d.ts',
    'test-results/**',
    'apps/web/public/vendor/**',
  ]),
]);
