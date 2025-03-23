import crypto from 'crypto';

// Функция для проверки подписи от ЮKassa
export function checkSignature(
  body: string,
  signature: string | null
): boolean {
  if (!signature) return false;

  const secretKey = process.env.YOOKASSA_SECRET_KEY!;
  const hmac = crypto.createHmac('sha1', secretKey);
  const expectedSignature = hmac.update(body).digest('hex');

  return signature === expectedSignature;
}
