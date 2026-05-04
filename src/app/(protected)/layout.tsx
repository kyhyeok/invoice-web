import { Header } from '@/components/layout/header'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO: Phase 3 Task 009에서 supabase.auth.getUser() 가드 추가
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  )
}
