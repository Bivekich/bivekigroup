import nodemailer from 'nodemailer';
import { WebsiteChanges } from './types';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  const mailOptions = {
    from: `"BivekiGroup" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Проверяем подключение при старте
transporter.verify(function (error) {
  if (error) {
    console.log('SMTP Error:', error);
  } else {
    console.log('SMTP Server is ready to take our messages');
  }
});

export async function sendWelcomeEmail(email: string, password: string) {
  const mailOptions = {
    from: `"BivekiGroup" <${process.env.SMTP_USER}>`,
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
    const info = await transporter.sendMail(mailOptions);
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
    from: `"BivekiGroup" <${process.env.SMTP_USER}>`,
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
    const info = await transporter.sendMail(mailOptions);
    console.log('Update notification sent successfully:', info.messageId);
  } catch (error) {
    console.error('Error sending account update email:', error);
    throw error;
  }
}

export async function sendAccountDeleteEmail(email: string) {
  const mailOptions = {
    from: `"BivekiGroup" <${process.env.SMTP_USER}>`,
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
    const info = await transporter.sendMail(mailOptions);
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
    from: `"BivekiGroup" <${process.env.SMTP_USER}>`,
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
    const info = await transporter.sendMail(mailOptions);
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
    text: '', // Пустой текст, так как используем HTML
    html,
  });
}

export async function sendWebsiteDeleteEmail(
  email: string,
  websiteData: { name: string; domain: string }
) {
  const mailOptions = {
    from: `"BivekiGroup" <${process.env.SMTP_USER}>`,
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
    const info = await transporter.sendMail(mailOptions);
    console.log('Website deletion notification sent:', info.messageId);
  } catch (error) {
    console.error('Error sending website deletion email:', error);
    throw error;
  }
}
