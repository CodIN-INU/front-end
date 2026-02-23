# 미사용 파일 정리

마이그레이션 완료 후 import가 모두 새 경로로 변경되어, 아래 파일들은 **더 이상 참조되지 않습니다**.

---

## 1. [안전 삭제] api/ @deprecated re-export 파일 (31개)

모든 소스에서 `@/features/` 또는 `@/shared/`로 직접 import하고 있어 삭제 가능합니다.

### api/boards/
| 파일 | 대체 경로 |
|------|-----------|
| `deletePost.tsx` | `@/features/board/api/deletePost` |
| `getSearch.ts` | `@/features/board/api/getSearch` |

### api/chat/
| 파일 | 대체 경로 |
|------|-----------|
| `getChatRoomData.tsx` | `@/features/chat/api/getChatRoomData` |
| `getChatData.tsx` | `@/features/chat/api/getChatData` |
| `postChatRoom.tsx` | `@/features/chat/api/postChatRoom` |
| `postChatImage.tsx` | `@/features/chat/api/postChatImage` |
| `deleteRoom.tsx` | `@/features/chat/api/deleteRoom` |

### api/comment/
| 파일 | 대체 경로 |
|------|-----------|
| `getComments.tsx` | `@/features/comment/api/getComments` |
| `postComment.tsx` | `@/features/comment/api/postComment` |

### api/vote/
| 파일 | 대체 경로 |
|------|-----------|
| `getVoteData.tsx` | `@/features/vote/api/getVoteData` |
| `getVoteDetail.tsx` | `@/features/vote/api/getVoteDetail` |
| `postVote.tsx` | `@/features/vote/api/postVote` |
| `postVoting.tsx` | `@/features/vote/api/postVoting` |

### api/user/
| 파일 | 대체 경로 |
|------|-----------|
| `postReissue.tsx` | `@/features/auth/api/postReissue` |
| `postLogin.tsx` | `@/features/auth/api/postLogin` |
| `postSignup.tsx` | `@/features/auth/api/postSignup` |
| `postLogout.tsx` | `@/features/auth/api/postLogout` |
| `postBlockUser.tsx` | `@/features/auth/api/postBlockUser` |
| `deleteUser.tsx` | `@/features/auth/api/deleteUser` |
| `postPwCheck.tsx` | `@/features/auth/api/postPwCheck` |
| `putPassword.tsx` | `@/features/auth/api/putPassword` |
| `postPortal.tsx` | `@/features/auth/api/postPortal` |
| `postMail.tsx` | `@/features/auth/api/postMail` |
| `postMailPW.tsx` | `@/features/auth/api/postMailPW` |
| `postMailCheck.tsx` | `@/features/auth/api/postMailCheck` |

### api/review/
| 파일 | 대체 경로 |
|------|-----------|
| `getReviewsContext.tsx` | `@/features/course-reviews/api/getReviewsContext` |
| `useLectureReviewsContext.tsx` | `@/features/course-reviews/api/useLectureReviewsContext` |
| `useDepartmentRatingInfoContext.tsx` | `@/features/course-reviews/api/useDepartmentRatingInfoContext` |
| `useSearchedReviewContext.tsx` | `@/features/course-reviews/api/useSearchedReviewContext` |
| `submitReview.tsx` | `@/features/course-reviews/api/submitReview` |

### api/notification/
| 파일 | 대체 경로 |
|------|-----------|
| `getNotificationList.ts` | `@/features/mypage/api/getNotificationList` |
| `getNotificationDetail.ts` | `@/features/mypage/api/getNotificationDetail` |

### api/fcm/
| 파일 | 대체 경로 |
|------|-----------|
| `postSubscribe.ts` | `@/features/mypage/api/postSubscribe` |
| `postUnsubscribe.ts` | `@/features/mypage/api/postUnsubscribe` |

### api/like/
| 파일 | 대체 경로 |
|------|-----------|
| `postLike.tsx` | `@/shared/api/postLike` |

### api/clients/
| 파일 | 대체 경로 |
|------|-----------|
| `fetchClient.ts` | `@/shared/api/fetchClient` |
| `apiClient.ts` | `@/shared/api/apiClient` |

---

## 2. 삭제 전 필수 작업

### api/clients 삭제 전

**scripts/write-ticketing-event-utf8.js** 가 `@/api/clients/fetchClient`를 사용합니다.

```
122번 줄: import { fetchClient } from '@/api/clients/fetchClient';
```

→ 아래로 변경 후 `api/clients/` 삭제:

```
import { fetchClient } from '@/shared/api/fetchClient';
```

---

## 3. 삭제 절차 제안

1. `scripts/write-ticketing-event-utf8.js` import 수정
2. `src/api/` 내 **api/server/** 를 제외한 모든 폴더 삭제:
   - `api/boards/`
   - `api/chat/`
   - `api/comment/`
   - `api/vote/`
   - `api/user/`
   - `api/review/`
   - `api/notification/`
   - `api/fcm/`
   - `api/like/`
   - `api/clients/`
3. `api/server/` 는 **유지** (여전히 @/api/server 또는 @/server로 사용 중)

---

## 4. 유지해야 하는 파일 (삭제 금지)

| 카테고리 | 예시 |
|----------|------|
| **api/server/** | 전체 폴더 (getCourseById, serverFetch, getVotes 등) |
| **app/** | page.tsx, layout.tsx (Next.js 라우팅) |
| **middleware** | src/middleware.ts |
| **설정/스타일** | globals.css, tailwind.config 등 |
| **context/store** | UserContext, AuthContext, userStore 등 |

---

## 5. 요약

| 구분 | 파일 수 | 비고 |
|------|---------|------|
| **안전 삭제** | 31개 | api/ 내 @deprecated re-export |
| **삭제 전 수정** | 1개 | scripts/write-ticketing-event-utf8.js |
| **유지** | api/server 전체 | 서버 API 사용 중 |
