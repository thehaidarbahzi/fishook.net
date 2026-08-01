import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-gutter">
      <p className="font-display text-display font-black text-primary">
        404
      </p>
      <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">
        Halaman tidak ditemukan
      </h1>
      <p className="max-w-xs text-center font-body-md text-on-surface-variant">
        Route yang Anda akses tidak tersedia atau sudah dipindahkan.
      </p>
      <Button variant="outline" render={<Link to="/" />}>
        Back to Dashboard
      </Button>
    </main>
  )
}

export default NotFound
