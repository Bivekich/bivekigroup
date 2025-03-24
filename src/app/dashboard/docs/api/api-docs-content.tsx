'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, Copy, CheckCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

export function ApiDocsContent() {
  const router = useRouter();
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold">API документация</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Документация по API</CardTitle>
          <CardDescription>
            Инструкции по использованию API для добавления заявок в CRM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="leads">
            <TabsList className="mb-4">
              <TabsTrigger value="leads">Заявки</TabsTrigger>
            </TabsList>

            <TabsContent value="leads" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Создание заявки</h3>
                <p className="text-muted-foreground mb-4">
                  Этот эндпоинт позволяет создать новую заявку в CRM. Все
                  созданные заявки будут отображаться в разделе CRM вашего
                  аккаунта.
                </p>

                <div className="bg-muted p-3 rounded-md font-mono text-sm flex justify-between items-center">
                  <code>POST /api/external/leads</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() =>
                      copyToClipboard(
                        'POST /api/external/leads',
                        'leads-endpoint'
                      )
                    }
                  >
                    {copiedEndpoint === 'leads-endpoint' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <Accordion type="single" collapsible className="mt-4">
                  <AccordionItem value="headers">
                    <AccordionTrigger>Заголовки запроса</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="font-medium">Content-Type</div>
                          <div className="col-span-2 font-mono">
                            application/json
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="font-medium">x-api-key</div>
                          <div className="col-span-2 font-mono">
                            ваш_api_ключ
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="body">
                    <AccordionTrigger>Тело запроса</AccordionTrigger>
                    <AccordionContent>
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs sm:text-sm">
                        {`{
  "name": "Имя клиента",    // обязательное поле
  "phone": "+71234567890",  // опционально
  "email": "client@example.com",  // опционально
  "amount": 10000,          // опционально, сумма заказа
  "status": "new",          // опционально, по умолчанию "new"
  "comment": "Комментарий к заявке",  // опционально
  "source": "website"       // опционально, источник заявки
}`}
                      </pre>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="response">
                    <AccordionTrigger>Ответ</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">
                            Успешный ответ (201 Created)
                          </h4>
                          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs sm:text-sm">
                            {`{
  "success": true,
  "lead_id": 123,
  "message": "Заявка успешно создана"
}`}
                          </pre>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">
                            Ошибка авторизации (401 Unauthorized)
                          </h4>
                          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs sm:text-sm">
                            {`{
  "error": "Неверный API ключ"
}`}
                          </pre>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">
                            Ошибка отсутствия подписки (403 Forbidden)
                          </h4>
                          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs sm:text-sm">
                            {`{
  "error": "Отсутствует активная подписка на CRM"
}`}
                          </pre>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">
                            Ошибка валидации (400 Bad Request)
                          </h4>
                          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs sm:text-sm">
                            {`{
  "error": "Имя клиента обязательно"
}`}
                          </pre>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="example">
                    <AccordionTrigger>Пример запроса</AccordionTrigger>
                    <AccordionContent>
                      <Tabs defaultValue="curl">
                        <TabsList className="mb-2">
                          <TabsTrigger value="curl">cURL</TabsTrigger>
                          <TabsTrigger value="js">JavaScript</TabsTrigger>
                          <TabsTrigger value="php">PHP</TabsTrigger>
                        </TabsList>

                        <TabsContent value="curl">
                          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs sm:text-sm">
                            {`curl -X POST \\
  "https://example.com/api/external/leads" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ваш_api_ключ" \\
  -d '{
    "name": "Иван Иванов",
    "phone": "+71234567890",
    "email": "ivan@example.com",
    "amount": 10000,
    "comment": "Заявка с сайта",
    "source": "website"
  }'`}
                          </pre>
                        </TabsContent>

                        <TabsContent value="js">
                          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs sm:text-sm">
                            {`// Использование fetch в JavaScript
fetch('https://example.com/api/external/leads', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'ваш_api_ключ'
  },
  body: JSON.stringify({
    name: 'Иван Иванов',
    phone: '+71234567890',
    email: 'ivan@example.com',
    amount: 10000,
    comment: 'Заявка с сайта',
    source: 'website'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Ошибка:', error));`}
                          </pre>
                        </TabsContent>

                        <TabsContent value="php">
                          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs sm:text-sm">
                            {`<?php
// Использование cURL в PHP
$data = [
  'name' => 'Иван Иванов',
  'phone' => '+71234567890',
  'email' => 'ivan@example.com',
  'amount' => 10000,
  'comment' => 'Заявка с сайта',
  'source' => 'website'
];

$ch = curl_init('https://example.com/api/external/leads');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'Content-Type: application/json',
  'x-api-key: ваш_api_ключ'
]);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>`}
                          </pre>
                        </TabsContent>
                      </Tabs>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
