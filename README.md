# Monitoring Feeder Kota

Aplikasi web pemantauan rute dan jadwal transportasi publik (Feeder Kota). Dibangun menggunakan **React (Vite)** dan **Laravel 10/11**, serta dirancang agar siap di-deploy ke **Amazon ECS** dengan integrasi AWS S3, CloudFront, dan RDS.

## Struktur Proyek

- `/frontend`: Aplikasi React (SPA).
- `/backend`: API menggunakan Laravel.
- `docker-compose.yml`: Lingkungan pengembangan lokal.

## Persyaratan
- Docker & Docker Compose
- Node.js (hanya jika ingin menjalankan frontend tanpa docker di lokal)

## Menjalankan Proyek Secara Lokal

1. Salin `.env.example` menjadi `.env` di direktori `backend` dan sesuaikan nilainya (kredensial database dll).
2. Salin `.env.example` menjadi `.env` di direktori `frontend` (jika ada) dan arahkan `VITE_API_URL` ke `http://localhost:8000/api`.
3. Jalankan container:
   ```bash
   docker-compose up -d --build
   ```
4. Akses aplikasi:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## Deploy ke AWS ECS

Proyek ini telah menyediakan file `Dockerfile` masing-masing untuk *Frontend* dan *Backend* yang dioptimalkan untuk di-deploy sebagai layanan Amazon ECS yang terpisah.

1. **Backend**: Build dari `backend/Dockerfile`. Pastikan environment variable AWS (RDS, S3, CloudFront) telah disetup di task definition ECS.
2. **Frontend**: Build dari `frontend/Dockerfile` yang mana berupa static asset yang di-serve via Nginx.

## Integrasi AWS S3 dan CloudFront

Laravel telah dikonfigurasi untuk menggunakan S3 disk (menggunakan library `league/flysystem-aws-s3-v3`). 
Gunakan key `.env`:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_DEFAULT_REGION`
- `AWS_BUCKET`
- `AWS_URL=https://[YOUR_CLOUDFRONT_DOMAIN]`

Untuk upload file ke S3, gunakan endpoint API `POST /api/upload-photo` yang telah disiapkan di Backend.
