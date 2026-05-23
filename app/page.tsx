const policies = [
  "서대문 내란세력 청산",
  "지하철 서부선 공공으로 신속하게 추진",
  "백련산 안산 불광천 홍제천 난개발 중단 생태 전환",
  "1인가구 원스톱 지원센터 동별 설치",
  "서대문 공공돌봄센터로 1:1 주민 돌봄 플래너",
  "공공 심야 어린이 병원, 공감심리센터로 무상심리상담",
  "서대문 디지털성폭력 원샷 지원 센터 설치로 안전한 서대문",
  "마을버스 무상교통, 출퇴근 시간 버스 배차 확대",
  "'15분 심층 상담' 1:1 동네주민 주치의제 실시",
  "프리랜서 무상 공유 오피스 설치",
  "남이동길 골목형상점가 사업 동별 확대로 중소상인 상생 지원",
  "서대문 기후공공돌봄 사회서비스원 설치로 공공돌봄 일자리 1천개 창출",
  "지역사랑상품권 예산비용 확대",
  "1인 가구 공동부엌 동별 설치",
  "1인 가구 무상 청소 대행 서비스",
  "가좌 공공 복덕방 설치 - 1인 가구 집 찾기, 이사, 복비 지원",
  "주거취약층 무상 집수리 리모델링",
  "1인 가구 병원동행 서비스 및 응급 연락망 제공",
  "'가좌 셉테드(CPTED-범죄예방디자인)' 전면 도입으로 안전한 골목길",
  "아동 청소년 생리대 무상 지원",
  "서대문 반려동물 공공병원, 저소득/1인가구 반려동물 무상의료",
];

export default function Home() {
  return (
    <main className="min-h-svh bg-[#f3f4f8] px-4 py-5 pb-36 text-[#071126] sm:px-6 lg:px-8">
      <form className="mx-auto max-w-[1152px] overflow-hidden rounded-3xl bg-[#f8f9fc] shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#ffe046] via-[#ffea76] to-[#fff7c6] px-7 py-9 sm:px-8 md:px-9">
          <div className="relative z-10 max-w-[560px]">
            <p className="mb-5 inline-flex rounded-full bg-[#071126] px-3 py-1.5 text-[11px] font-black text-[#ffe45c]">
              주민참여 정책투표
            </p>
            <h1 className="max-w-[640px] text-[34px] font-black leading-[0.95] tracking-[-0.07em] text-[#071126] sm:text-[50px] md:text-[58px]">
              남가좌동 북가좌동 주민이 직접 만드는 10대 정책공약
            </h1>
            <div className="mt-6 max-w-[450px] rounded-2xl border border-[#e4cf77] bg-white/70 px-5 py-4 text-[13px] font-semibold leading-7 text-[#20283a] backdrop-blur">
              <p>황경산의 색다른 정책공약을 주민들이 직접 결정해주세요.</p>
              <p>21개 정책공약 중 여러분들의 선택으로 10대 정책공약을 선정합니다.</p>
              <p>
                중복으로 투표가 가능하니, 꼭 필요하고 마음에 드는 정책공약
                모두를 선택해주세요.
              </p>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute right-20 top-24 hidden h-20 w-20 items-center justify-center rounded-2xl bg-[#071126]/5 text-6xl shadow-inner md:flex"
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
                <p className="mt-2 text-[12px] font-medium text-[#5d6678]">
                  마음에 드는 항목을 여러 개 선택할 수 있습니다.
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-[#e1c85a] bg-[#fff4a8] px-3 py-1.5 text-[11px] font-black text-[#7b6410]">
                중복 선택 가능
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {policies.map((policy, index) => (
                <label
                  key={policy}
                  className="group flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-[#dcc65f] bg-white px-3 py-3 text-[12px] font-bold leading-5 text-[#1b2435] transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <input
                    className="peer sr-only"
                    type="checkbox"
                    name="policies"
                    value={policy}
                  />
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#d8bd3b] bg-[#fff7cf] text-[10px] font-black text-[#ad8f16] peer-checked:bg-[#071126] peer-checked:text-[#ffe45c]">
                    {index + 1}
                  </span>
                  <span className="peer-checked:text-[#071126]">{policy}</span>
                </label>
              ))}
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-[12px] font-black text-[#1b2435]">
                기타 항목에 없는 정책공약이 필요하다면 직접 적어주세요.
              </span>
              <textarea
                name="customPolicy"
                rows={3}
                placeholder="예: 우리 동네에 꼭 필요한 정책공약"
                className="w-full resize-none rounded-xl border border-[#dcc65f] bg-white px-4 py-3 text-sm font-semibold outline-none placeholder:text-[#c6cbd6] focus:border-[#071126]"
              />
            </label>
          </div>

          <aside className="h-fit rounded-2xl border border-[#dcc65f] bg-white px-4 py-5">
            <h2 className="text-lg font-black tracking-[-0.04em]">추가 정보</h2>
            <p className="mt-3 text-[12px] font-medium leading-5 text-[#5d6678]">
              어떤 공약이 10대 공약이 됐을까 궁금하다면, 주소와 이메일,
              비고도 함께 작성해주세요.
            </p>

            <div className="mt-5 grid gap-4">
              <label className="block">
                <span className="mb-2 block text-[11px] font-black">주소(동까지)</span>
                <input
                  name="address"
                  placeholder="예: 남가좌동"
                  className="h-11 w-full rounded-xl border border-[#ead67a] px-3 text-sm font-semibold outline-none placeholder:text-[#c6cbd6] focus:border-[#071126]"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[11px] font-black">이메일</span>
                <input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="h-11 w-full rounded-xl border border-[#ead67a] px-3 text-sm font-semibold outline-none placeholder:text-[#c6cbd6] focus:border-[#071126]"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[11px] font-black">비고란</span>
                <textarea
                  name="memo"
                  rows={4}
                  placeholder="현장 메모나 전달사항"
                  className="w-full resize-none rounded-xl border border-[#ead67a] px-3 py-3 text-sm font-semibold outline-none placeholder:text-[#c6cbd6] focus:border-[#071126]"
                />
              </label>
            </div>
          </aside>
        </section>

        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#e7dfbd] bg-white/90 px-4 py-3 shadow-[0_-18px_40px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="mx-auto grid max-w-[1152px] gap-2 rounded-2xl bg-white sm:grid-cols-[1fr_1fr_360px]">
            <label className="block">
              <span className="mb-1 block text-[11px] font-black text-[#8b741a]">이름</span>
              <input
                name="name"
                placeholder="이름 입력"
                className="h-11 w-full rounded-xl border border-[#ead67a] px-4 text-sm font-semibold outline-none placeholder:text-[#c6cbd6] focus:border-[#071126]"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-black text-[#8b741a]">연락처</span>
              <input
                name="phone"
                placeholder="연락처 입력"
                className="h-11 w-full rounded-xl border border-[#ead67a] px-4 text-sm font-semibold outline-none placeholder:text-[#c6cbd6] focus:border-[#071126]"
              />
            </label>
            <button
              type="submit"
              className="mt-auto h-11 rounded-xl bg-[#071126] px-5 text-[13px] font-black text-[#ffe45c] shadow-[0_8px_20px_rgba(7,17,38,0.24)] transition hover:bg-[#13203b]"
            >
              선택한 공약 제안하기
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
