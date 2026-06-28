"use client";

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

type Language = "en" | "zh";
type LanguageMode = Language | "bilingual";

export type LocalizedText = string | { en: string; zh: string };

const languageMode = "bilingual" as LanguageMode;
const defaultLanguage = "zh" as Language;
const storageKey = "productflow-language";

const zhDictionary: Record<string, string> = {
  "Dashboard": "工作台",
  "Users": "用户",
  "Roles": "角色",
  "AI Chat": "AI 对话",
  "Audit Logs": "审计日志",
  "Files": "文件",
  "Email": "邮件",
  "Prototype": "原型",
  "Settings": "设置",
  "Workspace": "工作区",
  "Local demo": "本地演示",
  "AI usage": "AI 用量",
  "Live": "实时",
  "Attention": "需关注",
  "On track": "运行良好",
  "Weekly": "本周",
  "Latest": "最新",
  "Mock provider calls this week": "本周模拟供应商调用",
  "Operating rhythm": "运营节奏",
  "Acquisition": "获客",
  "Activation": "激活",
  "Retention": "留存",
  "Lead quality and first contact momentum.": "线索质量与首次触达节奏。",
  "Onboarding tasks moving through launch.": "上线前的入门任务推进。",
  "Renewal signals and account health.": "续约信号与账户健康度。",
  "Mock workflow lane for product teams.": "面向产品团队的模拟工作流泳道。",
  "Activity": "动态",
  "Workspace settings": "工作区设置",
  "Workspace name": "工作区名称",
  "API base URL": "API 基础地址",
  "Enabled modules": "已启用模块",
  "Save settings": "保存设置",
  "Invite": "邀请",
  "Name": "姓名",
  "Role": "角色",
  "Status": "状态",
  "Owner": "负责人",
  "Admin": "管理员",
  "Member": "成员",
  "active": "启用",
  "invited": "已邀请",
  "members": "名成员",
  "AI chat": "AI 对话",
  "Ask the mock provider to summarize product feedback.": "让模拟供应商总结产品反馈。",
  "The provider abstraction is ready. Set AI_PROVIDER and API keys in .env.": "供应商抽象已准备好。可在 .env 中设置 AI_PROVIDER 和 API 密钥。",
  "Message": "消息",
  "Send": "发送",
  "Prompt library": "提示词库",
  "Audit logs": "审计日志",
  "Upload": "上传",
  "File storage module placeholder. Wire this to S3, R2, OSS, or local storage.": "文件存储模块占位。可接入 S3、R2、OSS 或本地存储。",
  "Email preview": "邮件预览",
  "Recipient": "收件人",
  "Subject": "主题",
  "Template key": "模板键",
  "Render preview": "生成预览",
  "Feedback summary": "反馈总结",
  "Condense user feedback into themes and next actions.": "将用户反馈压缩为主题和下一步动作。",
  "Churn risk": "流失风险",
  "Explain account health signals and likely churn drivers.": "解释账户健康信号和可能的流失原因。",
  "Release note": "发布说明",
  "Turn shipped work into customer-facing release notes.": "把已发布工作转成面向客户的发布说明。",
  "Workspace settings updated": "工作区设置已更新",
  "Role policy changed": "角色策略已变更",
  "Usage report generated": "用量报告已生成",
  "settings": "设置",
  "rbac": "权限",
  "report": "报告",
  "User invited": "用户已邀请",
  "Role permissions updated": "角色权限已更新",
  "AI prompt published": "AI 提示词已发布",
  "auth": "认证",
  "ai": "AI",
  "Yesterday": "昨天",
  "Discover": "发现",
  "Map user goals, entry points, and first-run intent.": "梳理用户目标、入口和首次使用意图。",
  "Operate": "运营",
  "Model daily workflows across dashboard, users, and roles.": "建模工作台、用户与角色中的日常流程。",
  "Automate": "自动化",
  "Attach AI and system actions to repeatable product jobs.": "把 AI 和系统动作接入可重复的产品任务。",
  "Measure": "衡量",
  "Review usage, audit logs, and lifecycle metrics.": "查看用量、审计日志和生命周期指标。",
  "Full workspace and billing access.": "拥有工作区和计费的完整权限。",
  "Can manage users, roles, and operations.": "可管理用户、角色和运营流程。",
  "Can use product workflows and AI tools.": "可使用产品流程和 AI 工具。",
  "Create": "创建",
  "Vue admin workspace": "Vue 管理工作区",
  "Revenue": "收入",
  "Active users": "活跃用户",
  "Conversion": "转化率",
  "Open tasks": "待办任务",
  "+12.5% vs last month": "较上月 +12.5%",
  "+842 this week": "本周 +842",
  "Healthy funnel": "漏斗健康",
  "9 need attention": "9 项需要关注",
  "Operators": "运营人员",
  "Jobs": "任务",
  "Incidents": "事件",
  "Automation": "自动化",
  "12 online": "12 人在线",
  "29 pending": "29 项待处理",
  "2 urgent": "2 项紧急",
  "Healthy": "健康",
  "Accounts": "客户",
  "Deals": "商机",
  "Activities": "活动",
  "Contacts": "联系人",
  "Pipeline": "销售管道",
  "Stage": "阶段",
  "Value": "金额",
  "Close date": "预计成交",
  "New account": "新建客户",
  "New deal": "新建商机",
  "Log activity": "记录活动",
  "Articles": "文章",
  "Publishing calendar": "发布日历",
  "Collections": "合集",
  "Title": "标题",
  "Channel": "渠道",
  "Publish date": "发布日期",
  "Editor": "编辑",
  "New article": "新建文章",
  "Schedule content": "安排内容",
  "Create collection": "创建合集",
  "Knowledge articles": "知识文章",
  "Search feedback": "搜索反馈",
  "Help collections": "帮助合集",
  "Category": "分类",
  "Question": "问题",
  "Result quality": "结果质量",
  "Create article": "新建文章",
  "Review feedback": "查看反馈",
  "Approval requests": "审批请求",
  "Approval rules": "审批规则",
  "Request": "请求",
  "Requester": "申请人",
  "Approver": "审批人",
  "Policy": "策略",
  "Priority": "优先级",
  "Open request": "发起申请",
  "New rule": "新建规则",
  "Leads": "线索",
  "Company": "公司",
  "Source": "来源",
  "Plan": "套餐",
  "New lead": "新建线索",
  "API keys": "API 密钥",
  "Webhooks": "Webhook",
  "Usage events": "用量事件",
  "Key": "密钥",
  "Endpoint": "端点",
  "Event": "事件",
  "Last used": "最近使用",
  "Create key": "创建密钥",
  "Add webhook": "添加 Webhook",
  "Run job": "运行任务",
  "Open incident": "创建事件",
  "Teams": "团队",
  "Team": "团队",
  "Coverage": "覆盖范围",
  "Schedule": "计划",
  "Incident": "事件",
  "Severity": "严重级别"
};

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
}>({
  language: defaultLanguage,
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  useEffect(() => {
    if (languageMode !== "bilingual") {
      return;
    }

    const stored = window.localStorage.getItem(storageKey);
    if (stored === "en" || stored === "zh") {
      setLanguageState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.documentElement.dataset.language = language;

    if (languageMode === "bilingual") {
      window.localStorage.setItem(storageKey, language);
    }
  }, [language]);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(languageMode === "bilingual" ? nextLanguage : defaultLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function resolveText(value: LocalizedText, language: Language) {
  if (typeof value !== "string") {
    return value[language];
  }

  return language === "zh" ? zhDictionary[value] ?? value : value;
}

export function I18nText({ value }: { value: LocalizedText }) {
  const { language } = useLanguage();
  return <>{resolveText(value, language)}</>;
}

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  if (languageMode !== "bilingual") {
    return null;
  }

  return (
    <div className="inline-flex rounded-md border border-border bg-white p-1 text-sm shadow-sm" aria-label="Language">
      {(["en", "zh"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLanguage(option)}
          className={
            "h-8 rounded px-3 font-medium transition " +
            (language === option ? "bg-accent text-white" : "text-slate-600 hover:bg-surface hover:text-ink")
          }
        >
          {option === "en" ? "EN" : "中文"}
        </button>
      ))}
    </div>
  );
}
