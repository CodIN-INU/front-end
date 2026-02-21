# components → features/components 이동 가이드

> **목표**: `src/components`에 있는 feature 전용 컴포넌트를 `src/features/<이름>/components/`로 옮기고, 공통 컴포넌트만 `src/components`에 남긴다.

---

## 완료 현황 (작업 반영)

아래 항목은 **이동 완료**된 상태다. 사용처 import는 `@/features/<이름>/components/...`로 수정 완료, 기존 `src/components` 내 해당 파일은 삭제됨.

| Feature | 이동된 컴포넌트 (요약) |
|---------|------------------------|
| **ticketing** | 모달·티켓팅 UI → `features/ticketing/components/` |
| **chat** | MessageForm, MessageList, Message → `features/chat/components/` |
| **board** | PostList, PostItem, pageHeaderModal 등 → `features/board/components/` |
| **dept-boards** | DeptHeader, NotionContainer, QuestionContainer → `features/dept-boards/components/` |
| **course-reviews** | Subject, ReviewBtn, CustomSelect 등 → `features/course-reviews/components/` |
| **courses** | CourseCard, CustomSelect 등 → `features/courses/components/` |
| **department-info** | PartnerLinkCard 등 → `features/department-info/components/` |
| **comment** | CommentSection → `features/comment/components/` |

---

## 1. 현재 구분 (공통 vs feature)

### 1.1 공통 컴포넌트 (그대로 `src/components` 유지)

여러 도메인에서 쓰이거나, 도메인에 종속되지 않는 UI 블록.

| 경로 | 용도 |
|------|------|
| `Layout/` | header, Body, Navigation, BoardLayout, pageBar, Tabs 등 |
| `common/` | title, shadowBox, SearchInput, LoadingOverlay, AuthBootstrap, Menu, MenuItem |
| `buttons/` | commonBtn, underbarBtn, smRoundedBtn |
| `select/Select.tsx` | 범용 셀렉트 |
| `input/Input.tsx` | 범용 인풋 |
| `modals/` 중 공용 | ZoomableImageModal, AlertModal, AlarmModal, WebModal, ReportModal |
| `icons/` | CheckIcon 등 아이콘 |

### 1.2 Feature 전용 컴포넌트 (이동 대상)

| 현재 경로 (`src/components/`) | 이동 경로 (`src/features/`) | 사용처 요약 |
|-------------------------------|-----------------------------|-------------|
| **board/** | **board/components/** | |
| `board/PostList.tsx` | `board/components/PostList.tsx` | boards, search, mypage/board |
| `board/PostItem.tsx` | `board/components/PostItem.tsx` | PostList 내부 |
| `board/PostItem/*` (전체) | `board/components/PostItem/*` | PostItem 내부 |
| `board/pageHeaderModal.tsx` | `board/components/pageHeaderModal.tsx` | PostList |
| `board/PostItem/utils.ts` | `board/components/PostItem/utils.ts` 또는 `board/utils/` | PostItem |
| **chat/** | **chat/components/** | |
| `chat/MessageForm.tsx` | `chat/components/MessageForm.tsx` | ChatRoomPage |
| `chat/MessageList.tsx` | `chat/components/MessageList.tsx` | ChatRoomPage |
| `chat/Message.tsx` | `chat/components/Message.tsx` | MessageList 내부 추정 |
| **modals/ticketing/** | **ticketing/components/** | |
| `modals/ticketing/*.tsx` (전체) | `ticketing/components/` | ticketing 페이지·어드민 |
| **dept/** | **dept-boards/components/** | |
| `dept/header.tsx` | `dept-boards/components/DeptHeader.tsx` | main/dept |
| `dept/notionContainer.tsx` | `dept-boards/components/NotionContainer.tsx` | main/dept |
| `dept/questionContainer.tsx` | `dept-boards/components/QuestionContainer.tsx` | main/dept |
| **info/courses/** | **courses 또는 info 관련 feature** | |
| `info/courses/card.tsx` | `features/courses/components/CourseCard.tsx` 등 | info/courses 페이지 |
| `info/courses/review.tsx` | `features/courses/components/` | info/courses/[id] |
| `info/courses/tag.tsx` | `features/courses/components/` | info/courses/[id] |
| `info/courses/percentBox.tsx` | `features/courses/components/` | info/courses/[id] |
| `info/courses/customSelect.tsx` | `features/courses/components/` 또는 공용 | main/dept, courses |
| **info/rating.tsx** | **courses/components/** (courses 전용으로만 쓰이면) | info/courses, card |
| **info/partner/** | **department-info 또는 partners feature** | |
| `info/partner/PartnerLinkCard.tsx` | `features/department-info/components/` 등 | department-info/partners |
| `info/partner/bottomSheet.tsx` | 동일 feature | department-info/m/[id] |
| `info/partner/map.tsx`, `mapContainer.tsx`, `tag.tsx` | 동일 feature | partners·지도 관련 |
| **Review/** | **course-reviews/components/** | |
| `Review/Subject.tsx` | `course-reviews/components/Subject.tsx` | course-reviews 페이지 |
| `Review/ReviewComment.tsx` | `course-reviews/components/ReviewComment.tsx` | [departmentCode] |
| `Review/RateBar.tsx` | `course-reviews/components/RateBar.tsx` | write-review |
| `Review/DepartmentReview.tsx` | `course-reviews/components/DepartmentReview.tsx` | [departmentCode] |
| `Review/CustomSelect.tsx` | `course-reviews/components/CustomSelect.tsx` | write-review |
| `Review/ReviewBtn.tsx` | `course-reviews/components/ReviewBtn.tsx` | course-reviews, [departmentCode] |

---

## 2. 작업에 필요한 과정 (순서)

### 2.1 사전 정리

1. **Feature 이름 확정**  
   - `board`, `chat`, `ticketing`, `dept-boards`는 이미 있음.  
   - `courses`(과목 목록/상세), `course-reviews`(강의 리뷰), `department-info`(학과 정보·파트너·지도) 등 아직 없으면 폴더부터 생성.

2. **의존 관계 파악**  
   - 이동할 컴포넌트가 **다른 feature 컴포넌트**를 import하면, 그쪽을 먼저 옮기거나, 옮긴 뒤 `@/features/<이름>/components/...`로 바꿔야 함.  
   - 예: `PostList` → `PostDetailClient`는 이미 `@/features/board/...`이므로, board를 옮길 때 한 번만 수정하면 됨.

3. **공용 여부 재확인**  
   - `info/courses/customSelect`는 main/dept와 courses 둘 다에서 사용 → **공용**으로 두거나, 두 feature에서 각각 re-export할지 결정.

### 2.2 feature별로 진행할 단계 (한 feature씩)

각 feature에 대해 아래를 반복한다.

| 단계 | 작업 | 설명 |
|------|------|------|
| 1 | feature 폴더 확인/생성 | `src/features/<이름>/components/` 존재 여부 확인, 없으면 생성. |
| 2 | 파일 복사·이동 | `src/components/...` → `src/features/<이름>/components/...` (이름 통일 필요 시 변경). |
| 3 | feature 내부 import 수정 | 이동한 파일 안에서 상대 경로 또는 `@/features/<이름>/components/...`로 서로 참조하도록 수정. |
| 4 | 외부 import 일괄 수정 | `@/components/board/...` → `@/features/board/components/...` 등으로 **사용처 전부** 수정 (app, features, 다른 components 포함). |
| 5 | 기존 파일 삭제 | `src/components` 아래 옮긴 파일/폴더 삭제. |
| 6 | 빌드·린트 | `npm run build`, 린트 에러 해결. |
| 7 | 동작 확인 | 해당 라우트/화면 직접 클릭해서 확인. |

### 2.3 import 수정 시 유의사항

- **feature 내부**  
  - 같은 feature 내 컴포넌트끼리: `./Message`, `../components/Message` 등 상대 경로 또는 `@/features/chat/components/Message` 등으로 통일.

- **feature 외부 (app, 다른 features)**  
  - 절대 경로 사용: `@/features/board/components/PostList`, `@/features/ticketing/components/CancelModal` 등.

- **공용 컴포넌트 참조**  
  - 그대로 `@/components/Layout/...`, `@/components/common/...` 유지.

---

## 3. 권장 진행 순서 (의존성 고려)

1. **ticketing**  
   - `modals/ticketing/*` → `features/ticketing/components/`  
   - 사용처: features/ticketing, app (ticketing, admin, mypage).

2. **chat**  
   - `chat/*` → `features/chat/components/`  
   - 사용처: features/chat/pages/ChatRoomPage.

3. **board**  
   - `board/*` 전부 → `features/board/components/`  
   - 사용처: app (boards, mypage/board), features/search.  
   - 이미 `PostDetailClient`가 features/board에 있으므로, PostList 등만 경로 수정.

4. **dept-boards**  
   - `dept/*` → `features/dept-boards/components/`  
   - main/dept에서만 사용.

5. **course-reviews**  
   - `Review/*` → `features/course-reviews/components/`  
   - course-reviews 관련 페이지 전부.

6. **courses** (또는 info feature)  
   - `info/courses/*`, `info/rating.tsx` → `features/courses/components/` (또는 정한 feature명).  
   - info/courses, info/courses/[id] 등.

7. **department-info** (또는 partners)  
   - `info/partner/*` → `features/department-info/components/` (또는 별도 partners feature).  
   - department-info 라우트들.

---

## 4. 체크리스트 (feature 하나 끝날 때마다)

- [ ] `src/features/<이름>/components/` 아래 파일 이동 완료
- [ ] 이동한 파일 내부 import 수정 (상대/feature 경로)
- [ ] `@/components/...` → `@/features/.../components/...` 로 사용처 전부 수정
- [ ] `src/components`에서 해당 파일/폴더 삭제
- [ ] `npm run build` 성공
- [ ] 해당 화면 수동 테스트

---

## 5. 참고

- **FEATURE_SEPARATION_GUIDE.md**: app → features 페이지/로직 분리 방식.
- **FOLDER_STRUCTURE_PROPOSAL.md**: 제안 폴더 구조에서 board, ticketing 등 components 위치.

이동 후에는 “공통은 `components/`, 도메인 전용은 `features/<이름>/components/`”로 역할이 명확해진다.
