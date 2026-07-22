# Product Requirement Document (PRD)
## Project Name: Webhook Tester (Working Title)
**Version:** 2.0 (Updated Stack & Strict Validation Flow)

---

## 1. Overview & Objective
**Webhook Tester** adalah platform penerima *webhook* sementara yang dirancang untuk membantu *developer* menguji, menganalisis, dan men-debug request HTTP *real-time*. Fokus utama dari platform ini adalah menyediakan antarmuka pengguna (UI) yang ramah (*user-friendly*), responsif, serta mudah dibaca.

---

## 2. Core Features & Functional Requirements

### 2.1 Authentication & User Tokenization
* **Automatic Session Handshake:**
  * Pengguna yang mengakses frontend React.js akan diperiksa ketersediaan *cookie* sesi miliknya.
  * Jika *cookie* belum ada, server backend akan meng-generate token unik pengguna.
* **Token Structure:**
  * Kombinasi *Counter* + UUID v4 (contoh: `000042-9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d`) untuk memastikan kemudahan pengindeksan serta keterurutan tanpa risiko bentrok (*collision*).
* **Cookie Storage:** Token disimpan dalam bentuk `HttpOnly`, `SameSite=Lax`, dan `Secure` *cookie* demi keamanan terhadap serangan XSS.

### 2.2 Endpoint Management & Lifetime (Revocation)
* **Webhook ID Binding:** Setiap pengguna/token memiliki Webhook ID unik miliknya sendiri.
* **Automatic Expiration / Revocation:**
  * Masa berlaku (*TTL*) Webhook ID terikat secara langsung dengan waktu kadaluwarsa token/sesi pengguna (`expires_at`).
  * Backend akan mencabut (*revoke*) akses secara otomatis: jika request masuk ke Webhook ID yang sudah *expired*, backend langsung menolak request.

### 2.3 Strict Request Validation
* **JSON Filter Middleware:**
  * Server memeriksa header `Content-Type: application/json` serta melakukan *parsing* isi request.
  * **Non-JSON Handling:** Jika request yang dikirimkan **bukan format JSON** atau *malformed JSON*, backend **langsung menolak** dengan HTTP Status `400 Bad Request`.
  * Data request non-JSON **TIDAK AKAN dicatat/disimpan** ke database PostgreSQL demi efisiensi ruang penyimpanan.

### 2.4 Real-time Log & Visualizer UI
* **Instant Payload Streaming:** Request JSON yang valid akan langsung diteruskan ke UI via WebSocket/SSE tanpa butuh *refresh* halaman.
* **Structured Payload Visualizer:**
  * Render JSON berbasis *Tree View* yang dapat di-*expand* dan *collapse*.
  * *Syntax Highlighting* pewarnaan tipe data.
  * Tombol *One-click Copy* untuk menyalin bagian JSON tertentu.
  * Penampilan detail HTTP Method (`POST`, `GET`, dll.), Headers, Query Params, dan Payload Body.

---

## 3. Tech Stack Architecture

* **Frontend:** React.js + Tailwind CSS + Shadcn UI
* **JSON Viewer:** `@microlink/react-json-view`
* **Backend:** Hono Framework (Node.js / Bun runtime)
* **Database:** PostgreSQL (Primary Store & Session Logs)
* **Real-time:** WebSockets / SSE (Server-Sent Events)

---

## 4. System Flow & Architecture

```text
               ┌──────────────────────────────────────────────┐
               │         Client Browser / User Interface      │
               │            (React.js + Tailwind UI)          │
               └───────┬──────────────────────────────▲───────┘
                       │                              │
     1. Init Session / │                              │ 5. Real-time Log
     Get Token Cookie  │                              │    (WebSocket / SSE)
                       ▼                              │
┌─────────────────────────────────────────────────────┴────────────────────────┐
│                             HONO BACKEND ENGINE                              │
│                                                                              │
│   ┌────────────────────────┐      ┌──────────────────────────────────────┐   │
│   │  Session & Cookie MW   │      │        Webhook Receiver API          │   │
│   │ (Generate Counter-UUID)│      │    (/api/v1/listen/:webhook_id)      │   │
│   └────────────────────────┘      └──────────────────┬───────────────────┘   │
│                                                      │                       │
│                                    2. Expiration Check (NOW() < expires_at)  │
│                                                      ▼                       │
│                                           [ Is Webhook Active? ]             │
│                                            /                  \              │
│                                     (NO)  /                    \ (YES)       │
│                                          ▼                      ▼            │
│                                  [ Reject 410 ]      3. Strict JSON Check    │
│                                                          /            \      │
│                                                   (NO)  /              \(YES)│
│                                                        ▼                ▼    │
│                                                [ Reject 400 ]   4. Save Log  │
└─────────────────────────────────────────────────────────────────────────┬────┘
                                                                          │
                                                                          ▼
                                                               ┌────────────────────┐
                                                               │  PostgreSQL DB     │
                                                               │ (Users, Webhooks,  │
                                                               │  JSON Logs)        │
                                                               └────────────────────┘
```
---
## 5. Work Division
### Person A — Frontend Specialist (React.js)
- [ ] Setup project React.js dengan Tailwind CSS & Shadcn UI.
- [ ] Implementasi manajemen Session/Cookie handshake dengan Hono API.
- [ ] Laying out Dashboard (List Webhook, Sidebar Log, JSON Detail Preview).
- [ ] Integrasi @microlink/react-json-view untuk inspeksi data JSON.
- [ ] Integrasi WebSocket/SSE Client untuk pembaruan log secara real-time.

### Person B — Backend Specialist (Hono Framework)
- [ ] Setup Hono API Server & Koneksi Database PostgreSQL (menggunakan Prisma / Drizzle ORM).
- [ ] Implementasi Generator Token (Counter + UUID) & Cookie Session Middleware.
- [ ] Implementasi Middleware Strict JSON Validation & Expiration Checker (NOW() < expires_at).
- [ ] Bikin endpoint listener /api/v1/listen/:webhook_id & fungsi saver log ke DB PostgreSQL.
- [ ] Setup Engine WebSocket / SSE Server untuk push log ke pengguna.

---
## 6. Future Enhancements (Post-MVP)
- Fitur sistem akun permanen (OAuth / Email Login).
- Fitur Replay Request (Mengirim ulang payload webhook yang masuk ke URL target lain).
- Ekspor log request ke dalam bentuk file JSON atau CSV.
- Custom Response Simulator (Mengatur HTTP status code & custom response body).
---