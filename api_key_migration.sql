-- Добавление столбца api_key в таблицу users
ALTER TABLE "users"
ADD COLUMN "api_key" VARCHAR(64) UNIQUE;

-- Добавление индекса для быстрого поиска по API ключу
CREATE INDEX "users_api_key_idx" ON "users"("api_key");

-- Создание crm_leads таблицы, если она еще не существует
CREATE TABLE IF NOT EXISTS "crm_leads" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(50),
  "email" VARCHAR(255),
  "amount" DECIMAL(10,2),
  "status" VARCHAR(20) NOT NULL DEFAULT 'new',
  "comment" TEXT,
  "source" VARCHAR(50),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Создание индексов для crm_leads
CREATE INDEX IF NOT EXISTS "crm_leads_user_id_idx" ON "crm_leads"("user_id");
CREATE INDEX IF NOT EXISTS "crm_leads_status_idx" ON "crm_leads"("status");
CREATE INDEX IF NOT EXISTS "crm_leads_created_at_idx" ON "crm_leads"("created_at");

-- Создание таблицы crm_subscriptions, если она еще не существует
CREATE TABLE IF NOT EXISTS "crm_subscriptions" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER UNIQUE NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "expires_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Создание индекса для crm_subscriptions
CREATE INDEX IF NOT EXISTS "crm_subscriptions_user_id_idx" ON "crm_subscriptions"("user_id");
