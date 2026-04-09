# 미사용 파일 정리

마이그레이션 완료 후 import가 모두 새 경로로 변경되어, 아래 파일들은 **더 이상 참조되지 않습니다**.

---

## 3. 삭제 절차 제안

1. `scripts/write-ticketing-event-utf8.js` import 수정
2. `src/api/` 내 **모든 폴더 삭제** (현재 빈 폴더이며, 신규 코드는 `features/*/api` 또는 `shared/api`를 사용)
3. `src/server/`는 **유지** (`@/server`로 사용 중)

---

## 4. 유지해야 하는 파일 (삭제 금지)

| 카테고리 | 예시 |
|----------|------|
| **src/server/** | 전체 폴더 (getCourseById, serverFetch, getVotes 등) |
| **app/** | page.tsx, layout.tsx (Next.js 라우팅) |
| **middleware** | src/middleware.ts |
| **설정/스타일** | globals.css, tailwind.config 등 |
| **context/store** | UserContext, AuthContext, userStore 등 |
