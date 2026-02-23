# shared/ - 범용 코드

codin-folder 룰에 따른 **공용 레이어**. 여러 feature에서 재사용하는 UI, 훅, 유틸, 타입.

## 구조 (마이그레이션 진행 중)

| 폴더 | 역할 | 현재 위치 |
|------|------|-----------|
| ui/ | Layout, Button, Modal 등 공용 컴포넌트 | `@/components` |
| hooks/ | useElementSize, useReportModal 등 | `@/hooks` |
| utils/ | date, format, router 등 | `@/lib/utils` |
| types/ | auth, post, course 등 공용 타입 | `@/types` |
| constants/ | layout 등 전역 상수 | `@/constants` |
| store/ | Zustand 전역 상태 | `@/store` |
| context/ | Auth, User 등 Context | `@/context` |
| config/ | 앱 설정 | `@/config` |
| data/ | 정적 데이터 | `@/data` |

## Import 규칙

- `@/shared/*` - 마이그레이션 후 사용 예정
- 현재는 기존 경로(`@/components`, `@/lib` 등) 사용
