import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_calendar/calendar/v3";

const BookingSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  book: z.string().trim().max(200).optional().default(""),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  timezone: z.string().min(1).max(64),
  notes: z.string().trim().max(1000).optional().default(""),
});

export const bookAuditCall = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => BookingSchema.parse(input))
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    const GOOGLE_CALENDAR_API_KEY = process.env.GOOGLE_CALENDAR_API_KEY;
    if (!GOOGLE_CALENDAR_API_KEY) throw new Error("GOOGLE_CALENDAR_API_KEY is not configured");

    const start = new Date(`${data.date}T${data.time}:00`);
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    const event = {
      summary: `Listopia Audit Call — ${data.name}`,
      description:
        `Goodreads Listopia audit call.\n\n` +
        `Name: ${data.name}\n` +
        `Email: ${data.email}\n` +
        `Book: ${data.book || "—"}\n\n` +
        `Notes:\n${data.notes || "—"}`,
      start: { dateTime: start.toISOString().replace(/\.\d{3}Z$/, "Z"), timeZone: data.timezone },
      end: { dateTime: end.toISOString().replace(/\.\d{3}Z$/, "Z"), timeZone: data.timezone },
      attendees: [{ email: data.email, displayName: data.name }],
      reminders: { useDefault: true },
    };

    const res = await fetch(`${GATEWAY_URL}/calendars/primary/events?sendUpdates=all`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GOOGLE_CALENDAR_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Google Calendar create event failed", res.status, body);
      throw new Error(`Failed to create calendar event [${res.status}]`);
    }

    return { ok: true as const, eventId: body.id as string, htmlLink: body.htmlLink as string };
  });

const LeadSchema = z.object({
  email: z.string().trim().email().max(255),
  book: z.string().trim().min(1).max(200),
});

export const captureExitLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => LeadSchema.parse(input))
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    const GOOGLE_CALENDAR_API_KEY = process.env.GOOGLE_CALENDAR_API_KEY;
    if (!GOOGLE_CALENDAR_API_KEY) throw new Error("GOOGLE_CALENDAR_API_KEY is not configured");

    // Schedule a follow-up reminder on Dan's calendar (no attendees) the next day at 10:00 UTC.
    const start = new Date();
    start.setUTCDate(start.getUTCDate() + 1);
    start.setUTCHours(10, 0, 0, 0);
    const end = new Date(start.getTime() + 15 * 60 * 1000);

    const event = {
      summary: `Lead follow-up — ${data.email}`,
      description:
        `New exit-intent lead from danbrown.lovable.app\n\n` +
        `Email: ${data.email}\n` +
        `Book: ${data.book}\n\n` +
        `Reach out to schedule the free Listopia audit.`,
      start: { dateTime: start.toISOString().replace(/\.\d{3}Z$/, "Z"), timeZone: "UTC" },
      end: { dateTime: end.toISOString().replace(/\.\d{3}Z$/, "Z"), timeZone: "UTC" },
      reminders: { useDefault: true },
    };

    const res = await fetch(`${GATEWAY_URL}/calendars/primary/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GOOGLE_CALENDAR_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Google Calendar create lead failed", res.status, body);
      throw new Error(`Failed to save lead [${res.status}]`);
    }

    return { ok: true as const };
  });