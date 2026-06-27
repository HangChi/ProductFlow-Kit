export const metrics = [
  {
    "label": "Revenue",
    "value": "$42.8k",
    "change": "+12.5% vs last month"
  },
  {
    "label": "Active users",
    "value": "8,240",
    "change": "+842 this week"
  },
  {
    "label": "Conversion",
    "value": "7.6%",
    "change": "Healthy funnel"
  },
  {
    "label": "Open tasks",
    "value": "31",
    "change": "9 need attention"
  }
];

export const users = [
  { name: "Ada Chen", email: "ada@example.com", role: "Owner", status: "active" },
  { name: "Ben Miller", email: "ben@example.com", role: "Admin", status: "active" },
  { name: "Chris Zhou", email: "chris@example.com", role: "Member", status: "invited" },
];

export const roles = [
  { name: "Owner", description: "Full workspace and billing access.", members: 1 },
  { name: "Admin", description: "Can manage users, roles, and operations.", members: 3 },
  { name: "Member", description: "Can use product workflows and AI tools.", members: 24 },
];

export const activities = [
  { id: "act_1", title: "Workspace settings updated", actor: "Ada Chen", kind: "settings" },
  { id: "act_2", title: "Role policy changed", actor: "Ben Miller", kind: "rbac" },
  { id: "act_3", title: "Usage report generated", actor: "System", kind: "report" },
];

export const auditLogs = [
  { id: "log_1", action: "User invited", actor: "Ada Chen", scope: "auth", time: "10:24" },
  { id: "log_2", action: "Role permissions updated", actor: "Ben Miller", scope: "rbac", time: "09:18" },
  { id: "log_3", action: "AI prompt published", actor: "System", scope: "ai", time: "Yesterday" },
];

export const prompts = [
  { name: "Feedback summary", description: "Condense user feedback into themes and next actions." },
  { name: "Churn risk", description: "Explain account health signals and likely churn drivers." },
  { name: "Release note", description: "Turn shipped work into customer-facing release notes." },
];

export const prototypeSteps = [
  { title: "Discover", description: "Map user goals, entry points, and first-run intent.", progress: "88%" },
  { title: "Operate", description: "Model daily workflows across dashboard, users, and roles.", progress: "72%" },
  { title: "Automate", description: "Attach AI and system actions to repeatable product jobs.", progress: "64%" },
  { title: "Measure", description: "Review usage, audit logs, and lifecycle metrics.", progress: "78%" },
];

export const templateInfo = {
  id: "ai-saas",
  modules: ["auth","rbac","ai","audit-log"],
};
