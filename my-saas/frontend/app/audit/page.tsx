import { AppShell } from "@/components/app-shell";
import { I18nText } from "@/components/i18n";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auditLogs } from "@/lib/mock-data";

export default function AuditPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle><I18nText value={{ en: "Audit logs", zh: "审计日志" }} /></CardTitle>
            <Badge>{auditLogs.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between gap-4 rounded-md border border-border bg-white p-3 transition hover:bg-surface">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink"><I18nText value={log.action} /></p>
                  <p className="text-sm text-muted">{log.actor} / <I18nText value={log.time} /></p>
                </div>
                <Badge className="shrink-0"><I18nText value={log.scope} /></Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
