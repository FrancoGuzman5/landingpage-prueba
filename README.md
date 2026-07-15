# Kumelen Endémico

App fullstack de experiencias de viaje conscientes.

## Estructura

```
backend/    API REST (Node.js + Express + Prisma + PostgreSQL)
frontend/   Next.js 15 (App Router) + TypeScript + Tailwind CSS v3
```

Cada carpeta es una app independiente: su propio `package.json`, `node_modules` y `.env`.

## Requisitos

- Node.js 20+
- PostgreSQL corriendo localmente (o accesible por `DATABASE_URL`)

## Puesta en marcha

### Backend

```
cd backend
npm ci
cp .env.example .env      # completar DATABASE_URL y JWT_SECRET
npx prisma generate
npx prisma migrate deploy # aplica las migraciones existentes
node index.js              # http://localhost:3001
```

### Frontend

```
cd frontend
npm ci
cp .env.example .env.local   # completar NEXTAUTH_SECRET
npm run dev                   # http://localhost:3000
```

## Variables de entorno

Ver `backend/.env.example` y `frontend/.env.example` para el detalle de cada una.

## Estado actual / cosas a tener en cuenta

- El frontend y el backend **todavía no están conectados**: el login del frontend (`frontend/src/lib/auth.ts`) usa un `CredentialsProvider` de NextAuth que por ahora es un stub temporal (loguea con cualquier email), no llama a `backend/routes/auth.js`.
- `frontend/prisma/schema.prisma` es un duplicado sin uso del schema real (`backend/prisma/schema.prisma`, con migraciones). No se usa en ningún lado del código del frontend — pendiente de limpieza.
- `frontend/package.json` tiene dos dependencias sin uso: `bcrypt` (el backend usa `bcryptjs`) y `@tailwindcss/postcss` v4 (el proyecto usa Tailwind v3 vía `postcss.config.js` + `tailwind.config.js`). No rompen nada, solo ocupan espacio.
- Faltan los assets estáticos (`frontend/public/images/`, `frontend/public/videos/`) — sin ellos la página funciona pero se ven espacios vacíos donde van fotos/videos.
