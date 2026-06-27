import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Workspace settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid max-w-2xl gap-4">
            <Input label="Workspace name" defaultValue="Ai Saas Mybatis" />
            <Input label="API base URL" defaultValue="http://localhost:8080" />
            <Input label="Enabled modules" defaultValue="auth, rbac, ai, audit-log" />
            <div>
              <Button type="button">Save settings</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}
