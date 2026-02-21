# ✅ 폴더 구조 마이그레이션 작업 체크리스트

> **목표**: 제안한 구조로 점진적으로 마이그레이션하기

---

## 📋 전체 작업 개요

| Phase | 작업 내용 | 예상 시간 | 우선순위 |
|-------|-----------|-----------|----------|
| **Phase 0** | 준비 작업 (브랜치, 백업) | 30분 | 🔴 필수 |
| **Phase 1** | 기반 구조 정리 | 2-3시간 | 🔴 필수 |
| **Phase 2** | Feature 분리 (작은 것부터) | 1-2주 | 🟡 중요 |
| **Phase 3** | 공용 코드 정리 | 3-5시간 | 🟢 선택 |
| **Phase 4** | 검증 및 최적화 | 지속적 | 🟢 선택 |

---

## 🔴 Phase 0: 준비 작업 (필수)

### 작업 목록

- [ ] **Git 브랜치 생성**
  ```bash
  git checkout -b refactor/folder-structure
  ```

- [ ] **현재 상태 백업 확인**
  ```bash
  git status
  git add .
  git commit -m "chore: 폴더 구조 마이그레이션 전 백업"
  ```

- [ ] **프로젝트 빌드 확인**
  ```bash
  npm run build
  ```
  - 빌드가 성공하는지 확인 (현재 상태 기준선)

- [ ] **개발 서버 실행 확인**
  ```bash
  npm run dev
  ```
  - 주요 페이지들이 정상 동작하는지 확인

---

## 🔴 Phase 1: 기반 구조 정리 (필수)

### 1-1. 타입 통합 (`interfaces/` → `types/`)

#### 작업 순서

1. **기존 타입 파일 확인**
   - [ ] `src/interfaces/partners.ts`
   - [ ] `src/interfaces/map.ts`
   - [ ] `src/interfaces/course.ts`
   - [ ] `src/interfaces/Post.ts`
   - [ ] `src/interfaces/TicketEventRequest.ts`
   - [ ] `src/interfaces/SnackEvent.ts`

2. **타입 파일 이동**
   ```bash
   # 파일 이동 (Git이 자동으로 추적)
   mv src/interfaces/partners.ts src/types/partners.ts
   mv src/interfaces/map.ts src/types/map.ts
   mv src/interfaces/course.ts src/types/course.ts
   mv src/interfaces/Post.ts src/types/post.ts
   mv src/interfaces/TicketEventRequest.ts src/types/ticketEventRequest.ts
   mv src/interfaces/SnackEvent.ts src/types/snackEvent.ts
   ```

3. **Import 경로 일괄 변경**
   - [ ] VS Code에서 Find & Replace 사용:
     - Find: `@/interfaces/partners`
     - Replace: `@/types/partners`
   - [ ] 각 파일별로 반복:
     - `@/interfaces/map` → `@/types/map`
     - `@/interfaces/course` → `@/types/course`
     - `@/interfaces/Post` → `@/types/post`
     - `@/interfaces/TicketEventRequest` → `@/types/ticketEventRequest`
     - `@/interfaces/SnackEvent` → `@/types/snackEvent`

4. **types/index.ts 생성 (선택적)**
   ```typescript
   // src/types/index.ts
   export * from './auth';
   export * from './partners';
   export * from './map';
   export * from './course';
   export * from './post';
   export * from './ticketEventRequest';
   export * from './snackEvent';
   ```

5. **빌드 확인**
   - [ ] `npm run build` 실행
   - [ ] 에러 없이 빌드되는지 확인

6. **interfaces 폴더 삭제**
   - [ ] 모든 파일 이동 후 `src/interfaces/` 폴더 삭제

---

### 1-2. 스타일 정리

#### 작업 순서

1. **globals.css 이동**
   ```bash
   mv src/app/globals.css src/styles/globals.css
   ```

2. **layout.tsx 수정**
   - [ ] `src/app/layout.tsx` 열기
   - [ ] `import './globals.css'` → `import '@/styles/globals.css'` 변경

3. **기타 CSS 파일 확인**
   - [ ] `src/app/(public)/login/loginAnimation.css` → `src/styles/loginAnimation.css` 또는 `src/features/login/loginAnimation.css`
   - [ ] `src/app/(auth-required)/chatRoom/[chatRoomId]/chatRoom.css` → `src/styles/chatRoom.css` 또는 `src/features/chat/chatRoom.css`
   - [ ] 각 파일의 import 경로 수정

4. **빌드 확인**
   - [ ] `npm run build` 실행
   - [ ] 스타일이 정상 적용되는지 확인

---

### 1-3. lib 구조 생성

#### 작업 순서

1. **lib 폴더 구조 생성**
   ```bash
   mkdir -p src/lib/utils
   mkdir -p src/lib/api
   mkdir -p src/lib/constants
   mkdir -p src/lib/config
   ```

2. **utils 파일 이동 (선택적 - 나중에 해도 됨)**
   - [ ] `src/utils/date.ts` → `src/lib/utils/date.ts`
   - [ ] `src/utils/convertToKoreanDate.ts` → `src/lib/utils/convertToKoreanDate.ts`
   - [ ] `src/utils/dataUrlToFile.ts` → `src/lib/utils/dataUrlToFile.ts`
   - [ ] `src/utils/compressBase64Image.ts` → `src/lib/utils/compressBase64Image.ts`
   - [ ] `src/utils/router/createPostUrl.ts` → `src/lib/utils/router/createPostUrl.ts`

3. **Import 경로 변경**
   - [ ] `@/utils/date` → `@/lib/utils/date`
   - [ ] 각 파일별로 반복

4. **빌드 확인**
   - [ ] `npm run build` 실행

---

### Phase 1 완료 체크

- [ ] 모든 타입이 `src/types/`로 이동됨
- [ ] `src/interfaces/` 폴더 삭제됨
- [ ] `globals.css`가 `src/styles/`로 이동됨
- [ ] `app/layout.tsx`의 import 경로 수정됨
- [ ] 빌드 성공
- [ ] 개발 서버 정상 동작
- [ ] Git 커밋: `git commit -m "refactor: Phase 1 - 기반 구조 정리 완료"`

---

## 🟡 Phase 2: Feature 분리 (중요)

> **전략**: 작은 feature부터 시작해서 점진적으로 진행

### 2-1. 작은 Feature부터: `roomstatus` (추천 시작점)

#### 작업 순서

1. **폴더 구조 생성**
   ```bash
   mkdir -p src/features/roomstatus/{pages,components,hooks,utils,constants}
   ```

2. **컴포넌트 이동**
   ```bash
   mv src/app/(auth-required)/roomstatus/components/* src/features/roomstatus/components/
   ```

3. **타입 통합**
   - [ ] `src/app/(auth-required)/roomstatus/interfaces/*` 파일들을 확인
   - [ ] `src/features/roomstatus/types.ts` 생성하여 모든 타입 통합
   - [ ] 각 인터페이스 파일의 내용을 `types.ts`로 복사

4. **유틸 이동**
   ```bash
   mv src/app/(auth-required)/roomstatus/utils/* src/features/roomstatus/utils/
   ```

5. **상수 이동**
   ```bash
   mv src/app/(auth-required)/roomstatus/constants/* src/features/roomstatus/constants/
   ```

6. **페이지 컴포넌트 생성**
   - [ ] `src/app/(auth-required)/roomstatus/page.tsx` 내용을 확인
   - [ ] `src/features/roomstatus/pages/RoomStatusPage.tsx` 생성
   - [ ] 기존 로직을 페이지 컴포넌트로 이동

7. **app/page.tsx 단순화**
   ```typescript
   // src/app/(auth-required)/roomstatus/page.tsx
   import RoomStatusPage from '@/features/roomstatus/pages/RoomStatusPage';
   
   export default RoomStatusPage;
   ```

8. **Import 경로 수정**
   - [ ] feature 내부: 상대 경로로 변경
   - [ ] feature 외부: `@/features/roomstatus/...` 사용

9. **빌드 및 테스트**
   - [ ] `npm run build` 실행
   - [ ] `/roomstatus` 페이지 동작 확인

10. **커밋**
    ```bash
    git add .
    git commit -m "refactor: roomstatus feature 분리 완료"
    ```

---

### 2-2. 다음 Feature: `search`

#### 작업 순서 (roomstatus와 동일한 패턴)

- [ ] 폴더 구조 생성
- [ ] 컴포넌트/유틸/타입 이동
- [ ] 페이지 컴포넌트 생성
- [ ] app/page.tsx 단순화
- [ ] Import 경로 수정
- [ ] 빌드 및 테스트
- [ ] 커밋

---

### 2-3. 중간 Feature: `dept-boards`

#### 작업 순서

1. **폴더 구조 생성**
   ```bash
   mkdir -p src/features/dept-boards/{pages,components,hooks,types}
   ```

2. **파일 이동**
   - [ ] `src/app/(auth-required)/dept-boards/(nav)/header.tsx` → `src/features/dept-boards/components/DeptBoardsHeader.tsx`
   - [ ] `src/app/(auth-required)/dept-boards/(nav)/type.ts` → `src/features/dept-boards/types.ts`
   - [ ] 각 페이지별로 `pages/` 폴더에 페이지 컴포넌트 생성

3. **나머지 작업** (roomstatus와 동일)

---

### 2-4. 큰 Feature: `board`

#### 작업 순서

1. **폴더 구조 생성**
   ```bash
   mkdir -p src/features/board/{pages,components/{PostItem,PostDetail,PostList},hooks,utils,types}
   ```

2. **기존 컴포넌트 확인 및 이동**
   - [ ] `src/components/board/` 폴더 확인
   - [ ] board 전용 컴포넌트는 `features/board/components/`로 이동
   - [ ] 공용 컴포넌트는 `components/`에 유지

3. **app 내부 파일 이동**
   - [ ] `src/app/(auth-required)/boards/[boardName]/[postId]/PostDetailClient.tsx` → `src/features/board/components/PostDetail/PostDetailClient.tsx`
   - [ ] `src/app/(auth-required)/boards/[boardName]/[postId]/utils/textToChartData.tsx` → `src/features/board/utils/textToChartData.tsx`

4. **페이지 컴포넌트 생성**
   - [ ] 각 라우트별로 `pages/` 폴더에 페이지 컴포넌트 생성

5. **나머지 작업** (이전과 동일)

---

### 2-5. 큰 Feature: `ticketing`

#### 작업 순서

1. **폴더 구조 생성**
   ```bash
   mkdir -p src/features/ticketing/{admin/{pages,components,types},components,pages,hooks,types,utils}
   ```

2. **어드민 관련 파일 이동**
   - [ ] `src/app/admin/ticketing/create/components/InputBlock.tsx` → `src/features/ticketing/admin/components/InputBlock.tsx`
   - [ ] `src/app/admin/ticketing/create/types/inputBlockProps.ts` → `src/features/ticketing/admin/types.ts`에 통합

3. **일반 티켓팅 파일 이동**
   - [ ] `src/app/(auth-required)/ticketing/result/TicketingResultInner.tsx` → `src/features/ticketing/components/TicketingResultInner.tsx`

4. **나머지 작업** (이전과 동일)

---

### 2-6. 큰 Feature: `course-reviews`

#### 작업 순서

1. **폴더 구조 생성**
   ```bash
   mkdir -p src/features/course-reviews/{write-review/{pages,components,utils,types},components,pages,hooks,types,utils,constants}
   ```

2. **타입 통합**
   - [ ] 여러 곳에 흩어진 타입 파일들을 `types.ts`로 통합
   - [ ] `src/app/(auth-required)/info/course-reviews/type.ts`
   - [ ] `src/app/(auth-required)/info/course-reviews/types.ts`
   - [ ] `src/app/(auth-required)/info/course-reviews/[departmentCode]/types.ts`
   - [ ] `src/app/(auth-required)/info/course-reviews/write-review/type.ts`

3. **나머지 작업** (이전과 동일)

---

### Phase 2 완료 체크

- [ ] 주요 feature들이 모두 분리됨
- [ ] `app/` 폴더에는 `page.tsx`, `layout.tsx`만 남음
- [ ] 각 feature의 페이지가 정상 동작함
- [ ] 빌드 성공
- [ ] Git 커밋 완료

---

## 🟢 Phase 3: 공용 코드 정리 (선택)

### 3-1. components 재분류

#### 작업 순서

1. **각 feature에서 사용하는 컴포넌트 확인**
   - [ ] 2개 이상 feature에서 사용 → `components/`로 이동 검토
   - [ ] 1개 feature 전용 → `features/<domain>/components/`에 유지

2. **공용 컴포넌트 이동**
   - [ ] 예: `AlertModal`, `LoadingOverlay` 등

3. **Import 경로 수정**

---

### 3-2. lib/utils 정리

#### 작업 순서

1. **utils 폴더 확인**
   - [ ] `src/utils/` 폴더에 남은 파일 확인
   - [ ] 공용 유틸은 `lib/utils/`로 이동
   - [ ] feature 전용 유틸은 해당 feature로 이동

2. **중복 코드 제거**
   - [ ] 비슷한 기능의 유틸 통합

---

### Phase 3 완료 체크

- [ ] 공용 컴포넌트가 `components/`에 정리됨
- [ ] 공용 유틸이 `lib/utils/`에 정리됨
- [ ] 중복 코드 제거됨

---

## 🟢 Phase 4: 검증 및 최적화 (지속적)

### 작업 목록

- [ ] **순환 참조 확인**
  ```bash
  # 순환 참조 검사 도구 사용 (예: madge)
  npx madge --circular src/
  ```

- [ ] **불필요한 import 제거**
  - [ ] 사용하지 않는 import 삭제

- [ ] **타입 안정성 강화**
  - [ ] `any` 타입 제거
  - [ ] 타입 정의 보완

- [ ] **성능 최적화**
  - [ ] 불필요한 re-render 확인
  - [ ] 코드 스플리팅 확인

---

## 🚨 주의사항

### 1. 한 번에 하나씩
- Feature 하나씩 완료하고 커밋하세요
- 문제 발생 시 롤백이 쉬워집니다

### 2. 빌드 확인 필수
- 각 단계마다 `npm run build` 실행
- 에러가 있으면 다음 단계로 넘어가지 마세요

### 3. 테스트 필수
- 파일 이동 후 해당 페이지가 정상 동작하는지 확인
- 주요 기능 테스트

### 4. Git 커밋 전략
- Phase별로 커밋
- Feature별로 커밋
- 작은 단위로 자주 커밋

---

## 📝 작업 진행 상황 추적

### Phase 1: 기반 구조 정리
- [ ] 타입 통합 완료
- [ ] 스타일 정리 완료
- [x] lib 구조 생성 완료 — `src/lib/utils/` 생성, 공용 유틸(`date`, `convertToKoreanDate`, `compressBase64Image`, `dataUrlToFile`, `router/createPostUrl`) 이동 완료

### Phase 2: Feature 분리
- [x] roomstatus — `features/roomstatus/pages/`, app re-export
- [x] search — `features/search/pages/`, app re-export
- [x] chat — `features/chat/pages/` (ChatPage, ChatRoomPage), app re-export
- [x] dept-boards — `features/dept-boards/pages/` (faq, notice, opinion, q/[id]), app re-export
- [x] mypage — `features/mypage/pages/` (7개 페이지), app re-export
- [x] board — `features/board/pages/` (목록, 게시판, 작성, 상세), app re-export
- [x] ticketing — `features/ticketing/pages/` + `features/ticketing/admin/pages/`, app re-export
- [x] course-reviews — `features/course-reviews/` (컴포넌트·타입·utils·페이지), app re-export
- [x] main — `features/main/pages/` (MainPage, DeptPage), app re-export
- [x] auth (login·profile) — `features/auth/pages/` (LoginPage, LoginAdminPage, SignupProfilePage), app re-export
- [x] vote — `features/vote/pages/` (목록, 상세, 작성), app re-export
- [x] admin — `features/admin/pages/` + `features/ticketing/admin/pages/`, app re-export
- [x] courses — `features/courses/pages/`, app re-export
- [x] department-info — `features/department-info/`, app re-export

**요약**: 라우트별 페이지 로직은 `features/*/pages/`로 이동 완료, app의 각 `page.tsx`는 해당 feature 페이지를 import 후 re-export만 유지.

### Phase 3: 공용 코드 정리
- [ ] components 재분류
- [x] lib/utils 정리 — `src/utils/` → `src/lib/utils/` 이동 완료, import 경로 `@/utils/*` → `@/lib/utils/*` 일괄 수정 완료. feature 전용 유틸(`features/*/utils/`)은 기존 위치 유지.

### Phase 4: 검증 및 최적화
- [ ] 순환 참조 확인
- [ ] 불필요한 import 제거
- [ ] 타입 안정성 강화

---

## 🆘 문제 발생 시

### 빌드 에러
1. 에러 메시지 확인
2. Import 경로 확인
3. 파일 경로 확인
4. 필요시 이전 커밋으로 롤백

### 페이지 동작 안 함
1. 브라우저 콘솔 확인
2. Import 경로 확인
3. 컴포넌트 export 확인

### Git 충돌
1. `git status`로 상태 확인
2. 충돌 파일 수동 해결
3. 필요시 팀원과 협의

---

## ✅ 최종 완료 체크리스트

- [ ] 모든 Phase 완료
- [ ] 빌드 성공
- [ ] 모든 페이지 정상 동작
- [ ] Import 경로 정리됨
- [ ] 불필요한 파일 삭제됨
- [ ] Git 커밋 완료
- [ ] PR 생성 및 리뷰 요청

---

**작업 시작 전**: Phase 0부터 차근차근 진행하세요! 🚀
