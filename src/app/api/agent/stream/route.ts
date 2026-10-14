import { NextRequest } from "next/server";
import { runAutonomousStrikePipeline, AgentEvent } from "@/lib/services/agent";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { userProduct, competitor, solutions, selectedModel } = await req.json();

    if (!userProduct || !competitor) {
      return new Response(
        JSON.stringify({ error: "userProduct and competitor are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    const sendEvent = async (event: AgentEvent) => {
      const payload = `data: ${JSON.stringify(event)}\n\n`;
      await writer.write(encoder.encode(payload));
    };

    // Run agent pipeline asynchronously and pipe events
    (async () => {
      try {
        await runAutonomousStrikePipeline({
          userProduct,
          competitor,
          solutions,
          selectedModel,
          onEvent: async (ev) => {
            await sendEvent(ev);
          },
        });
      } catch (err: any) {
        console.error("Agent pipeline error:", err);
        await sendEvent({
          id: `ev-err-${Date.now()}`,
          timestamp: Date.now(),
          agentName: "Strike Strategist",
          type: "error",
          message: `Pipeline encountered an error: ${err?.message || "Unknown error"}`,
        });
      } finally {
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
