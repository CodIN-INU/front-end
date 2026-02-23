# api/server - 서버 전용 API

Next.js Server Components에서만 사용. `cookies()` 등 서버 전용 API 사용.

**Import 시 `@/server` 사용** (tsconfig path alias)

```ts
// ✅
import { getTopPosts, getRoomStatus } from '@/server';

// ❌
import { getTopPosts } from '@/api/server';
```
