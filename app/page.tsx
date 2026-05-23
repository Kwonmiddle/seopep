import { policies } from "@/lib/policies";

export default function Home() {
  return (
    <main className="min-h-svh bg-[#f4f0ff] px-4 py-5 pb-36 text-[#24123d] sm:px-6 lg:px-8">
      <form
        action="/api/policy-vote"
        method="post"
        className="mx-auto max-w-[1152px] overflow-hidden rounded-3xl bg-[#fbfaff] shadow-[0_24px_80px_rgba(46,16,101,0.16)]"
      >
        <section className="relative overflow-hidden bg-gradient-to-br from-[#2e1065] via-[#5b21b6] to-[#9f67ff] px-7 py-9 sm:px-8 md:px-9">
          <div className="relative z-10 max-w-[560px]">
            <p className="mb-5 inline-flex rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-black text-[#4c1d95] shadow-sm">
              서대문은평 주민광장
            </p>
            <h1 className="max-w-[640px] text-[34px] font-black leading-[0.95] tracking-[-0.07em] text-white sm:text-[50px] md:text-[58px]">
              서대문은평 주민이 직접 만드는 10대 정책공약
            </h1>
            <div className="mt-6 max-w-[520px] rounded-2xl border border-white/25 bg-white/15 px-5 py-4 text-[13px] font-semibold leading-7 text-white shadow-sm backdrop-blur">
              <p>2026 지방선거 주민들이 직접 정책공약을 결정한다!!</p>
              <p>주민들이 직접 10대 공약을 선정하여,</p>
              <p>
                서대문은평 지방선거 후보들에게 전달하고 약속을 받겠습니다.
              </p>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute right-20 top-24 hidden h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-6xl shadow-inner md:flex"
          >
            🐶
          </div>
        </section>

        <section className="grid gap-6 px-6 py-7 md:grid-cols-[1fr_250px] md:px-8 lg:grid-cols-[1fr_290px]">
          <div>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black tracking-[-0.04em]">
                  정책공약 선택
                </h2>
                <p className="mt-2 text-[12px] font-medium text-[#6d5f85]">
                  마음에 드는 항목을 여러 개 선택할 수 있습니다.
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-[#c4b5fd] bg-[#ede9fe] px-3 py-1.5 text-[11px] font-black text-[#5b21b6]">
                중복 선택 가능
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {policies.map((policy, index) => (
                <label
                  key={policy}
                  className="group flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-[#d8b4fe] bg-white px-3 py-3 text-[12px] font-bold leading-5 text-[#2f1b47] transition hover:-translate-y-0.5 hover:border-[#8b5cf6] hover:shadow-md"
                >
                  <input
                    className="peer sr-only"
                    type="checkbox"
                    name="policies"
                    value={policy}
                  />
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#c4b5fd] bg-[#f3e8ff] text-[10px] font-black text-[#6d28d9] peer-checked:bg-[#4c1d95] peer-checked:text-white">
                    {index + 1}
                  </span>
                  <span className="peer-checked:text-[#4c1d95]">{policy}</span>
                </label>
              ))}
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-[12px] font-black text-[#2f1b47]">
                기타 항목에 없는 정책공약이 필요하다면 직접 적어주세요.
              </span>
              <textarea
                name="customPolicy"
                rows={3}
                placeholder="예: 우리 동네에 꼭 필요한 정책공약"
                className="w-full resize-none rounded-xl border border-[#d8b4fe] bg-white px-4 py-3 text-sm font-semibold outline-none placeholder:text-[#b9aec8] focus:border-[#6d28d9]"
              />
            </label>
          </div>

          <aside className="h-fit rounded-2xl border border-[#d8b4fe] bg-white px-4 py-5 shadow-[0_16px_40px_rgba(76,29,149,0.08)]">
            <h2 className="text-lg font-black tracking-[-0.04em]">추가 정보</h2>
            <p className="mt-3 text-[12px] font-medium leading-5 text-[#6d5f85]">
              어떤 공약이 10대 공약이 됐을까 궁금하다면, 주소와 이메일,
              비고도 함께 작성해주세요.
            </p>

            <div className="mt-5 grid gap-4">
              <label className="block">
                <span className="mb-2 block text-[11px] font-black">주소(동까지)</span>
                <input
                  name="address"
                  placeholder="예: 남가좌동"
                  className="h-11 w-full rounded-xl border border-[#ddd6fe] px-3 text-sm font-semibold outline-none placeholder:text-[#b9aec8] focus:border-[#6d28d9]"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[11px] font-black">이메일</span>
                <input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="h-11 w-full rounded-xl border border-[#ddd6fe] px-3 text-sm font-semibold outline-none placeholder:text-[#b9aec8] focus:border-[#6d28d9]"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[11px] font-black">비고란</span>
                <textarea
                  name="memo"
                  rows={4}
                  placeholder="현장 메모나 전달사항"
                  className="w-full resize-none rounded-xl border border-[#ddd6fe] px-3 py-3 text-sm font-semibold outline-none placeholder:text-[#b9aec8] focus:border-[#6d28d9]"
                />
              </label>
            </div>
          </aside>
        </section>

        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#ddd6fe] bg-white/90 px-4 py-3 shadow-[0_-18px_40px_rgba(46,16,101,0.14)] backdrop-blur">
          <div className="mx-auto grid max-w-[1152px] gap-2 rounded-2xl bg-white sm:grid-cols-[1fr_1fr_360px]">
            <label className="block">
              <span className="mb-1 block text-[11px] font-black text-[#5b21b6]">이름</span>
              <input
                name="name"
                placeholder="이름 입력"
                className="h-11 w-full rounded-xl border border-[#ddd6fe] px-4 text-sm font-semibold outline-none placeholder:text-[#b9aec8] focus:border-[#6d28d9]"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-black text-[#5b21b6]">연락처</span>
              <input
                name="phone"
                placeholder="연락처 입력"
                className="h-11 w-full rounded-xl border border-[#ddd6fe] px-4 text-sm font-semibold outline-none placeholder:text-[#b9aec8] focus:border-[#6d28d9]"
              />
            </label>
            <button
              type="submit"
              className="mt-auto h-11 rounded-xl bg-[#4c1d95] px-5 text-[13px] font-black text-white shadow-[0_8px_20px_rgba(76,29,149,0.28)] transition hover:bg-[#5b21b6]"
            >
              선택한 공약 제안하기
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
