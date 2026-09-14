import type { NextConfig } from 'next';
const staticExport = process.env.UNSEEN_STATIC_EXPORT === '1';
const config: NextConfig = {
  ...(staticExport ? { output: 'export' as const, trailingSlash: true, distDir: '.next-static' } : {}),
  poweredByHeader: false,
  devIndicators: false,
  ...(staticExport ? {} : { async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  } }),
};
export default config;
