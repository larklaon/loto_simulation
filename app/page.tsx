"use client";

import { useState } from "react";

type Ticket = {
  id: number;
  numbers: number[];
};

const initialTickets: Ticket[] = [
  { id: 1, numbers: [4, 12, 19, 27, 34, 42] },
  { id: 2, numbers: [7, 15, 22, 29, 36, 44] },
  { id: 3, numbers: [2, 10, 18, 31, 38, 45] },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4.5 10h11M10.5 5l5 5-5 5" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 2 1.75 6.25L20 10l-6.25 1.75L12 18l-1.75-6.25L4 10l6.25-1.75L12 2Z" />
      <path d="m19 15 .85 2.15L22 18l-2.15.85L19 21l-.85-2.15L16 18l2.15-.85L19 15Z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <rect x="7" y="7" width="9" height="10" rx="2" />
      <path d="M12 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M16.5 8A6.5 6.5 0 0 0 5 5.2L3.5 7" />
      <path d="M3.5 3.5V7h3.5M3.5 12A6.5 6.5 0 0 0 15 14.8l1.5-1.8" />
      <path d="M16.5 16.5V13H13" />
    </svg>
  );
}

function getBallColor(number: number) {
  if (number <= 10) return "gold";
  if (number <= 20) return "blue";
  if (number <= 30) return "coral";
  if (number <= 40) return "slate";
  return "green";
}

function pickNumbers(fixedNumbers: number[]) {
  const available = Array.from({ length: 45 }, (_, index) => index + 1).filter(
    (number) => !fixedNumbers.includes(number),
  );

  for (let index = available.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [available[index], available[randomIndex]] = [available[randomIndex], available[index]];
  }

  return [...fixedNumbers, ...available.slice(0, 6 - fixedNumbers.length)].sort(
    (a, b) => a - b,
  );
}

export default function Home() {
  const [gameCount, setGameCount] = useState(3);
  const [fixedNumbers, setFixedNumbers] = useState<number[]>([]);
  const [showNumberPicker, setShowNumberPicker] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [generatedCount, setGeneratedCount] = useState(1);
  const [copyFeedback, setCopyFeedback] = useState<"idle" | "success" | "error">("idle");

  function generateTickets() {
    const nextTickets = Array.from({ length: gameCount }, (_, index) => ({
      id: Date.now() + index,
      numbers: pickNumbers(fixedNumbers),
    }));
    setTickets(nextTickets);
    setGeneratedCount((count) => count + 1);
    setCopyFeedback("idle");
  }

  function toggleFixedNumber(number: number) {
    setFixedNumbers((current) => {
      if (current.includes(number)) return current.filter((item) => item !== number);
      if (current.length >= 5) return current;
      return [...current, number].sort((a, b) => a - b);
    });
  }

  async function copyTickets() {
    const text = tickets.map((ticket) => ticket.numbers.join(", ")).join("\n");
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      setCopyFeedback("success");
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const didCopy = document.execCommand("copy");
      textarea.remove();
      setCopyFeedback(didCopy ? "success" : "error");
    }
    window.setTimeout(() => setCopyFeedback("idle"), 1800);
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="로또픽 홈">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="brand-name">lotto<span>pick</span></span>
        </a>

        <nav className="main-nav" aria-label="주요 메뉴">
          <a className="nav-link active" href="#generator">번호 생성</a>
          <a className="nav-link" href="#guide">이용 안내</a>
        </nav>

        <div className="header-note">
          <span className="live-dot" />
          <span>로또 6/45 시뮬레이터</span>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> LOTTO 6/45 · RANDOM NUMBER GENERATOR</div>
          <h1>오늘의 행운,<br /><span>가볍게 시작해요.</span></h1>
          <p className="hero-description">
            복잡한 고민은 잠시 내려두고,<br className="mobile-break" /> 랜덤 번호로 새로운 조합을 만들어보세요.
          </p>
          <a className="hero-link" href="#generator">번호 조합 만들기 <ArrowIcon /></a>
        </div>

        <div className="hero-art" aria-label="행운의 숫자 공 장식">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-glow" />
          <div className="art-ball ball-main"><span>7</span></div>
          <div className="art-ball ball-small ball-purple"><span>21</span></div>
          <div className="art-ball ball-small ball-yellow"><span>33</span></div>
          <div className="art-ball ball-tiny ball-blue"><span>12</span></div>
          <div className="art-ball ball-tiny ball-pink"><span>40</span></div>
          <div className="art-caption"><span className="caption-star"><SparkleIcon /></span><span>YOUR LUCKY MOMENT</span></div>
          <span className="art-sparkle sparkle-a">✳</span>
          <span className="art-sparkle sparkle-b">✦</span>
        </div>
      </section>

      <section className="workspace" id="generator">
        <aside className="control-card">
          <div className="card-kicker"><span>01</span> SET YOUR NUMBERS</div>
          <h2>조합 설정</h2>
          <p className="control-intro">원하는 게임 수와 고정 번호를 선택해 주세요.</p>

          <div className="control-divider" />

          <div className="field-heading">
            <div>
              <h3>몇 게임을 만들까요?</h3>
              <p>한 번에 최대 5개 조합까지</p>
            </div>
            <span className="field-unit">게임 수</span>
          </div>
          <div className="count-selector" role="group" aria-label="게임 수 선택">
            {[1, 2, 3, 4, 5].map((count) => (
              <button
                className={`count-option${gameCount === count ? " selected" : ""}`}
                key={count}
                onClick={() => setGameCount(count)}
                aria-pressed={gameCount === count}
              >
                {count}
              </button>
            ))}
          </div>

          <div className="fixed-number-toggle">
            <div className="toggle-copy">
              <span className="toggle-icon"><SparkleIcon /></span>
              <span><strong>고정 번호 사용</strong><small>좋아하는 숫자를 조합에 포함해요</small></span>
            </div>
            <button
              className={`switch${showNumberPicker ? " on" : ""}`}
              role="switch"
              aria-checked={showNumberPicker}
              aria-label="고정 번호 사용"
              onClick={() => setShowNumberPicker((visible) => !visible)}
            ><span /></button>
          </div>

          {showNumberPicker && (
            <div className="number-picker">
              <div className="picker-heading"><span>고정할 숫자 <b>{fixedNumbers.length}/5</b></span><button onClick={() => setFixedNumbers([])}>초기화</button></div>
              <div className="number-grid">
                {Array.from({ length: 45 }, (_, index) => index + 1).map((number) => (
                  <button
                    key={number}
                    className={`number-choice${fixedNumbers.includes(number) ? " picked" : ""}`}
                    onClick={() => toggleFixedNumber(number)}
                    aria-pressed={fixedNumbers.includes(number)}
                    disabled={!fixedNumbers.includes(number) && fixedNumbers.length === 5}
                  >{number}</button>
                ))}
              </div>
            </div>
          )}

          <button className="generate-button" onClick={generateTickets}>
            <SparkleIcon />
            <span>행운 번호 생성하기</span>
            <ArrowIcon />
          </button>
          <div className="random-note"><span className="lock-icon">✳</span> 모든 번호는 무작위로 생성돼요</div>
        </aside>

        <section className="results-panel" aria-live="polite">
          <div className="results-heading">
            <div>
              <div className="card-kicker"><span>02</span> YOUR COMBINATIONS</div>
              <h2>행운의 조합 <span className="result-count">{tickets.length}</span></h2>
              <p>마음에 드는 번호를 골라 간직해 보세요.</p>
            </div>
            <div className="result-actions">
              <button className="icon-action" onClick={generateTickets} aria-label="번호 다시 생성" title="다시 생성"><RefreshIcon /></button>
              <button className={`copy-button${copyFeedback === "success" ? " copied" : copyFeedback === "error" ? " failed" : ""}`} onClick={copyTickets}><CopyIcon />{copyFeedback === "success" ? "복사 완료" : copyFeedback === "error" ? "복사 실패" : "전체 복사"}</button>
            </div>
          </div>

          <div className="ticket-list">
            {tickets.map((ticket, index) => (
              <article className="ticket-card" key={ticket.id}>
                <div className="ticket-label"><span className="ticket-index">0{index + 1}</span><span>GAME</span></div>
                <div className="ticket-balls">
                  {ticket.numbers.map((number) => <span className={`lotto-ball ${getBallColor(number)}`} key={number}>{number}</span>)}
                </div>
                <span className="ticket-spark" aria-hidden="true">✦</span>
              </article>
            ))}
          </div>

          <div className="results-footer">
            <div className="generated-info"><span className="check-icon">✓</span><span>이번 조합은 <strong>{generatedCount}번째</strong> 생성이에요</span></div>
            <span className="cost-info">예상 금액 <strong>{(tickets.length * 1000).toLocaleString()}원</strong></span>
          </div>
        </section>
      </section>

      <section className="info-strip" id="guide">
        <div className="info-icon"><SparkleIcon /></div>
        <div className="info-copy"><strong>모든 조합의 당첨 확률은 동일해요.</strong><span>로또 6/45 1등 당첨 확률은 약 814만 분의 1이며, 이 페이지는 재미를 위한 시뮬레이터입니다.</span></div>
        <div className="info-odds"><strong>1 / 8,145,060</strong><span>1등 당첨 확률</span></div>
      </section>

      <footer className="site-footer"><a className="footer-brand" href="#top">lotto<span>pick</span></a><span>작은 설렘을 위한 번호 시뮬레이터</span><span className="footer-copy">© 2026 lotto pick</span></footer>
    </main>
  );
}
