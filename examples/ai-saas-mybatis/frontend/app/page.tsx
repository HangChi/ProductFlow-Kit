import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { activities, metrics } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <AppShell>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader>
              <CardTitle>{metric.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-ink">{metric.value}</p>
              <p className="mt-2 text-sm text-muted">{metric.change}</p>
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardHeader>
            <CardTitle>AI usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-ink">1.8k</p>
            <p className="mt-2 text-sm text-muted">Mock provider calls this week</p>
          </CardContent>
        </Card>

      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Operating rhythm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              {["Acquisition", "Activation", "Retention"].map((stage) => (
                <div key={stage} className="rounded-md border border-border bg-surface p-4">
                  <p className="text-sm font-semibold text-ink">{stage}</p>
                  <p className="mt-2 text-sm text-muted">Mock workflow lane for product teams.</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{activity.title}</p>
                    <p className="text-sm text-muted">{activity.actor}</p>
                  </div>
                  <Badge>{activity.kind}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
