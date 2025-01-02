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
import { Shield, Mail, User, Trash2, Search, Pencil, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: number;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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
      setUsers(usersList);
      setFilteredUsers(usersList);
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

      if (!response.ok) {
        throw new Error('Ошибка при создании пользователя');
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
        description: 'Не удалось создать пользователя',
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

      if (!response.ok) {
        throw new Error('Ошибка при обновлении пользователя');
      }

      toast({
        title: 'Успешно',
        description: 'Данные пользователя обновлены',
      });

      setIsEditDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить данные пользователя',
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
                  <Input name="password" type="password" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Роль</label>
                  <Select name="role" defaultValue="user">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Администратор</SelectItem>
                      <SelectItem value="user">Пользователь</SelectItem>
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
                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:ml-auto">
                    {user.role === 'admin' && (
                      <div className="flex items-center gap-1 text-blue-500">
                        <Shield className="h-4 w-4" />
                        <span className="text-xs font-medium">
                          Администратор
                        </span>
                      </div>
                    )}
                    <Dialog
                      open={isEditDialogOpen}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
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
                            <label className="text-sm font-medium">
                              Новый пароль
                            </label>
                            <Input
                              name="password"
                              type="password"
                              placeholder="Оставьте пустым, чтобы не менять"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Роль</label>
                            <Select
                              name="role"
                              defaultValue={selectedUser?.role}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">
                                  Администратор
                                </SelectItem>
                                <SelectItem value="user">
                                  Пользователь
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button type="submit" className="w-full">
                            Сохранить
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
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
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              {searchQuery ? 'Пользователи не найдены' : 'Нет пользователей'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
