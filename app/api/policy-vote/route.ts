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
  return privateKey.replace(/\\n/g, "\n");
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

  return `'${escapedSheetName}'!A:AI`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const serviceAccountEmail = getRequiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
    const privateKey = normalizePrivateKey(getRequiredEnv("GOOGLE_PRIVATE_KEY"));
    const spreadsheetId = getRequiredEnv("GOOGLE_SHEET_ID");
    const sheetName = process.env.GOOGLE_SHEET_TAB_NAME?.trim() || "Sheet1";

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: serviceAccountEmail,
        private_key: privateKey,
      },
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
      requestBody: {
        values: [
          [
            new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
            getFormValue(formData, "name"),
            getFormValue(formData, "phone"),
            getFormValue(formData, "address"),
            getFormValue(formData, "email"),
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
    console.error("Failed to submit policy vote", error);

    return NextResponse.redirect(new URL("/?error=submit", request.url), {
      status: 303,
    });
  }
}
