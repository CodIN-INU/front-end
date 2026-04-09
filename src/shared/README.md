# shared/ - 범용 코드

codin-folder 룰에 따른 **공용 레이어**. 여러 feature에서 재사용하는 UI, 훅, 유틸, 타입.

## 구조

| 폴더 | 역할 | import 권장 |
|------|------|-------------|
| ui/ | Layout, Button, Modal 등 공용 컴포넌트 | `@/shared/ui` 또는 `@/shared/ui/...` |
| hooks/ | useElementSize, useReportModal 등 | `@/shared/hooks` |
| utils/ | date, format, router 등 | `@/shared/utils` |
| types/ | auth, post, course 등 공용 타입 | `@/shared/types` |
| api/ | 공용 API 클라이언트 등 | `@/shared/api` |

## Import 규칙

- **전체 표·레이어별 규칙·금지 사항**: 프로젝트 루트 [`docs/IMPORT_RULES.md`](../../docs/IMPORT_RULES.md)
- **공용 UI**: `@/shared/ui` 우선. `index.ts`에서 re-export되는 심볼은 배럴에서 한 번에 import하고, deep import(`@/shared/ui/.../파일`)는 배럴에 없을 때만 사용한다.
- **훅 / 유틸 / 타입 / API**: 각각 `@/shared/hooks`, `@/shared/utils`, `@/shared/types`, `@/shared/api` (필요 시 하위 경로).
