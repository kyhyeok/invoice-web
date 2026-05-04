# Next.js 16.2.2 개발 지침

이 문서는 Claude Code에서 Next.js 16.2.2 프로젝트를 개발할 때 따라야 할 핵심 규칙과 가이드라인을 제공합니다.

## 🚀 필수 규칙 (엄격 준수)

### App Router 아키텍처

```typescript
// ✅ 올바른 방법: App Router 사용
app/
├── layout.tsx          // 루트 레이아웃
├── page.tsx           // 메인 페이지
├── loading.tsx        // 로딩 UI
├── error.tsx          // 에러 UI
├── not-found.tsx      // 404 페이지
└── dashboard/
    ├── layout.tsx     // 대시보드 레이아웃
    └── page.tsx       // 대시보드 페이지

// ❌ 금지: Pages Router 사용
pages/
├── index.tsx
└── dashboard.tsx
```

### Server Components 우선 설계

```typescript
// 🚀 필수: 기본적으로 모든 컴포넌트는 Server Components
export default async function UserDashboard() {
  // 서버에서 데이터 가져오기
  const user = await getUser()

  return (
    <div>
      <h1>{user.name}님의 대시보드</h1>
      {/* 클라이언트 컴포넌트가 필요한 경우에만 분리 */}
      <InteractiveChart data={user.analytics} />
    </div>
  )
}

// ✅ 클라이언트 컴포넌트는 최소한으로 사용
'use client'

import { useState } from 'react'

export function InteractiveChart({ data }: { data: Analytics[] }) {
  const [selectedRange, setSelectedRange] = useState('week')
  // 상호작용 로직만 클라이언트에서 처리
  return <Chart data={data} range={selectedRange} />
}
```

### 🔄 New: async request APIs 처리

```typescript
// 🔄 Next.js 15+ 비동기 방식 (Next.js 16에서도 동일)
import { cookies, headers } from 'next/headers'

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // 🚀 필수: async request APIs 올바른 처리
  const { id } = await params
  const query = await searchParams
  const cookieStore = await cookies()
  const headersList = await headers()

  const user = await getUser(id)

  return <UserProfile user={user} />
}

// ❌ 금지: 동기식 접근 (15.x에서 deprecated)
export default function Page({ params }: { params: { id: string } }) {
  const user = getUser(params.id) // 에러 발생
  return <UserProfile user={user} />
}
```

### Typed Routes 활용

```typescript
// 🚀 필수: Typed Routes로 타입 안전성 보장
import Link from 'next/link'

// next.config.ts에서 experimental.typedRoutes: true 설정 필요
export function Navigation() {
  return (
    <nav>
      {/* ✅ 타입 안전한 링크 */}
      <Link href="/dashboard/users/123">사용자 상세</Link>
      <Link href={{
        pathname: '/products/[id]',
        params: { id: 'abc' }
      }}>제품 상세</Link>

      {/* ❌ 컴파일 에러: 존재하지 않는 경로 */}
      <Link href="/nonexistent-route">잘못된 링크</Link>
    </nav>
  )
}
```

## ✅ 권장 사항 (성능 최적화)

### Streaming과 Suspense 활용

```typescript
import { Suspense } from 'react'

export default function DashboardPage() {
  return (
    <div>
      <h1>대시보드</h1>

      {/* ✅ 빠른 컨텐츠는 즉시 렌더링 */}
      <QuickStats />

      {/* ✅ 느린 컨텐츠는 Suspense로 감싸기 */}
      <Suspense fallback={<SkeletonChart />}>
        <SlowChart />
      </Suspense>

      <Suspense fallback={<SkeletonTable />}>
        <SlowDataTable />
      </Suspense>
    </div>
  )
}

async function SlowChart() {
  // 무거운 데이터 처리
  await new Promise(resolve => setTimeout(resolve, 2000))
  const data = await getComplexAnalytics()

  return <Chart data={data} />
}
```

### 🔄 New: after() API 활용

```typescript
import { after } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

  // 즉시 응답 반환
  const result = await processUserData(body)

  // 🔄 비블로킹 작업은 after()로 처리
  after(async () => {
    await sendAnalytics(result)
    await updateCache(result.id)
    await sendNotification(result.userId)
  })

  return Response.json({ success: true, id: result.id })
}
```

### 새로운 캐싱 전략

```typescript
// ✅ 세밀한 캐시 제어
export async function getProductData(id: string) {
  const data = await fetch(`/api/products/${id}`, {
    // 🔄 태그 기반 무효화 + revalidate
    next: {
      revalidate: 3600, // 1시간 캐시
      tags: [`product-${id}`, 'products'], // 태그 기반 무효화
    },
  })

  return data.json()
}

// 캐시 무효화
import { revalidateTag } from 'next/cache'

export async function updateProduct(id: string, data: ProductData) {
  await updateDatabase(id, data)

  // 관련 캐시 무효화
  revalidateTag(`product-${id}`)
  revalidateTag('products')
}
```

### Turbopack 최적화 설정

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ✅ Turbopack 최적화 설정
  experimental: {
    turbo: {
      rules: {
        // CSS 모듈 최적화
        '*.module.css': {
          loaders: ['css-loader'],
          as: 'css',
        },
      },
    },
    // 🔄 패키지 import 최적화
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'date-fns',
      'lodash-es',
    ],
  },
}

export default nextConfig
```

## ⚠️ Breaking Changes 대응

### React 19 호환성

```typescript
// ⚠️ React 19에서 변경된 사항들

// ✅ 새로운 방식: useFormStatus 훅
'use client'

import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? '제출 중...' : '제출'}
    </button>
  )
}

// ✅ Server Actions와 form 통합
export async function createUser(formData: FormData) {
  'use server'

  const name = formData.get('name') as string
  const email = formData.get('email') as string

  await saveUser({ name, email })
  redirect('/users')
}

export default function UserForm() {
  return (
    <form action={createUser}>
      <input name="name" required />
      <input name="email" type="email" required />
      <SubmitButton />
    </form>
  )
}
```

### 미들웨어 Node.js Runtime

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

// ⚠️ Edge Runtime에서 Node.js Runtime으로 변경
export const config = {
  runtime: 'nodejs', // 🔄 새로운 기본값
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

export function middleware(request: NextRequest) {
  // 🔄 Node.js API 사용 가능
  const crypto = require('crypto')
  const hash = crypto.createHash('sha256')

  // 인증 로직
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}
```

### 🔄 New: unauthorized/forbidden API

```typescript
// app/api/admin/route.ts
import { unauthorized, forbidden } from 'next/server'

export async function GET(request: Request) {
  const session = await getSession(request)

  // 🔄 새로운 unauthorized 함수
  if (!session) {
    return unauthorized()
  }

  // 🔄 새로운 forbidden 함수
  if (!session.user.isAdmin) {
    return forbidden()
  }

  const data = await getAdminData()
  return Response.json(data)
}
```

## 🔄 New Features 활용

### Route Groups 고급 패턴

```typescript
// ✅ Route Groups로 레이아웃 분리
app/
├── (marketing)/
│   ├── layout.tsx     // 마케팅 레이아웃
│   ├── page.tsx       // 홈페이지
│   └── about/
│       └── page.tsx   // 소개 페이지
├── (dashboard)/
│   ├── layout.tsx     // 대시보드 레이아웃
│   └── analytics/
│       └── page.tsx   // 분석 페이지
└── (auth)/
    ├── login/
    │   └── page.tsx
    └── register/
        └── page.tsx

// (marketing)/layout.tsx
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="marketing-layout">
      <MarketingHeader />
      {children}
      <MarketingFooter />
    </div>
  )
}
```

### Parallel Routes 활용

```typescript
// ✅ Parallel Routes로 동시 렌더링
app/
├── dashboard/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── @analytics/
│   │   └── page.tsx
│   └── @notifications/
│       └── page.tsx

// dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  notifications,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  notifications: React.ReactNode
}) {
  return (
    <div className="dashboard-grid">
      <main>{children}</main>
      <aside className="analytics-panel">
        <Suspense fallback={<AnalyticsSkeleton />}>
          {analytics}
        </Suspense>
      </aside>
      <div className="notifications-panel">
        <Suspense fallback={<NotificationsSkeleton />}>
          {notifications}
        </Suspense>
      </div>
    </div>
  )
}
```

### Intercepting Routes

```typescript
// ✅ Intercepting Routes로 모달 구현
app/
├── gallery/
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx    // 전체 페이지 보기
└── @modal/
    └── (.)gallery/
        └── [id]/
            └── page.tsx // 모달 보기

// @modal/(.)gallery/[id]/page.tsx
import { Modal } from '@/components/modal'

export default async function PhotoModal({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const photo = await getPhoto(id)

  return (
    <Modal>
      <img src={photo.url} alt={photo.title} />
    </Modal>
  )
}
```

## ❌ 금지 사항

### Pages Router 사용 금지

```typescript
// ❌ 절대 금지: Pages Router 패턴
pages/
├── _app.tsx
├── _document.tsx
├── index.tsx
└── api/
    └── users.ts

// ❌ 금지: getServerSideProps, getStaticProps 사용
export async function getServerSideProps() {
  // 이 방식은 사용하지 마세요
}
```

### 안티패턴 방지

```typescript
// ❌ 금지: 불필요한 'use client' 사용
'use client'

export default function SimpleComponent({ title }: { title: string }) {
  // 상태나 이벤트 핸들러가 없는데 'use client' 사용
  return <h1>{title}</h1>
}

// ✅ 올바른 방법: Server Component로 유지
export default function SimpleComponent({ title }: { title: string }) {
  return <h1>{title}</h1>
}

// ❌ 금지: 클라이언트에서 서버 함수 직접 호출
'use client'

import { getUser } from '@/lib/database' // 서버 전용 함수

export function UserProfile() {
  const user = getUser() // 에러 발생
  return <div>{user.name}</div>
}

// ✅ 올바른 방법: 서버에서 데이터 전달
export default async function UserPage() {
  const user = await getUser()
  return <UserProfile user={user} />
}

function UserProfile({ user }: { user: User }) {
  return <div>{user.name}</div>
}
```

## 코드 품질 체크리스트

개발 완료 후 다음 명령어들을 반드시 실행하세요:

```bash
# 🚀 필수: 타입 체크
npm run typecheck

# 🚀 필수: 린트 검사
npm run lint

# ✅ 권장: 포맷 검사
npm run format:check

# 🚀 필수: 통합 검사
npm run check-all

# 🚀 필수: 빌드 테스트
npm run build
```

이 지침을 따라 Next.js 16.2.2의 모든 기능을 최대한 활용하여 현대적이고 성능 최적화된 애플리케이션을 개발하세요.

---

## 🆕 Next.js 16 핵심 신기능

### 1. `cacheComponents` — PPR + useCache + dynamicIO 통합

Next.js 15 canary의 `experimental.ppr` 플래그가 **`cacheComponents` 단일 옵션으로 통합**되었습니다.

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ✅ Partial Prerendering + useCache + dynamicIO 동시 활성화
  cacheComponents: true,
}

export default nextConfig
```

**동작 방식**:

- 정적인 부분은 빌드 타임에 미리 렌더링
- 동적인 부분은 `<Suspense>` 경계 안에서 스트리밍
- `'use cache'` 디렉티브로 함수/컴포넌트 단위 캐싱 가능

```typescript
// ✅ 'use cache' 디렉티브 활용
async function getCachedQuotes(userId: string) {
  'use cache'
  return await db.quotes.findMany({ where: { userId } })
}

export default async function DashboardPage() {
  return (
    <div>
      {/* 캐싱된 정적 부분 */}
      <DashboardHeader />

      {/* 동적 부분은 Suspense로 분리 */}
      <Suspense fallback={<QuotesSkeleton />}>
        <QuotesList />
      </Suspense>
    </div>
  )
}
```

### 2. `connection()` — 런타임 환경변수 보장

빌드 타임에 환경변수가 번들링되는 것을 방지하여, Vercel 등에서 **런타임 시점에 환경변수를 읽도록** 강제합니다.

```typescript
import { connection } from 'next/server'

export default async function Page() {
  // 🔄 이 호출 이후의 코드는 항상 런타임에 실행됨
  await connection()

  // ✅ 런타임에 환경변수 안전하게 접근
  const config = process.env.RUNTIME_CONFIG
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY

  return <ConfigDisplay config={config} />
}
```

**활용 시점**:

- 시크릿 키, API 토큰 등 민감 정보
- 환경별로 달라지는 설정값
- Vercel 환경변수 (Preview/Production 분리)

### 3. `PageProps` 헬퍼 — 타입 안전한 라우트 props

`npx next typegen`을 통해 라우트별로 자동 생성된 타입 헬퍼를 사용할 수 있습니다.

```typescript
// ✅ 라우트 경로 기반 자동 타입 추론
export default async function Page(props: PageProps<'/quote/[token]'>) {
  const { token } = await props.params // ← 자동으로 { token: string } 타입
  const search = await props.searchParams

  return <QuoteViewer token={token} />
}
```

**기존 방식과 비교**:

```typescript
// ❌ 기존: 수동으로 타입 작성
export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
}

// ✅ Next.js 16: typegen 활용
export default async function Page(props: PageProps<'/quote/[token]'>) {
  const { token } = await props.params
}
```

### 4. Turbopack 안정화 (`build` 포함)

Next.js 15에서 `dev`만 안정화되었던 Turbopack이 **16에서는 `build`까지 안정 버전으로 승격**되었습니다.

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start"
  }
}
```

빌드 시간 **최대 5배 단축** (기존 webpack 대비).

### 5. Node.js 런타임 정책 변경

- **최소 Node.js: 20.9.0+** (Node 18 미지원)
- **최소 TypeScript: 5.1.0+**
- **브라우저 지원**: Chrome/Edge/Firefox 111+, Safari 16.4+

```bash
# 업그레이드 전 Node 버전 확인
node --version  # v20.9.0 이상이어야 함
```

### 6. 비동기 미들웨어 정식화

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ✅ Next.js 16: 비동기 미들웨어 권장
export async function middleware(request: NextRequest) {
  // Supabase 세션 검증 등 비동기 작업 자연스럽게 처리
  const session = await getSession(request)

  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

---

## 📦 Next.js 15 → 16 마이그레이션 체크리스트

업그레이드 시 확인할 항목:

- [ ] **Node 20.9+** 설치 확인 (`node --version`)
- [ ] **TypeScript 5.1+** 설치 확인 (`tsc --version`)
- [ ] `next` 및 `eslint-config-next` 버전을 `16.2.2`로 업데이트
- [ ] `experimental.ppr` 사용 중이면 `cacheComponents: true`로 변경
- [ ] `cookies()`, `headers()` → `await cookies()`, `await headers()` (codemod 활용)
- [ ] `params`, `searchParams` 모두 Promise 타입으로 변경
- [ ] `npm run build` 성공 확인

**자동 마이그레이션 명령**:

```bash
# 공식 codemod로 한 번에 마이그레이션
npx @next/codemod@latest upgrade latest

# 비동기 API만 변환
npx @next/codemod@latest next-async-request-api .
```

---

## 🔗 참조

- Next.js 16 업그레이드 가이드: https://nextjs.org/docs/app/guides/upgrading/version-16
- 공식 Codemod 목록: https://nextjs.org/docs/app/guides/upgrading/codemods
- cacheComponents API: https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents
