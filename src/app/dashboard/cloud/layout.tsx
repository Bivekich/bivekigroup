import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CloudLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container py-6 space-y-6">
      <Suspense fallback={<CloudSkeleton />}>{children}</Suspense>
    </div>
  );
}

function CloudSkeleton() {
  return (
    <>
      {/* Баланс и кнопки */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[140px]" />
          <Skeleton className="h-10 w-[140px]" />
        </div>
      </div>

      {/* Сервисы */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="relative bg-card rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-[100px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
