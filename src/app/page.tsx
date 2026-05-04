import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          QuoteSync
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          노션에서 작성한 견적서를 클라이언트에게 깔끔한 웹 뷰어와 PDF로 손쉽게
          공유하세요.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/login">
            <Button size="lg">시작하기</Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline">
              회원가입
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
