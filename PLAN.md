# Rencana Implementasi Frontend — Person A

## A. Struktur Folder Project


```

fishook/
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn UI components (generated)
│   │   ├── layout/
│   │   │   └── DashboardLayout.tsx
│   │   ├── log/
│   │   │   ├── LogList.tsx
│   │   │   └── LogItem.tsx
│   │   ├── detail/
│   │   │   ├── RequestDetail.tsx
│   │   │   ├── JsonViewer.tsx
│   │   │   └── HeadersTable.tsx
│   │   ├── webhook/
│   │   │   └── WebhookUrlCard.tsx
│   │   └── shared/
│   │       ├── CopyButton.tsx
│   │       ├── MethodBadge.tsx
│   │       └── EmptyState.tsx
│   ├── hooks/
│   │   ├── useSession.ts
│   │   └── useWebSocket.ts
│   ├── stores/
│   │   ├── sessionStore.ts
│   │   └── logsStore.ts
│   ├── lib/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx
│   └── main.tsx
├── components.json          # Shadcn config
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── vite.config.ts
├── package.json
└── progress.txt

```

## B. Breakdown Task (atomic)

| # | Task | Kategori | Dependencies | Note / Backend Alignment |
|---|------|----------|-------------|--------------------------|
| 1 | Init project Vite + React + TypeScript | Setup | — | Completed |
| 2 | Setup Tailwind CSS + konfigurasi | Setup | 1 | Completed |
| 3 | Init Shadcn UI + komponen (button, card, sheet, badge, scroll-area, skeleton, toast, separator, tabs) | Setup | 2 | Completed |
| 4 | Setup react-router-dom + routing structure (/, /*) | Setup | 1 | ✅ Done | — |
| 5 | Install dependencies tambahan (zustand, @microlink/react-json-view, lucide-react, clsx, tailwind-merge) | Setup | 1 | ✅ Done — `zustand@5.0.14`, `@microlink/react-json-view@1.31.25` (clsx/lucide-react/tailwind-merge sudah ada); build verified |
| 6 | Buat tipe data TypeScript (`types/index.ts`) | Core | — | ✅ Done — 5 tipe (HttpMethod, Session, WebhookLog, ApiError, WebSocketStatus); WS kirim WebhookLog polos via `?webhook_id=` |
| 7 | Buat API client dengan credentials include (`lib/api.ts`) | Core | 6 | ✅ Done — Base URL `http://localhost:3000` & `credentials: 'include'` |
| 8 | Buat Zustand store untuk session (`stores/sessionStore.ts`) | Core | 6, 7 | ✅ Done — Menyimpan `token`, `webhookId`, `webhookUrl`, `expiresAt` |
| 9 | Buat Zustand store untuk logs (`stores/logsStore.ts`) | Core | 6 | ✅ Done — Menyimpan array `WebhookLog` |
| 10 | Buat `useSession` hook — fetch `/api/v1/session/me`, handle loading/error/expired | Core | 8 | ✅ Done — Sesuaikan endpoint Express |
| 11 | Buat `useWebSocket` hook — koneksi Native WS (`ws://localhost:3000`), auto-reconnect | Core | 8, 9 | ✅ Done — Stream event `wsServer.broadcast` |
| 12 | Buat komponen `EmptyState` | Shared | — | ✅ Done — Generic (icon/title/description/action), default `Inbox`; build & lint verified |
| 13 | Buat komponen `CopyButton` dengan toast feedback | Shared | 5 | ✅ Done — clipboard API + fallback execCommand, toast sonner, ikon swap; `<Toaster />` di-mount; build & lint verified |
| 14 | Buat komponen `MethodBadge` (warna per HTTP method) | Shared | 6 | ✅ Done — `Record<HttpMethod,string>` (GET green, POST sky, PUT amber, DELETE red, PATCH violet), pakai `Badge outline`, type-safe |
| 15 | Buat komponen `WebhookUrlCard` — tampilkan URL + copy button | Feature | 13, 14 | ✅ Done — Menerima `webhookUrl` & `expiresAt` dari backend (di-parent `DashboardLayout`); helper `formatTimeRemaining`; update live 60s; state loading/error+retry |
| 16 | Buat `LogList` + `LogItem` — sidebar daftar request | Feature | 9, 14 | ✅ Done — `LogList` (header + Clear All 2-step confirm + ScrollArea + EmptyState), `LogItem` (button, selected/regular, badge+time+webhookId+body preview); helper `formatLogTime` & `summarizeBody` |
| 17 | Buat `HeadersTable` — tampilkan key-value headers | Feature | — | ✅ Done — tabel pure (props `headers` dari `RequestDetail`), styling `stitch/code.html:278-310`; empty/null → `EmptyState` |
| 18 | Buat `JsonViewer` — wrapper @microlink/react-json-view dengan copy per node | Feature | 5 | Menampilkan property `body` |
| 19 | Buat `RequestDetail` — tabs Body/Headers/Query, integrasi JsonViewer | Feature | 17, 18 | Tabs: Body (`body`), Headers (`headers`), Query (`queryParams`) |
| 20 | Buat `DashboardLayout` — sidebar + main panel + header | Feature | 15, 16, 19 | — |
| 21 | Buat halaman `Dashboard` — integrasi session + layout + WS | Page | 10, 11, 20 | Entry point utama aplikasi |
| 22 | Buat halaman `NotFound` | Page | 4 | — |
| 23 | Setup `App.tsx` + routing + global error boundary | Integration | 21, 22 | — |
| 24 | Responsive layout — sidebar collapse di mobile, Sheet utk detail | Polish | 20 | — |
| 25 | loading/empty/error state review seluruh komponen | Polish | 23 | — |
| 26 | Init `progress.txt` + catat semua yang sudah dikerjakan | Docs | — | — |

## C. State Handling per Komponen

| Komponen | Loading | Empty | Error | Edge Case |
|----------|---------|-------|-------|-----------|
| `useSession` | Skeleton full page | Redirect/expired message | Retry button + toast | Cookie ditolak browser / Port Express mati |
| `useWebSocket` | "Connecting..." indicator | Menunggu event pertama | Reconnect toast + badge offline | WebSocket port mismatch |
| `LogList` | Skeleton list (5 item) | Ilustrasi + "No requests yet" | Retry button | >100 item → virtual scroll (deferred) |
| `RequestDetail` | Skeleton panel | "Select a request" / "No body" | Fallback text | Payload `body` >1MB → collapse all |
| `WebhookUrlCard` | Skeleton text | — | "Failed to load webhook URL" | Copy ke clipboard blocked browser |
| `JsonViewer` | — | "No JSON body" placeholder | Raw text fallback | Circular JSON, non-JSON body |

## D. Urutan Eksekusi (Dependency-Aware)


```

Fase 1 (Setup):    1 → 2 → 3 (Completed) → 4 (Completed) → 5 (Completed)
Fase 2 (Core):     6 (Completed) → 7 → 8 → 9 → 10 → 11
Fase 3 (Shared):   12 → 13 → 14
Fase 4 (Feature):  15 → 16 → 17 → 18 → 19
Fase 5 (Layout):   20 → 21 → 22 → 23
Fase 6 (Polish):   24 → 25
Fase 7 (Docs):     26

```

## E. Log Format (`progress.txt`)

Setiap task akan dicatat sesuai format log-skill:

## 2026-07-31

### Setup Project

* Created `package.json` - Init Vite + React + TypeScript
* Created `tailwind.config.js` - Setup Tailwind CSS
* Created `components.json` - Init Shadcn UI

### Core Layer (Express & Native WS Sync)

* Created `types/index.ts` - Tipe data TypeScript disesuaikan dengan schema Drizzle (body, headers, queryParams)
* Created `lib/api.ts` - Fetch client mengarah ke Express http://localhost:3000 dengan credentials include