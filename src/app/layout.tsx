import '@/styles/globals.css';
import { ReactNode } from 'react';
import { UserProvider } from '@/context/UserContext';
import { AuthProvider } from '@/context/AuthContext';
import type { Viewport } from 'next';
import ReviewProvider from '@/context/WriteReviewContext';
import Script from 'next/script';
import { notoSansKR } from '@public/fonts';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      id="scrollbar-hidden"
      lang="ko"
      className={`w-full h-full relative ${notoSansKR.variable}`}
      suppressHydrationWarning
    >
      <head>
        <title>인천대학교 정보대 SNS</title>
        {/* 네이버맵은 지도 페이지에서만 lazy 로드 (렌더 차단 제거) */}
      </head>

      {/* Google Analytics gtag.js */}

      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-643XQ6BZ59"
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-643XQ6BZ59');
        `}
      </Script>
      <AuthProvider>
        <UserProvider>
          <ReviewProvider>
            <body
              id="scrollbar-hidden"
              className="bg-white max-w-full min-h-full relative flex justify-center"
            >
              {' '}
              {/* 바텀 네비게이션 높이만큼 패딩 추가 */}
              <div className="bg-white w-full min-h-full max-w-[500px] relative">
                {children}
              </div>
            </body>
          </ReviewProvider>
        </UserProvider>
      </AuthProvider>
    </html>
  );
}
