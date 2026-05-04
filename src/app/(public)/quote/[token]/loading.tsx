import { Skeleton } from '@/components/ui/skeleton'

export default function QuoteViewerLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-1/2" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}
