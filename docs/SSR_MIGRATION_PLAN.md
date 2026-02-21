# SSR 마이그레이션 단계별 제안

현재 대부분의 페이지는 `'use client'` + `useEffect`로 클라이언트에서만 데이터를 가져옵니다.  
아래 순서대로 SSR을 도입하면, 첫 화면 렌더와 SEO를 개선하면서 리스크를 줄일 수 있습니다.

---

## 전제: 서버에서 API 호출하기

- **현재:** `apiClient`(axios), `fetchClient`(fetch) 모두 **브라우저**에서만 동작 (`document.cookie`, `localStorage`).
- **필요:** 서버 컴포넌트에서는 **Next.js `cookies()`**로 쿠키를 읽어, `fetch(API_URL, { headers: { Cookie: ... } })` 형태로 백엔드 호출.
- **제안:** `src/api/server/` 또는 `src/lib/serverFetch.ts` 같은 **서버 전용 API 클라이언트**를 하나 두고, 인증이 필요한 요청은 여기서만 처리.

```ts
// 예: src/api/server/serverFetch.ts
import { cookies } from 'next/headers';

export async function serverFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get('x-access-token')?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
      Cookie: cookieStore.toString(),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

이걸 먼저 만들고, 아래 단계에서 “서버 fetch”는 전부 이 함수(또는 같은 패턴)를 쓰는 걸 전제로 합니다.

---

## 1단계: 게시글 상세 (PostDetail) – 우선 적용 권장

**이유**

- 이미 **async 서버 컴포넌트**로 되어 있어서, 서버에서 한 번만 데이터를 가져오면 됨.
- 상세 페이지는 **LCP·SEO**에 영향이 커서 SSR 효과가 큼.
- 구조가 단순함 (게시글 1건 fetch → props로 내려주기).

**할 일**

| 항목 | 내용 |
|------|------|
| **서버** | `PostDetailPage`(async)에서 `serverFetch`로 `GET /posts/:postId` 호출. |
| **클라이언트** | `PostDetailClient`에 `initialPost?: Post \| null` props 추가. `initialPost`가 있으면 그걸 초기 state로 사용하고, 없을 때만 기존처럼 `useEffect`로 fetch. |
| **인터랙션** | 좋아요/북마크/댓글 전송은 계속 `apiClient`(클라이언트) 사용. |

**결과**

- 첫 HTML에 본문이 포함되어 빠른 첫 화면 렌더.
- 이후 상호작용은 기존처럼 클라이언트에서 처리.

---

## 2단계: 게시판 목록 (BoardPage)

**이유**

- 목록도 첫 화면에 바로 보이면 체감 속도가 좋아짐.
- “첫 페이지 분량”만 서버에서 가져오고, **무한 스크롤/탭 전환**은 기존처럼 클라이언트 유지 가능.

**할 일**

| 항목 | 내용 |
|------|------|
| **app 라우트** | `app/(auth-required)/boards/[boardName]/page.tsx`를 **서버 컴포넌트**로 두고, 여기서 `serverFetch`로 첫 페이지 목록만 fetch (예: `GET /posts?board=...&page=0&size=20`). |
| **페이지 컴포넌트** | `BoardPage`는 두 가지 사용 방식 지원: (1) `initialPosts`, `initialHasMore` 등을 props로 받으면 SSR 결과 사용, (2) 없으면 기존처럼 클라이언트에서만 fetch. |
| **클라이언트** | 탭 변경·더보기(무한 스크롤)는 기존대로 `useEffect`/상태로 처리. |

**주의**

- `BoardPage`가 지금은 `'use client'` 전부이므로, “서버 페이지 → BoardPage에 initial 데이터 넘기기” 구조로 나누면 됨 (BoardPage는 계속 클라이언트, 받은 initial만 쓰면 됨).

---

## 3단계: 메인 페이지 (MainPage) – 선택

**이유**

- “게시물 랭킹”, “빈 강의실” 등 **초기 블록**만 서버에서 채우면 LCP 개선에 도움.

**할 일**

| 항목 | 내용 |
|------|------|
| **서버** | `app/(auth-required)/main/page.tsx`를 서버 컴포넌트로 두고, 랭킹 API(`/posts/top3`), 필요하면 빈 강의실 API 등 **초기 데이터만** `serverFetch`로 호출. |
| **클라이언트** | `MainPage`에 `initialRankingPosts`, `initialRoomStatus` 같은 props 추가. 있으면 스켈레톤 없이 바로 렌더, 없으면 기존처럼 클라이언트 fetch. |

**참고**

- 이미 메인은 dynamic/지연 로딩으로 나눠져 있으므로, “첫 블록만 SSR”만 해도 효과 있음.

---

## 4단계: 투표 목록/상세 (VoteList, VoteDetail)

**이유**

- 읽기 위주 페이지라 서버에서 한 번만 가져와도 됨.
- 목록·상세 모두 “첫 페이지 분량”만 서버에서 넘기면 됨.

**할 일**

| 항목 | 내용 |
|------|------|
| **VoteListPage** | app 라우트에서 `serverFetch`로 목록 1페이지 호출 → `VoteListPage`에 `initialVotes` 등으로 전달. |
| **VoteDetailPage** | app 라우트에서 `serverFetch`로 해당 투표 상세 호출 → `VoteDetailPage`에 `initialVote` 전달. |
| **클라이언트** | 투표하기/선택 등은 계속 클라이언트에서 `apiClient` 사용. |

---

## 5단계: 강의/코스·학과 정보 (Courses, Dept, Department-info)

**이유**

- 목록/상세 패턴이 비슷하고, 읽기 비중이 커서 SSR 이득이 있음.

**할 일**

| 항목 | 내용 |
|------|------|
| **CoursesPage / CourseDetailPage** | 서버에서 목록·상세 1건 fetch 후 props로 전달. |
| **DeptNoticePage, DeptFaqPage, DeptOpinionPage** | 각각 첫 페이지 분량만 서버 fetch → initial 데이터로 전달. |
| **Department info** | 공개 정보 위주면 서버 fetch 적합. |

---

## 6단계: 티켓팅 이벤트 목록 (TicketingPage)

**이유**

- “이벤트 목록” 첫 화면만 서버에서 주고, 상세/실시간(SSE)은 클라이언트 유지.

**할 일**

| 항목 | 내용 |
|------|------|
| **TicketingPage** | app 라우트에서 이벤트 목록 1페이지 `serverFetch` → `TicketingPage`에 `initialEvents` 전달. |
| **TicketingEventPage** | 이벤트 기본 정보는 서버에서 1건 fetch 가능. SSE·실시간 상태는 기존처럼 클라이언트 전담. |

---

## SSR을 나중에 하거나 유지하지 않을 페이지

| 페이지 | 이유 |
|--------|------|
| **로그인/회원가입** | 폼·리다이렉트 위주, SSR 이득 적음. |
| **글쓰기/수정 (CreatePost, WriteVote, EditEvent 등)** | 폼과 클라이언트 검증 위주. |
| **채팅** | 실시간·WebSocket/SSE, 클라이언트가 맞음. |
| **티켓팅 신청/서명 플로우** | SSE·실시간 상태·모달 조합. |
| **검색** | 쿼리 의존적이라 “첫 프레임만 SSR”은 선택. |
| **마이페이지/설정** | 개인화·상태가 많아서 클라이언트 유지가 단순. |

---

## 적용 순서 요약

1. **서버용 API 유틸** (`serverFetch` + 쿠키 전달) 추가.
2. **게시글 상세 (PostDetail)** – 서버에서 post 1건 fetch → `PostDetailClient`에 initial 전달.
3. **게시판 목록 (BoardPage)** – 첫 페이지만 서버 fetch → initial로 전달.
4. (선택) **메인 페이지** – 랭킹/강의실 등 초기 블록만 서버 fetch.
5. **투표 목록/상세** → **강의·학과** → **티켓팅 목록** 순으로 같은 패턴 적용.

이 순서대로 하면, “데이터는 서버에서 한 번, 나머지는 기존 클라이언트” 구조로 점진적으로 SSR을 넣을 수 있습니다.
