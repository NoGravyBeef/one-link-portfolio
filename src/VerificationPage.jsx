const guideItems = [
  ["01", "어디로 가나요", "제출한 공개 주소의 첫 화면으로 이동합니다."],
  ["02", "무엇을 하나요", "소개·경험·근거를 확인하고 경험 요약 버튼을 마우스와 키보드로 실행한 뒤 검사 결과를 확인합니다."],
  ["03", "무엇이 보이면 통과인가요", "핵심 정보가 함께 보이고 본문이 즉시 바뀌며 가로 넘침과 콘솔 오류가 없습니다."],
  ["04", "안 될 때", "새로고침한 뒤 다른 브라우저로 다시 열고, 계속 안 되면 이 페이지의 화면 기록과 검사 결과를 확인합니다."],
];

const completionItems = [
  "공개 주소가 다른 브라우저에서도 열린다.",
  "대상 문장과 공개·비공개 점검표가 존재한다.",
  "경험 1·2·3의 상황·행동·결과가 채워졌다.",
  "공개 가능한 근거 1개가 경험과 연결됐다.",
  "1366×768과 1920×1080에서 핵심 3개와 가로 넘침을 확인했다.",
  "실제 결함 3개 이상의 수정 전·후와 콘솔 오류 0건을 기록했다.",
  "마우스·Tab·Enter·Space에서 경험 선택이 작동한다.",
  "개인정보와 비밀값이 페이지·제출 기록·Git 기록에 0건이다.",
  "AI 사용과 직접 판단을 세 줄로 남겼다.",
];

function GuideCard({ number, title, children }) {
  return (
    <article className="guide-card">
      <span>{number}</span>
      <h2>{title}</h2>
      <p>{children}</p>
    </article>
  );
}

export default function VerificationPage() {
  const statusItems = [
    ["1366×768 화면", "통과"],
    ["1920×1080 화면", "통과"],
    ["가로 넘침", "0건"],
    ["콘솔 오류", "0건"],
    ["실제 결함", "4개 수정"],
    ["마우스·키보드", "통과"],
  ];
  return (
    <>
      <header className="verification-header">
        <a className="brand" href="index.html">
          <span className="brand-mark" aria-hidden="true">01</span>
          <span>ONE LINK</span>
        </a>
        <a className="back-link" href="index.html">포트폴리오로 돌아가기 <span aria-hidden="true">↗</span></a>
      </header>

      <main id="verification-main" className="verification-main">
        <section className="verification-hero" aria-labelledby="verification-title">
          <p className="eyebrow">VERIFICATION · GUIDE</p>
          <h1 id="verification-title">검증 안내서</h1>
          <p>공개 주소에서 무엇을 확인해야 하는지 3단계 안에서 설명하고, 통과 근거를 한곳에 모읍니다.</p>
        </section>

        <section className="guide-grid" aria-label="검증 방법">
          {guideItems.map(([number, title, text]) => (
            <GuideCard key={number} number={number} title={title}>{text}</GuideCard>
          ))}
        </section>

        <section className="verification-section" aria-labelledby="status-title">
          <div className="verification-heading">
            <p className="eyebrow">CURRENT STATUS</p>
            <h2 id="status-title">현재 검사 결과</h2>
          </div>
          <div className="status-grid">
            {statusItems.map(([item, result], index) => (
              <article className="status-card" key={item}>
                <span>0{index + 1}</span><p>{item}</p><strong>{result}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="verification-section split-section" aria-label="공개 범위와 비밀값 점검">
          <article className="verification-block">
            <p className="block-label">PRIVACY</p>
            <h2>공개하지 않을 정보</h2>
            <ul>
              <li>개인정보</li>
              <li>계정 정보</li>
              <li>타인의 개인 정보</li>
            </ul>
          </article>
          <article className="verification-block danger-block">
            <p className="block-label">SECRETS</p>
            <h2>저장하지 않을 비밀값</h2>
            <ul>
              <li>비밀번호·로그인 정보</li>
              <li>토큰·API 키·인증서</li>
              <li>.env 파일과 과거 Git 기록의 비밀값</li>
            </ul>
          </article>
        </section>

        <section className="verification-section" aria-labelledby="ai-title">
          <div className="verification-heading">
            <p className="eyebrow">AI USE · 3 LINES</p>
            <h2 id="ai-title">AI 사용 3줄</h2>
          </div>
          <div className="ai-lines">
            <p><strong>AI에게 맡긴 일</strong><span>정해진 방향을 바탕으로 페이지 구조와 문장 초안, React·GSAP 구현 및 검사 작업을 맡겼다.</span></p>
            <p><strong>내가 판단한 일</strong><span>대상과 공개 범위, 강점과 근거뿐 아니라 React·Vite·GSAP 사용, 기업형 풀페이지 애니메이션, GitHub Pages 배포 방식을 직접 선택했다.</span></p>
            <p><strong>AI 말을 안 들은 일</strong><span>정적 HTML과 단순 CSS 애니메이션으로 구현하라는 초기 제안을 따르지 않고, 원하는 표현에 적합한 React와 GSAP 구성을 선택했다.</span></p>
          </div>
        </section>

        <section className="verification-section" aria-labelledby="checklist-title">
          <div className="verification-heading">
            <p className="eyebrow">FINAL CHECK</p>
            <h2 id="checklist-title">완주 체크리스트</h2>
          </div>
          <ul className="completion-list">
            {completionItems.map((item) => <li key={item}><span aria-hidden="true" />{item}</li>)}
          </ul>
        </section>
      </main>

      <footer className="verification-footer">
        <span>ONE LINK PORTFOLIO · VERIFICATION</span>
        <a href="index.html">처음으로 돌아가기 ↑</a>
      </footer>
    </>
  );
}
