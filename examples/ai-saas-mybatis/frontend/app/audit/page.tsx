import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auditLogs } from "@/lib/mock-data";

export default function AuditPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Audit logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between rounded-md border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-ink">{log.action}</p>
                  <p className="text-sm text-muted">{log.actor} · {log.time}</p>
                </div>
                <Badge>{log.scope}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
