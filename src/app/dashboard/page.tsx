import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '대시보드 - QuoteSync',
  description: '견적서 목록을 확인하고 공유 링크를 관리하세요',
}

// TODO: 인증 미들웨어 설정 후 보호된 라우트로 처리
// TODO: 노션 견적서 목록 조회 (F002) 구현
// TODO: 공유 링크 생성 모달 (F003) 구현
// TODO: 공유 링크 관리 (F012) 구현
export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">대시보드</h1>
      <p className="text-muted-foreground mt-2">준비 중입니다.</p>
    </div>
  )
}
