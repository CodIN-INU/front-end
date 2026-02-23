# app/ 디렉터리 구조

Next.js App Router 기반 라우팅·레이아웃 구조입니다.

## 레이아웃 계층

```
layout.tsx (루트)
└── (auth-required)/layout.tsx  ← BottomNav
    ├── main/layout.tsx         ← MainHeader + DefaultBody(full)
    ├── ticketing/(list)/layout.tsx
    └── ...
```

## DefaultBody headerPadding

| 값 | 용도 |
|----|------|
| `none` | 헤더 없음 |
| `compact` | 일반 헤더 (80px) |
| `full` | MainHeader+TopNav (160px) |

## 상세 문서

전체 구조 설명은 [`docs/APP_STRUCTURE.md`](../../docs/APP_STRUCTURE.md)를 참고하세요.
