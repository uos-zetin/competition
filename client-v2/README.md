# client-v2

라인트레이서 대회 운영 시스템의 클라이언트. [Feature-Sliced Design(FSD)](https://feature-sliced.design/)을 따라 레이어별로 코드를 나눈다.

## 레이어 구조

```
src/
├─ app/        # 라우팅 조립, 전역 레이아웃/프로바이더
├─ pages/      # URL 경로에 대응하는 화면. widgets/features/entities/shared 조합만 함
├─ widgets/    # 여러 페이지에서 재사용하는 레이아웃/UI 블록
├─ features/   # CRUD를 넘어서는 운영 시나리오, cross-cutting 관심사
├─ entities/   # 도메인 모델(대회/부문/참가자/기록 등) — 타입/스키마/store/API/UI를 전부 소유
└─ shared/     # 특정 도메인에 속하지 않는 공용 유틸/UI/설정
```

각 레이어는 자기보다 아래 레이어만 import할 수 있다(`pages` → `widgets`/`features`/`entities`/`shared`, `features`/`widgets` → `entities`/`shared`, `entities` → `shared`). 같은 레이어의 다른 슬라이스끼리는 import하지 않는다.

## 슬라이싱 원칙

- **entities가 순수 CRUD 도메인을 끝까지 소유한다.** 생성/수정/삭제/조회만 있는 도메인(대회, 부문, 참가자 등)은 별도 feature 없이 entities 하나가 타입·zod 스키마·zustand store·repository(REST/소켓)·selector 훅·mutation 함수·테스트를 전부 갖는다.
- **feature는 두 경우에만 존재한다**: (a) CRUD를 넘어서는 운영 워크플로우(여러 entity를 조합하거나 규칙 있는 상태 전이가 있는 경우), (b) 인증·에러 처리처럼 특정 entity에 속하지 않는 cross-cutting 관심사.
- **DI는 API 경계(REST repository / 소켓 channel)에서만 한다.** React Context/Provider 계층을 따로 두지 않고, `entities/{slice}/api/index.ts` 같은 모듈 스코프 조립 지점에서 mock/real repository를 환경변수로 스위칭한다.
- **소켓 연결 생명주기는 항상 entities가 독점 소유한다.** 정본 구현이 하나만 존재해야 연결/해제 레이스 컨디션을 피할 수 있다.
- **테스트는 로직이 실제로 있는 위치에 같이 둔다.** 팩토리 함수(`createXxxService({ xxxRepository })`)를 React 없이 직접 호출해서 검증한다.
- **개발 중엔 mock repository, 검증 시엔 로컬 실제 서버로 스위칭한다.** `src/shared/config/env.ts`의 `env.useMocks`가 단일 진입점.

## 명령어

```bash
npm run dev      # mock 모드 개발 서버
npm run lint
npm run test      # vitest run
npm run build      # tsc -b && vite build
npm run format
```

## 페이지별 기능

기능이 단순해서 화면만 봐도 알 수 있는 페이지(홈, 관리자 대시보드, 로딩)는 별도 문서 없이 이 표에만 남긴다. 나머지는 각 문서에서 기능 목록과 특이사항(화면만 봐선 알기 어려운 동작)을 확인할 수 있다.

| URL 경로 | 페이지 | 문서 |
|---|---|---|
| `/` | 홈 | — |
| `/counter` | 계수기 선택 | [counter-selector](./docs/pages/counter-selector.md) |
| `/counter/:counterId/timer` | 타이머 | [timer](./docs/pages/timer.md) |
| `/counter/:counterId/controller` | 컨트롤러 | [controller](./docs/pages/controller.md) |
| `/counter/:counterId/manual-counter` | 수동 계수 | [manual-counter](./docs/pages/manual-counter.md) |
| `/admin` | 관리자 대시보드 | — |
| `/admin/competitions` | 대회 관리 | [admin-competitions](./docs/pages/admin-competitions.md) |
| `/admin/divisions` | 부문 관리 | [admin-divisions](./docs/pages/admin-divisions.md) |
| `/admin/participants` | 참가자 관리 | [admin-participants](./docs/pages/admin-participants.md) |
| `/admin/records` | 기록 관리 | [admin-records](./docs/pages/admin-records.md) |
| `/admin/users` | 사용자 관리 | [admin-users](./docs/pages/admin-users.md) |
| (지연 로딩 중 폴백) | 로딩 | — |
| `/dashboard` | 대시보드(공개) | [dashboard](./docs/pages/dashboard.md) |
