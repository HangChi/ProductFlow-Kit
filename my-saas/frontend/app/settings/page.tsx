"use client";

import { FormEvent, useEffect, useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { I18nText } from "@/components/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { API_URL, enabledModules } from "@/lib/api";

const settingsKey = "productflow-workspace-settings";

type WorkspaceSettings = {
  workspaceName: string;
  apiBaseUrl: string;
  enabledModules: string;
};

const defaultSettings: WorkspaceSettings = {
  workspaceName: "My Saas",
  apiBaseUrl: API_URL,
  enabledModules: enabledModules.join(", "),
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(settingsKey);
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      } catch {
        setSettings(defaultSettings);
      }
    }
    setLoading(false);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.localStorage.setItem(settingsKey, JSON.stringify(settings));
    setNotice("Workspace settings saved locally");
  }

  function resetSettings() {
    window.localStorage.removeItem(settingsKey);
    setSettings(defaultSettings);
    setNotice("Workspace settings reset");
  }

  return (
    <AppShell>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle><I18nText value={{ en: "Workspace settings", zh: "工作区设置" }} /></CardTitle>
              <p className="mt-1 text-sm text-muted">
                <I18nText value={{ en: "Saved in this browser until a settings API is added.", zh: "在设置 API 完成前，配置会保存在当前浏览器。" }} />
              </p>
            </div>
            <span className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted">saas-admin</span>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          {loading ? (
            <p className="text-sm text-muted"><I18nText value={{ en: "Loading settings...", zh: "正在加载设置..." }} /></p>
          ) : (
            <form className="grid gap-5 lg:grid-cols-2" onSubmit={handleSubmit}>
              {notice ? (
                <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 lg:col-span-2">
                  {notice}
                </div>
              ) : null}
              <Input
                label={{ en: "Workspace name", zh: "工作区名称" }}
                value={settings.workspaceName}
                onChange={(event) => setSettings((current) => ({ ...current, workspaceName: event.target.value }))}
              />
              <Input
                label={{ en: "API base URL", zh: "API 基础地址" }}
                value={settings.apiBaseUrl}
                onChange={(event) => setSettings((current) => ({ ...current, apiBaseUrl: event.target.value }))}
              />
              <Input
                containerClassName="lg:col-span-2"
                label={{ en: "Enabled modules", zh: "已启用模块" }}
                value={settings.enabledModules}
                onChange={(event) => setSettings((current) => ({ ...current, enabledModules: event.target.value }))}
              />
              <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-5 lg:col-span-2">
                <Button type="button" variant="secondary" onClick={resetSettings}>
                  <RotateCcw size={16} aria-hidden="true" />
                  <I18nText value={{ en: "Reset", zh: "重置" }} />
                </Button>
                <Button type="submit">
                  <Save size={16} aria-hidden="true" />
                  <I18nText value={{ en: "Save settings", zh: "保存设置" }} />
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
