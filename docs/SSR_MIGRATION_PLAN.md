# SSR 마이그레이션 단계별 제안

현재 대부분의 페이지는 `'use client'` + `useEffect`로 클라이언트에서만 데이터를 가져옵니다.  
아래 순서대로 SSR을 도입하면, 첫 화면 렌더와 SEO를 개선하면서 리스크를 줄일 수 있습니다.

---

## 전제: 서버에서 API 호출하기

- **현재:** `apiClient`(axios), `fetchClient`(fetch) 모두 **브라우저**에서만 동작 (`document.cookie`, `localStorage`).
- **필요:** 서버 컴포넌트에서는 **Next.js `cookies()`**로 쿠키를 읽어, `fetch(API_URL, { headers: { Cookie: ... } })` 형태로 백엔드 호출.
- **제안:** `src/server/` 또는 `src/lib/serverFetch.ts` 같은 **서버 전용 API 클라이언트**를 하나 두고, 인증이 필요한 요청은 여기서만 처리.

```ts
// 예: src/server/serverFetch.ts
import { cookies } from 'next/headers';

export async function serverFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const cookieStore = await cookies();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      Cookie: cookieStore.toString(),
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

---

## 적용 순서 요약

1. 서버용 API 유틸(`serverFetch`)을 `src/server/`에 둔다.
2. PostDetail → BoardPage 순으로 “초기 데이터만” SSR을 도입한다.
3. 그 다음 Vote/Courses/Dept/Ticketing으로 같은 패턴을 확장한다.
