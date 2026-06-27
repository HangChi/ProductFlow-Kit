import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prototypeSteps } from "@/lib/mock-data";

export default function PrototypePage() {
  return (
    <AppShell>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {prototypeSteps.map((step) => (
          <Card key={step.title}>
            <CardHeader>
              <CardTitle>{step.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted">{step.description}</p>
              <div className="mt-4 h-2 rounded-full bg-surface">
                <div className="h-2 rounded-full bg-accent" style={{ width: step.progress }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
