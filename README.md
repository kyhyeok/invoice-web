# QuoteSync

노션에서 작성한 견적서를 클라이언트에게 깔끔한 웹 뷰어와 PDF로 손쉽게 공유하는 서비스입니다.

## 프로젝트 개요

**목적**: 프리랜서·에이전시가 노션에서 작성한 견적서를 클라이언트에게 깔끔한 웹 뷰어와 PDF로 손쉽게 공유할 수 있게 한다

**사용자**:

- 운영자: 노션으로 견적서를 작성하는 프리랜서, 디자이너, 에이전시 운영자
- 클라이언트: 링크로 견적서를 받아 확인하는 클라이언트

## 주요 페이지

| 경로                  | 페이지      | 설명                                          |
| --------------------- | ----------- | --------------------------------------------- |
| `/`                   | 랜딩 페이지 | 서비스 소개 및 로그인/회원가입 진입점         |
| `/login`              | 로그인      | 이메일/비밀번호 인증                          |
| `/signup`             | 회원가입    | 신규 운영자 계정 생성                         |
| `/dashboard`          | 대시보드    | 견적서 목록 조회 및 공유 링크 생성·관리       |
| `/notion-integration` | 노션 연동   | Integration Token 등록·수정·해제              |
| `/quote/[token]`      | 견적서 뷰어 | 클라이언트용 공개 견적서 뷰어 및 PDF 다운로드 |

## 핵심 기능

- **노션 연동 (F001)**: Integration Token으로 노션 워크스페이스 연결
- **견적서 목록 (F002)**: 연동된 노션 데이터베이스에서 견적서 목록 조회
- **공유 링크 생성 (F003)**: 견적서별 고유 토큰 기반 공유 URL 생성 (만료 일시 옵션)
- **견적서 웹 뷰어 (F004)**: 공유 링크로 접속 시 브랜드 친화적 레이아웃으로 렌더링
- **PDF 다운로드 (F005)**: 웹 뷰어를 PDF 파일로 변환하여 저장
- **기본 인증 (F010)**: 이메일·비밀번호 회원가입/로그인/로그아웃

## 기술 스택

- **Framework**: Next.js 16.2.2 (App Router + Turbopack)
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5
- **Styling**: TailwindCSS v4
- **UI Components**: shadcn/ui (new-york style) + Radix UI + Lucide React
- **Forms**: React Hook Form + Zod
- **Auth & DB**: Supabase (PostgreSQL + Row Level Security)
- **Notion API**: @notionhq/client
- **PDF**: Puppeteer 또는 react-pdf
- **Deploy**: Vercel

## 시작하기

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.local.example .env.local
# .env.local 파일을 열어 Supabase 정보를 채워주세요

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 전체 검사 (타입, 린트, 포맷)
npm run check-all
```

개발 서버는 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

## 개발 상태

- [x] 기본 프로젝트 구조 설정 (Next.js 16.2.2 + TypeScript + TailwindCSS v4 + shadcn/ui)
- [x] 랜딩 페이지 스캐폴딩
- [x] 로그인 / 회원가입 페이지 스캐폴딩
- [x] 대시보드 페이지 스캐폴딩
- [x] 노션 연동 페이지 스캐폴딩
- [x] 견적서 뷰어 페이지 스캐폴딩
- [ ] Supabase 인증 연동 (F010)
- [ ] 노션 Integration Token 연동 (F001)
- [ ] 견적서 목록 조회 (F002)
- [ ] 공유 링크 생성 (F003)
- [ ] 견적서 웹 뷰어 (F004)
- [ ] PDF 다운로드 (F005)

## 문서

- [PRD 문서](./docs/PRD.md) - 상세 프로젝트 요구사항
- [개발 로드맵](./docs/ROADMAP.md) - 개발 계획
- [개발 가이드](./CLAUDE.md) - AI 개발 지침
