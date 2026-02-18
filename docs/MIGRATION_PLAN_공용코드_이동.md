# 공용 유틸/타입/컴포넌트 이동 계획

> **참고**: 이 프로젝트는 App Router(`src/app`)를 사용합니다. `app` 폴더 내 비-page 파일(컴포넌트, utils, types)은 라우팅되지는 않지만, `features` / `components` / `lib` / `types`로 분리하면 구조가 명확해지고 재사용·유지보수가 쉬워집니다.

---

## 1. 타입·인터페이스 → `src/types`

| 현재 경로 | 이동 경로 | 이유 |
|-----------|-----------|------|
| `src/interfaces/partners.ts` | `src/types/partners.ts` | 타입/인터페이스 통합. `types`와 `interfaces` 이원화 제거. |
| `src/interfaces/map.ts` | `src/types/map.ts` | 위와 동일. |
| `src/interfaces/course.ts` | `src/types/course.ts` | 위와 동일. |
| `src/interfaces/Post.ts` | `src/types/post.ts` | 위와 동일. 파일명은 kebab-case 권장. |
| `src/interfaces/TicketEventRequest.ts` | `src/types/ticketEventRequest.ts` | 위와 동일. |
| `src/interfaces/SnackEvent.ts` | `src/types/snackEvent.ts` | 위와 동일. |

**이동 후**: 모든 `@/interfaces/*` import를 `@/types/*`로 변경.

---

## 2. 유틸 → `src/lib` (선택)

| 현재 경로 | 이동 경로 | 이유 |
|-----------|-----------|------|
| `src/utils/date.ts` | `src/lib/date.ts` | 날짜 유틸은 여러 곳에서 재사용 가능. `lib`에 두면 “공용 로직” 역할이 분명해짐. |
| `src/utils/convertToKoreanDate.ts` | `src/lib/convertToKoreanDate.ts` | 위와 동일. |
| `src/utils/dataUrlToFile.ts` | `src/lib/dataUrlToFile.ts` | 데이터 변환 유틸. |
| `src/utils/compressBase64Image.ts` | `src/lib/compressBase64Image.ts` | 이미지 처리 유틸. |
| `src/utils/router/createPostUrl.ts` | `src/lib/router/createPostUrl.ts` | URL 생성 로직. |

**참고**: `utils` 폴더를 그대로 두고 **새 공용 로직만** `lib`에 두는 방식도 가능합니다.  
- **옵션 A**: 위 파일들을 `lib`로 이동 후 `utils`는 점진적으로 비우기.  
- **옵션 B**: `utils` 유지, `lib`에는 API 클라이언트·설정 등 “외부 연동/설정”만 두기.

---

## 3. `app` 내부 비-page 파일 → `src/features` / `src/components`

App Router에서는 `page.tsx`만 라우트가 되지만, 컴포넌트·유틸·타입을 `app` 밖으로 빼면 역할이 분리됩니다.

### 3-1. 기능 단위(도메인) → `src/features`

| 현재 경로 | 이동 경로 | 이유 |
|-----------|-----------|------|
| `src/app/(auth-required)/roomstatus/components/*` | `src/features/roomstatus/components/*` | roomstatus 전용 컴포넌트. 기능 단위로 묶기. |
| `src/app/(auth-required)/roomstatus/interfaces/*` | `src/features/roomstatus/types/*` 또는 `src/types/roomstatus.ts` | roomstatus 전용 타입. 공용이면 `types`, 전용이면 features 내 types. |
| `src/app/(auth-required)/roomstatus/utils/timePointerUtils.tsx` | `src/features/roomstatus/utils/timePointerUtils.tsx` | roomstatus 전용 유틸. |
| `src/app/(auth-required)/roomstatus/constants/timeTableData.tsx` | `src/features/roomstatus/constants/timeTableData.tsx` | roomstatus 전용 상수. |
| `src/app/admin/ticketing/create/components/InputBlock.tsx` | `src/features/ticketing/admin/components/InputBlock.tsx` | 티켓팅 어드민 전용 컴포넌트. |
| `src/app/admin/ticketing/create/types/inputBlockProps.ts` | `src/features/ticketing/admin/types/inputBlockProps.ts` | 티켓팅 어드민 전용 타입. |
| `src/app/(auth-required)/ticketing/result/TicketingResultInner.tsx` | `src/features/ticketing/components/TicketingResultInner.tsx` | 티켓팅 결과 UI. |
| `src/app/(auth-required)/boards/[boardName]/[postId]/PostDetailClient.tsx` | `src/features/board/components/PostDetailClient.tsx` | 게시글 상세 클라이언트 컴포넌트. |
| `src/app/(auth-required)/boards/[boardName]/[postId]/utils/textToChartData.tsx` | `src/features/board/utils/textToChartData.tsx` | 게시글 차트 유틸. |
| `src/app/(auth-required)/dept-boards/(nav)/header.tsx` | `src/features/dept-boards/components/DeptBoardsHeader.tsx` | dept-boards 레이아웃용 헤더. |
| `src/app/(auth-required)/dept-boards/(nav)/type.ts` | `src/features/dept-boards/types.ts` 또는 `src/types/deptBoards.ts` | dept-boards 타입. |
| `src/app/(auth-required)/info/course-reviews/type.ts` | `src/types/courseReview.ts` (공용) 또는 `src/features/course-reviews/types.ts` | 강의 리뷰 타입. |
| `src/app/(auth-required)/info/course-reviews/types.ts` | `src/types/courseReview.ts` | 위와 통합 가능. |
| `src/app/(auth-required)/info/course-reviews/[departmentCode]/types.ts` | `src/features/course-reviews/types/departmentCode.ts` | 학과별 리뷰 타입. |
| `src/app/(auth-required)/info/course-reviews/write-review/type.ts` | `src/features/course-reviews/write-review/types.ts` | 작성 리뷰 타입. |
| `src/app/(auth-required)/info/course-reviews/write-review/util/calcEmotion.ts` | `src/features/course-reviews/utils/calcEmotion.ts` | 리뷰 감정 계산 유틸. |
| `src/app/(auth-required)/info/course-reviews/write-review/constants.ts` | `src/features/course-reviews/constants.ts` | 리뷰 상수. |

### 3-2. 공용/레이아웃에 가까운 것 → `src/components`

| 현재 경로 | 이동 경로 | 이유 |
|-----------|-----------|------|
| (없음) | - | **이미** 공용 컴포넌트는 `src/components`에 있음. `app` 안에 있는 비-page 파일은 대부분 도메인 전용이므로 `features` 이동을 우선 권장. |

---

## 4. 스타일 → `src/styles`

| 현재 경로 | 이동 경로 | 이유 |
|-----------|-----------|------|
| `src/app/globals.css` | `src/styles/globals.css` | 전역 스타일을 한곳에서 관리. |
| `src/app/(public)/login/loginAnimation.css` | `src/styles/loginAnimation.css` 또는 `src/features/login/loginAnimation.css` | 로그인 전용이면 features, 공용 애니면 styles. |
| `src/app/(auth-required)/chatRoom/[chatRoomId]/chatRoom.css` | `src/styles/chatRoom.css` 또는 `src/features/chat/components/chatRoom.css` | 채팅방 전용이면 features. |

**이동 후**: `app/layout.tsx`의 `import './globals.css'` → `import '@/styles/globals.css'` 등으로 경로 수정.

---

## 5. 요약 체크리스트

- [ ] **타입**: `src/interfaces/*` → `src/types/*` 로 이동 및 import 일괄 변경.
- [ ] **유틸**: `src/utils/*` → `src/lib/*` 로 이동 여부 결정 후, 선택한 항목만 이동 및 import 변경.
- [ ] **기능 코드**: `app` 내 컴포넌트/유틸/타입/상수 → `src/features/<도메인>/*` 로 이동 후 각 페이지에서 `@/features/...` 로 import.
- [ ] **스타일**: `app/globals.css` → `src/styles/globals.css`, 기타 CSS는 공용/도메인에 따라 `styles` 또는 `features`로 이동.
- [ ] **컴포넌트**: pages 폴더가 생기면 그 안의 비-page 파일(컴포넌트 등)은 반드시 `src/components` 또는 `src/features`로 빼기. (현재는 App Router만 사용 중.)

---

## 6. 권장 진행 순서

1. **타입 통합** (`interfaces` → `types`) — import 경로만 바꿔도 되므로 리스크 낮음.
2. **스타일** (`globals.css` → `src/styles`) — layout 한 곳만 수정.
3. **features 분리** — 도메인별로 한 번에 하나씩(예: roomstatus → ticketing → board → course-reviews).
4. **utils → lib** — 필요 시 선택적으로 진행.

이 순서대로 적용하면 기존 동작을 유지하면서 점진적으로 구조를 정리할 수 있습니다.
