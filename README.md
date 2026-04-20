# Almanca Ogrenme Uygulamasi

Kurs sonrasi tekrar ve hata odakli pratik platformu. Detayli planlama icin:

- [docs/info.txt](docs/info.txt) — proje fikri
- [docs/urun_gereksinimleri_ve_piyasa_arastirmasi.txt](docs/urun_gereksinimleri_ve_piyasa_arastirmasi.txt) — gereksinim + piyasa analizi
- [docs/proje_wbs.txt](docs/proje_wbs.txt) — is kirilim yapisi
- [docs/product_backlog.txt](docs/product_backlog.txt) — oncelikli backlog
- [docs/teknik_mimari.txt](docs/teknik_mimari.txt)
- [docs/bilgi_mimarisi_ve_ekranlar.txt](docs/bilgi_mimarisi_ve_ekranlar.txt)
- [docs/veritabani_semasi.txt](docs/veritabani_semasi.txt)
- [docs/ogrenme_motoru.txt](docs/ogrenme_motoru.txt)
- [docs/icerik_standardi.txt](docs/icerik_standardi.txt)
- [docs/sprint_plani.txt](docs/sprint_plani.txt)

## Stack

- Frontend: React 18 + Vite + Tailwind CSS + TanStack Query + Zustand
- Backend: NestJS + Prisma + PostgreSQL 18
- Auth: JWT (access + refresh)
- Docker: dev ve prod uretim icin ayri compose dosyalari
- Monorepo: pnpm workspaces

## On kosullar

- Node.js 20+
- pnpm 9+ (`npm install -g pnpm`)
- Docker Desktop
- Host uzerinde calisan PostgreSQL 18 (port 5432, `postgres` kullanicisi)
- `almanca_dev` ve `almanca_test` veritabanlari olusturulmus

## Kurulum

```bash
# 1. Bagimliliklar
pnpm install

# 2. Env dosyalari
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# apps/api/.env icindeki DATABASE_URL sifresini kendi sifrenle guncelle

# 3. Prisma istemcisi ve ilk migration
pnpm --filter api prisma generate
pnpm --filter api prisma migrate dev --name init
```

## Gelistirme (Docker icinde — onerilen)

```bash
pnpm docker:dev
```

Bu komut `apps/api` ve `apps/web` container'larini ayaga kaldirir. Postgres
host'taki kendi Docker Postgres'in uzerinden `host.docker.internal` ile
erisilir.

- API: http://localhost:3000/api/v1/health
- Swagger: http://localhost:3000/api/docs
- Web: http://localhost:5173

Durdurmak icin:
```bash
pnpm docker:dev:down
```

## Gelistirme (native — pnpm ile)

```bash
# Postgres'in host'ta calistigini varsayiyor. .env icinde localhost kullan.
pnpm dev
```

## Prod benzeri lokal test

```bash
pnpm docker:prod
```

Web 80 portundan (nginx) servis edilir, `/api/` uc noktalari api container'ina
proxy'lenir.

## Klasor yapisi

```
.
├── apps/
│   ├── api/      NestJS + Prisma
│   └── web/      Vite + React
├── packages/
│   └── shared/   paylasimli tipler ve enumlar
├── docker-compose.dev.yml
├── docker-compose.yml
└── pnpm-workspace.yaml
```

## Test

```bash
pnpm test
```

## Lint ve typecheck

```bash
pnpm lint
pnpm typecheck
```

## Sprint 0 ne iceriyor?

- Monorepo iskelet
- NestJS api, health endpoint, Swagger
- Prisma baglantisi (tek marker modeli)
- Vite + React + Tailwind web, api health gosteren basit sayfa
- Dockerfile (dev + prod) ve docker-compose dosyalari
- GitHub Actions CI

Sprint 1 ile auth, seviye ve konu API'leri gelecek.

## Sorun giderme

**"host.docker.internal" adres cozulmiyor:**
Linux'ta compose dosyasindaki `extra_hosts` satiri ile host-gateway yonetilir.
Docker Desktop (Windows/Mac) varsayilan olarak destekler.

**"Postgres baglantisi reddedildi":**
Host'taki Postgres container'inin portu 5432'ye forward edildigine emin ol:
```bash
docker ps | grep postgres
```

**Vite hot reload calismiyor:**
Windows'ta volume mount'lari yavas olabilir; `vite.config.js` icinde
`usePolling: true` aktif. Bir iki saniye gecikme normaldir.
