# Product Requirement Document (PRD)
## Project Name: Webhook Tester (Working Title: Fishook)
**Version:** 2.2 (Express.js, MySQL, Drizzle ORM Schema Alignment & Native WebSockets Integration)

---

## 1. Overview & Objective
**Webhook Tester** adalah platform penerima *webhook* sementara yang dirancang untuk membantu *developer* menguji, menganalisis, dan men-debug request HTTP *real-time*. Fokus utama dari platform ini adalah menyediakan antarmuka pengguna (UI) yang ramah (*user-friendly*), responsif, serta mudah dibaca.

---

## 2. Core Features & Functional Requirements

### 2.1 Authentication & User Tokenization
* **Automatic Session Handshake:**
  * Pengguna yang mengakses frontend React.js akan melakukan *fetch* ke `/api/v1/session/me` dengan membawa `credentials: 'include'`.
  * Jika cookie belum ada/invalid, `sessionMiddleware` Express akan meng-generate token unik pengguna beserta `webhookId` unik dan mengeset cookie `HttpOnly`.
* **Token Structure:**
  * Kombinasi *Counter* + UUID v4 (contoh: `000042-9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d`).
* **Cookie Storage:** Token disimpan dalam bentuk `HttpOnly`, `SameSite=Lax`, dan `Secure` cookie demi keamanan.

### 2.2 Endpoint Management & Lifetime (Revocation)
* **Single Table Session & Webhook Binding:**
  * Setiap record di tabel `sessions` langsung memutus dependensi antar-tabel terpisah dengan menyimpan `webhook_id` secara langsung (1:1 relation embedded).
* **Automatic Expiration / Revocation:**
  * Masa berlaku (*TTL*) Webhook ID terikat secara langsung dengan waktu kadaluwarsa sesi pengguna (`expiresAt`).
  * Middleware `expirationCheck` di backend akan memeriksa `expiresAt` pada tabel `sessions` dan menolak request yang masuk ke `webhook_id` yang sudah *expired*.

### 2.3 Strict Request Validation
* **JSON Filter Middleware:**
  * Server dipasangi middleware `strictJsonCheck` yang memeriksa header `Content-Type: application/json` serta melakukan *parsing* isi request.
  * **Non-JSON Handling:** Jika request yang dikirimkan **bukan format JSON** atau *malformed JSON*, backend **langsung menolak** dengan HTTP Status `400 Bad Request`.
  * Data request non-JSON **TIDAK AKAN dicatat/disimpan** ke database MySQL demi efisiensi ruang penyimpanan.

### 2.4 Real-time Log & Visualizer UI
* **Instant Payload Streaming:** Request JSON yang valid akan langsung dibroadcast ke UI via Native WebSocket (`ws`) tanpa butuh *refresh* halaman.
* **Structured Payload Visualizer:**
  * Render JSON berbasis *Tree View* yang dapat di-*expand* dan *collapse*.
  * *Syntax Highlighting* pewarnaan tipe data.
  * Tombol *One-click Copy* untuk menyalin bagian JSON tertentu.
  * Penampilan detail HTTP Method (`POST`, `GET`, dll.), Headers (`headers`), Query Params (`queryParams`), dan Payload Body (`body`).

---

## 3. Tech Stack Architecture

* **Frontend:** React.js + Tailwind CSS + Shadcn UI
* **JSON Viewer:** `@microlink/react-json-view`
* **Backend:** Express.js + `cookie-parser` + `cors` (Node.js runtime via `tsx`)
* **Database:** MySQL 8.x + Drizzle ORM (`drizzle-kit`)
* **Real-time:** Native WebSockets (`ws`)

---

## 4. Database Schema Concept (MySQL via Drizzle ORM)

Sesuai dengan implementasi `schema.ts`, struktur database disederhanakan menjadi 2 tabel utama:

### Table: `sessions`
* `id`: INT AUTO_INCREMENT PRIMARY KEY (`serial("id")`)
* `token`: VARCHAR(255) NOT NULL (`varchar("token")`) — Format: Counter-UUID
* `webhookId`: VARCHAR(255) NOT NULL UNIQUE (`varchar("webhook_id")`) — Webhook endpoint slug unik
* `createdAt`: DATETIME NOT NULL (`datetime("created_at")`)
* `expiresAt`: DATETIME NOT NULL (`datetime("expires_at")`)

### Table: `webhook_logs`
* `id`: INT AUTO_INCREMENT PRIMARY KEY (`serial("id")`)
* `webhookId`: VARCHAR(255) NOT NULL (`varchar("webhook_id")`) — Relasi logika ke `sessions.webhookId`
* `method`: VARCHAR(10) NOT NULL (`varchar("method")`)
* `headers`: JSON (`json("headers")`) — Nullable JSON object
* `queryParams`: JSON (`json("query_params")`) — Nullable JSON object
* `body`: JSON (`json("body")`) — Nullable payload JSON
* `createdAt`: DATETIME NOT NULL (`datetime("created_at")`)

---

## 5. System Flow & Architecture

```text
               ┌──────────────────────────────────────────────┐
               │         Client Browser / User Interface      │
               │         (React.js + Tailwind UI + Vite)      │
               └───────┬──────────────────────────────▲───────┘
                       │                              │
 1. GET /session/me    │                              │ 5. Real-time Log Broadcast
    (with credentials) │                              │    (Native WebSocket `ws`)
                       ▼                              │
┌─────────────────────────────────────────────────────┴────────────────────────┐
│                             EXPRESS BACKEND ENGINE                           │
│                                                                              │
│   ┌────────────────────────┐      ┌──────────────────────────────────────┐   │
│   │   Session Middleware   │      │        Webhook Receiver API          │   │
│   │ (Generate Counter-UUID)│      │    (/api/v1/listen/:webhook_id)      │   │
│   └────────────────────────┘      └──────────────────┬───────────────────┘   │
│                                                      │                       │
│                                    2. Expiration Check (expirationCheck MW)  │
│                                                      ▼                       │
│                                            [ Is Webhook Active? ]            │
│                                            /                  \              │
│                                     (NO)  /                    \ (YES)       │
│                                          ▼                      ▼            │
│                                  [ Reject 410 ]      3. Strict JSON Check    │
│                                                      (strictJsonCheck MW)    │
│                                                          /            \      │
│                                                   (NO)  /              \(YES)│
│                                                        ▼                ▼    │
│                                                [ Reject 400 ]   4. Save Log  │
└─────────────────────────────────────────────────────────────────────────┬────┘
                                                                          │
                                                                          ▼
                                                               ┌────────────────────┐
                                                               │  MySQL DB (Drizzle)│
                                                               │ (sessions,         │
                                                               │  webhook_logs)     │
                                                               └────────────────────┘

```

---

## 6. Work Division

### Person A — Frontend Specialist (React.js)

* [x] Setup project React.js dengan Tailwind CSS & Shadcn UI.
* [ ] Implementasi manajemen Session/Cookie handshake dengan Express API (`GET /api/v1/session/me`).
* [ ] Laying out Dashboard (List Webhook, Sidebar Log, JSON Detail Preview).
* [ ] Integrasi `@microlink/react-json-view` untuk inspeksi data JSON.
* [ ] Integrasi Native WebSocket Client (`ws`) untuk pembaruan log secara real-time.

### Person B — Backend Specialist (Express.js)

* [x] Setup Express API Server & Koneksi Database MySQL (menggunakan Drizzle ORM + `mysql2`).
* [x] Implementasi Generator Token (Counter + UUID) & Cookie Session Middleware.
* [x] Implementasi Middleware Strict JSON Validation (`strictJsonCheck`) & Expiration Checker (`expirationCheck`).
* [x] Bikin endpoint listener `/api/v1/listen/:webhook_id` & fungsi saver log ke DB MySQL tabel `webhook_logs`.
* [x] Setup Engine WebSocket (`ws`) untuk push/broadcast log ke pengguna.

---

## 7. Future Enhancements (Post-MVP)

* Fitur sistem akun permanen (OAuth / Email Login).
* Fitur Replay Request (Mengirim ulang payload webhook yang masuk ke URL target lain).
* Ekspor log request ke dalam bentuk file JSON atau CSV.
* Custom Response Simulator (Mengatur HTTP status code & custom response body).

---

### Key Changes Summary:
1. **Penyederhanaan Tabel Database:** Menghapus tabel `webhooks` terpisah dari PRD versi sebelumnya, menyatukan `webhook_id` secara langsung di tabel `sessions` sesuai deklarasi Drizzle `export const sessions`.
2. **Kesesuaian Tipe Data:**
   - Primary key menggunakan `serial()` (INT Auto Increment).
   - Kolom JSON `headers`, `queryParams` (`query_params`), dan `body` bersifat nullable sesuai `schema.ts`.
   - Mengubah penamaan kolom pada deskripsi skema ke format camelCase/snake_case aktual (`webhookId`, `queryParams`, `createdAt`).
3. **Pembaruan Diagram Arsitektur & Deskripsi:** Mengubah referensi tabel database pada diagram dan alur kerja sistem menjadi `sessions` dan `webhook_logs`.