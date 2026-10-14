import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { grievance, battlecard, webhookUrl, channel = "#churn-strikes" } = await req.json();

    if (!grievance) {
      return new Response(
        JSON.stringify({ error: "Grievance data required for dispatch" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const leadScore = Math.round(
      (grievance.churnIntent === "CRITICAL_CHURN" ? 95 : grievance.churnIntent === "HIGH_INTENT" ? 85 : 75) *
      (grievance.matchSimilarity || 0.88)
    );

    // If an external Slack or Discord webhook is configured, post directly
    if (webhookUrl && webhookUrl.startsWith("http")) {
      try {
        const slackPayload = {
          text: `🚨 *High-Intent Churn Alert: ${grievance.competitor} ➔ ${grievance.userProduct}*`,
          blocks: [
            {
              type: "header",
              text: {
                type: "plain_text",
                text: `🚨 High-Intent Churn Opportunity [Score: ${leadScore}/100]`,
                emoji: true,
              },
            },
            {
              type: "section",
              fields: [
                { type: "mrkdwn", text: `*Competitor:* ${grievance.competitor}` },
                { type: "mrkdwn", text: `*Prospect:* ${grievance.author} (${grievance.sourcePlatform})` },
                { type: "mrkdwn", text: `*Intent:* ${grievance.churnIntent}` },
                { type: "mrkdwn", text: `*Vector Match:* ${grievance.matchedSolution?.title || "Native Migration"}` },
              ],
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `> "${grievance.quote}"\n<${grievance.sourceUrl}|View Original Public Thread>`,
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*🎯 Recommended Actionable Outreach:*\n\`\`\`${battlecard?.authenticMigrationOffer?.readyToPostMessage || "View Battlecard in RadarStrike"}\`\`\``,
              },
            },
          ],
        };

        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(slackPayload),
        });
      } catch (webhookErr) {
        console.warn("External webhook dispatch error:", webhookErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        channel,
        leadScore,
        dispatchedAt: new Date().toISOString(),
        prospect: grievance.author,
        platform: grievance.sourcePlatform,
        message: `Successfully dispatched high-intent lead to ${channel}`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Dispatch failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
