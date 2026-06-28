"use client";

import { FormEvent, useEffect, useState } from "react";
import { Ban, RefreshCw, UserPlus, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { I18nText } from "@/components/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiDelete, apiGet, apiPost } from "@/lib/api";

type User = {
  id: number;
  name: string;
  email: string;
  roleKey: string;
  status: string;
  createdAt: string;
};

const defaultInviteForm = {
  name: "",
  email: "",
  password: "password",
  roleKey: "member",
  status: "active",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState(defaultInviteForm);
  const [submitting, setSubmitting] = useState(false);
  const [disablingId, setDisablingId] = useState<number | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setError("");
    setRefreshing(true);
    try {
      const nextUsers = await apiGet<User[]>("/api/users");
      setUsers(nextUsers);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Failed to load users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function handleInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);

    try {
      const created = await apiPost<User>("/api/users", inviteForm);
      setUsers((current) => [created, ...current.filter((user) => user.id !== created.id)]);
      setInviteForm(defaultInviteForm);
      setInviteOpen(false);
      setNotice(`Created ${created.email}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  }

  async function disableUser(user: User) {
    setError("");
    setNotice("");
    setDisablingId(user.id);

    try {
      await apiDelete<void>(`/api/users/${user.id}`);
      setUsers((current) =>
        current.map((item) => (item.id === user.id ? { ...item, status: "disabled" } : item)),
      );
      setNotice(`Disabled ${user.email}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Failed to disable user");
    } finally {
      setDisablingId(null);
    }
  }

  return (
    <AppShell>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle><I18nText value={{ en: "Users", zh: "用户" }} /></CardTitle>
              <p className="mt-1 text-sm text-muted">{users.length} <I18nText value="members" /></p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={loadUsers} disabled={refreshing}>
                <RefreshCw size={16} aria-hidden="true" />
                <I18nText value={{ en: "Refresh", zh: "刷新" }} />
              </Button>
              <Button type="button" onClick={() => setInviteOpen(true)}>
                <UserPlus size={16} aria-hidden="true" />
                <I18nText value={{ en: "Invite", zh: "邀请" }} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <div className="border-b border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
          {notice ? (
            <div className="border-b border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {notice}
            </div>
          ) : null}
          {loading ? (
            <div className="px-4 py-6 text-sm text-muted">
              <I18nText value={{ en: "Loading users...", zh: "正在加载用户..." }} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full border-collapse text-left text-sm">
                <thead className="border-b border-border bg-surfaceStrong text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium"><I18nText value={{ en: "Name", zh: "姓名" }} /></th>
                    <th className="px-4 py-3 font-medium"><I18nText value={{ en: "Email", zh: "邮箱" }} /></th>
                    <th className="px-4 py-3 font-medium"><I18nText value={{ en: "Role", zh: "角色" }} /></th>
                    <th className="px-4 py-3 font-medium"><I18nText value={{ en: "Status", zh: "状态" }} /></th>
                    <th className="px-4 py-3 text-right font-medium"><I18nText value={{ en: "Actions", zh: "操作" }} /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white">
                  {users.map((user) => (
                    <tr key={user.id} className="transition hover:bg-surface">
                      <td className="px-4 py-3 font-medium text-ink">{user.name}</td>
                      <td className="px-4 py-3 text-muted">{user.email}</td>
                      <td className="px-4 py-3 text-muted">{user.roleKey}</td>
                      <td className="px-4 py-3">
                        <Badge tone={user.status === "active" ? "success" : "warning"}>
                          <I18nText value={user.status} />
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => disableUser(user)}
                          disabled={user.status === "disabled" || disablingId === user.id}
                        >
                          <Ban size={16} aria-hidden="true" />
                          <I18nText value={{ en: "Disable", zh: "禁用" }} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 ? (
                    <tr>
                      <td className="px-4 py-6 text-center text-muted" colSpan={5}>
                        <I18nText value={{ en: "No users found.", zh: "暂无用户。" }} />
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {inviteOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle><I18nText value={{ en: "Invite user", zh: "邀请用户" }} /></CardTitle>
                <Button type="button" variant="ghost" onClick={() => setInviteOpen(false)}>
                  <X size={16} aria-hidden="true" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <form className="grid gap-4" onSubmit={handleInvite}>
                <Input
                  label={{ en: "Name", zh: "姓名" }}
                  value={inviteForm.name}
                  onChange={(event) => setInviteForm((form) => ({ ...form, name: event.target.value }))}
                  required
                />
                <Input
                  label={{ en: "Email", zh: "邮箱" }}
                  type="email"
                  value={inviteForm.email}
                  onChange={(event) => setInviteForm((form) => ({ ...form, email: event.target.value }))}
                  required
                />
                <Input
                  label={{ en: "Password", zh: "密码" }}
                  type="password"
                  value={inviteForm.password}
                  onChange={(event) => setInviteForm((form) => ({ ...form, password: event.target.value }))}
                />
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <I18nText value={{ en: "Role", zh: "角色" }} />
                  <select
                    className="h-10 rounded-md border border-border bg-white px-3 text-sm text-ink outline-none transition focus:border-accent focus:shadow-focus"
                    value={inviteForm.roleKey}
                    onChange={(event) => setInviteForm((form) => ({ ...form, roleKey: event.target.value }))}
                  >
                    <option value="owner">owner</option>
                    <option value="admin">admin</option>
                    <option value="member">member</option>
                  </select>
                </label>
                <div className="flex justify-end gap-2 border-t border-border pt-4">
                  <Button type="button" variant="secondary" onClick={() => setInviteOpen(false)}>
                    <I18nText value={{ en: "Cancel", zh: "取消" }} />
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    <UserPlus size={16} aria-hidden="true" />
                    <I18nText value={submitting ? { en: "Creating...", zh: "正在创建..." } : { en: "Create", zh: "创建" }} />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </AppShell>
  );
}
