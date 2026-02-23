import type { Configuration, RuleSetRule } from 'webpack';

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
  webpack: (config: Configuration) => {
    // SVGR setting
    if (!config.module?.rules) return config;

    const fileLoaderRule = config.module.rules.find((rule): rule is RuleSetRule => {
      if (typeof rule !== 'object' || rule === null) return false;
      const r = rule as RuleSetRule;
      const test = r.test;
      if (test instanceof RegExp) return test.test('.svg');
      if (typeof test === 'function') return test('.svg');
      return false;
    });

    if (!fileLoaderRule) return config;

    const baseRule =
      typeof fileLoaderRule === 'object' && fileLoaderRule !== null
        ? { ...fileLoaderRule }
        : {};

    config.module.rules.push(
      {
        ...baseRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: 'issuer' in fileLoaderRule ? fileLoaderRule.issuer : undefined,
        resourceQuery: {
          not: [
            ...(Array.isArray(
              (fileLoaderRule.resourceQuery as { not?: unknown[] })?.not
            )
              ? (fileLoaderRule.resourceQuery as { not: RegExp[] }).not
              : []),
            /url/,
          ],
        },
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
    Object.assign(fileLoaderRule, { exclude: /\.svg$/i });
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
