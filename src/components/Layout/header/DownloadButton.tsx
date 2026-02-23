// components/DownloadButton.tsx
'use client';
import React, { useState } from 'react';
import { fetchClient } from '@/shared/api/fetchClient';

interface DownloadButtonProps {
  endpoint: string; // 백엔드 API 경로 (예: "/files/report")
  filename?: string; // 저장할 파일 이름
  method?: 'GET' | 'POST';
  body?: any; // POST 시 보낼 데이터
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  endpoint,
  filename = 'download.file',
  method = 'GET',
  body,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
  try {
    setLoading(true);

    // 1) 우선 fetchClient로 한 번 때려서 인증/재발급 플로우를 태움 (응답은 버려도 됨)
    await fetchClient(endpoint, {
      method,
      body: method === 'POST' && body ? JSON.stringify(body) : undefined,
      headers: method === 'POST' ? { 'Content-Type': 'application/json' } : undefined,
    });

    // 2) 실제 다운로드는 Blob으로 직접 요청 (엑셀 MIME 지정)
    const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
    const res = await fetch(url, {
      method,
      credentials: 'include',
      headers: {
        Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ...(method === 'POST' ? { 'Content-Type': 'application/json' } : {}),
      },
      body: method === 'POST' && body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      // 서버가 JSON 에러를 줄 수도 있으니 시도
      let message = `다운로드 실패: ${res.status}`;
      try {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          const errJson = await res.json();
          if (errJson?.message) message = errJson.message;
        } else {
          const t = await res.text();
          if (t) message = t;
        }
      } catch {}
      throw new Error(message);
    }

    // 3) 파일명 Content-Disposition에서 추출 (없으면 props filename 사용)
    const cd = res.headers.get('content-disposition') || '';
    const match = cd.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i);
    const safeFilename = match ? decodeURIComponent(match[1]) : filename;

    // 4) Blob → 다운로드
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `${safeFilename}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error(err);
    alert(err instanceof Error ? err.message : '파일 다운로드 중 오류가 발생했습니다.');
  } finally {
    setLoading(false);
  }
};


  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={`px-4 py-2 rounded font-bold ${
        loading ? 'bg-gray-100' : ''
      }`}
    >
      <img src='/icons/button/download.svg' className='pointer-events-none'></img>
    </button>
  );
};

export default DownloadButton;
