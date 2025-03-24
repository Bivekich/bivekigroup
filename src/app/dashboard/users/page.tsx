'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Shield,
  Mail,
  User,
  Trash2,
  Search,
  Pencil,
  Plus,
  Trophy,
  Gift,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { UserRole } from '@/lib/types';
import { ApiKeySection } from '@/app/profile/api-key';

interface User {
  id: number;
  email: string;
  role: UserRole;
  created_at: string;
  hasCrmAccess?: boolean;
  api_key?: string | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [loadingCrmAccess, setLoadingCrmAccess] = useState<number | null>(null);
  const [removingCrmAccess, setRemovingCrmAccess] = useState<number | null>(
    null
  );

  // Функция генерации пароля
  const generatePassword = (isEdit: boolean = false) => {
    const length = 12;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    if (isEdit) {
      setEditPassword(password);
    } else {
      setGeneratedPassword(password);
    }
    return password;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchQuery]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/users');
      const data = await response.json();
      const usersList = Array.isArray(data.users) ? data.users : [];

      // Получаем информацию о подписках CRM
      const usersWithCrmStatus = await Promise.all(
        usersList.map(async (user: User) => {
          try {
            const crmResponse = await fetch(
              `/api/users/${user.id}/crm-access/check`
            );
            if (crmResponse.ok) {
              const crmData = await crmResponse.json();
              return { ...user, hasCrmAccess: crmData.isActive };
            }
          } catch (error) {
            console.error(
              `Ошибка при проверке доступа к CRM для пользователя ${user.id}:`,
              error
            );
          }
          return { ...user, hasCrmAccess: false };
        })
      );

      setUsers(usersWithCrmStatus);
      setFilteredUsers(usersWithCrmStatus);
    } catch (error) {
      console.error('Ошибка при загрузке пользователей:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить список пользователей',
        variant: 'destructive',
      });
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (formData: FormData) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
          role: formData.get('role'),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при создании пользователя');
      }

      toast({
        title: 'Успешно',
        description: 'Пользователь создан',
      });

      setIsCreateDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
      toast({
        title: 'Ошибка',
        description:
          error instanceof Error
            ? error.message
            : 'Не удалось создать пользователя',
        variant: 'destructive',
      });
    }
  };

  const handleEditUser = async (formData: FormData) => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password') || undefined,
          role: formData.get('role'),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при обновлении пользователя');
      }

      toast({
        title: 'Успешно',
        description: 'Данные пользователя обновлены',
      });

      setIsEditDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error);
      toast({
        title: 'Ошибка',
        description:
          error instanceof Error
            ? error.message
            : 'Не удалось обновить данные пользователя',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении пользователя');
      }

      toast({
        title: 'Успешно',
        description: 'Пользователь удален',
      });

      fetchUsers();
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить пользователя',
        variant: 'destructive',
      });
    }
  };

  const handleGrantCrmAccess = async (userId: number) => {
    try {
      setLoadingCrmAccess(userId);

      const response = await fetch(`/api/users/${userId}/crm-access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          duration: 30, // 30 дней бесплатного доступа
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при выдаче доступа к CRM');
      }

      toast({
        title: 'Успешно',
        description: 'Доступ к CRM выдан',
      });

      // Обновляем список пользователей
      fetchUsers();
    } catch (error) {
      console.error('Ошибка при выдаче доступа к CRM:', error);
      toast({
        title: 'Ошибка',
        description:
          error instanceof Error
            ? error.message
            : 'Не удалось выдать доступ к CRM',
        variant: 'destructive',
      });
    } finally {
      setLoadingCrmAccess(null);
    }
  };

  const handleRemoveCrmAccess = async (userId: number) => {
    if (
      !confirm(
        'Вы уверены, что хотите удалить доступ к CRM у этого пользователя?'
      )
    ) {
      return;
    }

    try {
      setRemovingCrmAccess(userId);

      const response = await fetch(`/api/users/${userId}/crm-access`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при удалении доступа к CRM');
      }

      toast({
        title: 'Успешно',
        description: 'Доступ к CRM удален',
      });

      // Обновляем список пользователей
      fetchUsers();
    } catch (error) {
      console.error('Ошибка при удалении доступа к CRM:', error);
      toast({
        title: 'Ошибка',
        description:
          error instanceof Error
            ? error.message
            : 'Не удалось удалить доступ к CRM',
        variant: 'destructive',
      });
    } finally {
      setRemovingCrmAccess(null);
    }
  };

  // Добавляем функцию обновления API ключа
  const handleApiKeyUpdate = (apiKey: string) => {
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        api_key: apiKey,
      });

      // Обновляем пользователя в списке
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...user, api_key: apiKey } : user
        )
      );

      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...user, api_key: apiKey } : user
        )
      );
    }
  };

  return (
    <div className="container max-w-4xl py-4 sm:py-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Пользователи</h1>
        <div className="flex items-center gap-2 sm:ml-auto">
          <div className="relative flex-1 sm:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск пользователей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="icon" className="shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Создать пользователя</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateUser(new FormData(e.currentTarget));
                }}
                className="space-y-4 mt-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Пароль</label>
                  <div className="flex gap-2">
                    <Input
                      name="password"
                      type="text"
                      value={generatedPassword}
                      onChange={(e) => setGeneratedPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => generatePassword()}
                    >
                      Сгенерировать
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Роль</label>
                  <Select name="role" defaultValue="client">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Администратор</SelectItem>
                      <SelectItem value="client">Клиент</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  Создать
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-1 sm:space-y-0">
          <CardTitle className="text-lg">Список пользователей</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 border rounded-lg"
                >
                  <Skeleton className="h-4 w-32 sm:w-48" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span className="text-sm truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>
                      {new Date(user.created_at).toLocaleString('ru', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:ml-auto">
                    {user.role === 'admin' && (
                      <div className="flex items-center gap-1 text-blue-500">
                        <Shield className="h-4 w-4" />
                        <span className="text-xs font-medium">
                          Администратор
                        </span>
                      </div>
                    )}
                    {user.hasCrmAccess && (
                      <div className="flex items-center gap-1 text-green-500">
                        <Trophy className="h-4 w-4" />
                        <span className="text-xs font-medium">CRM доступ</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 ml-auto sm:ml-2">
                      {user.hasCrmAccess && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="Удалить доступ к CRM"
                          onClick={() => handleRemoveCrmAccess(user.id)}
                          disabled={removingCrmAccess === user.id}
                        >
                          {removingCrmAccess === user.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Выдать доступ к CRM"
                        onClick={() => handleGrantCrmAccess(user.id)}
                        disabled={
                          loadingCrmAccess === user.id || user.hasCrmAccess
                        }
                      >
                        {loadingCrmAccess === user.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Gift
                            className={`h-4 w-4 ${user.hasCrmAccess ? 'text-gray-300' : 'text-green-500'}`}
                          />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              {searchQuery ? 'Пользователи не найдены' : 'Нет пользователей'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Диалог редактирования пользователя */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактировать пользователя</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditUser(new FormData(e.currentTarget));
            }}
            className="space-y-4 mt-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                name="email"
                type="email"
                defaultValue={selectedUser?.email}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Новый пароль</label>
              <div className="flex gap-2">
                <Input
                  name="password"
                  type="text"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Оставьте пустым, чтобы не менять"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => generatePassword(true)}
                >
                  Сгенерировать
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Роль</label>
              <Select name="role" defaultValue={selectedUser?.role}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Администратор</SelectItem>
                  <SelectItem value="client">Клиент</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Сохранить
            </Button>
          </form>

          {selectedUser && (
            <div className="mt-6 pt-6 border-t">
              <ApiKeySection
                user={selectedUser}
                onApiKeyUpdate={handleApiKeyUpdate}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
