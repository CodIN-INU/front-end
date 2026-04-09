# Import 규칙

신규·수정 코드는 아래 규칙을 따른다. 목표는 **import 경로를 일정하게 유지해서 결합도를 낮추고, 구조 리팩터를 쉽게 만드는 것**이다.

---

## 1. 경로 별칭 (`tsconfig` → `@/*` = `src/*`)

| 목적 | 권장 import | 비고 |
|------|-------------|------|
| 공용 UI | `@/shared/ui` | 배럴 우선(아래 2절) |
| 범용 훅 | `@/shared/hooks` 또는 `@/shared/hooks/<파일>` | `index.ts`에서 re-export |
| 범용 유틸 | `@/shared/utils` 또는 `@/shared/utils/...` | 동일 |
| 범용 타입 | `@/shared/types/...` | |
| 공용 API 클라이언트 등 | `@/shared/api/...` | |
| 서버 전용 API | `@/server`, `@/server/...` | `src/server` |
| 도메인 기능 | `@/features/<도메인>/...` | 가능하면 feature public API 경유(아래 3절) |

---

## 2. `@/shared/ui` — 배럴 우선, deep import는 필요할 때만

- **기본**: `src/shared/ui/index.ts`에 노출된 심볼은 아래처럼 한 번에 가져온다.

```ts
import { Header, DefaultBody, LoadingOverlay } from '@/shared/ui';
```

- **deep import** (`@/shared/ui/layout/header/Header` 등)는 아래 경우에만 허용한다.
  - 배럴에 아직 노출되지 않았거나
  - 의존을 명시적으로 드러내야 해서 일부러 “좁게” 가져오고 싶을 때

---

## 3. `features/` — 내부 vs 외부(import 경계)

- **같은 feature 내부**: 상대 경로(`../components/...`) 또는 `@/features/<도메인>/...` 중 한 방식으로 통일한다.
- **다른 feature / `app`에서 가져올 때**:
  - 이상적: `@/features/<도메인>`의 **public API**(`index.ts`)만 import
  - 아직 `index.ts`가 정리되지 않았으면 임시로 deep import를 허용하되, 점진적으로 public API로 모은다.

---

## 4. `app/` 라우트 레이어 규칙

- `app/`은 **조립 레이어**다.
  - OK: `@/features/...`, `@/shared/...`, `@/server` import
  - 금지: 라우트 폴더 안에 도메인 전용 컴포넌트/유틸/타입이 장기적으로 쌓이는 것
- 라우트 전용으로 짧게 끝나는 조각은 해당 segment의 `_components` 같은 private 폴더로 두되,
  기능 단위로 커지면 `features/`로 이동한다.

---

## 5. 금지·비권장 패턴

| 패턴 | 이유 |
|------|------|
| `shared` → `features` import | 공용 레이어가 도메인에 의존하면 결합도 급상승 |
| 불필요한 deep import 남발 | 공개 경로(`@/shared/ui`, `@/shared/hooks`, `@/shared/utils`)를 우선 |
| `server`를 클라이언트에서 value import | 서버 코드가 클라이언트 번들로 새는 사고 방지 |

> `server` 타입이 필요하면 `import type { ... } from '@/server'`만 허용한다.

---

## 6. 결합도 요약(권장 의존 방향)

- `app` → `features` / `shared` / `server`
- `features` → `shared` / `server` (feature끼리 의존은 최소화)
- `shared` → `shared` (feature 의존 금지)
- `server` → `server` + `shared` (types/utils 등)

자세한 폴더 규칙은 `.cursor/rules/codin-folder.mdc`, 정리 현황은 `docs/FOLDER_STRUCTURE_RULE.md` 참고.
