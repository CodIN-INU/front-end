# 🚀 빠른 시작 가이드

> 마이그레이션 작업을 빠르게 시작하기 위한 요약 가이드

---

## ⚡ 5분 안에 시작하기

### 1단계: 준비 (2분)

```bash
# 브랜치 생성
git checkout -b refactor/folder-structure

# 현재 상태 커밋
git add .
git commit -m "chore: 폴더 구조 마이그레이션 전 백업"

# 빌드 확인
npm run build
```

### 2단계: Phase 1 시작 - 타입 통합 (3분)

```bash
# 타입 파일 이동
mv src/interfaces/partners.ts src/types/partners.ts
mv src/interfaces/map.ts src/types/map.ts
mv src/interfaces/course.ts src/types/course.ts
mv src/interfaces/Post.ts src/types/post.ts
mv src/interfaces/TicketEventRequest.ts src/types/ticketEventRequest.ts
mv src/interfaces/SnackEvent.ts src/types/snackEvent.ts
```

**VS Code에서 Find & Replace:**
- `@/interfaces/partners` → `@/types/partners`
- `@/interfaces/map` → `@/types/map`
- `@/interfaces/course` → `@/types/course`
- `@/interfaces/Post` → `@/types/post`
- `@/interfaces/TicketEventRequest` → `@/types/ticketEventRequest`
- `@/interfaces/SnackEvent` → `@/types/snackEvent`

```bash
# 빌드 확인
npm run build

# 커밋
git add .
git commit -m "refactor: interfaces → types 통합"
```

---

## 📋 작업 순서 (우선순위)

### 🔴 필수 작업 (오늘 할 일)

1. **Phase 0: 준비** (30분)
   - [ ] 브랜치 생성
   - [ ] 백업 커밋
   - [ ] 빌드 확인

2. **Phase 1: 기반 구조** (2-3시간)
   - [ ] 타입 통합 (`interfaces/` → `types/`)
   - [ ] 스타일 정리 (`globals.css` → `styles/`)
   - [ ] lib 구조 생성

### 🟡 중요 작업 (이번 주 할 일)

3. **Phase 2: Feature 분리** (1-2주)
   - [ ] `roomstatus` (가장 작고 쉬움 - 추천 시작점)
   - [ ] `search`
   - [ ] `chat`
   - [ ] `dept-boards`
   - [ ] `mypage`
   - [ ] `board`
   - [ ] `ticketing`
   - [ ] `course-reviews`

### 🟢 선택 작업 (나중에 해도 됨)

4. **Phase 3: 공용 코드 정리** (3-5시간)
5. **Phase 4: 최적화** (지속적)

---

## 🎯 첫 번째 Feature 분리 예시: `roomstatus`

### 전체 작업 흐름

```bash
# 1. 폴더 구조 생성
mkdir -p src/features/roomstatus/{pages,components,hooks,utils,constants,types}

# 2. 파일 이동
mv src/app/(auth-required)/roomstatus/components/* src/features/roomstatus/components/
mv src/app/(auth-required)/roomstatus/utils/* src/features/roomstatus/utils/
mv src/app/(auth-required)/roomstatus/constants/* src/features/roomstatus/constants/

# 3. 타입 통합 (수동)
# src/app/(auth-required)/roomstatus/interfaces/* 파일들을
# src/features/roomstatus/types.ts 하나로 통합

# 4. 페이지 컴포넌트 생성 (수동)
# src/app/(auth-required)/roomstatus/page.tsx 내용을
# src/features/roomstatus/pages/RoomStatusPage.tsx로 이동

# 5. app/page.tsx 단순화
# import RoomStatusPage from '@/features/roomstatus/pages/RoomStatusPage';
# export default RoomStatusPage;

# 6. Import 경로 수정 (VS Code Find & Replace)

# 7. 빌드 확인
npm run build

# 8. 커밋
git add .
git commit -m "refactor: roomstatus feature 분리 완료"
```

---

## 🔍 각 단계별 체크리스트

### 타입 통합 체크리스트
- [ ] 6개 타입 파일 이동 완료
- [ ] 모든 import 경로 변경 완료
- [ ] 빌드 성공
- [ ] `src/interfaces/` 폴더 삭제

### 스타일 정리 체크리스트
- [ ] `globals.css` 이동 완료
- [ ] `app/layout.tsx` import 수정 완료
- [ ] 빌드 성공
- [ ] 스타일 정상 적용 확인

### Feature 분리 체크리스트 (각 feature마다)
- [ ] 폴더 구조 생성 완료
- [ ] 컴포넌트 이동 완료
- [ ] 타입 통합 완료
- [ ] 유틸/상수 이동 완료
- [ ] 페이지 컴포넌트 생성 완료
- [ ] `app/page.tsx` 단순화 완료
- [ ] Import 경로 수정 완료
- [ ] 빌드 성공
- [ ] 페이지 동작 확인 완료
- [ ] 커밋 완료

---

## 💡 자주 하는 실수 방지

### ❌ 하지 말아야 할 것

1. **한 번에 모든 걸 바꾸기**
   - ✅ Feature 하나씩 완료하고 커밋
   - ❌ 여러 feature 동시에 작업

2. **빌드 확인 안 하기**
   - ✅ 각 단계마다 `npm run build`
   - ❌ 마지막에만 확인

3. **Import 경로 안 바꾸기**
   - ✅ 파일 이동 후 반드시 import 수정
   - ❌ 경로만 바꾸고 import는 그대로

4. **app에 컴포넌트 남겨두기**
   - ✅ 모든 컴포넌트를 `features/`로 이동
   - ❌ `app/`에 컴포넌트 남겨두기

---

## 🆘 문제 해결

### 빌드 에러 발생 시

```bash
# 1. 에러 메시지 확인
npm run build

# 2. Import 경로 확인
# - 파일이 실제로 이동되었는지
# - import 경로가 올바른지

# 3. 필요시 롤백
git reset --hard HEAD~1
```

### 페이지가 동작 안 할 때

1. 브라우저 콘솔 확인 (F12)
2. Import 경로 확인
3. 컴포넌트 export 확인
4. 파일 경로 확인

---

## 📚 상세 문서

- **전체 체크리스트**: `docs/MIGRATION_CHECKLIST.md`
- **구조 제안서**: `docs/FOLDER_STRUCTURE_PROPOSAL.md`
- **실전 예시**: `docs/FOLDER_STRUCTURE_EXAMPLES.md`

---

## ✅ 오늘의 목표 설정

### 최소 목표 (2-3시간)
- [ ] Phase 0 완료
- [ ] Phase 1 완료 (타입 통합 + 스타일 정리)

### 이상적 목표 (하루)
- [ ] Phase 0 완료
- [ ] Phase 1 완료
- [ ] `roomstatus` feature 분리 완료

### 완벽한 목표 (1주)
- [ ] Phase 1 완료
- [ ] 작은 feature 3개 분리 완료 (`roomstatus`, `search`, `chat`)

---

**시작하기**: `docs/MIGRATION_CHECKLIST.md`를 열고 Phase 0부터 시작하세요! 🚀
