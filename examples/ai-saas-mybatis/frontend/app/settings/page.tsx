import { AppShell } from "@/components/app-shell";
import { I18nText } from "@/components/i18n";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle><I18nText value={{ en: "Workspace settings", zh: "工作区设置" }} /></CardTitle>
            <span className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted">ai-saas</span>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <form className="grid gap-5 lg:grid-cols-2">
            <Input label={{ en: "Workspace name", zh: "工作区名称" }} defaultValue="Ai Saas Mybatis" />
            <Input label={{ en: "API base URL", zh: "API 基础地址" }} defaultValue="http://localhost:8080" />
            <Input containerClassName="lg:col-span-2" label={{ en: "Enabled modules", zh: "已启用模块" }} defaultValue="auth, rbac, ai, audit-log" />
            <div className="flex justify-end border-t border-border pt-5 lg:col-span-2">
              <Button type="button">
                <Save size={16} aria-hidden="true" />
                <I18nText value={{ en: "Save settings", zh: "保存设置" }} />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}
