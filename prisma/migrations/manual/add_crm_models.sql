-- Создаем enum тип для статуса заявки
CREATE TYPE "LeadStatus" AS ENUM ('new', 'in_progress', 'waiting', 'completed', 'rejected');

-- Создаем таблицу для подписки CRM
CREATE TABLE "crm_subscriptions" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER UNIQUE NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "expires_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Индекс для подписки
CREATE INDEX "crm_subscriptions_user_id_idx" ON "crm_subscriptions"("user_id");

-- Создаем таблицу для заявок CRM
CREATE TABLE "crm_leads" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(50),
  "email" VARCHAR(255),
  "amount" DECIMAL(10,2),
  "status" "LeadStatus" NOT NULL DEFAULT 'new',
  "comment" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Индексы для заявок
CREATE INDEX "crm_leads_user_id_idx" ON "crm_leads"("user_id");
CREATE INDEX "crm_leads_status_idx" ON "crm_leads"("status");
CREATE INDEX "crm_leads_created_at_idx" ON "crm_leads"("created_at");
