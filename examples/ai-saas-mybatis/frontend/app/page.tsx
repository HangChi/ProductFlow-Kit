import { AppShell } from "@/components/app-shell";
import { I18nText } from "@/components/i18n";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { activities, metrics } from "@/lib/mock-data";

const stages = [
  {
    label: { en: "Acquisition", zh: "获客" },
    description: { en: "Lead quality and first contact momentum.", zh: "线索质量与首次触达节奏。" },
    progress: "78%",
    tone: "bg-accent",
  },
  {
    label: { en: "Activation", zh: "激活" },
    description: { en: "Onboarding tasks moving through launch.", zh: "上线前的入门任务推进。" },
    progress: "64%",
    tone: "bg-success",
  },
  {
    label: { en: "Retention", zh: "留存" },
    description: { en: "Renewal signals and account health.", zh: "续约信号与账户健康度。" },
    progress: "71%",
    tone: "bg-warning",
  },
];

export default function DashboardPage() {
  return (
    <AppShell>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric, index) => (
          <Card key={metric.label} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-muted"><I18nText value={metric.label} /></p>
                <Badge tone={index === metrics.length - 1 ? "warning" : "success"}>
                  <I18nText value={index === metrics.length - 1 ? { en: "Attention", zh: "需关注" } : { en: "On track", zh: "运行良好" }} />
                </Badge>
              </div>
              <p className="mt-4 text-3xl font-semibold text-ink">{metric.value}</p>
              <p className="mt-2 text-sm text-muted"><I18nText value={metric.change} /></p>
            </CardContent>
          </Card>
        ))}
        <Card className="overflow-hidden border-blue-200">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-muted"><I18nText value={{ en: "AI usage", zh: "AI 用量" }} /></p>
              <Badge tone="info"><I18nText value={{ en: "Live", zh: "实时" }} /></Badge>
            </div>
            <p className="mt-4 text-3xl font-semibold text-ink">1.8k</p>
            <p className="mt-2 text-sm text-muted"><I18nText value={{ en: "Mock provider calls this week", zh: "本周模拟供应商调用" }} /></p>
          </CardContent>
        </Card>

      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle><I18nText value={{ en: "Operating rhythm", zh: "运营节奏" }} /></CardTitle>
              <Badge tone="info"><I18nText value={{ en: "Weekly", zh: "本周" }} /></Badge>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid gap-3 md:grid-cols-3">
              {stages.map((stage) => (
                <div key={stage.label.en} className="rounded-md border border-border bg-surface p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-ink"><I18nText value={stage.label} /></p>
                    <span className="text-sm font-semibold text-ink">{stage.progress}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted"><I18nText value={stage.description} /></p>
                  <div className="mt-4 h-2 rounded-full bg-surfaceStrong">
                    <div className={"h-2 rounded-full " + stage.tone} style={{ width: stage.progress }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle><I18nText value={{ en: "Activity", zh: "动态" }} /></CardTitle>
              <Badge><I18nText value={{ en: "Latest", zh: "最新" }} /></Badge>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink"><I18nText value={activity.title} /></p>
                    <p className="text-sm text-muted">{activity.actor}</p>
                  </div>
                  <Badge className="shrink-0"><I18nText value={activity.kind} /></Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
