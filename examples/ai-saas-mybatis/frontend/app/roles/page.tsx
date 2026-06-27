import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { roles } from "@/lib/mock-data";

export default function RolesPage() {
  return (
    <AppShell>
      <div className="grid gap-4 md:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.name}>
            <CardHeader>
              <CardTitle>{role.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted">{role.description}</p>
              <p className="mt-4 text-sm font-medium text-ink">{role.members} members</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
