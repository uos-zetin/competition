# 사용자 관리 (`/admin/users`)

로그인 계정을 만들고 권한(역할)을 부여하는 페이지. 회원가입이 없으므로 모든 계정은 여기서 관리자가 만들어야 한다.

| 기능 | 특이사항 |
|---|---|
| 사용자 생성/삭제 | — |
| 역할(권한) 부여: `administrator` / `manualRecorder` / `stopwatchRecorder` | administrator=전체 관리, manualRecorder=[수동 계수](./manual-counter.md) 접근([계수기 선택](./counter-selector.md) 화면에서 이 두 역할로 접근 가능 화면이 갈림). **stopwatchRecorder**는 사람이 로그인해서 쓰는 역할이 아니라 계수기 단말이 서버에 연동될 때 쓰는 역할이라 클라이언트 화면 어디에도 이 역할을 사용한 분기가 없음 |
