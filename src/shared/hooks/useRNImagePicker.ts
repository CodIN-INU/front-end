'use client';

import { useCallback } from 'react';

interface RNImage {
  base64: string;
  name: string;
  type: string;
}

function base64ToFile(base64: string, filename: string, mimeType: string): File {
  const byteString = atob(base64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new File([ab], filename, { type: mimeType });
}

type RNWindow = Window & {
  ReactNativeWebView?: { postMessage: (msg: string) => void };
};

export function isRNWebView(): boolean {
  return typeof window !== 'undefined' && !!(window as RNWindow).ReactNativeWebView;
}

export function useRNImagePicker() {
  const isRN = isRNWebView();

  // Web → RN: OPEN_IMAGE_PICKER 요청 후 IMAGE_PICKER_RESULT 응답을 File[] 로 반환
  const openPicker = useCallback(
    (options: { multiple?: boolean } = {}): Promise<File[]> => {
      if (!isRNWebView()) return Promise.resolve([]);

      return new Promise((resolve) => {
        const requestId = Math.random().toString(36).slice(2);

        const handler = (event: MessageEvent) => {
          try {
            const data =
              typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            if (
              data.type === 'IMAGE_PICKER_RESULT' &&
              data.payload?.requestId === requestId
            ) {
              window.removeEventListener('message', handler);
              const files: File[] = (data.payload.images as RNImage[] ?? []).map(
                (img) => base64ToFile(img.base64, img.name, img.type)
              );
              resolve(files);
            }
          } catch {
            // 파싱 실패 무시
          }
        };

        window.addEventListener('message', handler);

        (window as RNWindow).ReactNativeWebView!.postMessage(
          JSON.stringify({
            type: 'OPEN_IMAGE_PICKER',
            payload: { multiple: options.multiple ?? false, requestId },
          })
        );
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return { isRN, openPicker };
}
