import nodemailer from 'nodemailer';
import { WebsiteChanges } from './types';

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export async function sendEmail({
  to,
  subject,
  html,
  from,
  text,
  attachments,
}: EmailOptions) {
  try {
    const info = await transport.sendMail({
      from: from || `Biveki Group <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text,
      attachments,
    });
    console.log('Message sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Ошибка отправки email:', error);
    throw error;
  }
}

// Проверяем подключение при старте
transport.verify(function (error) {
  if (error) {
    console.log('SMTP Error:', error);
  } else {
    console.log('SMTP Server is ready to take our messages');
  }
});

export async function sendWelcomeEmail(email: string, password: string) {
  const mailOptions = {
    from: `Biveki Group <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Добро пожаловать в BivekiGroup',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Добро пожаловать в BivekiGroup!</h2>
        <p>Ваш аккаунт был успешно создан. Ниже приведены данные для входа:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>Пароль:</strong> ${password}</p>
        </div>
        <p>Для входа в систему перейдите по ссылке: <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" style="color: #007bff;">Войти</a></p>
        <p>Рекомендуем сменить пароль после первого входа в систему.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">Это автоматическое сообщение, пожалуйста, не отвечайте на него.</p>
      </div>
    `,
  };

  try {
    const info = await transport.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
}

export async function sendAccountUpdateEmail(
  email: string,
  changes: { email?: string; role?: string; password?: string }
) {
  console.log('Preparing to send update email to:', email);
  console.log('Changes to notify about:', changes);

  const mailOptions = {
    from: `Biveki Group <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Изменение данных учетной записи',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Изменение данных учетной записи</h2>
        <p>В вашей учетной записи были внесены следующие изменения:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Email для входа:</strong> ${changes.email || email}</p>
          ${changes.role ? `<p style="margin: 5px 0;"><strong>Новая роль:</strong> ${changes.role === 'admin' ? 'Администратор' : 'Клиент'}</p>` : ''}
          ${changes.password ? `<p style="margin: 5px 0;"><strong>Новый пароль:</strong> ${changes.password}</p>` : ''}
        </div>
        <p>Для входа в систему используйте ссылку: <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" style="color: #007bff;">Войти</a></p>
        ${changes.password ? '<p>Рекомендуем сохранить новый пароль в надежном месте.</p>' : ''}
        <p>Если вы не запрашивали эти изменения, пожалуйста, немедленно свяжитесь с администратором.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">Это автоматическое сообщение, пожалуйста, не отвечайте на него.</p>
      </div>
    `,
  };

  try {
    console.log('Attempting to send email with options:', {
      to: mailOptions.to,
      subject: mailOptions.subject,
      changes,
    });
    const info = await transport.sendMail(mailOptions);
    console.log('Update notification sent successfully:', info.messageId);
  } catch (error) {
    console.error('Error sending account update email:', error);
    throw error;
  }
}

export async function sendAccountDeleteEmail(email: string) {
  const mailOptions = {
    from: `Biveki Group <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Удаление учетной записи',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Удаление учетной записи</h2>
        <p>Ваша учетная запись в системе BivekiGroup была удалена.</p>
        <p>Если у вас есть вопросы, пожалуйста, свяжитесь с администратором.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">Это автоматическое сообщение, пожалуйста, не отвечайте на него.</p>
      </div>
    `,
  };

  try {
    const info = await transport.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending account delete email:', error);
    throw error;
  }
}

export async function sendWebsiteCreatedEmail(
  email: string,
  websiteData: { name: string; domain: string; status: string }
) {
  const mailOptions = {
    from: `Biveki Group <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Новый сайт создан',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Новый сайт создан</h2>
        <p>Для вас был создан новый сайт со следующими параметрами:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Название:</strong> ${websiteData.name}</p>
          <p style="margin: 5px 0;"><strong>Домен:</strong> ${websiteData.domain}</p>
          <p style="margin: 5px 0;"><strong>Статус:</strong> ${websiteData.status}</p>
        </div>
        <p>Вы можете отслеживать статус вашего сайта в личном кабинете:</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="color: #007bff;">Перейти в личный кабинет</a></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">Это автоматическое сообщение, пожалуйста, не отвечайте на него.</p>
      </div>
    `,
  };

  try {
    const info = await transport.sendMail(mailOptions);
    console.log('Website created notification sent:', info.messageId);
  } catch (error) {
    console.error('Error sending website created email:', error);
    throw error;
  }
}

export async function sendWebsiteUpdateEmail(
  email: string,
  websiteData: {
    name: string;
    domain: string;
    status: string;
    changes: WebsiteChanges;
  }
) {
  const { name, domain, status, changes } = websiteData;
  let subject = 'Обновление информации о сайте';
  let html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">`;

  if (changes.ownership === 'removed') {
    subject = 'Сайт удален из вашего аккаунта';
    html += `Сайт удален из вашего аккаунта</h2>
      <p>Сайт <strong>${name}</strong> (${domain}) был удален из вашего аккаунта.</p>`;
  } else if (changes.ownership === 'added') {
    subject = 'Новый сайт добавлен в ваш аккаунт';
    html += `Новый сайт добавлен в ваш аккаунт</h2>
      <p>В ваш аккаунт был добавлен новый сайт:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Название:</strong> ${name}</p>
        <p style="margin: 5px 0;"><strong>Домен:</strong> ${domain}</p>
        <p style="margin: 5px 0;"><strong>Статус:</strong> ${status}</p>
      </div>`;
  } else {
    html += `Обновление информации о сайте</h2>
      <p>Информация о сайте <strong>${name}</strong> (${domain}) была обновлена:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        ${changes.name ? `<p style="margin: 5px 0;"><strong>Новое название:</strong> ${changes.name}</p>` : ''}
        ${changes.domain ? `<p style="margin: 5px 0;"><strong>Новый домен:</strong> ${changes.domain}</p>` : ''}
        ${changes.status ? `<p style="margin: 5px 0;"><strong>Новый статус:</strong> ${changes.status}</p>` : ''}
      </div>`;
  }

  html += `
      <p>Вы можете просмотреть актуальную информацию в личном кабинете:</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="color: #007bff;">Перейти в личный кабинет</a></p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">Это автоматическое сообщение, пожалуйста, не отвечайте на него.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject,
    text: '',
    html,
  });
}

export async function sendWebsiteDeleteEmail(
  email: string,
  websiteData: { name: string; domain: string }
) {
  const mailOptions = {
    from: `Biveki Group <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Удаление сайта',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Удаление сайта</h2>
        <p>Сайт был удален из системы:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Название:</strong> ${websiteData.name}</p>
          <p style="margin: 5px 0;"><strong>Домен:</strong> ${websiteData.domain}</p>
        </div>
        <p>Если у вас есть вопросы, пожалуйста, свяжитесь с администратором.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">Это автоматическое сообщение, пожалуйста, не отвечайте на него.</p>
      </div>
    `,
  };

  try {
    const info = await transport.sendMail(mailOptions);
    console.log('Website deletion notification sent:', info.messageId);
  } catch (error) {
    console.error('Error sending website deletion email:', error);
    throw error;
  }
}

export async function sendBalanceUpdateEmail(
  email: string,
  data: {
    amount: number;
    newBalance: number;
    type: 'deposit' | 'withdrawal';
  }
) {
  const mailOptions = {
    from: `Biveki Group <${process.env.SMTP_USER}>`,
    to: email,
    subject: `${data.type === 'deposit' ? 'Пополнение' : 'Списание'} баланса`,
    text: `Уведомляем вас об изменении баланса в системе BivekiGroup.\n\n${data.type === 'deposit' ? 'Пополнение' : 'Списание'}: ${Math.abs(data.amount).toFixed(2)} ₽\nТекущий баланс: ${data.newBalance.toFixed(2)} ₽\n\nС уважением,\nКоманда BivekiGroup`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Уведомление от Biveki Group</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .email-body {
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              padding: 40px;
              margin: 20px 0;
            }
            .logo {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo h1 {
              color: #2d3748;
              font-size: 24px;
              font-weight: 700;
              margin: 0;
            }
            .info-box {
              background-color: #f7fafc;
              border-radius: 4px;
              padding: 20px;
              margin: 20px 0;
            }
            .info-box p {
              margin: 8px 0;
              color: #4a5568;
            }
            .amount {
              font-size: 24px;
              font-weight: 600;
              color: ${data.type === 'deposit' ? '#48bb78' : '#f56565'};
            }
            .button-container {
              text-align: center;
              margin: 30px 0;
            }
            .button {
              display: inline-block;
              background-color: #3182ce;
              color: #ffffff !important;
              padding: 12px 24px;
              border-radius: 6px;
              text-decoration: none;
              font-weight: 600;
              transition: background-color 0.2s;
            }
            .button:hover {
              background-color: #2c5282;
              color: #ffffff !important;
            }
            .message {
              text-align: center;
              color: #4a5568;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #718096;
              font-size: 14px;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="email-body">
              <div class="logo">
                <h1>Biveki Group</h1>
              </div>

              <div class="message">
                <h2 style="color: #2d3748; margin-bottom: 20px;">
                  ${data.type === 'deposit' ? '💰 Пополнение баланса' : '📉 Списание средств'}
                </h2>
                <p>Уведомляем вас об изменении баланса в системе Biveki Group.</p>
              </div>

              <div class="info-box">
                <p>
                  <strong>${data.type === 'deposit' ? 'Пополнение' : 'Списание'}:</strong>
                  <span class="amount">${Math.abs(data.amount).toFixed(2)} ₽</span>
                </p>
                <p><strong>Текущий баланс:</strong> ${data.newBalance.toFixed(2)} ₽</p>
              </div>

              <div class="button-container">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/cloud" class="button">
                  Перейти в личный кабинет
                </a>
              </div>

              <div class="footer">
                <p>С уважением,<br>Команда Biveki Group</p>
                <p>Это автоматическое сообщение, пожалуйста, не отвечайте на него.</p>
                <p>© ${new Date().getFullYear()} Biveki Group. Все права защищены.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const info = await transport.sendMail(mailOptions);
    console.log(
      'Balance update notification sent successfully:',
      info.messageId
    );
  } catch (error) {
    console.error('Error sending balance update email:', error);
    throw error;
  }
}
