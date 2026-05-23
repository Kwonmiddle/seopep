import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { policies } from "@/lib/policies";

export const runtime = "nodejs";

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}

function normalizePrivateKey(privateKey: string) {
  let key = privateKey.trim();

  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }

  return key.replace(/\\n/g, "\n");
}

function getFormValue(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

function getFormValues(formData: FormData, name: string) {
  return formData
    .getAll(name)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
}

function getSheetRange(sheetName: string) {
  const escapedSheetName = sheetName.replaceAll("'", "''");

  return `'${escapedSheetName}'`;
}

function getErrorCode(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "unknown";

  if (message.includes("is not configured")) {
    return "config";
  }

  if (
    message.includes("invalid_grant") ||
    message.includes("DECODER") ||
    message.includes("private key") ||
    message.includes("No key or keyFile set")
  ) {
    return "auth";
  }

  if (
    message.includes("Unable to parse range") ||
    message.includes("not found") ||
    message.includes("Requested entity was not found")
  ) {
    return "sheet";
  }

  if (message.includes("permission") || message.includes("PERMISSION_DENIED")) {
    return "permission";
  }

  return "unknown";
}

function redirectWithError(request: NextRequest, code: string) {
  return NextResponse.redirect(new URL(`/?error=submit&code=${code}`, request.url), {
    status: 303,
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const serviceAccountEmail = getRequiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
    const privateKey = normalizePrivateKey(getRequiredEnv("GOOGLE_PRIVATE_KEY"));
    const spreadsheetId = getRequiredEnv("GOOGLE_SHEET_ID");
    const sheetName = process.env.GOOGLE_SHEET_TAB_NAME?.trim() || "Sheet1";

    const auth = new google.auth.JWT({
      email: serviceAccountEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const selectedPolicies = getFormValues(formData, "policies");
    const selectedPolicySet = new Set(selectedPolicies);
    const policyColumns = policies.map((policy) =>
      selectedPolicySet.has(policy) ? "1" : "",
    );

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: getSheetRange(sheetName),
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [
          [
            new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
            getFormValue(formData, "name"),
            getFormValue(formData, "phone"),
            getFormValue(formData, "address"),
            getFormValue(formData, "email"),
            getFormValue(formData, "talk"),
            getFormValue(formData, "firstAssembly"),
            getFormValue(formData, "secondAssembly"),
            getFormValue(formData, "memo"),
            ...policyColumns,
            getFormValue(formData, "customPolicy"),
          ],
        ],
      },
    });

    return NextResponse.redirect(new URL("/?submitted=1", request.url), {
      status: 303,
    });
  } catch (error) {
    const errorCode = getErrorCode(error);
    console.error("Failed to submit policy vote", errorCode, error);

    return redirectWithError(request, errorCode);
  }
}
