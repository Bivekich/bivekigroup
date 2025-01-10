-- Таблица баланса пользователей
CREATE TABLE IF NOT EXISTS cloud_balance (
  user_id INTEGER PRIMARY KEY REFERENCES users(id),
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица облачных услуг
CREATE TABLE IF NOT EXISTS cloud_services (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('server', 'database', 'storage', 'email', 'apps')),
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'suspended', 'terminated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица операций с балансом
CREATE TABLE IF NOT EXISTS cloud_operations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'withdrawal')),
  amount DECIMAL(10, 2) NOT NULL,
  method VARCHAR(20) CHECK (method IN ('invoice', 'online')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_cloud_services_user_id ON cloud_services(user_id);
CREATE INDEX IF NOT EXISTS idx_cloud_services_status ON cloud_services(status);
CREATE INDEX IF NOT EXISTS idx_cloud_operations_user_id ON cloud_operations(user_id);
CREATE INDEX IF NOT EXISTS idx_cloud_operations_status ON cloud_operations(status);

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cloud_services_updated_at
  BEFORE UPDATE ON cloud_services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cloud_balance_updated_at
  BEFORE UPDATE ON cloud_balance
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Функция для ежедневного списания средств
CREATE OR REPLACE FUNCTION process_daily_charges()
RETURNS void AS $$
DECLARE
  service RECORD;
  user_balance DECIMAL;
  total_charge DECIMAL;
  user_services CURSOR FOR
    SELECT user_id, SUM(price) as total_price
    FROM cloud_services
    WHERE status = 'active'
    GROUP BY user_id;
BEGIN
  FOR user_record IN user_services LOOP
    -- Получаем баланс пользователя
    SELECT amount INTO user_balance
    FROM cloud_balance
    WHERE user_id = user_record.user_id;

    -- Если баланса недостаточно, приостанавливаем услуги
    IF user_balance < user_record.total_price THEN
      UPDATE cloud_services
      SET status = 'suspended'
      WHERE user_id = user_record.user_id AND status = 'active';

      -- Создаем уведомление
      INSERT INTO notifications (user_id, title, description)
      VALUES (
        user_record.user_id,
        'Услуги приостановлены',
        'Ваши облачные услуги были приостановлены из-за недостаточного баланса'
      );
    ELSE
      -- Списываем средства
      UPDATE cloud_balance
      SET amount = amount - user_record.total_price
      WHERE user_id = user_record.user_id;

      -- Создаем операцию списания
      INSERT INTO cloud_operations (user_id, type, amount, status)
      VALUES (
        user_record.user_id,
        'withdrawal',
        user_record.total_price,
        'completed'
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
