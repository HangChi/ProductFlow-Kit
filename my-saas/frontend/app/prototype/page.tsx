import { AppShell } from "@/components/app-shell";
import { I18nText } from "@/components/i18n";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prototypeSteps } from "@/lib/mock-data";

export default function PrototypePage() {
  return (
    <AppShell>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {prototypeSteps.map((step) => (
          <Card key={step.title} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle><I18nText value={step.title} /></CardTitle>
                <Badge tone="info">{step.progress}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <p className="text-sm text-muted"><I18nText value={step.description} /></p>
              <div className="mt-5 h-2 rounded-full bg-surfaceStrong">
                <div className="h-2 rounded-full bg-accent" style={{ width: step.progress }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
