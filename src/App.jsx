import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences, qualityChecks, scope } from "./data/content";

gsap.registerPlugin(ScrollTrigger);

function Header() {
  return (
    <header className="site-header" aria-label="주요 탐색">
      <a className="brand" href="#intro" aria-label="소개 화면으로 이동">
        <span className="brand-mark" aria-hidden="true">01</span>
        <span>ONE LINK</span>
      </a>
      <nav className="main-nav" aria-label="페이지 섹션">
        <a href="#intro">소개</a>
        <a href="#experiences">경험</a>
        <a href="#proof">제작 근거</a>
        <a className="nav-proof" href="verification.html">검증 안내서</a>
      </nav>
    </header>
  );
}

function SectionIndex({ current, total = "03" }) {
  return (
    <div className="section-index" aria-hidden="true">
      <strong>{current}</strong><span>/</span><span>{total}</span>
    </div>
  );
}

function IntroSection() {
  return (
    <section id="intro" className="panel intro-panel" aria-labelledby="intro-title">
      <SectionIndex current="01" />
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="intro-grid section-inner">
        <div className="intro-copy reveal-group">
          <p className="eyebrow">ONE LINK PORTFOLIO · INTRO</p>
          <h1 id="intro-title">[소개 문장 입력]</h1>
          <p className="intro-lede">[활동을 설명하는 문장 입력]</p>
          <div className="strength-chips" aria-label="강점 세 가지">
            {experiences.map((item) => <span key={item.id}>{item.strength}</span>)}
          </div>
          <div className="hero-evidence" data-testid="hero-evidence">
            <span className="status-dot" aria-hidden="true" />
            <div>
              <span>확인 가능한 근거</span>
              <strong>경험 1에 공개 가능한 근거를 연결합니다.</strong>
            </div>
          </div>
        </div>

        <aside className="scope-stack reveal-group" aria-label="대상과 공개 범위">
          <article className="info-block audience-block">
            <p className="block-label"><span>01</span> 이 페이지의 대상</p>
            <p>{scope.audience}</p>
          </article>
          <article className="info-block scope-block">
            <p className="block-label"><span>02</span> 공개 범위</p>
            <div className="scope-row">
              <strong>공개</strong>
              <p>{scope.publicItems.join(" · ")}</p>
            </div>
            <div className="scope-row private">
              <strong>비공개</strong>
              <p>{scope.privateItems.join(" · ")}</p>
            </div>
          </article>
        </aside>
      </div>
      <a className="scroll-cue" href="#experiences">
        경험과 강점 확인 <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}

function DetailBlock({ number, title, children, variant = "neutral", className = "" }) {
  return (
    <section className={`detail-block ${variant} ${className}`.trim()} aria-labelledby={`detail-${number}`}>
      <div className="detail-heading">
        <span aria-hidden="true">{number}</span>
        <h3 id={`detail-${number}`}>{title}</h3>
      </div>
      <p>{children}</p>
    </section>
  );
}

function ExperiencesSection() {
  const [activeId, setActiveId] = useState(1);
  const detailRef = useRef(null);
  const active = experiences.find((item) => item.id === activeId);

  useLayoutEffect(() => {
    if (!detailRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const context = gsap.context(() => {
      gsap.fromTo(
        ".detail-block",
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.36, stagger: 0.045, ease: "power2.out", clearProps: "all" },
      );
    }, detailRef);
    return () => context.revert();
  }, [activeId]);

  return (
    <section id="experiences" className="panel experiences-panel" aria-labelledby="experiences-title">
      <SectionIndex current="02" />
      <div className="section-inner experience-inner">
        <div className="section-heading reveal-group">
          <p className="eyebrow">EXPERIENCE · STRENGTH</p>
          <h2 id="experiences-title">경험으로 확인하는 강점</h2>
          <p>요약 버튼을 선택하면 아래 상세 본문이 같은 자리에서 바뀝니다.</p>
        </div>

        <div className="experience-buttons reveal-group" aria-label="경험 선택">
          {experiences.map((item) => {
            const selected = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                className={`experience-button ${selected ? "is-active" : ""}`}
                aria-pressed={selected}
                aria-controls="experience-detail"
                onClick={() => setActiveId(item.id)}
              >
                <span className="experience-number">0{item.id}</span>
                <strong>{item.title}</strong>
                <span className="experience-summary">{ }</span>
                <span className="experience-strength">{item.strength}</span>
              </button>
            );
          })}
        </div>

        <article
          id="experience-detail"
          className="experience-detail"
          aria-live="polite"
          aria-labelledby="experience-detail-title"
          ref={detailRef}
          data-testid="experience-detail"
        >
          <div className="detail-title-row">
            <div>
              <p className="block-label">SELECTED EXPERIENCE</p>
              <h3 id="experience-detail-title">{active.title} 상세 · {active.strength}</h3>
            </div>
            <span className="detail-badge">0{active.id}</span>
          </div>
          <div className="detail-grid">
            <DetailBlock number="01" title="상황">{active.situation}</DetailBlock>
            <DetailBlock number="02" title="행동" variant="action">{active.action}</DetailBlock>
            <DetailBlock number="03" title="결과" variant="result" className="half">{active.result}</DetailBlock>
            <DetailBlock number="04" title="공개 가능한 근거" variant="evidence" className="half">{active.evidence}</DetailBlock>
          </div>
        </article>
      </div>
    </section>
  );
}

function ProofSection() {
  return (
    <section id="proof" className="panel proof-panel" aria-labelledby="proof-title">
      <SectionIndex current="03" />
      <div className="section-inner proof-inner">
        <div className="section-heading reveal-group">
          <p className="eyebrow">BUILD · VERIFY · IMPROVE</p>
          <h2 id="proof-title">말이 아니라 검사 결과로</h2>
          <p>첫 구현에서 실제 결함을 찾고, 같은 조건으로 고친 전과 후를 남깁니다.</p>
        </div>

        <div className="before-after reveal-group" aria-label="수정 전후 기록 자리">
          <article className="proof-frame before">
            <span className="frame-label">BEFORE</span>
            <div className="frame-placeholder">
              <span aria-hidden="true">01</span>
              <p>실제 결함을 발견한 뒤<br />수정 전 화면을 연결합니다.</p>
            </div>
          </article>
          <div className="proof-arrow" aria-hidden="true">→</div>
          <article className="proof-frame after">
            <span className="frame-label">AFTER</span>
            <div className="frame-placeholder">
              <span aria-hidden="true">02</span>
              <p>같은 해상도와 위치에서<br />수정 후 화면을 연결합니다.</p>
            </div>
          </article>
        </div>

        <div className="quality-grid reveal-group">
          {qualityChecks.map((check, index) => (
            <article key={check.label} className="quality-card">
              <span>0{index + 1}</span>
              <p>{check.label}</p>
              <strong>{check.value}</strong>
            </article>
          ))}
        </div>

        <div className="proof-cta reveal-group">
          <div>
            <p className="block-label">VERIFICATION GUIDE</p>
            <h3>검사 방법과 통과 기준을 한곳에서 확인합니다.</h3>
          </div>
          <a href="verification.html">검증 안내서 열기 <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;
    const context = gsap.context(() => {
      gsap.utils.toArray(".reveal-group").forEach((element) => {
        gsap.fromTo(element, { autoAlpha: 0, y: 18 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          clearProps: "all",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      });
    });
    return () => {
      context.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <Header />
      <main id="main-content">
        <IntroSection />
        <ExperiencesSection />
        <ProofSection />
      </main>
      <footer className="site-footer">
        <span>ONE LINK PORTFOLIO</span>
        <span>개인정보를 공개하기 전에 반드시 최종 점검합니다.</span>
      </footer>
    </>
  );
}
