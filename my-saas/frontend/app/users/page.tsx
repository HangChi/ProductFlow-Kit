import { AppShell } from "@/components/app-shell";
import { I18nText } from "@/components/i18n";
import { UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { users } from "@/lib/mock-data";

export default function UsersPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle><I18nText value={{ en: "Users", zh: "用户" }} /></CardTitle>
              <p className="mt-1 text-sm text-muted">{users.length} <I18nText value="members" /></p>
            </div>
            <Button type="button">
              <UserPlus size={16} aria-hidden="true" />
              <I18nText value={{ en: "Invite", zh: "邀请" }} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-[680px] w-full border-collapse text-left text-sm">
              <thead className="border-b border-border bg-surfaceStrong text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium"><I18nText value={{ en: "Name", zh: "姓名" }} /></th>
                  <th className="px-4 py-3 font-medium"><I18nText value={{ en: "Email", zh: "邮箱" }} /></th>
                  <th className="px-4 py-3 font-medium"><I18nText value={{ en: "Role", zh: "角色" }} /></th>
                  <th className="px-4 py-3 font-medium"><I18nText value={{ en: "Status", zh: "状态" }} /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {users.map((user) => (
                  <tr key={user.email} className="transition hover:bg-surface">
                    <td className="px-4 py-3 font-medium text-ink">{user.name}</td>
                    <td className="px-4 py-3 text-muted">{user.email}</td>
                    <td className="px-4 py-3 text-muted"><I18nText value={user.role} /></td>
                    <td className="px-4 py-3">
                      <Badge tone={user.status === "active" ? "success" : "warning"}>
                        <I18nText value={user.status} />
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
