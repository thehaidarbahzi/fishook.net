# Product Requirement Document (PRD)
## Project Name: Webhook Tester (Working Title: Fishook)
**Version:** 2.1 (Express.js, MySQL, Drizzle ORM & Native WebSockets Integration)

---

## 1. Overview & Objective
**Webhook Tester** adalah platform penerima *webhook* sementara yang dirancang untuk membantu *developer* menguji, menganalisis, dan men-debug request HTTP *real-time*. Fokus utama dari platform ini adalah menyediakan antarmuka pengguna (UI) yang ramah (*user-friendly*), responsif, serta mudah dibaca.

---

## 2. Core Features & Functional Requirements

### 2.1 Authentication & User Tokenization
* **Automatic Session Handshake:**
  * Pengguna yang mengakses frontend React.js akan melakukan *fetch* ke `/api/v1/session/me` dengan membawa `credentials: 'include'`.
  * Jika cookie belum ada/invalid, `sessionMiddleware` Express akan meng-generate token unik pengguna dan mengeset cookie `HttpOnly`.
* **Token Structure:**
  * Kombinasi *Counter* + UUID v4 (contoh: `000042-9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d`).
* **Cookie Storage:** Token disimpan dalam bentuk `HttpOnly`, `SameSite=Lax`, dan `Secure` cookie demi keamanan.

### 2.2 Endpoint Management & Lifetime (Revocation)
* **Webhook ID Binding:** Setiap pengguna/token memiliki Webhook ID unik miliknya sendiri.
* **Automatic Expiration / Revocation:**
  * Masa berlaku (*TTL*) Webhook ID terikat secara langsung dengan waktu kadaluwarsa token/sesi pengguna (`expiresAt`).
  * Middleware `expirationCheck` di backend akan menolak request yang masuk ke Webhook ID yang sudah *expired*.

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
  * Penampilan detail HTTP Method (`POST`, `GET`, dll.), Headers, Query Params, dan Payload Body.

---

## 3. Tech Stack Architecture

* **Frontend:** React.js + Tailwind CSS + Shadcn UI
* **JSON Viewer:** `@microlink/react-json-view`
* **Backend:** Express.js + `cookie-parser` + `cors` (Node.js runtime via `tsx`)
* **Database:** MySQL 8.x + Drizzle ORM (`drizzle-kit`)
* **Real-time:** Native WebSockets (`ws`)

---

## 4. Database Schema Concept (MySQL via Drizzle)

### Table: `users_sessions`
* `id` VARCHAR(36) PRIMARY KEY -- UUID v4
* `token` VARCHAR(255) NOT NULL UNIQUE -- Format: Counter-UUID
* `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP
* `expiresAt` DATETIME NOT NULL

### Table: `webhooks`
* `id` VARCHAR(36) PRIMARY KEY -- UUID v4
* `sessionId` VARCHAR(36) FOREIGN KEY -> `users_sessions.id`
* `endpointSlug` VARCHAR(255) NOT NULL UNIQUE
* `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP
* `expiresAt` DATETIME NOT NULL
* `isActive` BOOLEAN DEFAULT TRUE

### Table: `webhook_logs`
* `id` BIGINT AUTO_INCREMENT PRIMARY KEY
* `webhookId` VARCHAR(36) FOREIGN KEY -> `webhooks.id`
* `method` VARCHAR(10) NOT NULL
* `headers` JSON NOT NULL
* `queryParams` JSON NOT NULL
* `body` JSON NOT NULL -- Menyimpan payload valid JSON
* `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP

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
│                                           [ Is Webhook Active? ]             │
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
                                                               │ (users_sessions,   │
                                                               │  webhooks, logs)   │
                                                               └────────────────────┘