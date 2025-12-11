import { createTool } from "@voltagent/core";
import { z } from "zod";

export const currentTimeTool = createTool({
  name: "current_time",
  description: "Returns the current time as ISO and localized strings.",
  parameters: z.object({
    locale: z.string().optional().describe("Locale passed to Intl.DateTimeFormat"),
    timeZone: z.string().optional().describe("IANA timezone identifier"),
  }),
  outputSchema: z.object({
    iso: z.string(),
    display: z.string(),
  }),
  async execute({ locale, timeZone }) {
    const date = new Date();
    const formatter = Intl.DateTimeFormat(locale ?? "en-US", {
      timeZone,
      dateStyle: "full",
      timeStyle: "long",
    });

    return {
      iso: date.toISOString(),
      display: formatter.format(date),
    };
  },
});

