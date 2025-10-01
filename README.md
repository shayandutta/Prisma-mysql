### Prisma Backend Playground

This repository is a minimal Express + Prisma backend used for learning Prisma.

### Tech stack

- **Runtime**: Node.js (ES Modules)
- **Web**: Express
- **ORM**: Prisma (v6)
- **DB**: MySQL

### Prerequisites

- Node.js 18+
- A running MySQL instance

### Quick start

1. Install dependencies

```bash
npm install
```

2. Create a `.env` in the project root with your database URL

```bash
cp .env.example .env # if you create one
```

Example `DATABASE_URL` for MySQL:

```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE?connection_limit=5"
```

3. Generate Prisma Client

```bash
npx prisma generate
```

4. Apply schema to the database

- Using migrations (recommended during dev):

```bash
npx prisma migrate dev --name init
```

- Or push schema directly (no migration files):

```bash
npx prisma db push
```

5. Run the dev server

```bash
npm run start
```

The server starts on `http://localhost:5050` and returns "home route working!" at `/`.

### Prisma details

- Schema: `prisma/schema.prisma`
- Provider: `mysql`
- Client output: `generated/prisma` (custom path)

Because the client is generated to a custom directory, import it from `./generated/prisma` (relative to your file):

```js
import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient();
```

Useful commands:

- Generate client: `npx prisma generate`
- Open Prisma Studio: `npx prisma studio`
- Create a new migration: `npx prisma migrate dev --name <migration_name>`
- Reset DB (dangerous): `npx prisma migrate reset`

### Example model

This project currently has an `Article` model with an `ArticleState` enum (simplified example):

```prisma
enum ArticleState {
  DRAFT
  PUBLISHED
}

model Article {
  id        Int         @id @default(autoincrement())
  title     String
  content   String
  state     ArticleState @default(DRAFT)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
}
```

### Project structure (key files)

```
.
├─ index.js                  # Express server (port 5050)
├─ prisma/
│  ├─ schema.prisma         # Prisma schema (MySQL)
│  └─ migrations/           # Prisma migrations
├─ generated/prisma/        # Generated Prisma Client output
├─ package.json             # Scripts and deps
└─ README.md
```

### Scripts

- **start**: `nodemon index.js`

### Troubleshooting

- If imports fail for Prisma Client, make sure you ran `npx prisma generate` and that you are importing from the custom output path `./generated/prisma`.
- Check that `DATABASE_URL` in `.env` is correct and the MySQL instance is reachable.
- If migrations fail, try `npx prisma migrate reset` (this will drop data) and run `npx prisma migrate dev` again.

### Notes

- This repo is intentionally minimal to focus on learning Prisma concepts step-by-step.
