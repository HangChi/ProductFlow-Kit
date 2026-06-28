"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { I18nText } from "@/components/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiGet } from "@/lib/api";

type AuditLog = {
  id: number;
  actorEmail: string;
  action: string;
  scope: string;
  metadata: string | null;
  createdAt: string;
};

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    setError("");
    setRefreshing(true);
    try {
      const nextLogs = await apiGet<AuditLog[]>("/api/audit-logs");
      setLogs(nextLogs);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Failed to load audit logs");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  return (
    <AppShell>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle><I18nText value={{ en: "Audit logs", zh: "审计日志" }} /></CardTitle>
              <p className="mt-1 text-sm text-muted">
                {logs.length} <I18nText value={{ en: "recent events", zh: "条最近事件" }} />
              </p>
            </div>
            <Button type="button" variant="secondary" onClick={loadLogs} disabled={refreshing}>
              <RefreshCw size={16} aria-hidden="true" />
              <I18nText value={{ en: "Refresh", zh: "刷新" }} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          {error ? (
            <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
          {loading ? (
            <p className="text-sm text-muted"><I18nText value={{ en: "Loading audit logs...", zh: "正在加载审计日志..." }} /></p>
          ) : logs.length === 0 ? (
            <div className="rounded-md border border-border bg-surface px-4 py-8 text-center text-sm text-muted">
              <I18nText value={{ en: "No audit events yet.", zh: "暂无审计事件。" }} />
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="flex flex-col gap-3 rounded-md border border-border bg-white p-3 transition hover:bg-surface sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">{log.action}</p>
                    <p className="mt-1 text-sm text-muted">
                      {log.actorEmail} / {formatDate(log.createdAt)}
                    </p>
                    {log.metadata ? <p className="mt-1 text-xs text-muted">{log.metadata}</p> : null}
                  </div>
                  <Badge className="shrink-0">{log.scope}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
