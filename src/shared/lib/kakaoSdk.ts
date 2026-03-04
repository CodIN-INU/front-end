let kakaoLoadPromise: Promise<any | null> | null = null;

export async function loadKakaoSdk(kakaoKey?: string): Promise<any | null> {
  if (typeof window === 'undefined') return null;

  const w = window as unknown as { Kakao?: any };

  if (w.Kakao && w.Kakao.isInitialized()) {
    return w.Kakao;
  }

  if (!kakaoKey) return null;

  if (kakaoLoadPromise) {
    return kakaoLoadPromise;
  }

  kakaoLoadPromise = new Promise<any | null>((resolve, reject) => {
    if (document.getElementById('kakao-sdk')) {
      const existing = w.Kakao;
      if (existing) {
        if (!existing.isInitialized()) {
          existing.init(kakaoKey);
        }
        resolve(existing);
        return;
      }
    }

    const script = document.createElement('script');
    script.id = 'kakao-sdk';
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
    script.async = true;

    script.onload = () => {
      const Kakao = w.Kakao;
      if (!Kakao) {
        resolve(null);
        return;
      }
      if (!Kakao.isInitialized()) {
        Kakao.init(kakaoKey);
      }
      resolve(Kakao);
    };

    script.onerror = (error) => {
      kakaoLoadPromise = null;
      reject(error);
    };

    document.head.appendChild(script);
  });

  return kakaoLoadPromise;
}

