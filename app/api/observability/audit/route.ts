import { NextRequest, NextResponse } from "next/server";
import { auditLogger } from "@/lib/observability";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const org_id = url.searchParams.get("org_id");
    const module_id = url.searchParams.get("module_id");
    const verdict = url.searchParams.get("verdict") as
      | "pass"
      | "partial_pass"
      | "fail"
      | null;
    const limit = parseInt(url.searchParams.get("limit") || "100");
    const export_format = url.searchParams.get("export"); // "json" for export

    const filter = {
      org_id: org_id || undefined,
      module_id: module_id || undefined,
      verdict: verdict || undefined,
      limit,
    };

    if (export_format === "json") {
      const exportData = auditLogger.exportLogs(filter);

      return NextResponse.json(exportData, {
        headers: {
          "Content-Disposition": `attachment; filename="audit-logs-${new Date().toISOString().split("T")[0]}.json"`,
        },
      });
    }

    const logs = auditLogger.queryLogs(filter);
    const statistics = auditLogger.getStatistics(filter);
    const trend = auditLogger.getLogsTrend(24);

    return NextResponse.json({
      logs,
      statistics,
      trend,
      filter_applied: filter,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[API] Failed to get audit logs:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const required = [
      "run_id",
      "org_id",
      "module_id",
      "signature_7d",
      "model",
      "tokens",
      "cost",
      "export_formats",
      "duration_ms",
    ];
    const missing = required.filter((field) => !(field in body));

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 },
      );
    }

    // Log the run
    auditLogger.logRun({
      run_id: body.run_id,
      org_id: body.org_id,
      module_id: body.module_id,
      signature_7d: body.signature_7d,
      model: body.model,
      tokens: body.tokens,
      cost: body.cost,
      score: body.score,
      export_formats: body.export_formats,
      prompt_content: body.prompt_content,
      input_content: body.input_content,
      output_content: body.output_content,
      duration_ms: body.duration_ms,
      error_code: body.error_code,
      metadata: body.metadata,
    });

    return NextResponse.json({
      status: "logged",
      run_id: body.run_id,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[API] Failed to log audit entry:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
