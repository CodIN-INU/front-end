# Feature 분리 방식 가이드

> **목표**: `app/` 안에 섞여 있는 컴포넌트·유틸·타입을 도메인별로 `features/`로 빼서, 라우팅(`app`)과 비즈니스 로직(`features`)을 분리한다.

---

## 1. 어떤 식으로 나누는지 (개념)

### Before (현재)

```
src/app/(auth-required)/roomstatus/
├── page.tsx              ← 라우트 + UI 로직이 같이 있음
├── layout.tsx            ← 레이아웃
├── [floor]/page.tsx      ← 또 다른 라우트 + UI
├── components/           ← app 안에 컴포넌트 (라우팅과 무관한데 app에 있음)
│   ├── roomItem.tsx
│   ├── roomItemHourly.tsx
│   └── ...
├── interfaces/           ← app 안에 타입
├── utils/                ← app 안에 유틸
└── constants/            ← app 안에 상수
```

- **문제**: 라우팅용 `page.tsx` / `layout.tsx`만 있어야 할 `app/` 안에, “강의실 현황” 기능 전용 코드가 같이 들어 있음.
- **결과**: 기능 수정 시 `app/` 깊은 경로를 찾아다녀야 하고, 다른 화면에서 재사용하기도 애매함.

### After (Feature 분리 후)

**app/** — 라우팅만 담당

```
src/app/(auth-required)/roomstatus/
├── page.tsx              ← 내용: import RoomStatusPage from '@/features/roomstatus/pages/...'; export default RoomStatusPage;
├── layout.tsx            ← (필요 시 레이아웃만 유지)
└── [floor]/page.tsx      ← 내용: import FloorPage from '@/features/roomstatus/pages/...'; export default FloorPage;
```

**features/** — “강의실 현황” 기능 전체

```
src/features/roomstatus/
├── pages/                 ← app의 page.tsx가 import할 “페이지 컴포넌트”
│   ├── RoomStatusPage.tsx
│   └── FloorPage.tsx
├── components/            ← roomstatus 전용 UI
│   ├── RoomItem.tsx
│   ├── RoomItemHourly.tsx
│   ├── RoomItemDetail.tsx
│   └── CurrentTimePointer.tsx
├── hooks/                 ← (필요 시) roomstatus 전용 훅
├── utils/
│   └── timePointerUtils.tsx
├── constants/
│   └── timeTableData.tsx
└── types.ts               ← interfaces/* 를 하나로 묶은 타입
```

- **역할 분리**: `app/` = “이 URL이면 이 페이지 컴포넌트를 보여준다”만 결정.  
  실제 UI·상태·유틸·타입은 전부 `features/roomstatus/`에서 관리.
- **효과**: 강의실 현황 수정 시 `features/roomstatus/`만 보면 되고, 테스트/재사용도 feature 단위로 가능.

---

## 2. Feature 하나의 표준 구조

각 feature는 아래 구조를 기본으로 한다.

```
src/features/<도메인명>/
├── pages/           # app의 page.tsx가 import할 컴포넌트 (실제 화면)
├── components/      # 이 feature 전용 컴포넌트
├── hooks/           # (선택) 이 feature 전용 훅
├── utils/           # (선택) 이 feature 전용 유틸
├── constants/       # (선택) 이 feature 전용 상수
└── types.ts         # (선택) 이 feature 전용 타입. 공용이면 src/types/ 사용
```

- **pages/**  
  - `app/.../page.tsx`는 **한두 줄**만 두고, `pages/` 안의 컴포넌트를 import해서 `export default` 한다.
- **components / hooks / utils / constants**  
  - 지금 `app/` 같은 경로 아래에 있는 전용 코드를 그대로 옮긴다.
- **types.ts**  
  - `app/.../interfaces/*` 또는 `app/.../types/*`를 하나의 `types.ts`로 묶거나, 공용 타입은 `src/types/`에 둔다.

---

## 3. 우리가 할 작업 순서 (한 feature씩)

한 번에 하나의 feature만 분리한다.

| 순서 | 단계 | 설명 |
|------|------|------|
| 1 | 폴더 생성 | `src/features/<도메인>/pages`, `components`, `utils` 등 필요한 폴더만 생성 |
| 2 | 파일 이동 | `app/...` 아래의 컴포넌트·유틸·상수·인터페이스를 `features/<도메인>/` 아래로 이동 |
| 3 | 타입 정리 | `interfaces/*` 또는 `types/*` → `features/<도메인>/types.ts` 하나로 통합 (또는 공용은 `src/types/`) |
| 4 | 페이지 컴포넌트 만들기 | 기존 `app/.../page.tsx` 안의 JSX/로직을 `features/<도메인>/pages/XXXPage.tsx`로 옮김 |
| 5 | app은 re-export만 | `app/.../page.tsx`는 `import Page from '@/features/<도메인>/pages/...'; export default Page;` 만 남김 |
| 6 | import 경로 수정 | feature 내부는 상대 경로, feature 밖(공용 컴포넌트 등)은 `@/components/` 등 절대 경로 |
| 7 | 빌드·동작 확인 | `npm run build` 및 해당 라우트 직접 눌러서 확인 |

---

## 4. 이 프로젝트에서 분리할 Feature 목록 (우선순위)

### 4-1. 완료 현황 (작업 반영)

아래 Feature는 **페이지·컴포넌트를 `features/`로 옮기고 app은 re-export만 유지**한 상태까지 반영됨.

| Feature | features 경로 | app re-export 경로 (요약) |
|---------|----------------|---------------------------|
| **admin** | `features/admin/pages/` | `admin/page`, `admin/report` |
| **ticketing (admin)** | `features/ticketing/admin/pages/` | `admin/ticketing/*`, `admin/ticketing/create`, `admin/ticketing/[eventId]/*` |
| **main** | `features/main/pages/` | `(auth-required)/main`, `main/dept` |
| **auth (login·profile)** | `features/auth/pages/` | `(public)/login`, `login/admin`, `(public)/auth/profile` |
| **vote** | `features/vote/pages/` | `(public)/vote`, `vote/[voteId]`, `(auth-required)/write/vote` |
| **roomstatus** | `features/roomstatus/pages/` | `(auth-required)/roomstatus`, `roomstatus/[floor]` |
| **search** | `features/search/pages/` | `(auth-required)/search` |
| **chat** | `features/chat/pages/` | `(auth-required)/chat`, `chatRoom/[chatRoomId]` |
| **dept-boards** | `features/dept-boards/pages/` | `dept-boards/(nav)/faq|notice|opinion`, `dept-boards/q/[id]` |
| **mypage** | `features/mypage/pages/` | `(auth-required)/mypage/*` (7개 페이지) |
| **board** | `features/board/pages/` | `(auth-required)/boards`, `boards/[boardName]`, `boards/[boardName]/create`, `boards/[boardName]/[postId]` |
| **ticketing (일반)** | `features/ticketing/pages/` | `(auth-required)/ticketing`, `ticketing/[eventId]`, `ticketing/result` |
| **courses** | `features/courses/pages/` | `(auth-required)/info/courses`, `info/courses/[id]` |
| **course-reviews** | `features/course-reviews/` | `(auth-required)/info/course-reviews/*`, `write-review` |
| **department-info** | `features/department-info/` | `(auth-required)/info/department-info/*` |

컴포넌트 이전: ticketing 모달·티켓팅 UI, chat(MessageForm/List/Message), board(PostList, PostItem, pageHeaderModal 등), dept-boards(DeptHeader, NotionContainer, QuestionContainer), course-reviews(Review/*), courses(CourseCard 등), comment(CommentSection) → 각각 해당 `features/<이름>/components/` 로 이동 완료.

### 4-2. 원본 목록 (참고용)

| 순서 | Feature | app 경로 (대략) | 상태 |
|------|---------|------------------|------|
| 1 | **roomstatus** | `(auth-required)/roomstatus/` | ✅ 완료 |
| 2 | search | `(auth-required)/search/` | ✅ 완료 |
| 3 | chat / chatRoom | `(auth-required)/chat/`, `chatRoom/[chatRoomId]/` | ✅ 완료 |
| 4 | dept-boards | `(auth-required)/dept-boards/` | ✅ 완료 |
| 5 | mypage | `(auth-required)/mypage/` | ✅ 완료 |
| 6 | board | `(auth-required)/boards/` | ✅ 완료 |
| 7 | ticketing | `(auth-required)/ticketing/`, `admin/ticketing/` | ✅ 완료 |
| 8 | course-reviews | `(auth-required)/info/course-reviews/` | ✅ 완료 |
| — | **main** | `(auth-required)/main/`, `main/dept` | ✅ 완료 |
| — | **auth (login)** | `(public)/login/`, `login/admin`, `auth/profile` | ✅ 완료 |
| — | **vote** | `(public)/vote/`, `vote/[voteId]`, `write/vote` | ✅ 완료 |
| — | **admin** | `admin/`, `admin/report`, `admin/ticketing/*` | ✅ 완료 |

---

## 5. 예시: roomstatus 분리 (실제로 할 작업)

### 5-1. 이동할 파일 매핑

| 현재 위치 (app) | 이동 위치 (features) |
|-----------------|----------------------|
| `roomstatus/components/roomItem.tsx` | `features/roomstatus/components/RoomItem.tsx` |
| `roomstatus/components/roomItemHourly.tsx` | `features/roomstatus/components/RoomItemHourly.tsx` |
| `roomstatus/components/roomItemDetail.tsx` | `features/roomstatus/components/RoomItemDetail.tsx` |
| `roomstatus/components/currentTimePointer.tsx` | `features/roomstatus/components/CurrentTimePointer.tsx` |
| `roomstatus/utils/timePointerUtils.tsx` | `features/roomstatus/utils/timePointerUtils.tsx` |
| `roomstatus/constants/timeTableData.tsx` | `features/roomstatus/constants/timeTableData.tsx` |
| `roomstatus/interfaces/*.tsx` | `features/roomstatus/types.ts` 로 내용 통합 |

### 5-2. 페이지 컴포넌트

- `app/(auth-required)/roomstatus/page.tsx` 내용 → `features/roomstatus/pages/RoomStatusPage.tsx` 로 옮기고,  
  `app/.../roomstatus/page.tsx` 는  
  `import RoomStatusPage from '@/features/roomstatus/pages/RoomStatusPage'; export default RoomStatusPage;` 만 유지.
- `app/(auth-required)/roomstatus/[floor]/page.tsx` 내용 → `features/roomstatus/pages/FloorPage.tsx` 로 옮기고,  
  `app/.../[floor]/page.tsx` 도 같은 방식으로 re-export만 남긴다.

### 5-3. Import 규칙

- **feature 안에서** feature 안 파일 부를 때: 상대 경로  
  - 예: `import RoomItem from '../components/RoomItem';`
- **feature 안에서** 공용 모듈 부를 때: `@/` 절대 경로  
  - 예: `import Header from '@/components/Layout/header/Header';`, `import type { X } from '@/types/...';`

---

## 6. 정리: “Feature 분리”가 의미하는 것

1. **app/**  
   - URL과 매핑만 담당.  
   - `page.tsx` / `layout.tsx` 는 가능하면 “해당 feature의 페이지 컴포넌트를 import해서 export”만 한다.

2. **features/<도메인>/**  
   - 그 URL에서 쓰는 **화면·로직·타입·유틸·상수**를 한 덩어리로 묶는다.  
   - 폴더 구조는 `pages/`, `components/`, `hooks/`, `utils/`, `constants/`, `types.ts` 를 기본으로 한다.

3. **한 번에 하나씩**  
   - roomstatus → search → chat → … 순서로 하나 완료할 때마다 빌드·동작 확인 후 다음 feature로 진행한다.

4. **공용은 그대로**  
   - 여러 feature에서 쓰는 컴포넌트/타입/유틸은 `src/components/`, `src/types/`, `src/lib/` 등에 두고, feature에서는 `@/` 로만 참조한다.

이 방식으로 진행하면, “Feature 분리 어떤 식으로 할 건지”는 위 흐름대로 한다고 보면 된다.
