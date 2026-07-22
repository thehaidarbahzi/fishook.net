# Product Requirement Document (PRD)
## Project Name: Webhook Tester (Working Title)

---

## 1. Overview & Objective
**Webhook Tester** adalah platform penerima *webhook* sementara yang dirancang untuk membantu *developer* menguji, menganalisis, dan men-debug request HTTP *real-time*. Fokus utama dari platform ini adalah menyediakan antarmuka pengguna (UI) yang ramah (*user-friendly*), responsif, serta mudah dibaca.

---

## 2. Core Features & Functional Requirements

### 2.1 Endpoint Management
* **Dynamic Endpoint Generation:** Menggenerasi URL unik secara acak menggunakan ID pendek (contoh: `app.domain.com/api/v1/listen/x7k9p2`).
* **Auto-Expiration (TTL):** Endpoint dan data log yang masuk akan tersimpan sementara di Redis dan otomatis terhapus setelah 24 jam.

### 2.2 Real-time Log Display
* **Instant Stream:** Menampilkan request yang masuk secara *real-time* tanpa perlu mereload halaman web.
* **Payload Inspection:** Menyajikan rincian request secara terstruktur:
  * HTTP Method (`POST`, `GET`, `PUT`, `DELETE`, dll.)
  * Request Headers
  * Query Parameters
  * Request Body / JSON Payload
* **Visualizer UI:**
  * Render JSON berbasis *Tree View* yang dapat di-*expand* dan *collapse*.
  * *Syntax Highlighting* (pewarnaan tipe data).
  * Fitur *One-click Copy* untuk menyalin bagian JSON tertentu.

### 2.3 Custom Response Simulator
* Pengguna dapat mengatur respons otomatis yang akan dikirimkan kembali ke pengirim *webhook*.
* Pengaturan mencakup:
  * HTTP Status Code (contoh: `200 OK`, `400 Bad Request`, `500 Internal Server Error`).
  * Custom Body Response (JSON/Text).
  * Delay response (opsional).

---

## 3. Tech Stack Architecture

* **Frontend:** Next.js (React), Tailwind CSS, Shadcn UI
* **JSON Visualizer:** `@microlink/react-json-view`
* **Response Editor:** `@monaco-editor/react`
* **Backend:** Node.js (Fastify Framework)
* **Real-time Engine:** Socket.io
* **Data Store / Cache:** Redis (In-memory storage dengan TTL 24 Jam)
* **ID Generator:** `nanoid`

---

## 4. System Flow & Architecture

```text
[ External Webhook Sender ]
            │
            ▼ (HTTP Request)
  [ Fastify Backend API ]
            │
    ┌───────┴───────┐
    │               │
    ▼               ▼
[ Redis Cache ]  [ Socket.io Server ]
 (TTL 24h Log)      │ (Real-time Event)
                    ▼
          [ Next.js Frontend UI ]
```
---
## 5. Scope & Task Allocation
### Person A - Frontend Specialist
- Setup Next.js, Tailwind CSS,dan Shadcn UI
- Laying out Dashboard (Sidebar list log & Main preview area).
- Integrasi @microlink/react-json-view untuk inspeksi data JSON.
- Integrasi socket.io-client untuk menerima update data instan.
- Integrasi Monaco Editor untuk konfigurasi Custom Response.

### Person B — Backend Specialist
- Setup Fastify Server & CORS configuration.
- Bikin endpoint generator menggunakan nanoid.
- Menangani pemrosesan HTTP Request masuk (headers, params, body).
- Integrasi Redis (ioredis) dengan sistem pengesetan TTL (24 jam).
- Setup Socket.io Server untuk push event log masuk ke room pengguna.
- Menangani fitur Custom Response Simulator.

---
## 6. Future Enhancements (Post-MVP)
- Fitur sistem akun (Autentikasi dengan PostgreSQL) untuk simpan endpoint permanen.
- Fitur Replay Request (Mengirim ulang payload ke URL server lain).
- Ekspor log ke file JSON / CSV.
---