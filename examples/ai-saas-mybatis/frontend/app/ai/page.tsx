import { AppShell } from "@/components/app-shell";
import { I18nText } from "@/components/i18n";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { prompts } from "@/lib/mock-data";

export default function AiPage() {
  return (
    <AppShell>
      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle><I18nText value={{ en: "AI chat", zh: "AI 对话" }} /></CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="space-y-4">
              <div className="rounded-md bg-surfaceStrong p-4 text-sm text-slate-700">
                <I18nText value={{ en: "Ask the mock provider to summarize product feedback.", zh: "让模拟供应商总结产品反馈。" }} />
              </div>
              <div className="rounded-md border border-border bg-white p-4 text-sm text-slate-700">
                <I18nText value={{ en: "The provider abstraction is ready. Set AI_PROVIDER and API keys in .env.", zh: "供应商抽象已准备好。可在 .env 中设置 AI_PROVIDER 和 API 密钥。" }} />
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <Input label={{ en: "Message", zh: "消息" }} placeholder="Summarize this week's usage" />
                <div>
                  <Button type="button" className="w-full sm:w-auto">
                    <Send size={16} aria-hidden="true" />
                    <I18nText value={{ en: "Send", zh: "发送" }} />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle><I18nText value={{ en: "Prompt library", zh: "提示词库" }} /></CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="space-y-3">
              {prompts.map((prompt) => (
                <div key={prompt.name} className="rounded-md border border-border bg-surface p-3 transition hover:border-accent">
                  <p className="text-sm font-medium text-ink"><I18nText value={prompt.name} /></p>
                  <p className="mt-1 text-sm text-muted"><I18nText value={prompt.description} /></p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
