'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-foreground text-2xl font-bold">
          문제가 발생했습니다
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          요청을 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>
        {error.digest ? (
          <p className="text-muted-foreground mt-2 font-mono text-xs">
            오류 ID: {error.digest}
          </p>
        ) : null}
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={reset}>다시 시도</Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/')}
          >
            홈으로
          </Button>
        </div>
      </div>
    </div>
  )
}
