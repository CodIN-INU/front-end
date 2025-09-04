/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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

module.exports = nextConfig;
