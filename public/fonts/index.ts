import localFont from 'next/font/local';

/**
 * LCP 개선: 실제 사용 weight만 로드 (9개 → 4개)
 * globals.css의 text-Ml(font-light), font-medium, font-normal 사용
 */
export const notoSansKR = localFont({
  variable: '--font-noto-sans-kr',
  display: 'swap',
  preload: true,
  src: [
    { path: './NotoSansKR-Light.ttf', weight: '300', style: 'normal' },
    { path: './NotoSansKR-Regular.ttf', weight: '400', style: 'normal' },
    { path: './NotoSansKR-Medium.ttf', weight: '500', style: 'normal' },
    { path: './NotoSansKR-Bold.ttf', weight: '700', style: 'normal' },
  ],
});
