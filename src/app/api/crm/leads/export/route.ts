import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { readFile, unlink } from 'fs/promises';
import ExcelJS from 'exceljs';
import { createObjectCsvWriter } from 'csv-writer';
import { sendEmail } from '@/lib/mail';

interface JWTPayload {
  id: number;
  email: string;
  role: 'admin' | 'client';
}

interface ExportRequest {
  dateFrom: string;
  dateTo: string;
  format: 'xlsx' | 'csv';
  email: string;
}

interface CRMLead {
  id: number;
  created_at: Date;
  status: string;
  name: string;
  phone: string | null;
  email: string | null;
  amount: number | null;
  comment: string | null;
  user_id?: number;
  updated_at?: Date;
  [key: string]: any;
}

// Создание Excel файла
async function generateExcel(leads: CRMLead[], fileName: string) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Заявки');

  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Дата создания', key: 'created_at', width: 20 },
    { header: 'Статус', key: 'status', width: 15 },
    { header: 'Имя', key: 'name', width: 20 },
    { header: 'Телефон', key: 'phone', width: 20 },
    { header: 'Email', key: 'email', width: 20 },
    { header: 'Сумма', key: 'amount', width: 15 },
    { header: 'Комментарий', key: 'comment', width: 30 },
  ];

  // Форматирование ячеек
  worksheet.getColumn('created_at').numFmt = 'dd.mm.yyyy hh:mm';
  worksheet.getColumn('amount').numFmt = '# ##0.00 ₽';

  // Переводим статусы на русский
  const statusTranslation: Record<string, string> = {
    new: 'Новый',
    in_progress: 'В работе',
    waiting: 'В ожидании',
    completed: 'Выполнен',
    rejected: 'Отказ',
  };

  // Добавляем данные
  leads.forEach((lead) => {
    const row = {
      ...lead,
      created_at: new Date(lead.created_at),
      status: statusTranslation[lead.status] || lead.status,
      amount: lead.amount || 0,
    };
    worksheet.addRow(row);
  });

  // Сохраняем файл
  const filePath = join(tmpdir(), fileName);
  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

// Создание CSV файла
async function generateCSV(leads: CRMLead[], fileName: string) {
  const filePath = join(tmpdir(), fileName);

  // Переводим статусы на русский
  const statusTranslation: Record<string, string> = {
    new: 'Новый',
    in_progress: 'В работе',
    waiting: 'В ожидании',
    completed: 'Выполнен',
    rejected: 'Отказ',
  };

  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: 'id', title: 'ID' },
      { id: 'created_at', title: 'Дата создания' },
      { id: 'status', title: 'Статус' },
      { id: 'name', title: 'Имя' },
      { id: 'phone', title: 'Телефон' },
      { id: 'email', title: 'Email' },
      { id: 'amount', title: 'Сумма' },
      { id: 'comment', title: 'Комментарий' },
    ],
    encoding: 'utf8',
  });

  // Форматируем данные
  const formattedLeads = leads.map((lead) => ({
    ...lead,
    created_at: new Date(lead.created_at).toLocaleString('ru-RU'),
    status: statusTranslation[lead.status] || lead.status,
    amount: lead.amount ? `${lead.amount} ₽` : '',
  }));

  await csvWriter.writeRecords(formattedLeads);
  return filePath;
}

// Отправка файла на email
async function sendExportEmail(
  email: string,
  filePath: string,
  format: string
) {
  const fileContent = await readFile(filePath);

  const fileExtension = format === 'xlsx' ? 'Excel' : 'CSV';
  const currentDate = new Date().toLocaleDateString('ru-RU');

  await sendEmail({
    to: email,
    subject: `Выгрузка заявок из CRM от ${currentDate}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Выгрузка заявок из CRM системы</h2>
        <p>Здравствуйте!</p>
        <p>Выгрузка заявок из CRM системы успешно выполнена. Файл формата ${fileExtension} прикреплен к этому письму.</p>
        <p>Дата выгрузки: ${currentDate}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">С уважением, команда Biveki Group</p>
      </div>
    `,
    attachments: [
      {
        filename: `crm_leads_${currentDate}.${format}`,
        content: fileContent,
        contentType:
          format === 'xlsx'
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'text/csv',
      },
    ],
  });
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split('Bearer ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const decoded = verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as JWTPayload;

    // Проверяем наличие активной подписки
    const subscription = await prisma.cRMSubscription.findUnique({
      where: { user_id: decoded.id },
    });

    const isActive =
      subscription?.active &&
      (!subscription.expires_at ||
        new Date(subscription.expires_at) > new Date());

    if (!subscription || !isActive) {
      return NextResponse.json(
        { error: 'Отсутствует активная подписка на CRM' },
        { status: 403 }
      );
    }

    const { dateFrom, dateTo, format, email }: ExportRequest = await req.json();

    // Валидация данных
    if (!dateFrom || !dateTo || !format || !email) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные параметры' },
        { status: 400 }
      );
    }

    if (format !== 'xlsx' && format !== 'csv') {
      return NextResponse.json(
        { error: 'Неподдерживаемый формат файла' },
        { status: 400 }
      );
    }

    // Формируем запрос для получения заявок
    const startDate = new Date(dateFrom);
    const endDate = new Date(dateTo);
    endDate.setDate(endDate.getDate() + 1); // Чтобы включить весь день

    const leads = await prisma.cRMLead.findMany({
      where: {
        user_id: decoded.id,
        created_at: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: { created_at: 'desc' },
    });

    if (leads.length === 0) {
      return NextResponse.json(
        { error: 'Нет данных для выгрузки за указанный период' },
        { status: 404 }
      );
    }

    // Генерируем уникальное имя файла
    const fileName = `crm_export_${randomUUID()}.${format}`;

    // Создаем файл в зависимости от формата
    const filePath =
      format === 'xlsx'
        ? await generateExcel(leads, fileName)
        : await generateCSV(leads, fileName);

    try {
      // Ждем завершения отправки файла
      await sendExportEmail(email, filePath, format);

      // Удаляем временный файл
      await unlink(filePath).catch((err) => {
        console.error('Ошибка при удалении временного файла:', err);
      });

      return NextResponse.json({
        success: true,
        message: 'Файл успешно отправлен на указанный email.',
      });
    } catch (err) {
      console.error('Ошибка при отправке экспорта по email:', err);
      return NextResponse.json(
        { error: 'Ошибка при отправке файла экспорта на email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Ошибка при экспорте заявок:', error);
    return NextResponse.json(
      { error: 'Ошибка при экспорте заявок' },
      { status: 500 }
    );
  }
}
