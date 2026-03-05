'use client';

import { useCallback } from 'react';
import { loadKakaoSdk } from '@/shared/lib/kakaoSdk';

interface UseShareActionsOptions {
  title: string;
  description?: string;
  imageUrl?: string;
  url?: string;
}

export function useShareActions({
  title,
  description,
  imageUrl,
  url,
}: UseShareActionsOptions) {
  const getShareUrl = () => {
    if (url) return url;
    if (typeof window === 'undefined') return '';
    return window.location.href;
  };

  const copyLink = useCallback(async () => {
    const shareUrl = getShareUrl();
    if (!shareUrl) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      alert('링크가 복사되었습니다.');
    } catch {
      alert('클립보드 복사에 실패했어요.');
    }
  }, [url]);

  const shareKakao = useCallback(async () => {
    const shareUrl = getShareUrl();
    if (!shareUrl) return;

    // React Native WebView 환경이면 네이티브 측에서 카카오 공유 처리
    if (typeof window !== 'undefined' && (window as any).ReactNativeWebView) {
      try {
        (window as any).ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'SHARE_KAKAO',
            payload: {
              title,
              description: description ?? '',
              imageUrl:
                imageUrl ?? 'https://codin.inu.ac.kr/images/logo.png',
              url: shareUrl,
            },
          }),
        );
      } catch (error) {
        console.error('웹뷰로 카카오 공유 메시지 전송 실패:', error);
        alert('앱에서 카카오톡 공유를 처리하지 못했어요.');
      }
      return;
    }

    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

    try {
      const Kakao = await loadKakaoSdk(kakaoKey);
      if (!Kakao) {
        alert('카카오톡 SDK 로딩 중입니다. 잠시 후 다시 시도해주세요.');
        return;
      }

      Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title,
          description: description ?? '',
          imageUrl:
            imageUrl ?? 'https://codin.inu.ac.kr/images/logo.png',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      });
    } catch (error) {
      console.error('카카오톡 공유 실패:', error);
      alert('카카오톡 공유 중 오류가 발생했어요.');
    }
  }, [title, description, imageUrl, url]);

  return { copyLink, shareKakao };
}

