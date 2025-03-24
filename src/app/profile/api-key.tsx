'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Copy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { UserWithoutPassword } from '@/lib/types';

interface ApiKeyProps {
  user: UserWithoutPassword;
  onApiKeyUpdate?: (apiKey: string) => void;
}

export function ApiKeySection({ user, onApiKeyUpdate }: ApiKeyProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(user.api_key || null);
  const [copied, setCopied] = useState(false);

  const generateApiKey = async () => {
    if (
      !confirm(
        'Генерация нового ключа сделает все существующие интеграции недействительными. Продолжить?'
      )
    ) {
      return;
    }

    try {
      setIsGenerating(true);
      const response = await fetch(`/api/users/${user.id}/api-key`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Не удалось сгенерировать API ключ');
      }

      const data = await response.json();
      setApiKey(data.api_key);

      if (onApiKeyUpdate) {
        onApiKeyUpdate(data.api_key);
      }

      toast({
        title: 'API ключ сгенерирован',
        description: 'Новый API ключ успешно создан',
      });
    } catch (error) {
      console.error('Ошибка при генерации API ключа:', error);
      toast({
        title: 'Ошибка',
        description:
          error instanceof Error
            ? error.message
            : 'Не удалось сгенерировать API ключ',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">API ключ</h3>
      <p className="text-sm text-muted-foreground">
        Используйте этот ключ для интеграции с внешними сервисами и добавления
        заявок через API
      </p>

      {apiKey ? (
        <>
          <div className="relative">
            <div className="p-3 bg-muted rounded-md">
              <code className="font-mono text-xs break-all">{apiKey}</code>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2"
                onClick={copyToClipboard}
                title="Копировать"
              >
                {copied ? 'Скопировано!' : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <p className="text-xs text-amber-500">
            Внимание: При обновлении ключа все текущие интеграции перестанут
            работать, и вам нужно будет обновить ключ в ваших приложениях.
          </p>
        </>
      ) : (
        <div className="text-sm text-muted-foreground italic">
          API ключ не сгенерирован
        </div>
      )}

      <Button
        variant="outline"
        className="w-full"
        onClick={generateApiKey}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Генерация...
          </>
        ) : apiKey ? (
          'Обновить API ключ'
        ) : (
          'Сгенерировать API ключ'
        )}
      </Button>
    </div>
  );
}
