# 앱 구조 가이드

이 문서는 `src/app/` 및 레이아웃 구조를 이해하기 위한 가이드입니다.

---

## 1. 레이아웃 계층 구조

```
RootLayout (app/layout.tsx)
├── Providers (Auth, User, Review)
└── body
    └── (auth-required) Layout  ← 로그인 필요 라우트
        ├── BottomNav (공통 하단 네비)
        └── children
            ├── main Layout      ← /main
            │   ├── MainHeader
            │   └── DefaultBody(headerPadding="full")
            ├── ticketing/(list) Layout  ← /ticketing
            │   ├── MainHeader
            │   └── DefaultBody(headerPadding="full")
            ├── roomstatus Layout
            ├── dept-boards/(nav) Layout
            └── ...
```

### 라우트 그룹 `(괄호)` 설명
- **`(auth-required)`**: 로그인 필요. URL에 포함되지 않음. BottomNav 적용.
- **`(public)`**: 비인증 접근 가능 (로그인, 투표 등).
- **`(list)`**, **`(nav)`**: URL에 포함되지 않는 폴더. 특정 페이지에만 레이아웃 적용용.

---

## 2. DefaultBody `headerPadding` 값

| 값 | 패딩 | 사용처 |
|----|------|--------|
| `none` | 없음 | 로그인 페이지 등 헤더 없는 화면 |
| `compact` | 80px | 일반 페이지 (뒤로가기 + 타이틀 헤더) |
| `full` | 160px | MainHeader + TopNav (로고, 알림, 탭) |

---

## 3. 주요 레이아웃별 구조

### 메인 페이지 (`/main`)
```
main/layout.tsx
├── MainHeader (로고, Notice, TopNav: 메인|티켓팅)
└── DefaultBody(headerPadding="full")
    └── MainPage (캘린더, 강의실현황, 랭킹)
```

### 티켓팅 목록 (`/ticketing`)
```
ticketing/(list)/layout.tsx
├── MainHeader
└── DefaultBody(headerPadding="full")
    └── TicketingPage (탭 + 이벤트 목록)
```

### 일반 페이지 (예: 마이페이지, 검색)
```
(auth-required) Layout (BottomNav)
└── Page (Header + DefaultBody 자체 포함)
    ├── Header (뒤로가기, 타이틀)
    └── DefaultBody(headerPadding="compact")
```

### 게시판 (BoardLayout 사용)
```
BoardLayout
├── Header (뒤로가기, 타이틀, 검색)
└── DefaultBody(headerPadding="compact")
    ├── Tabs
    └── children
```

---

## 4. 디렉터리 구조 요약

```
src/app/
├── layout.tsx                 # 루트 (폰트, Provider)
├── page.tsx                   # /
├── (public)/                  # 비인증
│   ├── login/
│   ├── vote/
│   └── auth/
├── (auth-required)/           # 로그인 필요, BottomNav
│   ├── layout.tsx             # BottomNav 래퍼
│   ├── main/
│   │   ├── layout.tsx         # MainHeader + DefaultBody
│   │   └── page.tsx
│   ├── ticketing/
│   │   ├── (list)/            # /ticketing (MainHeader)
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── [eventId]/         # /ticketing/123
│   │   └── result/
│   ├── boards/, mypage/, search/, chat/ ...
│   └── info/, dept-boards/, roomstatus/ ...
└── admin/                     # 관리자 (별도 레이아웃)
```

---

## 5. 공통 컴포넌트 위치

| 컴포넌트 | 경로 | 역할 |
|----------|------|------|
| MainHeader | `@/features/main` (index) | 로고 + Notice + TopNav |
| Header | `@/components/Layout/header/Header` | 뒤로가기 + 타이틀 (범용) |
| DefaultBody | `@/components/Layout/Body/defaultBody` | 콘텐츠 래퍼 + 패딩 |
| BottomNav | `@/components/Layout/Navigation/BottomNav` | 하단 탭 네비게이션 |
| BoardLayout | `@/components/Layout/BoardLayout` | 게시판/티켓팅용 레이아웃 |

## 6. codin-folder 룰 적용

- **@/server**: 서버 전용 API (api/server) → `import { getTopPosts } from '@/server'`
- **@/features/xxx**: feature index 통해 import 권장 → `import { MainPage } from '@/features/main'`
- **shared/**: 마이그레이션 예정 (components, lib, hooks 등)
