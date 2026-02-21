# 📖 폴더 구조 실전 예시

> 실제 코드 예시를 통한 구조 이해

---

## 🎯 Before & After 비교

### 예시 1: 게시판 상세 페이지

#### ❌ Before (현재 구조)
```
src/app/(auth-required)/boards/[boardName]/[postId]/
├── page.tsx                    # 복잡한 로직 포함
├── PostDetailClient.tsx        # 컴포넌트가 app 안에
└── utils/
    └── textToChartData.tsx     # 유틸이 app 안에
```

**문제점**:
- 라우팅과 비즈니스 로직이 섞임
- 컴포넌트를 찾기 어려움
- 재사용 불가

#### ✅ After (개선 구조)
```
src/app/(auth-required)/boards/[boardName]/[postId]/
└── page.tsx                    # 단순 import & export만

src/features/board/
├── pages/
│   └── PostDetailPage.tsx      # 페이지 컴포넌트
├── components/
│   └── PostDetail/
│       └── PostDetailClient.tsx
├── utils/
│   └── textToChartData.tsx
└── types.ts
```

**코드 예시**:
```tsx
// ✅ app/(auth-required)/boards/[boardName]/[postId]/page.tsx
import PostDetailPage from '@/features/board/pages/PostDetailPage';

export default PostDetailPage;

// ✅ features/board/pages/PostDetailPage.tsx
import { Header } from '@/components/Layout/header';
import PostDetailClient from '../components/PostDetail/PostDetailClient';
import DefaultBody from '@/components/Layout/Body/defaultBody';

export interface PostDetailPageProps {
  params: Promise<{ boardName: string; postId: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const resolvedParams = await params;
  return (
    <DefaultBody hasHeader={1}>
      <PostDetailClient 
        boardName={resolvedParams.boardName}
        postId={resolvedParams.postId} 
      />
    </DefaultBody>
  );
}
```

---

### 예시 2: 티켓팅 어드민

#### ❌ Before
```
src/app/admin/ticketing/create/
├── page.tsx
├── components/
│   └── InputBlock.tsx         # 컴포넌트가 app 안에
└── types/
    └── inputBlockProps.ts      # 타입이 app 안에
```

#### ✅ After
```
src/app/admin/ticketing/create/
└── page.tsx                    # 단순 import만

src/features/ticketing/
├── admin/
│   ├── pages/
│   │   └── CreateTicketingPage.tsx
│   ├── components/
│   │   └── InputBlock.tsx
│   └── types.ts                # inputBlockProps 포함
└── components/                 # 티켓팅 공용 컴포넌트
    └── TicketingResultInner.tsx
```

**코드 예시**:
```tsx
// ✅ app/admin/ticketing/create/page.tsx
import CreateTicketingPage from '@/features/ticketing/admin/pages/CreateTicketingPage';

export default CreateTicketingPage;

// ✅ features/ticketing/admin/pages/CreateTicketingPage.tsx
import InputBlock from '../components/InputBlock';
import type { InputBlockProps } from '../types';

export default function CreateTicketingPage() {
  // 페이지 로직
  return <InputBlock {...props} />;
}
```

---

### 예시 3: 강의실 현황

#### ❌ Before
```
src/app/(auth-required)/roomstatus/
├── page.tsx
├── layout.tsx
├── [floor]/page.tsx
├── components/                 # app 안에 컴포넌트
│   ├── roomItem.tsx
│   ├── roomItemHourly.tsx
│   └── currentTimePointer.tsx
├── interfaces/                 # app 안에 타입
│   ├── roomItem_interface.tsx
│   └── currentTimePointer_interface.tsx
├── utils/
│   └── timePointerUtils.tsx
└── constants/
    └── timeTableData.tsx
```

#### ✅ After
```
src/app/(auth-required)/roomstatus/
├── page.tsx                    # 단순 import
├── layout.tsx                  # 레이아웃만
└── [floor]/page.tsx            # 단순 import

src/features/roomstatus/
├── pages/
│   ├── RoomStatusPage.tsx
│   └── FloorPage.tsx
├── components/
│   ├── RoomItem/
│   ├── RoomItemHourly/
│   └── CurrentTimePointer/
├── hooks/
│   └── useRoomStatus.ts
├── types.ts                    # 모든 인터페이스 통합
├── utils/
│   └── timePointerUtils.tsx
└── constants/
    └── timeTableData.tsx
```

---

## 🔄 공용 vs Feature 전용 판단 예시

### Case 1: PostItem 컴포넌트

**상황**: 게시판에서만 사용하는 PostItem

**판단**:
- ✅ `features/board/components/PostItem/`에 위치
- ❌ `components/`에 두지 않음 (board 전용)

**이유**: 다른 feature에서 사용하지 않음

---

### Case 2: AlertModal 컴포넌트

**상황**: 여러 feature에서 사용하는 모달

**판단**:
- ✅ `components/modals/AlertModal.tsx`로 이동
- ❌ feature 내부에 두지 않음

**이유**: board, ticketing, chat 등 여러 곳에서 사용

**마이그레이션**:
```typescript
// 1단계: board feature에서 사용 중
// features/board/components/AlertModal.tsx

// 2단계: ticketing에서도 사용하게 됨
// → components/modals/AlertModal.tsx로 이동

// 모든 feature에서 import 경로 변경
import AlertModal from '@/components/modals/AlertModal';
```

---

### Case 3: 날짜 포맷 유틸

**상황**: `convertToKoreanDate` 함수

**판단**:
- ✅ `lib/utils/date.ts`에 위치
- ❌ feature 내부에 두지 않음

**이유**: 순수 함수, 여러 곳에서 재사용

---

## 📁 Feature 내부 구조 상세

### 표준 Feature 구조
```
features/ticketing/
├── pages/                      # 페이지 컴포넌트 (app에서 import)
│   ├── TicketingPage.tsx
│   └── TicketingResultPage.tsx
│
├── components/                 # ticketing 전용 컴포넌트
│   ├── TicketCard/
│   │   ├── TicketCard.tsx
│   │   ├── TicketCard.test.tsx
│   │   └── index.ts            # export
│   └── TicketForm/
│
├── hooks/                      # ticketing 전용 훅
│   ├── useTicketing.ts
│   └── useTicketStatus.ts
│
├── store/                      # ticketing 전용 스토어 (선택적)
│   └── ticketingStore.ts
│
├── api/                        # ticketing 전용 API (선택적)
│   └── ticketingApi.ts
│
├── utils/                      # ticketing 전용 유틸
│   └── formatTicketDate.ts
│
├── types.ts                    # ticketing 타입 정의
├── constants.ts                # ticketing 상수
└── index.ts                    # Public API (선택적)
```

### index.ts로 Public API 노출 (선택적)
```typescript
// features/ticketing/index.ts
export { TicketingPage } from './pages/TicketingPage';
export { TicketCard } from './components/TicketCard';
export { useTicketing } from './hooks/useTicketing';
export type { Ticket, TicketStatus } from './types';

// 사용 예시
import { TicketCard, useTicketing, type Ticket } from '@/features/ticketing';
```

---

## 🎨 Import 패턴 예시

### Feature 내부 (상대 경로)
```typescript
// features/board/components/PostDetail/PostDetailClient.tsx
import { PostItem } from '../PostItem';           // 같은 레벨
import { usePost } from '../../hooks/usePost';    // 상위 레벨
import type { Post } from '../../types';          // 상위 레벨
```

### Feature 외부 (절대 경로)
```typescript
// features/board/components/PostDetail/PostDetailClient.tsx
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/types/auth';
import { formatDate } from '@/lib/utils/date';
```

### app에서 feature 사용
```typescript
// app/(auth-required)/boards/[boardName]/page.tsx
import BoardListPage from '@/features/board/pages/BoardListPage';

export default BoardListPage;
```

---

## 🚦 마이그레이션 단계별 예시

### Step 1: 타입 통합
```typescript
// Before: src/interfaces/partners.ts
export interface IPartners { ... }

// After: src/types/partners.ts
export interface IPartners { ... }

// 모든 import 변경
// @/interfaces/partners → @/types/partners
```

### Step 2: Feature 분리 (roomstatus 예시)

**1단계: 폴더 생성**
```bash
mkdir -p src/features/roomstatus/{pages,components,hooks,utils,constants}
```

**2단계: 파일 이동**
```bash
# 컴포넌트 이동
mv src/app/.../roomstatus/components/* src/features/roomstatus/components/

# 타입 통합
# interfaces/* → features/roomstatus/types.ts

# 유틸 이동
mv src/app/.../roomstatus/utils/* src/features/roomstatus/utils/
```

**3단계: 페이지 컴포넌트 생성**
```typescript
// features/roomstatus/pages/RoomStatusPage.tsx
import RoomStatusLayout from './RoomStatusLayout';
import { RoomItem } from '../components/RoomItem';
// ... 로직

export default function RoomStatusPage() {
  // 기존 page.tsx 로직
}
```

**4단계: app/page.tsx 단순화**
```typescript
// app/(auth-required)/roomstatus/page.tsx
import RoomStatusPage from '@/features/roomstatus/pages/RoomStatusPage';

export default RoomStatusPage;
```

**5단계: Import 경로 일괄 변경**
```bash
# VS Code: Find & Replace
# @/app/.../roomstatus/components → @/features/roomstatus/components
```

---

## ✅ 체크리스트: Feature 분리 완료 확인

각 feature 분리 후 확인:

- [ ] `app/` 내 해당 경로에 `page.tsx`만 남아있음
- [ ] 모든 컴포넌트가 `features/<domain>/components/`로 이동
- [ ] 모든 타입이 `features/<domain>/types.ts`로 통합
- [ ] 모든 유틸이 `features/<domain>/utils/`로 이동
- [ ] Import 경로가 모두 수정됨
- [ ] 빌드 에러 없음
- [ ] 기능 동작 확인 완료

---

## 🎯 실전 팁

### Tip 1: 점진적 마이그레이션
한 번에 모든 걸 바꾸지 말고, feature 하나씩 완료하세요.

### Tip 2: 공용 컴포넌트는 나중에
처음엔 feature에 두고, 2번째 사용처가 생기면 `components/`로 이동.

### Tip 3: 타입은 통합 우선
여러 파일에 흩어진 타입을 `types.ts` 하나로 통합하면 관리가 쉬워집니다.

### Tip 4: 테스트 파일도 함께 이동
컴포넌트 이동 시 `.test.tsx` 파일도 함께 이동하세요.

### Tip 5: Git 커밋은 feature 단위로
한 feature 분리를 완료할 때마다 커밋하면 롤백이 쉽습니다.
