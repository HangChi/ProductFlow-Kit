import { AppShell } from "@/components/app-shell";
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
            <CardTitle>AI chat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="rounded-md bg-surface p-4 text-sm text-slate-700">
                Ask the mock provider to summarize product feedback.
              </div>
              <div className="rounded-md border border-border bg-white p-4 text-sm text-slate-700">
                The provider abstraction is ready. Set AI_PROVIDER and API keys in .env.
              </div>
              <div className="flex gap-3">
                <Input label="Message" placeholder="Summarize this week's usage" />
                <div className="pt-6">
                  <Button type="button">Send</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prompt library</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {prompts.map((prompt) => (
                <div key={prompt.name} className="rounded-md border border-border p-3">
                  <p className="text-sm font-medium text-ink">{prompt.name}</p>
                  <p className="mt-1 text-sm text-muted">{prompt.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
