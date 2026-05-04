# QuoteSync 개발 가이드라인 (AI Agent 전용)

> 본 문서는 AI Coding Agent가 본 저장소에서 작업할 때 따라야 할 **프로젝트 고유 규칙**만 기술한다. 일반 개발 지식·튜토리얼·기능 설명은 포함하지 않는다.

---

## 프로젝트 개요

- **서비스명**: QuoteSync (`package.json` 의 `"name": "quotesync"`)
- **목적**: 노션에서 작성한 견적서를 클라이언트에게 웹 뷰어 + PDF로 공유
- **운영자(로그인 필요)**: 프리랜서·에이전시 — 노션 연동 / 견적서 목록 / 공유 링크 관리
- **클라이언트(로그인 불필요)**: `/quote/[token]` 경로로 견적서 열람 + PDF 다운로드
- **MVP 기능 ID 체계**: `F001`~`F005` (핵심), `F010`~`F012` (지원). 신규 기능 코드/PR/문서에는 **반드시 해당 F-ID를 명시**한다. 정의: `docs/PRD.md`

---

## 기술 스택 고정값 (변경 금지)

- Framework: **Next.js 16.2.2** (App Router + Turbopack)
- Runtime: **React 19.1.0**
- TypeScript: **5.x** (`tsconfig.json` `strict: true`)
- Styling: **TailwindCSS v4** + **shadcn/ui** (`style: "new-york"`, `baseColor: "neutral"`, `cssVariables: true`)
- Forms: **React Hook Form + Zod + Server Actions**
- Icons: **lucide-react** (`components.json` `iconLibrary: "lucide"`)
- Toast: **sonner** (`<Toaster />`는 `src/app/layout.tsx`에 이미 마운트됨 — 추가 마운트 금지)
- Theme: **next-themes** (`<ThemeProvider>`는 `src/app/layout.tsx`에 이미 적용됨 — 재래핑 금지)
- Animation utility: **tw-animate-css**
- Test 프레임워크: **현재 없음** — 테스트 추가가 필요하면 사용자에게 먼저 확인 후 도입

> **금지**: 위 라이브러리 외에 동일 영역의 대체재(예: Formik, Chakra UI, styled-components, react-hot-toast, classnames 단독, dayjs 등)를 import 하지 말 것.

---

## 디렉토리 구조 (실제 존재 기준)

```
src/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 (ThemeProvider + Toaster 포함)
│   ├── page.tsx                # 랜딩
│   ├── globals.css             # 전역 CSS / shadcn 토큰
│   ├── login/page.tsx          # F010
│   ├── signup/page.tsx         # F010
│   ├── dashboard/page.tsx      # F002 / F003 / F012
│   ├── notion-integration/page.tsx  # F001 / F011
│   └── quote/                  # F004 / F005 — 공개 라우트 (로그인 불필요)
├── components/
│   ├── ui/                     # shadcn/ui — 직접 작성 금지, CLI로만 추가
│   ├── layout/                 # container.tsx, header.tsx, footer.tsx
│   ├── navigation/             # main-nav.tsx, mobile-nav.tsx (쌍으로 동기화)
│   ├── providers/              # theme-provider.tsx
│   ├── login-form.tsx          # 페이지 전용 폼 컴포넌트
│   ├── signup-form.tsx
│   └── theme-toggle.tsx
└── lib/
    ├── utils.ts                # cn() — 다른 정의 추가 금지, 별도 파일로 분리
    └── env.ts                  # 환경변수 Zod 검증 (단일 진입점)
```

### 신규 파일 배치 결정 트리

| 추가하려는 것                        | 위치                                                               | 비고                                      |
| ------------------------------------ | ------------------------------------------------------------------ | ----------------------------------------- |
| shadcn/ui 컴포넌트                   | `src/components/ui/`                                               | **반드시** `npx shadcn@latest add <name>` |
| 한 페이지에서만 쓰는 폼              | `src/components/<feature>-form.tsx`                                | `login-form.tsx` 패턴 따라 단일 파일      |
| 여러 페이지에서 쓰는 도메인 컴포넌트 | `src/components/<domain>/`                                         | 하위 폴더 신설 가능                       |
| 네비게이션 메뉴                      | `src/components/navigation/`                                       | 데스크톱·모바일 **둘 다** 수정            |
| 레이아웃 래퍼                        | `src/components/layout/`                                           |                                           |
| Context Provider                     | `src/components/providers/`                                        | `src/app/layout.tsx`에 등록 잊지 말 것    |
| Zod 스키마                           | `src/lib/schemas/<domain>.ts` (없으면 생성)                        | 폼·서버액션·DB가 동일 스키마 공유         |
| 커스텀 훅                            | `src/lib/hooks/<name>.ts` (없으면 생성)                            | 별칭 `@/hooks` 사용                       |
| 타입                                 | `src/lib/types/<domain>.ts` (없으면 생성)                          |                                           |
| Server Action                        | `src/app/actions/<domain>.ts` 또는 해당 라우트 폴더의 `actions.ts` | 파일 최상단 `'use server'` 필수           |
| 환경변수                             | `src/lib/env.ts` 의 `envSchema` **+** `.env.local.example`         | 둘 다 갱신 (아래 동기화 규칙 참조)        |

### 금지 위치

- `src/components/misc/`, `src/components/common/`, `src/components/shared/` — 의미 없는 폴더 신설 금지
- `src/pages/` — Pages Router 절대 사용 금지
- `src/components/sections/` — 본 디렉토리는 과거에 존재했으나 **삭제됨**. 재생성 금지

---

## 네이밍 규칙

- 파일/폴더: **kebab-case**. (예: `share-link-form.tsx`, `notion-integration/`)
- React 컴포넌트 함수명: **PascalCase**, **named export** 우선. 페이지 컴포넌트(`app/**/page.tsx`)만 `default export`.
- Zod 스키마 변수: `<name>Schema`, 추론 타입은 `<Name>FormData`/`<Name>Input` (예: `loginSchema` → `LoginFormData`).
- 기능 단위 식별자: PRD의 `F001`~`F012` 그대로 사용. 임의 ID 발번 금지.

---

## 경로 별칭 (Path Alias)

`tsconfig.json`: `"@/*": ["./src/*"]`
`components.json`:

```
@/components → src/components
@/lib        → src/lib
@/hooks      → src/hooks
@/ui         → src/components/ui
@/utils      → src/lib/utils
```

규칙:

- 모든 내부 import 는 `@/` 사용. `../../..` 형태 상대 경로 **금지**.
- 별칭을 추가/변경하려면 `tsconfig.json` 의 `paths` **와** `components.json` 의 `aliases` 를 **반드시 동시 수정**한다.

---

## 다중 파일 동기화 규칙 (필수 준수)

작업 시 한 쪽만 바꾸면 시스템이 깨지는 짝. 한 항목을 수정할 때 같은 줄의 모든 파일을 함께 갱신해야 한다.

| 변경 트리거                    | 동시에 수정할 파일                                                                                                         | 사유                                  |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| 환경변수 추가/제거             | `src/lib/env.ts`(Zod 스키마 + `envSchema.parse` 인자) **+** `.env.local.example`                                           | 런타임 검증과 문서화 동기화           |
| 새 페이지 라우트 추가          | `src/app/<route>/page.tsx` **+** `src/components/navigation/main-nav.tsx` **+** `src/components/navigation/mobile-nav.tsx` | 두 네비게이션은 항상 동일 항목 노출   |
| 경로 별칭 변경                 | `tsconfig.json` **+** `components.json`                                                                                    | shadcn CLI/TS 모두 참조               |
| 보호 라우트 추가 (운영자 전용) | 인증 미들웨어/가드 **+** `/quote/**`는 **반드시 화이트리스트 유지**                                                        | 클라이언트 공개 접근 보장 (F004/F005) |
| Provider 추가                  | `src/components/providers/<name>.tsx` 생성 **+** `src/app/layout.tsx` 의 ThemeProvider 위치에 중첩 등록                    | 전역 활성화                           |
| shadcn/ui 토큰/색상 변경       | `src/app/globals.css`(CSS 변수) — `components.json` 의 `baseColor: "neutral"` 와 일치 유지                                 | 다크모드 깨짐 방지                    |
| Zod 스키마 변경                | 해당 스키마를 import 하는 폼 컴포넌트 **+** Server Action **+** (DB 모델/마이그레이션 존재 시)                             | 단일 진실 소스                        |
| `package.json` 의존성 변경     | `package-lock.json` 도 같이 커밋 (`npm install` 후 자동 갱신)                                                              | CI 일관성                             |

---

## 코드 구현 규칙

### Server / Client Components

- **기본은 Server Component**. `'use client'` 는 다음 사유가 있을 때만 파일 최상단에 추가:
  - `useState` / `useEffect` / 이벤트 핸들러 / 브라우저 API
  - `useTheme`, `useFormContext` 등 클라이언트 훅 사용
- 데이터 패칭은 **Server Component 또는 Server Action**에서 수행. 클라이언트에서 `fetch('/api/...')` 보다 Server Action 우선.
- `params` / `searchParams` 는 **Promise** 로 받고 `await` 해서 사용한다 (Next.js 16 규칙).

```tsx
// ✅
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  // ...
}

// ❌ 동기 접근 금지
export default function Page({ params }: { params: { id: string } }) {
  /* ... */
}
```

### 폼 처리 표준 (필수)

새 폼은 **React Hook Form + Zod resolver + Server Action** 조합으로 작성한다.

```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '@/lib/schemas/auth'

export function LoginForm() {
  const form = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })
  // ...
}
```

> **참고**: 현재 `src/components/login-form.tsx` / `signup-form.tsx` 는 `useState` 기반 레거시 구현이다. 해당 파일을 수정할 때는 위 표준으로 **마이그레이션을 우선 검토**한다 (PRD/가이드 합의 사항).

### 스타일링

- **반드시** Tailwind 유틸리티 클래스 사용. `style={{ ... }}` 인라인 스타일 **금지**.
- 색상은 **시맨틱 토큰**(`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-primary-foreground`, `bg-destructive` 등)만 사용. `bg-white`, `text-gray-900`, `bg-blue-500` 같은 **고정 팔레트 금지** (다크모드 호환 불가).
- 클래스 조합은 `cn()` (`@/lib/utils`) 만 사용. `clsx`/`tailwind-merge` 직접 호출 금지.
- 정렬은 `prettier-plugin-tailwindcss` 가 자동 처리 — 수동으로 재정렬하지 말 것.

### shadcn/ui 컴포넌트

- 추가는 **항상** `npx shadcn@latest add <name>`. `src/components/ui/` 안에 수기 작성 금지.
- 기존 ui 컴포넌트를 수정하기 전에 동일 효과를 props/`className` + `cn()` 으로 달성 가능한지 먼저 검토. 직접 수정이 필요하면 변경 사유를 PR에 명시.

### 메타데이터

- 페이지마다 `export const metadata: Metadata` 작성. 타이틀 형식은 **`<페이지명> - QuoteSync`** 로 통일 (`src/app/dashboard/page.tsx` 참고).

### 환경변수

- 모든 환경변수는 `src/lib/env.ts` 의 `envSchema` 를 통해서만 접근. `process.env.X` 직접 사용 금지.
- `NOTION_INTEGRATION_TOKEN` 은 **사용자별 DB 저장** 정책이다. `envSchema` 에 추가하지 말 것 (env.ts 주석 명시 사항).
- 인증은 Supabase 사용 가정 (env.ts 에 `NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY` 정의됨). 다른 인증 SDK 도입 시 사용자에게 먼저 확인.

### 보안 헤더

- `next.config.ts` 의 `headers()` 가 `X-Frame-Options: DENY` 를 강제한다. 견적서 임베드/iframe 시나리오가 필요하면 헤더를 수정해야 함을 인지하고 PR 에서 명시.

---

## 라우트 / 인증 정책

| 경로                                | 접근                     | 비고                                                |
| ----------------------------------- | ------------------------ | --------------------------------------------------- |
| `/`, `/login`, `/signup`            | 공개                     |                                                     |
| `/dashboard`, `/notion-integration` | 운영자 인증 필수         | 미들웨어 도입 시 보호 대상                          |
| `/quote/**`                         | **공개 (로그인 불필요)** | 토큰 기반 접근. 미들웨어 화이트리스트에 반드시 포함 |

> **금지**: `/quote/**` 를 인증 보호 대상에 포함시키는 변경. 클라이언트는 로그인하지 않는다.

---

## 명령어 / 워크플로

```bash
npm run dev          # Turbopack 개발 서버
npm run build        # Turbopack 프로덕션 빌드
npm run typecheck    # tsc --noEmit
npm run lint         # eslint .
npm run format       # prettier --write .
npm run check-all    # typecheck + lint + format:check (작업 완료 시 필수)
```

작업 완료 체크리스트(필수):

1. `npm run check-all` 통과
2. `npm run build` 성공 (UI/라우트 변경이 있는 경우)
3. 변경된 페이지를 `npm run dev` 로 실제 브라우저에서 동작 확인 (UI/UX 변경 시)

> Pre-commit 훅(`husky` + `lint-staged`)이 자동으로 `prettier --write` / `eslint --fix` 를 실행한다. **`--no-verify` 사용 금지** — hook 실패는 우회하지 말고 원인 수정.

---

## 커밋 / Git 규칙

- 커밋 메시지: **한국어** + 컨벤셔널 + 이모지 prefix (저장소 기존 컨벤션). 예: `🔧 chore: ...`, `✨ feat: ...`, `📝 docs: ...`, `🐛 fix: ...`.
- `shrimp_data/` 디렉토리는 `.gitignore` 에 등록되어 있다. **커밋 금지** (로컬 작업 데이터).
- `.idea/`, `.vscode/settings.json` 은 현재 추적 중 — 함부로 삭제하지 말 것 (개인 설정 동기화용).

---

## AI 의사결정 규칙

작업 지시가 모호할 때 다음 우선순위로 판단:

1. **PRD 우선**: 기능을 추가/변경할 때 `docs/PRD.md` 의 F-ID 와 사용자 여정에 부합하는지 먼저 확인. 부합하지 않으면 사용자에게 확인 요청.
2. **MVP 범위 외 기능 자동 구현 금지**: 소셜 로그인, OAuth, 통계, 커스텀 브랜딩, 승인/거절, 이메일 알림, 다국어 — PRD 가 "MVP 이후"로 명시한 항목은 요청이 명확할 때만 작업.
3. **기존 패턴 우선**: 동일 카테고리의 기존 파일이 있으면 그 구조/네이밍을 그대로 따른다 (예: 새 폼 → `login-form.tsx` 디렉토리·파일 패턴).
4. **새 디렉토리 신설 전 검토**: `src/components/` 또는 `src/lib/` 아래에 새 하위 폴더를 만들기 전에 본 문서의 "결정 트리" 표를 먼저 참조.
5. **외부 라이브러리 도입 시 확인 요청**: 본 문서 "기술 스택 고정값"에 없는 의존성을 추가해야 할 경우, 추가 전 사용자에게 사유와 함께 확인.
6. **Server Action vs API Route**: 새 백엔드 로직은 **Server Action** 우선. `src/app/api/**` 라우트는 외부 시스템 webhook 등 Server Action 으로 표현 불가능한 경우에만 신설.
7. **`/quote/**` 작업 시\*\*: 로그인 가정 코드(쿠키 기반 사용자 fetch 등)를 추가하지 않는다. 토큰 → 견적서 데이터 매핑만으로 동작해야 한다.

---

## 금지 사항 요약

| ❌ 하지 말 것                                              | ✅ 대신                                         |
| ---------------------------------------------------------- | ----------------------------------------------- |
| `pages/` 디렉토리 생성                                     | `src/app/` (App Router)                         |
| `params: { id: string }` 동기 시그니처                     | `params: Promise<{ id: string }>` + `await`     |
| `style={{ ... }}` 인라인 스타일                            | Tailwind 클래스 + `cn()`                        |
| `bg-white` / `text-gray-900` 등 고정 색상                  | `bg-background` / `text-foreground` 시맨틱 토큰 |
| `src/components/ui/` 수기 컴포넌트 작성                    | `npx shadcn@latest add <name>`                  |
| `process.env.X` 직접 사용                                  | `import { env } from '@/lib/env'`               |
| `NOTION_INTEGRATION_TOKEN` 환경변수 등록                   | 사용자별 DB 저장                                |
| `useState`/`useEffect` 기반 신규 폼 작성                   | RHF + Zod + Server Action                       |
| `../../..` 상대 경로                                       | `@/` 별칭                                       |
| `git commit --no-verify`                                   | hook 실패 원인 수정                             |
| `shrimp_data/` 커밋                                        | `.gitignore` 유지                               |
| `/quote/**` 인증 보호 대상에 포함                          | 공개 화이트리스트 유지                          |
| 사용자 여정/MVP 범위 외 기능 자동 구현                     | 사용자 확인 후 진행                             |
| 한 네비게이션만 수정 (`main-nav` 또는 `mobile-nav` 한쪽만) | 둘 다 동기 수정                                 |
| `tsconfig.json` 별칭만 변경                                | `components.json` 도 동시 변경                  |
| `env.ts` 만 변경                                           | `.env.local.example` 도 동시 변경               |

---

## 변경 이력 관리

본 문서를 갱신할 때:

- **최소 변경 원칙**: 기존 규칙은 사용자 코드/구조가 실제로 바뀌었을 때만 수정한다.
- **타임니스 점검**: 위에 언급된 디렉토리/파일이 사라졌거나 의존성이 제거된 경우, 해당 규칙을 즉시 제거한다.
- **신규 규칙 추가 기준**: "이 정보를 모르면 AI 가 잘못 동작할 가능성이 있는가?" 가 Yes 인 항목만 추가. 일반 개발 지식은 기재하지 않는다.
