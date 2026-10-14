import { NextRequest, NextResponse } from "next/server";
import { getOrSynthesizeBattleMatrix } from "@/lib/services/matrix";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { userProduct = "Resend", competitor = "SendGrid", selectedModel = "hybrid" } = await req.json();

    const matrix = await getOrSynthesizeBattleMatrix(userProduct, competitor, selectedModel);

    return NextResponse.json({ success: true, matrix });
  } catch (error: any) {
    console.error("Matrix generation error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
