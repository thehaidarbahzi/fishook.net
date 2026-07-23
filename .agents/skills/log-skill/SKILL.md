---
name: log-skill
description: Berikan log yang sudah dikerjakan
license: MIT
compatibility: opencode
metadata:
  audience: maintainers
---

## What I do

- Tambahkan log yang sudah dikerjakan di file progress.txt

## When to use me

- Setelah selesai membuat file, refactor, menjalankan task, atau memperbaiki bug
- Setiap kali ada perubahan kode

## How I do it

1. Read `progress.txt` untuk melihat log terakhir
2. Append entry baru di bagian bawah file
3. Group berdasarkan tanggal, gunakan bullet points
4. Format: aksi (`Modified`, `Created`, `Fixed`, `Deleted`) + nama file + deskripsi

## Log Format

```
## 2026-07-21

### Kategori Task
- Modified `components/TodoList.tsx` - Tambah font size text-lg
- Created `components/Header.tsx` - Komponen header baru
- Fixed bug di `app/page.tsx` - Perbaiki hydration error
- Fixed `ModuleNotFoundError` in `Task 2.1` - Medium - 8 min
```

**PENTING:** Selalu append, jangan overwrite file yang sudah ada