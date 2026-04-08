# Import 규칙

신규·수정 코드는 아래 **권장 경로**를 따른다. (레거시 `src/types`, `src/lib/utils` 등 forwarder는 유지되나, 새 코드는 `shared` 우선.)

---

## 1. 경로 별칭 (`tsconfig` → `@/*` = `src/*`)

| 목적 | 권장 import | 비고 |
|------|-------------|------|
| 공용 UI | `@/shared/ui` | 배럴 우선(아래 2절) |
| 범용 훅 | `@/shared/hooks` 또는 `@/shared/hooks/<파일>` | `index.ts`에서 re-export |
| 범용 유틸 | `@/shared/utils` 또는 `@/shared/utils/...` | 동일 |
| 범용 타입 | `@/shared/types/...` | |
| 공용 API 클라이언트 등 | `@/shared/api/...` | |
| 서버 전용 API | `@/server`, `@/server/...` | `src/api/server` |
| 도메인 기능 | `@/features/<도메인>/...` | 가능하면 feature `index` 경유(아래 3절) |

---

## 2. `@/shared/ui` — 배럴 우선, deep import는 필요할 때만

- **기본**: `src/shared/ui/index.ts`에서 내보내는 심볼은 **`import { A, B } from '@/shared/ui'`** 한 번에 가져온다.
- **deep import** (`@/shared/ui/layout/header/Header` 등)는 다음 경우에만 허용한다.
  - 배럴에 아직 노출되지 않았거나,
  - 트리 쉐이킹·명시적 의존이 필요할 때.
- 새 공용 컴포넌트를 추가할 때는 **`index.ts`(또는 해당 영역 `index`)에 export 추가**를 검토한다.

---

## 3. `features/` — 내부 vs 외부

- **같은 feature 안**: 상대 경로(`../components/...`) 또는 `@/features/<이름>/...` 중 팀 일관성에 맞게 선택.
- **다른 feature / `app`에서 feature 코드를 쓸 때**:
  - 이상적: `@/features/<도메인>`의 **공개 API**(`index.ts`)만 import.
  - 아직 `index.ts`가 없으면 기존처럼 `@/features/<도메인>/pages/...` 등을 쓸 수 있으나, 점진적으로 공개 경로로 모은다.

---

## 4. `app/` 라우트 레이어

- 페이지·레이아웃은 **조립**만: `@/features/...`, `@/shared/...` import.
- 라우트 전용 조각은 해당 segment의 `_components` 등 private 폴더에 두고, **여러 feature에서 재사용**되면 `shared/ui` 또는 `features`로 승격한다.

---

## 5. 금지·지양

| 지양 | 대신 |
|------|------|
| `shared`가 `features`를 import | 공용 레이어는 도메인에 의존하지 않음 |
| 불필요한 deep import | `@/shared/ui` 배럴, `@/shared/hooks`, `@/shared/utils`의 `index` |
| 서버 전용 모듈을 클라이언트 번들로 | `import type` 또는 `@/server` 경계 유지 (기존 RSC 규칙 따름) |

---

## 6. 결합도 요약 (codin-folder와 동일 계열)

- `app` → `features` / `shared` / `server` ✓  
- `features` → `shared` / `server` ✓ (`features` 끼리는 최소화)  
- `shared` → `shared` 내부만 (feature 의존 금지)  
- `server` → `server` + `shared` 일부(types/utils 등)

상세 아키텍처는 `.cursor/rules/codin-folder.mdc`, 폴더 트리는 `docs/FOLDER_STRUCTURE_RULE.md`를 참고한다.
