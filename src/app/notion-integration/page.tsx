import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '노션 연동 - QuoteSync',
  description: '노션 Integration Token을 등록하고 워크스페이스를 연결하세요',
}

// TODO: 인증 미들웨어 설정 후 보호된 라우트로 처리
// TODO: 노션 Integration Token 등록 (F001) 구현
// TODO: 연동 상태 관리 (F011) 구현
export default function NotionIntegrationPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">노션 연동</h1>
      <p className="text-muted-foreground mt-2">준비 중입니다.</p>
    </div>
  )
}
