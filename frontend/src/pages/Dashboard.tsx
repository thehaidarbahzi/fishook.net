import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function Dashboard() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-gutter">
      <Badge variant="secondary" className="font-label-caps uppercase">
        Fishook / Webhook Tester
      </Badge>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-headline-sm text-headline-sm">
            Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-stack-md">
          <p className="font-body-md text-on-surface-variant">
            Landing view — request log & payload visualizer akan ditampilkan di
            sini.
          </p>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-full rounded-lg" />
            <Skeleton className="h-6 w-3/4 rounded-lg" />
            <Skeleton className="h-6 w-1/2 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default Dashboard
