"use client";

import { FormEvent, useEffect, useState } from "react";
import { Pencil, Plus, RefreshCw, Save, Shield, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { I18nText } from "@/components/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiGet, apiPost, apiPut } from "@/lib/api";

type Role = {
  roleKey: string;
  name: string;
  description: string | null;
  memberCount: number;
  permissions: string[];
};

type Permission = {
  permissionKey: string;
  name: string;
  description: string | null;
};

type RoleForm = {
  roleKey: string;
  name: string;
  description: string;
  permissions: string[];
};

const emptyRoleForm: RoleForm = {
  roleKey: "",
  name: "",
  description: "",
  permissions: [],
};

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<RoleForm>(emptyRoleForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  async function loadRoles() {
    setError("");
    setRefreshing(true);
    try {
      const [nextRoles, nextPermissions] = await Promise.all([
        apiGet<Role[]>("/api/roles"),
        apiGet<Permission[]>("/api/roles/permissions"),
      ]);
      setRoles(nextRoles);
      setPermissions(nextPermissions);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Failed to load roles");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function openCreateModal() {
    setForm(emptyRoleForm);
    setModalMode("create");
  }

  function openEditModal(role: Role) {
    setForm({
      roleKey: role.roleKey,
      name: role.name,
      description: role.description ?? "",
      permissions: role.permissions,
    });
    setModalMode("edit");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);

    try {
      const payload = {
        roleKey: form.roleKey,
        name: form.name,
        description: form.description,
        permissions: form.permissions,
      };
      const saved =
        modalMode === "edit"
          ? await apiPut<Role>(`/api/roles/${form.roleKey}`, payload)
          : await apiPost<Role>("/api/roles", payload);

      setRoles((current) => {
        const withoutSaved = current.filter((role) => role.roleKey !== saved.roleKey);
        return [...withoutSaved, saved].sort((left, right) => left.roleKey.localeCompare(right.roleKey));
      });
      setModalMode(null);
      setNotice(`${modalMode === "edit" ? "Updated" : "Created"} ${saved.name}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Failed to save role");
    } finally {
      setSubmitting(false);
    }
  }

  function togglePermission(permissionKey: string) {
    setForm((current) => {
      const selected = current.permissions.includes(permissionKey);
      return {
        ...current,
        permissions: selected
          ? current.permissions.filter((permission) => permission !== permissionKey)
          : [...current.permissions, permissionKey].sort(),
      };
    });
  }

  return (
    <AppShell>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle><I18nText value={{ en: "Roles", zh: "角色" }} /></CardTitle>
              <p className="mt-1 text-sm text-muted">
                {roles.length} <I18nText value={{ en: "roles configured", zh: "个角色已配置" }} />
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={loadRoles} disabled={refreshing}>
                <RefreshCw size={16} aria-hidden="true" />
                <I18nText value={{ en: "Refresh", zh: "刷新" }} />
              </Button>
              <Button type="button" onClick={openCreateModal}>
                <Plus size={16} aria-hidden="true" />
                <I18nText value={{ en: "New role", zh: "新建角色" }} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          {error ? (
            <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
          {notice ? (
            <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {notice}
            </div>
          ) : null}
          {loading ? (
            <p className="text-sm text-muted"><I18nText value={{ en: "Loading roles...", zh: "正在加载角色..." }} /></p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {roles.map((role) => (
                <Card key={role.roleKey} className="shadow-none">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <CardTitle className="truncate">{role.name}</CardTitle>
                        <p className="mt-1 text-sm text-muted">{role.roleKey}</p>
                      </div>
                      <Badge tone={role.roleKey === "owner" ? "info" : "neutral"}>{role.memberCount}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5">
                    <p className="min-h-10 text-sm text-muted">{role.description || "No description"}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {role.permissions.slice(0, 5).map((permission) => (
                        <Badge key={permission}>{permission}</Badge>
                      ))}
                      {role.permissions.length > 5 ? <Badge>+{role.permissions.length - 5}</Badge> : null}
                    </div>
                    <div className="mt-5 flex justify-end">
                      <Button type="button" variant="secondary" onClick={() => openEditModal(role)}>
                        <Pencil size={16} aria-hidden="true" />
                        <I18nText value={{ en: "Edit", zh: "编辑" }} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {modalMode ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
          <Card className="max-h-[92vh] w-full max-w-3xl overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-accentSoft text-accent">
                    <Shield size={18} aria-hidden="true" />
                  </span>
                  <CardTitle>
                    <I18nText value={modalMode === "edit" ? { en: "Edit role", zh: "编辑角色" } : { en: "New role", zh: "新建角色" }} />
                  </CardTitle>
                </div>
                <Button type="button" variant="ghost" onClick={() => setModalMode(null)}>
                  <X size={16} aria-hidden="true" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="max-h-[calc(92vh-86px)] overflow-y-auto p-5">
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label={{ en: "Role key", zh: "角色键" }}
                    value={form.roleKey}
                    disabled={modalMode === "edit"}
                    onChange={(event) => setForm((current) => ({ ...current, roleKey: event.target.value }))}
                    required
                  />
                  <Input
                    label={{ en: "Name", zh: "名称" }}
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    required
                  />
                </div>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <I18nText value={{ en: "Description", zh: "描述" }} />
                  <textarea
                    className="min-h-24 rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-accent focus:shadow-focus"
                    value={form.description}
                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  />
                </label>
                <div className="grid gap-3">
                  <p className="text-sm font-medium text-slate-700">
                    <I18nText value={{ en: "Permissions", zh: "权限" }} />
                  </p>
                  <div className="grid gap-2 md:grid-cols-2">
                    {permissions.map((permission) => (
                      <label
                        key={permission.permissionKey}
                        className="flex items-start gap-3 rounded-md border border-border bg-white px-3 py-3 text-sm transition hover:border-accent"
                      >
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 accent-blue-600"
                          checked={form.permissions.includes(permission.permissionKey)}
                          onChange={() => togglePermission(permission.permissionKey)}
                        />
                        <span>
                          <span className="block font-medium text-ink">{permission.permissionKey}</span>
                          <span className="block text-muted">{permission.description || permission.name}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2 border-t border-border pt-4">
                  <Button type="button" variant="secondary" onClick={() => setModalMode(null)}>
                    <I18nText value={{ en: "Cancel", zh: "取消" }} />
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    <Save size={16} aria-hidden="true" />
                    <I18nText value={submitting ? { en: "Saving...", zh: "正在保存..." } : { en: "Save role", zh: "保存角色" }} />
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
