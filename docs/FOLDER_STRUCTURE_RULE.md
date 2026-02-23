# codin-folder 룰 적용 현황

`.cursor/rules/codin-folder.mdc` 기준 폴더 구조 정리.

## 현재 구조

```
src/
├── app/          # 라우팅/레이아웃 (얇게 유지) ✓
├── features/     # 도메인 기능 ✓
├── shared/       # 범용 UI/훅/유틸/타입 (마이그레이션 중)
│   ├── ui/       ← @/components 예정
│   ├── hooks/    ← @/hooks 예정
│   ├── utils/    ← @/lib/utils 예정
│   ├── types/    ← @/types 예정
│   └── ...
├── api/          # 클라이언트 API (boards, chat, user 등)
└── api/server/   # 서버 전용 → import 시 @/server 사용 ✓
```

## 적용 완료

- [x] **@/server** 경로 별칭 추가 (`api/server` → `@/server`)
- [x] 모든 `@/api/server` import를 `@/server`로 변경
- [x] shared/ 폴더 구조 생성

## API 점진 마이그레이션 (api/ → features/*/api/)

**원칙**: api/ 유지, 새 코드는 feature 내 api/에 배치, 기존 코드는 점진 이동

| api/ | 대상 feature | 상태 |
|------|--------------|------|
| boards | features/board/api | ✅ 완료 |
| chat | features/chat/api | ✅ 완료 |
| vote | features/vote/api | ✅ 완료 |
| user | features/auth/api | ✅ 완료 |
| review | features/course-reviews/api | ✅ 완료 |
| comment | features/comment/api | ✅ 완료 |
| like | shared/api | ✅ 완료 |
| notification | features/mypage/api | ✅ 완료 |
| fcm | features/mypage/api | ✅ 완료 |
| clients | shared/api | ✅ 완료 |

- **api/server**: 별도 유지 (@/server), 이번 마이그레이션 제외

## 진행 예정

- [ ] components → shared/ui 물리적 이동
- [ ] lib, hooks, types → shared 하위로 이동
- [ ] 각 feature에 index.ts 공개 API 추가
- [ ] deep import 금지 (features/auth/components/xxx → features/auth)
