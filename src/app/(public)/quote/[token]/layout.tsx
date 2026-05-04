export default function QuoteViewerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-background min-h-screen print:bg-white">
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8 print:px-0 print:py-0">
        {children}
      </main>
    </div>
  )
}
