import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";
const OWNER_EMAIL = "dannabrownq@gmail.com";

const Schema = z.object({
  email: z.string().trim().email().max(255),
  calculator: z.string().trim().min(1).max(100),
  inputs: z.record(z.string().min(1).max(64), z.union([z.string().max(200), z.number()])),
  results: z.array(
    z.object({
      label: z.string().min(1).max(100),
      value: z.string().min(1).max(100),
    }),
  ).min(1).max(10),
});

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function buildRaw(to: string, subject: string, html: string, bcc?: string) {
  const headers = [
    `To: ${to}`,
    bcc ? `Bcc: ${bcc}` : "",
    `From: Dan Brown <me>`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "",
    html,
  ].filter(Boolean).join("\r\n");
  // base64url
  return Buffer.from(headers, "utf-8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export const emailCalculatorResult = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Schema.parse(input))
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    const GOOGLE_MAIL_API_KEY = process.env.GOOGLE_MAIL_API_KEY;
    if (!GOOGLE_MAIL_API_KEY) throw new Error("GOOGLE_MAIL_API_KEY is not configured");

    const inputsRows = Object.entries(data.inputs)
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 12px;color:#666;border-bottom:1px solid #eee">${escapeHtml(k)}</td><td style="padding:6px 12px;border-bottom:1px solid #eee">${escapeHtml(String(v))}</td></tr>`,
      )
      .join("");
    const resultsRows = data.results
      .map(
        (r) =>
          `<tr><td style="padding:8px 12px;color:#666;border-bottom:1px solid #eee">${escapeHtml(r.label)}</td><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #eee">${escapeHtml(r.value)}</td></tr>`,
      )
      .join("");

    const userHtml = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111">
        <h2 style="font-family:Georgia,serif;font-size:22px;margin:0 0 8px">Your ${escapeHtml(data.calculator)} results</h2>
        <p style="color:#555;margin:0 0 20px">Thanks for using the free author toolkit on danbrown.lovable.app. Here's a copy of what you calculated.</p>
        <h3 style="font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#888;margin:24px 0 6px">Results</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px">${resultsRows}</table>
        <h3 style="font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#888;margin:24px 0 6px">Inputs</h3>
        <table style="width:100%;border-collapse:collapse;font-size:13px">${inputsRows}</table>
        <p style="margin:28px 0 0;color:#555">Want a personalized Listopia campaign plan? Reply to this email and I'll set up a free audit call.</p>
        <p style="margin:6px 0 0;color:#111;font-weight:600">— Dan Brown</p>
      </div>`;
    const ownerHtml = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111">
        <h2 style="margin:0 0 8px">New calculator lead</h2>
        <p style="margin:0 0 16px"><strong>Email:</strong> ${escapeHtml(data.email)}<br/><strong>Calculator:</strong> ${escapeHtml(data.calculator)}</p>
        <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#888;margin:16px 0 6px">Inputs</h3>
        <table style="width:100%;border-collapse:collapse;font-size:13px">${inputsRows}</table>
        <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#888;margin:16px 0 6px">Results</h3>
        <table style="width:100%;border-collapse:collapse;font-size:13px">${resultsRows}</table>
      </div>`;

    const send = async (raw: string) => {
      const res = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": GOOGLE_MAIL_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        console.error("Gmail send failed", res.status, body);
        throw new Error(`Gmail send failed [${res.status}]`);
      }
    };

    await send(buildRaw(data.email, `Your ${data.calculator} results`, userHtml));
    await send(buildRaw(OWNER_EMAIL, `New lead: ${data.calculator} (${data.email})`, ownerHtml));

    return { ok: true as const };
  });