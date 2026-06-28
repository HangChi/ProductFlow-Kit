import { AppShell } from "@/components/app-shell";
import { I18nText } from "@/components/i18n";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { roles } from "@/lib/mock-data";

export default function RolesPage() {
  return (
    <AppShell>
      <div className="grid gap-4 md:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.name}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle><I18nText value={role.name} /></CardTitle>
                <Badge tone={role.name === "Owner" ? "info" : "neutral"}>{role.members}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <p className="text-sm text-muted"><I18nText value={role.description} /></p>
              <p className="mt-4 text-sm font-medium text-ink">{role.members} <I18nText value="members" /></p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
