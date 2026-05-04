# QuoteSync 개발 로드맵

노션에서 작성한 견적서를 깔끔한 웹 뷰어와 PDF로 손쉽게 공유하는 SaaS 서비스

## 개요

**QuoteSync**는 프리랜서·디자이너·에이전시 운영자를 위한 노션 기반 견적서 공유 플랫폼으로 다음 기능을 제공합니다.

- **노션 Integration 연동**: Integration Token으로 노션 워크스페이스의 견적서 데이터베이스를 연결합니다.
- **공유 링크 기반 견적서 뷰어**: 고유 토큰 기반 공유 URL로 클라이언트가 로그인 없이 깔끔한 레이아웃의 견적서를 확인합니다.
- **PDF 다운로드**: 웹 뷰어 화면을 그대로 PDF 파일로 변환하여 보관·제출할 수 있도록 지원합니다.

## 개발 워크플로우

1. **작업 계획**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
- 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- `/tasks` 디렉토리에 새 작업 파일 생성
- 명명 형식: `XXX-description.md` (예: `001-setup.md`)
- 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
- **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**
- 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조. 예를 들어, 현재 작업이 `012`라면 `011`과 `010`을 예시로 참조.
- 이러한 예시들은 완료된 작업이므로 내용이 완료된 작업의 최종 상태를 반영함 (체크된 박스와 변경 사항 요약). 새 작업의 경우, 문서에는 빈 박스와 변경 사항 요약이 없어야 함. 초기 상태의 샘플로 `000-sample.md` 참조.

3. **작업 구현**

- 작업 파일의 명세서를 따름
- 기능과 기능성 구현
- **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
- 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
- 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
- 테스트 통과 확인 후 다음 단계로 진행
- 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**

- 로드맵에서 완료된 작업을 ✅로 표시

## 개발 단계

### Phase 1: 애플리케이션 골격 구축

- **Task 001: 프로젝트 라우팅 및 레이아웃 골격 구성** - 우선순위
  - Next.js 16 App Router 기반 전체 라우트 구조 생성 (`/`, `/login`, `/signup`, `/dashboard`, `/notion-connect`, `/quote/[token]`)
  - 공개 영역과 인증 영역을 위한 Route Group 구성 (`(public)`, `(auth)`, `(protected)`)
  - Root layout, 인증 영역 layout, 공개 영역 layout 골격 구현
  - 글로벌 네비게이션 헤더 및 푸터 컴포넌트 골격 작성
  - `loading.tsx`, `error.tsx`, `not-found.tsx` 기본 파일 생성
  - 모든 페이지에 빈 껍데기 컴포넌트 배치하여 라우트 동작 확인

- **Task 002: 도메인 타입 및 인터페이스 정의**
  - `types/` 디렉토리에 도메인 타입 정의 (`User`, `NotionIntegration`, `Quote`, `QuoteBlock`)
  - 노션 API 응답 타입 정의 (`NotionPage`, `NotionDataSource`, `NotionBlock`)
  - 공유 링크 관련 타입 정의 (`ShareLink`, `ShareLinkStatus`)
  - 폼 스키마용 Zod 인터페이스 정의 (`AuthSchema`, `NotionConnectSchema`, `ShareLinkSchema`)
  - Server Action 응답 표준 타입 정의 (`ActionResult<T>`, `ActionError`)
  - API 응답 공통 타입 정의 및 export 정리

- **Task 003: Supabase 및 Drizzle ORM 스키마 설계**
  - Supabase 프로젝트 생성 및 환경 변수 템플릿 작성 (`.env.example`)
  - Drizzle ORM 설정 (`drizzle.config.ts`, `db/schema.ts`)
  - `users`, `notion_integrations`, `quotes` 테이블 스키마 정의 (구현 제외, 스키마 설계만)
  - Row Level Security 정책 초안 작성
  - 마이그레이션 명령어 스크립트 정리 (`db:generate`, `db:migrate`, `db:push`)
  - Supabase 클라이언트 유틸리티 골격 구성 (`lib/supabase/server.ts`, `lib/supabase/client.ts`)

- **Task 004: 글로벌 프로바이더 및 유틸리티 골격 구성**
  - TanStack Query Provider 설정 및 Root Layout 통합
  - `lib/utils.ts` 기본 유틸 함수 정리 (`cn`, `formatDate`, `formatCurrency`)
  - 환경 변수 검증 모듈 작성 (`lib/env.ts` with Zod)
  - 토스트 알림 시스템(Sonner) 글로벌 설정
  - Server Action 공통 래퍼 함수 골격 작성 (`lib/actions/with-auth.ts`)

### Phase 2: UI/UX 완성 (더미 데이터 활용)

- **Task 005: 디자인 시스템 및 공통 컴포넌트 라이브러리 구축**
  - shadcn/ui 컴포넌트 설치 및 커스터마이징 (Button, Input, Card, Dialog, Form, Table, Badge, Skeleton)
  - TailwindCSS v4 디자인 토큰 정의 (색상, 타이포그래피, 간격)
  - 공통 레이아웃 컴포넌트 구현 (`PageHeader`, `EmptyState`, `LoadingSpinner`, `ConfirmDialog`)
  - 폼 컴포넌트 패턴 정립 (`FormField`, `FormError`, `SubmitButton`)
  - 더미 데이터 fixture 작성 (`lib/mocks/quotes.ts`, `lib/mocks/users.ts`)

- **Task 006: 랜딩 및 인증 페이지 UI 구현**
  - 랜딩 페이지 UI 완성 (히어로, 핵심 기능 소개, CTA 섹션)
  - 로그인 페이지 UI 구현 (이메일/비밀번호 폼, 회원가입 링크)
  - 회원가입 페이지 UI 구현 (이메일/비밀번호/이름 폼, 약관 동의)
  - React Hook Form + Zod 기반 폼 검증 UX 적용 (제출 동작은 더미)
  - 모바일 반응형 디자인 적용 및 다크 모드 호환성 확인

- **Task 007: 대시보드 및 노션 연동 페이지 UI 구현**
  - 대시보드 레이아웃 구성 (사이드바 또는 상단 네비게이션 + 메인 영역)
  - 견적서 목록 테이블 UI 구현 (페이지 제목, 생성일, 공유 링크 상태, 액션 버튼)
  - 견적서 미연동/빈 상태 EmptyState UI 구현
  - 노션 연동 페이지 UI 구현 (Integration Token 입력 폼, 연동 가이드 카드)
  - 연동 상태 표시 컴포넌트 구현 (활성/비활성 배지)
  - 모든 데이터는 더미 fixture에서 가져오도록 구현

- **Task 008: 공유 링크 생성 모달 및 견적서 뷰어 UI 구현**
  - 공유 링크 생성 모달 UI 구현 (만료 일시 옵션, 복사 버튼, QR 코드 placeholder)
  - 공유 링크 목록 컴포넌트 (활성/비활성 토글, 만료일, 비활성화 버튼)
  - 견적서 뷰어 페이지 UI 구현 (헤더, 클라이언트/공급자 정보, 항목 테이블, 합계, 노트)
  - 노션 블록 렌더링 컴포넌트 골격 (텍스트, 헤딩, 리스트, 테이블, 인용)
  - PDF 다운로드 버튼 및 인쇄용 스타일 시트 구성
  - 만료된 링크/비활성 링크에 대한 안내 페이지 UI 구현

### Phase 3: 핵심 기능 구현

- **Task 009: Supabase 인증 시스템 구현 (F010)** - 우선순위
  - Supabase Auth 설정 및 이메일/비밀번호 회원가입·로그인·로그아웃 Server Action 구현
  - `middleware.ts`로 보호 라우트 세션 갱신 및 리디렉션 처리
  - 사용자 프로필 자동 생성 트리거 (DB 트리거 또는 Server Action)
  - 인증 에러 처리 및 사용자 친화적 메시지 매핑
  - Playwright MCP로 회원가입 → 로그인 → 보호 페이지 접근 → 로그아웃 E2E 플로우 테스트
  - 미인증 상태에서 보호 라우트 접근 차단 시나리오 검증

- **Task 010: 데이터베이스 마이그레이션 및 Repository 계층 구현**
  - Drizzle 마이그레이션 실행 및 RLS 정책 적용
  - `db/repositories/users.ts`, `db/repositories/notion-integrations.ts`, `db/repositories/quotes.ts` 구현
  - Server Action에서 Repository 호출하는 패턴 정립
  - 트랜잭션 처리 및 에러 핸들링 표준화
  - Playwright MCP로 데이터 생성/조회/삭제 통합 시나리오 검증

- **Task 011: 노션 Integration 연동 기능 구현 (F001, F011)**
  - `@notionhq/client` 기반 노션 클라이언트 래퍼 구현 (`lib/notion/client.ts`)
  - Integration Token 검증 Server Action 구현 (workspace 정보 조회로 유효성 확인)
  - 데이터 소스 선택 UI 및 `data_source_id` 저장 로직 구현
  - 토큰 암호화 저장 전략 적용 (Supabase Vault 또는 AES-256)
  - 연동 해제 및 재연동 플로우 구현
  - Playwright MCP로 정상 토큰/잘못된 토큰/권한 부족 토큰 시나리오 E2E 테스트

- **Task 012: 견적서 목록 조회 기능 구현 (F002)**
  - `notion.dataSources.query` 호출로 견적서 페이지 목록 가져오기
  - TanStack Query를 활용한 견적서 목록 캐싱 및 무효화 전략 구현
  - 더미 데이터를 실제 노션 API 호출로 교체
  - 노션 페이지 메타데이터 추출 유틸리티 (제목, 생성일, 속성)
  - 페이지네이션 및 검색·필터링 (제목 기반) 구현
  - Playwright MCP로 노션 데이터 로드, 빈 상태, 네트워크 에러 케이스 검증

- **Task 013: 공유 링크 생성 및 관리 기능 구현 (F003, F012)**
  - 고유 share_token 생성 유틸리티 (nanoid 또는 crypto.randomUUID)
  - 공유 링크 생성 Server Action 구현 (만료일, 활성 상태 옵션)
  - 공유 링크 비활성화/재활성화 Server Action 구현
  - 클립보드 복사 기능 및 토스트 알림 연동
  - 만료된 링크 자동 처리 로직 (조회 시 만료 검증)
  - Playwright MCP로 링크 생성 → 복사 → 비활성화 → 만료 시나리오 E2E 테스트

- **Task 014: 견적서 웹 뷰어 구현 (F004)**
  - `/quote/[token]` 페이지에서 토큰으로 견적서 조회 및 노션 페이지 콘텐츠 fetching
  - 노션 블록을 React 컴포넌트로 렌더링하는 변환 레이어 구현
  - 만료/비활성/존재하지 않는 토큰에 대한 에러 페이지 처리
  - 공개 접근(비로그인) 라우트로 동작 확인 (middleware 예외 처리)
  - 메타데이터 및 OG 이미지 동적 생성 (Open Graph)
  - Playwright MCP로 비로그인 사용자 접근, 만료 링크, 비활성 링크, 정상 렌더링 E2E 테스트

- **Task 015: PDF 다운로드 기능 구현 (F005)**
  - `@react-pdf/renderer` 기반 견적서 PDF 템플릿 컴포넌트 구현
  - `renderToBuffer` / `renderToStream`으로 PDF 생성 Server Action 또는 Route Handler 구현
  - 웹 뷰어와 동일한 레이아웃을 PDF로 재현
  - 한글 폰트 임베딩 및 페이지 분할 처리
  - 다운로드 파일명 규칙 적용 (`quote_<제목>_<날짜>.pdf`)
  - Playwright MCP로 PDF 다운로드 트리거 및 응답 헤더 검증, 빈 데이터 케이스 처리 테스트

- **Task 016: 핵심 기능 E2E 통합 테스트**
  - Playwright MCP로 전체 사용자 플로우 시나리오 테스트 (가입 → 노션 연동 → 견적서 목록 → 공유 링크 생성 → 클라이언트 뷰어 → PDF 다운로드)
  - 운영자/클라이언트 두 역할의 멀티 컨텍스트 테스트
  - 인증/권한 경계 케이스 검증 (다른 사용자의 견적서 접근 차단)
  - API 호출 실패, 노션 데이터 변형 등 엣지 케이스 시나리오 검증
  - Vitest 단위 테스트로 핵심 유틸리티 및 토큰 생성 로직 검증

### Phase 4: 고급 기능 및 최적화

- **Task 017: 사용자 경험 향상 및 부가 기능**
  - 견적서 미리보기 모달 추가 (대시보드에서 PDF 변환 전 확인)
  - 공유 링크에 패스워드 보호 옵션 추가 (선택 사항)
  - 토스트/스켈레톤/optimistic update를 활용한 인터랙션 개선
  - 다국어 i18n 토대 마련 (한국어 기본, 영어 추가 가능 구조)
  - 접근성(a11y) 개선 (키보드 네비게이션, ARIA 속성, 스크린 리더 호환성)

- **Task 018: 성능 최적화 및 캐싱 전략**
  - Next.js 16 캐싱 전략 적용 (`unstable_cache`, Route Segment Config)
  - 노션 API 응답 캐싱 및 ISR/Revalidation 정책 수립
  - 이미지 최적화 (`next/image`) 및 폰트 최적화 (`next/font`)
  - Server Component / Client Component 경계 재검토 및 번들 사이즈 분석
  - Lighthouse / Web Vitals 측정 및 LCP/INP/CLS 개선

- **Task 019: 모니터링·로깅 및 배포 파이프라인 구축**
  - Vercel 배포 환경 구성 (Production / Preview / Development)
  - 환경 변수 시크릿 관리 및 Vercel 프로젝트 연결
  - GitHub Actions 또는 Vercel CI 기반 lint/typecheck/test 파이프라인 구성
  - 에러 모니터링 도구(예: Sentry) 연동 및 로깅 전략 수립
  - Husky + lint-staged 검증 강화 및 PR 템플릿 정비
  - 운영 모니터링 대시보드 구성 (Vercel Analytics, Supabase Logs)

- **Task 020: 출시 준비 및 문서화**
  - 사용자 온보딩 가이드 작성 (노션 Integration 발급 방법, 데이터베이스 구조 가이드)
  - 개인정보 처리방침 / 이용약관 페이지 작성
  - 마케팅 랜딩 페이지 콘텐츠 보강 (FAQ, 사용 사례, 가격 안내)
  - 베타 사용자 피드백 채널 구성 (이메일 또는 Tally 폼)
  - 최종 회귀 테스트 및 프로덕션 출시 체크리스트 검증
