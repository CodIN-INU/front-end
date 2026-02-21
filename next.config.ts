/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: false,

  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },

  // 사용하는 패키지만 번들에 포함 (미사용 JS 감소)
  experimental: {
    optimizePackageImports: ['lodash', 'react-icons', 'lucide-react'],
  },

  // 정적 에셋 캐시 헤더 (캐시 수명 개선)
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  images: {
    domains: [
      'codin-s3-bucket.s3.ap-northeast-2.amazonaws.com',
      'starinu.inu.ac.kr',
      'ite.inu.ac.kr',
      'ese.inu.ac.kr', // S3 버킷 도메인 추가
      'cse.inu.ac.kr',
      'inu.ac.kr',
      'www.inu.ac.kr'

    ],
  },
  output: 'standalone',
  webpack: config => {
    // SVGR setting
    const fileLoaderRule = config.module.rules.find(rule =>
      rule.test?.test?.('.svg')
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              typescript: true,
              ext: 'tsx',
            },
          },
        ],
      }
    );
    fileLoaderRule.exclude = /\.svg$/i;
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
