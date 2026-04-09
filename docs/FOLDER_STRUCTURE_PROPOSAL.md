# 📁 폴더 구조 개선 제안서

> **목표**: 유지보수하기 쉽고, 보기 편하며, 확장 가능한 폴더 구조

---

## 🎯 핵심 원칙

1. **Feature-based 구조**: 도메인별로 기능을 묶어서 관리
2. **관심사 분리**: 라우팅(`app`), 비즈니스 로직(`features`), 공용 코드(`components`, `lib`) 분리
3. **명확한 책임**: 각 폴더의 역할이 명확해야 함
4. **확장성**: 새로운 기능 추가 시 구조가 깨지지 않아야 함

---

## 📂 제안하는 폴더 구조

```
src/
├── app/                          # 🛣️ Next.js 라우팅만 (page.tsx, layout.tsx, route.ts)
│   ├── (auth-required)/          # 인증 필요 라우트 그룹
│   ├── (public)/                 # 공개 라우트 그룹
│   ├── admin/                    # 어드민 라우트
│   ├── layout.tsx                # 루트 레이아웃
│   └── page.tsx                  # 홈 페이지
│
├── features/                     # 🎯 도메인별 기능 (Feature-based)
│   ├── auth/                     # 인증 관련
│   │   ├── components/           # auth 전용 컴포넌트
│   │   ├── hooks/                # auth 전용 훅
│   │   ├── types.ts              # auth 타입
│   │   └── utils.ts              # auth 유틸
│   │
│   ├── ticketing/                # 티켓팅 기능
│   │   ├── admin/                # 티켓팅 어드민
│   │   │   ├── components/
│   │   │   └── types.ts
│   │   ├── components/           # 티켓팅 공용 컴포넌트
│   │   ├── hooks/
│   │   ├── types.ts
│   │   └── utils.ts
│   │
│   ├── board/                    # 게시판 기능
│   │   ├── components/
│   │   │   ├── PostItem/
│   │   │   ├── PostDetail/
│   │   │   └── PostList/
│   │   ├── hooks/
│   │   ├── types.ts
│   │   └── utils/
│   │       └── textToChartData.ts
│   │
│   ├── roomstatus/               # 강의실 현황
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types.ts
│   │   ├── utils/
│   │   └── constants/
│   │
│   ├── course-reviews/           # 강의 리뷰
│   │   ├── write-review/         # 리뷰 작성 서브 기능
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types.ts
│   │   └── utils/
│   │
│   ├── dept-boards/              # 학과 게시판
│   ├── chat/                     # 채팅
│   ├── mypage/                   # 마이페이지
│   └── search/                   # 검색
│
├── components/                   # 🧩 공용 컴포넌트 (여러 도메인에서 재사용)
│   ├── Layout/                   # 레이아웃 컴포넌트
│   │   ├── header/
│   │   ├── Navigation/
│   │   └── Body/
│   ├── common/                   # 범용 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Loading.tsx
│   ├── modals/                   # 공용 모달
│   └── icons/                    # 아이콘 컴포넌트
│
├── lib/                          # 🔧 공용 유틸리티 & 설정
│   ├── utils/                    # 순수 함수 유틸
│   │   ├── date.ts
│   │   ├── format.ts
│   │   └── validation.ts
│   ├── api/                      # API 클라이언트 & 설정
│   │   ├── clients/
│   │   └── endpoints/
│   ├── constants/                # 전역 상수
│   └── config/                   # 설정 파일
│
├── types/                        # 📝 공용 타입 정의
│   ├── auth.ts
│   ├── board.ts
│   ├── course.ts
│   ├── partners.ts
│   └── index.ts                  # 타입 re-export
│
├── hooks/                        # 🪝 공용 커스텀 훅
│   ├── useAuth.ts
│   ├── useDebounce.ts
│   └── useElementSize.tsx
│
├── store/                        # 🗄️ 전역 상태 관리 (Zustand)
│   ├── userStore.ts
│   └── deptStore.ts
│
├── context/                      # 🎭 React Context
│   ├── AuthContext.tsx
│   ├── UserContext.tsx
│   └── WriteReviewContext.tsx
│
├── styles/                       # 🎨 전역 스타일
│   ├── globals.css
│   └── variables.css
│
└── data/                         # 📊 정적 데이터 (선택적)
    └── boardData.ts
```

---

## 🔍 각 폴더의 역할과 규칙

### 1. `app/` - 라우팅 전용

**역할**: Next.js App Router의 라우팅만 담당

**규칙**:
- ✅ `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`만 포함
- ❌ 컴포넌트, 유틸, 타입 정의 금지
- ✅ 최소한의 코드만 (import & export)

**예시**:
```tsx
// ✅ 좋은 예: app/(auth-required)/boards/[boardName]/[postId]/page.tsx
import PostDetailPage from '@/features/board/pages/PostDetailPage';

export default PostDetailPage;

// ❌ 나쁜 예: 컴포넌트 로직이 app에 있음
export default function Page() {
  // 복잡한 로직...
}
```

---

### 2. `features/` - 도메인별 기능

**역할**: 비즈니스 로직이 있는 기능 단위

**규칙**:
- 각 feature는 독립적으로 동작 가능해야 함
- feature 내부는 `components/`, `hooks/`, `types.ts`, `utils/` 구조
- 다른 feature를 import할 때는 최소한으로 (순환 참조 주의)
- 공용으로 쓰이는 건 `components/` 또는 `lib/`로 이동

**Feature 식별 기준**:
- 독립적인 비즈니스 도메인 (예: ticketing, board, chat)
- 여러 페이지에서 사용되지만 특정 도메인에 속함
- 자체 상태/로직/타입을 가짐

**예시 구조**:
```
features/board/
├── components/           # board 전용 컴포넌트
│   ├── PostItem/
│   ├── PostDetail/
│   └── PostList/
├── hooks/                # board 전용 훅
│   └── usePost.ts
├── pages/                # 페이지 컴포넌트 (app에서 import)
│   └── PostDetailPage.tsx
├── types.ts              # board 타입
└── utils/                # board 유틸
    └── textToChartData.ts
```

---

### 3. `components/` - 공용 컴포넌트

**역할**: 여러 도메인에서 재사용되는 컴포넌트

**규칙**:
- 2개 이상의 feature에서 사용되면 여기로
- 도메인 로직이 없는 순수 UI 컴포넌트
- props로 동작을 제어받음

**예시**:
- `Layout/`, `common/Button`, `modals/AlertModal` 등

---

### 4. `lib/` - 공용 유틸리티 & 설정

**역할**: 순수 함수, API 클라이언트, 설정

**구조**:
- `lib/utils/`: 순수 함수 (date, format, validation 등)
- `lib/api/`: API 클라이언트, 엔드포인트 정의
- `lib/constants/`: 전역 상수
- `lib/config/`: 설정 파일

**규칙**:
- 도메인 로직 없음 (순수 함수만)
- 테스트 가능해야 함
- 재사용 가능해야 함

---

### 5. `types/` - 공용 타입

**역할**: 여러 곳에서 사용되는 타입 정의

**규칙**:
- feature 전용 타입은 `features/<domain>/types.ts`
- 공용 타입만 여기로
- `index.ts`로 re-export하여 import 편의성 제공

**예시**:
```typescript
// types/index.ts
export * from './auth';
export * from './board';
export * from './course';
```

---

### 6. `hooks/`, `store/`, `context/` - 상태 관리

**역할**: 전역 상태 및 공용 훅

**규칙**:
- feature 전용 훅/스토어는 `features/<domain>/hooks/` 또는 `features/<domain>/store/`
- 공용만 여기로

---

## 🚀 마이그레이션 전략

### Phase 1: 기반 구조 정리 (1주)
1. ✅ `src/types/` 통합 (`interfaces/` → `types/`)
2. ✅ `src/styles/` 생성 및 `globals.css` 이동
3. ✅ `src/lib/` 구조 생성

### Phase 2: Feature 분리 시작 (2-3주)
1. **작은 feature부터**: `roomstatus` → `search` → `chat`
2. **중간 feature**: `dept-boards` → `mypage`
3. **큰 feature**: `board` → `ticketing` → `course-reviews`

### Phase 3: 공용 코드 정리 (1주)
1. `components/` 재분류 (공용 vs feature 전용)
2. `lib/utils/` 정리
3. 중복 코드 제거

### Phase 4: 최적화 (지속적)
1. 순환 참조 제거
2. 불필요한 import 정리
3. 타입 안정성 강화

---

## 📋 Feature 분리 체크리스트

각 feature를 분리할 때:

- [ ] `app/` 내 컴포넌트/유틸/타입을 `features/<domain>/`으로 이동
- [ ] `features/<domain>/pages/`에 페이지 컴포넌트 생성
- [ ] `app/`의 `page.tsx`는 단순히 import & export만
- [ ] feature 내부 import는 상대 경로 사용 (예: `./components/PostItem`)
- [ ] feature 외부 import는 절대 경로 사용 (예: `@/shared/ui`, `@/shared/hooks`)
- [ ] 공용으로 쓰이는 컴포넌트는 `shared/ui/`로 이동 검토
- [ ] 타입이 공용이면 `types/`로 이동 검토

---

## 🎨 Import 규칙

### Feature 내부
```typescript
// ✅ 상대 경로 사용
import { PostItem } from './components/PostItem';
import { usePost } from '../hooks/usePost';
```

### Feature 외부
```typescript
// ✅ 절대 경로 사용 (@ alias)
import { CommonBtn } from '@/shared/ui';
import { useAuth } from '@/hooks/useAuth';
import type { Post } from '@/types/board';
```

### Feature 간 참조 (최소화)
```typescript
// ⚠️ 가능하지만 최소한으로
import { TicketStatus } from '@/features/ticketing/types';

// ✅ 더 나은 방법: 공용 타입으로 승격
import { TicketStatus } from '@/types/ticketing';
```

---

## 💡 장점

### 1. **유지보수성**
- 기능별로 코드가 모여있어 수정 범위가 명확
- 버그 발생 시 해당 feature만 확인하면 됨

### 2. **확장성**
- 새 기능 추가 시 `features/new-feature/`만 만들면 됨
- 기존 코드에 영향 없음

### 3. **가독성**
- 폴더 구조만 봐도 프로젝트 구조 파악 가능
- 파일 찾기가 쉬움

### 4. **협업**
- 여러 개발자가 동시에 다른 feature 작업 가능
- 충돌 최소화

### 5. **테스트**
- Feature 단위로 테스트 작성 용이
- Mock 데이터도 feature 내부에 위치

---

## ⚠️ 주의사항

### 1. 순환 참조 방지
```typescript
// ❌ 나쁜 예
// features/board/hooks/usePost.ts
import { useAuth } from '@/features/auth/hooks/useAuth';

// features/auth/hooks/useAuth.ts
import { Post } from '@/features/board/types';

// ✅ 좋은 예: 공용으로 승격
// hooks/useAuth.ts
// types/board.ts
```

### 2. 과도한 분리 금지
- 작은 기능은 feature로 만들지 말고 `components/`에
- 1-2개 파일만 있는 건 feature로 만들지 않음

### 3. 공용 vs Feature 전용 판단
- **공용**: 2개 이상 feature에서 사용 → `components/` 또는 `lib/`
- **Feature 전용**: 1개 feature에서만 사용 → `features/<domain>/`

---

## 📚 참고 자료

- [Next.js App Router Best Practices](https://nextjs.org/docs/app/building-your-application/routing)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Bulletproof React](https://github.com/alan2207/bulletproof-react)

---

## 🤔 Q&A

**Q: `app/` 안에 `_components` 같은 폴더를 만들어도 되나요?**  
A: 가능하지만 권장하지 않습니다. `features/`로 분리하는 게 더 명확합니다.

**Q: `features/` 내부에 `api/` 폴더를 둬도 되나요?**  
A: Feature 전용 API라면 가능하지만, 공용 API는 `lib/api/`에 두는 게 좋습니다.

**Q: 공용 컴포넌트와 feature 컴포넌트의 경계가 모호해요.**  
A: 처음엔 feature에 두고, 2번째 feature에서도 쓰이면 `components/`로 이동하는 전략을 권장합니다.
