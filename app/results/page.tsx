import Link from "next/link";
import { google } from "googleapis";
import { policies } from "@/lib/policies";

export const dynamic = "force-dynamic";

type SheetSummary = {
  submittedCount: number;
  totalPolicyVotes: number;
  talkCount: number;
  firstAssemblyCount: number;
  secondAssemblyCount: number;
  customPolicyCount: number;
  policyResults: Array<{
    policy: string;
    policyNumber: number;
    count: number;
    percentage: number;
  }>;
  updatedAt: string;
};

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

function getSheetRange(sheetName: string) {
  const escapedSheetName = sheetName.replaceAll("'", "''");

  return `'${escapedSheetName}'`;
}

function getColumnIndex(headers: string[], name: string, fallbackIndex: number) {
  const index = headers.findIndex(
    (header) => header.trim().toLowerCase() === name.toLowerCase(),
  );

  return index >= 0 ? index : fallbackIndex;
}

function isChecked(value: string | undefined) {
  return Boolean(value?.trim());
}

async function getSheetSummary(): Promise<SheetSummary> {
  const serviceAccountEmail = getRequiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = normalizePrivateKey(getRequiredEnv("GOOGLE_PRIVATE_KEY"));
  const spreadsheetId = getRequiredEnv("GOOGLE_SHEET_ID");
  const sheetName = process.env.GOOGLE_SHEET_TAB_NAME?.trim() || "Sheet1";

  const auth = new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: getSheetRange(sheetName),
  });

  const values = response.data.values ?? [];
  const headers = (values[0] ?? []).map((value) => String(value));
  const rows = values.slice(1).filter((row) => row.some((cell) => cell));

  const talkIndex = getColumnIndex(headers, "Talk", 5);
  const firstAssemblyIndex = getColumnIndex(headers, "1st", 6);
  const secondAssemblyIndex = getColumnIndex(headers, "2nd", 7);
  const customPolicyIndex = getColumnIndex(headers, "Policy_29", 37);
  const policyIndexes = policies.map((_, index) =>
    getColumnIndex(headers, `Policy_${index + 1}`, 9 + index),
  );

  const policyCounts = policies.map(() => 0);
  let totalPolicyVotes = 0;
  let talkCount = 0;
  let firstAssemblyCount = 0;
  let secondAssemblyCount = 0;
  let customPolicyCount = 0;

  rows.forEach((row) => {
    if (isChecked(String(row[talkIndex] ?? ""))) {
      talkCount += 1;
    }

    if (isChecked(String(row[firstAssemblyIndex] ?? ""))) {
      firstAssemblyCount += 1;
    }

    if (isChecked(String(row[secondAssemblyIndex] ?? ""))) {
      secondAssemblyCount += 1;
    }

    if (isChecked(String(row[customPolicyIndex] ?? ""))) {
      customPolicyCount += 1;
    }

    policyIndexes.forEach((columnIndex, policyIndex) => {
      if (isChecked(String(row[columnIndex] ?? ""))) {
        policyCounts[policyIndex] += 1;
        totalPolicyVotes += 1;
      }
    });
  });

  const policyResults = policies
    .map((policy, index) => ({
      policy,
      policyNumber: index + 1,
      count: policyCounts[index],
      percentage:
        rows.length > 0 ? Math.round((policyCounts[index] / rows.length) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count || a.policyNumber - b.policyNumber);

  return {
    submittedCount: rows.length,
    totalPolicyVotes,
    talkCount,
    firstAssemblyCount,
    secondAssemblyCount,
    customPolicyCount,
    policyResults,
    updatedAt: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
  };
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-[#d8b4fe] bg-white px-5 py-4 shadow-[0_12px_30px_rgba(76,29,149,0.08)]">
      <p className="text-[14px] font-black text-[#6d5f85]">{label}</p>
      <p className="mt-2 text-[34px] font-black tracking-[-0.05em] text-[#4c1d95]">
        {value}
      </p>
    </div>
  );
}

export default async function ResultsPage() {
  let summary: SheetSummary | null = null;
  let errorMessage = "";

  try {
    summary = await getSheetSummary();
  } catch {
    errorMessage =
      "결과를 불러오지 못했습니다. Google Sheets 환경변수와 권한을 확인해주세요.";
  }

  const topPolicies = summary?.policyResults.slice(0, 10) ?? [];
  const maxCount = Math.max(...(summary?.policyResults.map((item) => item.count) ?? [0]), 1);

  return (
    <main className="min-h-svh bg-[#f4f0ff] px-4 py-5 text-[#24123d] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1152px] overflow-hidden rounded-3xl bg-[#fbfaff] shadow-[0_24px_80px_rgba(46,16,101,0.16)]">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#2e1065] via-[#5b21b6] to-[#9f67ff] px-7 py-12 text-white sm:px-10 md:px-14">
          <div className="absolute -right-24 top-8 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <Link
              href="/"
              className="inline-flex rounded-full bg-white/95 px-4 py-2 text-[15px] font-black text-[#4c1d95] shadow-sm transition hover:-translate-y-0.5"
            >
              설문으로 돌아가기
            </Link>
            <h1 className="main-title mt-8 max-w-[860px] text-[44px] leading-[0.95] tracking-[-0.07em] sm:text-[64px] md:text-[78px]">
              주민이 선택한 정책공약 결과
            </h1>
            <p className="mt-6 max-w-[720px] text-[20px] font-semibold leading-8 text-white/90">
              제출된 응답을 기준으로 공약별 선택 수를 집계했습니다. 순위와
              막대 길이는 현재 시트 데이터에 따라 자동으로 갱신됩니다.
            </p>
            {summary ? (
              <p className="mt-5 text-[14px] font-semibold text-white/75">
                마지막 집계: {summary.updatedAt}
              </p>
            ) : null}
          </div>
        </section>

        <section className="px-6 py-7 md:px-8">
          {errorMessage ? (
            <div className="rounded-2xl border border-[#fca5a5] bg-[#fff1f2] px-5 py-4 text-[17px] font-bold text-[#9f1239]">
              {errorMessage}
            </div>
          ) : null}

          {summary ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <SummaryCard label="전체 제출" value={summary.submittedCount} />
                <SummaryCard label="공약 선택 합계" value={summary.totalPolicyVotes} />
                <SummaryCard label="소통방 신청" value={summary.talkCount} />
                <SummaryCard
                  label="주민대회 1차"
                  value={summary.firstAssemblyCount}
                />
                <SummaryCard
                  label="주민대회 2차"
                  value={summary.secondAssemblyCount}
                />
              </div>

              <section className="mt-8 rounded-3xl border border-[#d8b4fe] bg-white px-5 py-6 shadow-[0_16px_40px_rgba(76,29,149,0.08)]">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2 className="paper-regular text-[28px] tracking-[-0.04em]">
                      TOP 10 정책공약
                    </h2>
                    <p className="mt-2 text-[15px] font-medium text-[#6d5f85]">
                      가장 많이 선택된 공약을 순위대로 보여줍니다.
                    </p>
                  </div>
                  <span className="rounded-full bg-[#ede9fe] px-4 py-2 text-[14px] font-black text-[#5b21b6]">
                    기타 제안 {summary.customPolicyCount}건
                  </span>
                </div>

                <div className="mt-6 grid gap-4">
                  {topPolicies.map((item, index) => (
                    <div
                      key={item.policy}
                      className="rounded-2xl border border-[#ede9fe] bg-[#fbfaff] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4c1d95] text-[16px] font-black text-white">
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <p className="text-[18px] font-black leading-7 text-[#2f1b47]">
                              <span className="mr-2 text-[#6d28d9]">
                                #{item.policyNumber}
                              </span>
                              {item.policy}
                            </p>
                            <p className="shrink-0 text-[18px] font-black text-[#4c1d95]">
                              {item.count}표 · {item.percentage}%
                            </p>
                          </div>
                          <div className="mt-3 h-4 overflow-hidden rounded-full bg-[#ede9fe]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#4c1d95] to-[#9f67ff]"
                              style={{
                                width: `${Math.max(
                                  item.count > 0 ? (item.count / maxCount) * 100 : 0,
                                  item.count > 0 ? 6 : 0,
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-8 rounded-3xl border border-[#d8b4fe] bg-white px-5 py-6 shadow-[0_16px_40px_rgba(76,29,149,0.08)]">
                <h2 className="paper-regular text-[28px] tracking-[-0.04em]">
                  전체 순위
                </h2>
                <div className="mt-5 grid gap-2">
                  {summary.policyResults.map((item, index) => (
                    <div
                      key={item.policy}
                      className="grid gap-2 rounded-xl border border-[#f3e8ff] px-3 py-3 md:grid-cols-[54px_1fr_110px]"
                    >
                      <span className="text-[16px] font-black text-[#6d28d9]">
                        {index + 1}위
                      </span>
                      <span className="text-[16px] font-bold text-[#2f1b47]">
                        #{item.policyNumber} {item.policy}
                      </span>
                      <span className="text-[16px] font-black text-[#4c1d95] md:text-right">
                        {item.count}표
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : null}
        </section>
      </div>
    </main>
  );
}
