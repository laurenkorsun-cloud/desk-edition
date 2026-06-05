import { Resend } from "resend";
import type { EditionContent, EditionRow } from "@/lib/types";
import type { PersonalEditionContent } from "@/lib/config-types";
import type { PersonalEditionRow } from "@/lib/personal-editions";

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:4000";
}

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Missing RESEND_API_KEY");
  return new Resend(key);
}

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendConfirmEmail(params: {
  to: string;
  confirmToken: string;
}) {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL ?? "Desk Edition <onboarding@resend.dev>";
  const confirmUrl = `${getAppUrl()}/confirm?token=${params.confirmToken}`;

  await resend.emails.send({
    from,
    to: params.to,
    subject: "Confirm your Desk Edition subscription",
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
        <p style="font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: #666;">Desk Edition</p>
        <h1 style="font-size: 22px; font-weight: normal;">Confirm your subscription</h1>
        <p>You'll get a personalized morning briefing—news, modules you pick, and talking points—delivered around 9:30 AM in your timezone.</p>
        <p><a href="${confirmUrl}" style="display: inline-block; background: #1a3a2a; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Confirm subscription</a></p>
        <p style="font-size: 13px; color: #666;">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}

function buildEditionEmailHtml(edition: EditionRow, unsubscribeUrl: string) {
  const content = edition.content_json as EditionContent;
  const editionUrl = `${getAppUrl()}/edition/${edition.slug}`;
  const bullets = content.emailBullets
    .map((b) => `<li style="margin-bottom: 8px;">${escapeHtml(b)}</li>`)
    .join("");
  const talkingPoints = content.talkingPoints
    .map(
      (t, i) =>
        `<li style="margin-bottom: 10px;"><strong>${i + 1}.</strong> ${escapeHtml(t)}</li>`
    )
    .join("");

  return `
    <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.5;">
      <p style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #6b5c4f; margin-bottom: 4px;">Desk Edition</p>
      <h1 style="font-size: 26px; font-weight: normal; margin: 0 0 8px;">${escapeHtml(edition.title)}</h1>
      <p style="font-size: 17px; color: #333; font-style: italic; border-left: 3px solid #c4a574; padding-left: 16px; margin: 20px 0;">${escapeHtml(edition.lede)}</p>
      <h2 style="font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; color: #6b5c4f;">Today's headlines</h2>
      <ul style="padding-left: 20px;">${bullets}</ul>
      <h2 style="font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; color: #6b5c4f; margin-top: 28px;">Talking points</h2>
      <ul style="padding-left: 20px; background: #f8f5f0; padding: 16px 16px 16px 36px; border-radius: 6px;">${talkingPoints}</ul>
      <p style="margin-top: 28px;">
        <a href="${editionUrl}" style="display: inline-block; background: #1a3a2a; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-family: system-ui, sans-serif; font-size: 14px;">Read today's edition</a>
      </p>
      <hr style="border: none; border-top: 1px solid #e8e0d5; margin: 32px 0;" />
      <p style="font-size: 12px; color: #888; font-family: system-ui, sans-serif;">
        Delivered ~9:30 AM your local time · Summaries are editorial; always read original sources on the web edition.<br/>
        <a href="${unsubscribeUrl}" style="color: #888;">Unsubscribe</a>
      </p>
    </div>
  `;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendEditionEmail(params: {
  to: string;
  edition: EditionRow;
  unsubscribeToken: string;
}) {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL ?? "Desk Edition <onboarding@resend.dev>";
  const unsubscribeUrl = `${getAppUrl()}/unsubscribe?token=${params.unsubscribeToken}`;
  const subject = `Desk Edition — ${params.edition.title}`;

  const { data, error } = await resend.emails.send({
    from,
    to: params.to,
    subject,
    html: buildEditionEmailHtml(params.edition, unsubscribeUrl),
  });

  if (error) throw error;
  return data;
}

function buildPersonalEmailHtml(
  edition: PersonalEditionRow,
  token: string,
  unsubscribeUrl: string
) {
  const content = edition.content_json as PersonalEditionContent;
  const editionUrl = `${getAppUrl()}/me/${token}/${edition.slug}`;
  const bullets = content.emailBullets
    .map((b) => `<li style="margin-bottom: 8px;">${escapeHtml(b)}</li>`)
    .join("");
  const talkingPoints = content.talkingPoints
    .map(
      (t, i) =>
        `<li style="margin-bottom: 10px;"><strong>${i + 1}.</strong> ${escapeHtml(t)}</li>`
    )
    .join("");
  const moduleBlocks = content.modules
    .map(
      (m) =>
        `<p style="margin: 12px 0;"><strong>${escapeHtml(m.title)}</strong><br/>${escapeHtml(m.body).replace(/\*\*/g, "")}</p>`
    )
    .join("");

  return `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <p style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #6b5c4f;">Desk Edition · Personal</p>
      <h1 style="font-size: 26px; font-weight: normal;">${escapeHtml(edition.title)}</h1>
      <p style="font-style: italic; border-left: 3px solid #c4a574; padding-left: 16px;">${escapeHtml(edition.lede)}</p>
      ${moduleBlocks}
      <h2 style="font-size: 14px; text-transform: uppercase; color: #6b5c4f;">Headlines</h2>
      <ul>${bullets}</ul>
      ${talkingPoints ? `<h2 style="font-size: 14px; text-transform: uppercase;">Talking points</h2><ul>${talkingPoints}</ul>` : ""}
      <p style="margin-top: 24px;"><a href="${editionUrl}" style="background: #1a3a2a; color: #fff; padding: 12px 24px; text-decoration: none;">Read your edition</a></p>
      <p style="font-size: 12px; color: #888; margin-top: 24px;">
        <a href="${getAppUrl()}/settings?token=${token}">Settings</a> · <a href="${unsubscribeUrl}">Unsubscribe</a>
      </p>
    </div>
  `;
}

export async function sendPersonalEditionEmail(params: {
  to: string;
  edition: PersonalEditionRow;
  unsubscribeToken: string;
}) {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL ?? "Desk Edition <onboarding@resend.dev>";
  const unsubscribeUrl = `${getAppUrl()}/unsubscribe?token=${params.unsubscribeToken}`;

  const { data, error } = await resend.emails.send({
    from,
    to: params.to,
    subject: `Desk Edition — ${params.edition.title}`,
    html: buildPersonalEmailHtml(
      params.edition,
      params.unsubscribeToken,
      unsubscribeUrl
    ),
  });

  if (error) throw error;
  return data;
}

export async function sendAlertEmail(message: string) {
  const alertTo = process.env.ALERT_EMAIL;
  if (!alertTo || !isResendConfigured()) {
    console.error("Alert:", message);
    return;
  }

  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL ?? "Desk Edition <onboarding@resend.dev>";

  await resend.emails.send({
    from,
    to: alertTo,
    subject: "[Desk Edition] Cron alert",
    text: message,
  });
}
