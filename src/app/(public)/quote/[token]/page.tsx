import { Metadata } from 'next'

interface QuoteViewerPageProps {
  params: Promise<{ token: string }>
}

export async function generateMetadata({
  params,
}: QuoteViewerPageProps): Promise<Metadata> {
  const { token } = await params
  return {
    title: `견적서 - QuoteSync`,
    description: `공유된 견적서를 확인하세요 (토큰: ${token})`,
  }
}

// TODO: 공유 토큰 유효성 검사 구현 (만료/비활성화 처리)
// TODO: 노션 데이터 기반 견적서 렌더링 (F004) 구현
// TODO: PDF 다운로드 기능 (F005) 구현
export default async function QuoteViewerPage({
  params,
}: QuoteViewerPageProps) {
  const { token } = await params

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">견적서 뷰어</h1>
      <p className="text-muted-foreground mt-2">
        토큰: <code className="font-mono text-sm">{token}</code>
      </p>
      <p className="text-muted-foreground mt-1">준비 중입니다.</p>
    </div>
  )
}
