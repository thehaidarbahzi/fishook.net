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

| # | Task | Kategori | Dependencies |
|---|------|----------|-------------|
| 1 | Init project Vite + React + TypeScript | Setup | — |
| 2 | Setup Tailwind CSS + konfigurasi | Setup | 1 |
| 3 | Init Shadcn UI + komponen (button, card, sheet, badge, scroll-area, skeleton, toast, separator, tabs) | Setup | 2 |
| 4 | Setup react-router-dom + routing structure (/, /*) | Setup | 1 |
| 5 | Install dependencies tambahan (zustand, @microlink/react-json-view, lucide-react, clsx, tailwind-merge) | Setup | 1 |
| 6 | Buat tipe data TypeScript (`types/index.ts`) | Core | — |
| 7 | Buat API client dengan credentials include (`lib/api.ts`) | Core | 6 |
| 8 | Buat Zustand store untuk session (`stores/sessionStore.ts`) | Core | 6, 7 |
| 9 | Buat Zustand store untuk logs (`stores/logsStore.ts`) | Core | 6 |
| 10 | Buat `useSession` hook — fetch session on mount, handle loading/error/expired | Core | 8 |
| 11 | Buat `useWebSocket` hook — koneksi WS, auto-reconnect, handle loading/error | Core | 8, 9 |
| 12 | Buat komponen `EmptyState` | Shared | — |
| 13 | Buat komponen `CopyButton` dengan toast feedback | Shared | 5 |
| 14 | Buat komponen `MethodBadge` (warna per HTTP method) | Shared | — |
| 15 | Buat komponen `WebhookUrlCard` — tampilkan URL + copy button | Feature | 13, 14 |
| 16 | Buat `LogList` + `LogItem` — sidebar daftar request | Feature | 9, 14 |
| 17 | Buat `HeadersTable` — tampilkan key-value headers | Feature | — |
| 18 | Buat `JsonViewer` — wrapper @microlink/react-json-view dengan copy per node | Feature | 5 |
| 19 | Buat `RequestDetail` — tabs Body/Headers/Query, integrasi JsonViewer | Feature | 17, 18 |
| 20 | Buat `DashboardLayout` — sidebar + main panel + header | Feature | 15, 16, 19 |
| 21 | Buat halaman `Dashboard` — integrasi session + layout + WS | Page | 10, 11, 20 |
| 22 | Buat halaman `NotFound` | Page | 4 |
| 23 | Setup `App.tsx` + routing + global error boundary | Integration | 21, 22 |
| 24 | Responsive layout — sidebar collapse di mobile, Sheet utk detail | Polish | 20 |
| 25 | loading/empty/error state review seluruh komponen | Polish | 23 |
| 26 | Init `progress.txt` + catat semua yang sudah dikerjakan | Docs | — |

## C. State Handling per Komponen

| Komponen | Loading | Empty | Error | Edge Case |
|----------|---------|-------|-------|-----------|
| `useSession` | Skeleton full page | Redirect/expired message | Retry button + toast | Cookie ditolak browser |
| `useWebSocket` | "Connecting..." indicator | Menunggu event pertama | Reconnect toast + badge offline | Koneksi drop tiba-tiba |
| `LogList` | Skeleton list (5 item) | Ilustrasi + "No requests yet" | Retry button | >100 item → virtual scroll (deferred) |
| `RequestDetail` | Skeleton panel | "Select a request" / "No body" | Fallback text | JSON >1MB → collapse all |
| `WebhookUrlCard` | Skeleton text | — | "Failed to load webhook URL" | Copy ke clipboard blocked |
| `JsonViewer` | — | "No JSON body" placeholder | Raw text fallback | Circular JSON, non-JSON body |

## D. Urutan Eksekusi (Dependency-Aware)

```
Fase 1 (Setup):    1 → 2 → 3 → 4 → 5
Fase 2 (Core):     6 → 7 → 8 → 9 → 10 → 11
Fase 3 (Shared):   12 → 13 → 14
Fase 4 (Feature):  15 → 16 → 17 → 18 → 19
Fase 5 (Layout):   20 → 21 → 22 → 23
Fase 6 (Polish):   24 → 25
Fase 7 (Docs):     26
```

## E. Log Format (`progress.txt`)

Setiap task akan dicatat sesuai format log-skill:

```
## 2026-07-23

### Setup Project
- Created `package.json` - Init Vite + React + TypeScript
- Created `tailwind.config.js` - Setup Tailwind CSS
- ...

### Core Layer
- Created `types/index.ts` - Tipe data TypeScript
- Created `lib/api.ts` - API client dengan credentials include
- ...
```
