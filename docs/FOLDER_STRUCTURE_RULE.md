# codin-folder 룰 적용 현황

`.cursor/rules/codin-folder.mdc` 기준 폴더 구조 정리.

## 현재 구조

```
src/
├── app/          # 라우팅/레이아웃 (얇게 유지) ✓
├── features/     # 도메인 기능 ✓
├── shared/       # 범용 UI/훅/유틸/타입
│   ├── ui/       # 공용 UI (아래 표 참고) — 신규·이전 import는 @/shared/ui 권장
│   ├── hooks/    # 범용 훅 (feature 전용 훅은 features/*/hooks)
│   ├── utils/    # 범용 유틸 (경계: @/shared/utils 또는 개별 파일)
│   ├── types/    # 범용 타입 (경계: @/shared/types)
│   ├── api/      # 공용 API 클라이언트 등
│   └── ...
├── types/        # 호환 레이어: 파일별 re-export → @/shared/types
├── lib/utils/    # 호환 레이어: 일부 re-export → @/shared/utils
├── api/          # 클라이언트 API (boards, chat, user 등)
└── api/server/   # 서버 전용 → import 시 @/server 사용 ✓
```

## 적용 완료

- [x] **@/server** 경로 별칭 추가 (`api/server` → `@/server`)
- [x] 모든 `@/api/server` import를 `@/server`로 변경
- [x] `shared/` 폴더 구조 생성
- [x] **types** — `src/shared/types/*` 실구현 + `src/types/*` forwarder (`export * from '@/shared/types/...'`)
- [x] **lib/utils (범용)** — `src/shared/utils/*` 실구현 + `src/lib/utils/*` 등 forwarder
- [x] **hooks (범용)** — `src/shared/hooks/*` 실구현, 루트 `src/hooks/` 제거(이미 반영)
- [x] **shared/ui** — 아래 `shared/ui` 표 기준으로 **실구현 및 진입점(`src/shared/ui/index.ts`) 정리**

## shared/ui 마이그레이션 현황

**원칙**: 공용 UI의 정식 위치는 `src/shared/ui`. 신규·수정 코드는 `@/shared/ui` 또는 `@/shared/ui/<영역>/...` 로 import.

| 영역 | shared/ui 경로 | 상태 | 비고 |
|------|----------------|------|------|
| common | `shared/ui/common` | ✅ 실구현 | ShadowBox, Title, SearchInput, LoadingOverlay, Menu 등 |
| buttons | `shared/ui/buttons` | ✅ 실구현 | commonBtn, smRoundedBtn, underbarBtn |
| layout | `shared/ui/layout` | ✅ 실구현 | Body, BottomNav, Navigation, header, BoardLayout, Tabs 등 |
| modals | `shared/ui/modals` | ✅ 실구현 | Alarm, Report, ZoomableImage 등 (도메인 전용 모달은 해당 `features/*/components`) |
| input | `shared/ui/input` | ✅ 실구현 | Input |
| icons | `shared/ui/icons` | ✅ 실구현 | CheckIcon (확장 시 동일 패턴) |

**남은 정리 (호환)**

- [x] `src/components` 제거 및 스크립트·문서의 `@/components` 예시를 `@/shared/ui`로 통일
- [x] **import 규칙 문서화** — [`docs/IMPORT_RULES.md`](./IMPORT_RULES.md) (공용 UI `@/shared/ui`, 배럴 우선·deep import 지양, 레이어별 경계)

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

- [x] **components → shared/ui** `src/components` 폴더 제거, 실구현은 `shared/ui`만 ✓
- [ ] 각 **feature**에 `index.ts` 공개 API 정리
- [ ] **deep import 금지** 정서화 (예: `features/auth/components/xxx` 직접 참조 대신 feature 공개 경로)
