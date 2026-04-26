import { useTheme } from "../context/ThemeContext";

export default function GlobalStyles() {
  const { T, isDark } = useTheme();

  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display:ital@0;1&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      body {
        font-family: 'DM Sans', system-ui, sans-serif;
        background: ${T.bg};
        color: ${T.text};
        -webkit-font-smoothing: antialiased;
        transition: background-color 0.3s ease, color 0.3s ease;
      }

      .serif { font-family: 'DM Serif Display', Georgia, serif; }

      /* ── Animations ─────────────────────────────────────────────────────────── */
      @keyframes fadeUp  { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
      @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
      @keyframes liveDot { 0%,100% { opacity:1; transform:scale(1) } 50% { opacity:.45; transform:scale(.8) } }

      .s1 { animation: fadeUp .42s ease both .05s }
      .s2 { animation: fadeUp .42s ease both .11s }
      .s3 { animation: fadeUp .42s ease both .17s }
      .s4 { animation: fadeUp .42s ease both .23s }
      .s5 { animation: fadeUp .42s ease both .29s }

      .live-dot { animation: liveDot 2.2s ease-in-out infinite; }

      /* ── Cards ──────────────────────────────────────────────────────────────── */
      .card-lift {
        transition: box-shadow .22s ease, transform .22s ease,
                    border-color .22s ease, background-color .3s ease;
      }
      .card-lift:hover {
        transform: translateY(-2px);
        box-shadow: ${T.cardHover};
        border-color: ${T.teal} !important;
      }

      /* ── Nav links ──────────────────────────────────────────────────────────── */
      .nav-link {
        position: relative;
        background: none; border: none; cursor: pointer;
        font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
        padding: 6px 12px; border-radius: 6px; text-transform: capitalize;
        transition: color .18s, background .18s;
      }
      .nav-link::after {
        content: '';
        position: absolute; bottom: -4px; left: 0; right: 0;
        height: 2px; background: ${T.teal}; border-radius: 1px;
        transform: scaleX(0); transform-origin: left;
        transition: transform .2s ease;
      }
      .nav-link:hover, .nav-link.active { color: ${T.teal} !important; }
      .nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); }

      /* ── Table rows ─────────────────────────────────────────────────────────── */
      .t-row { transition: background .15s; cursor: default; }
      .t-row:hover { background: ${T.tableHover} !important; }

      /* ── Form inputs ────────────────────────────────────────────────────────── */
      .field {
        width: 100%;
        background: ${T.inputBg};
        border: 1.5px solid ${T.border};
        border-radius: 8px; padding: 10px 14px;
        font-family: 'DM Sans', sans-serif; font-size: 14px;
        color: ${T.text}; outline: none;
        transition: border-color .2s, box-shadow .2s, background .3s, color .3s;
      }
      .field:focus {
        border-color: ${T.teal};
        box-shadow: 0 0 0 3px ${isDark ? "rgba(45,212,191,0.18)" : "rgba(13,110,110,0.11)"};
      }
      .field::placeholder { color: ${T.faint}; }
      select.field { cursor: pointer; }
      select.field option { background: ${T.card}; color: ${T.text}; }

      /* ── Range sliders ──────────────────────────────────────────────────────── */
      input[type="range"] {
        -webkit-appearance: none; appearance: none;
        width: 100%; height: 4px; border-radius: 99px;
        background: ${T.border}; cursor: pointer; outline: none;
        transition: background .3s;
      }
      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none; appearance: none;
        width: 16px; height: 16px; border-radius: 50%;
        background: ${T.teal}; border: 2px solid ${T.card};
        box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        cursor: pointer; transition: transform .15s, box-shadow .15s;
      }
      input[type="range"]::-webkit-slider-thumb:hover {
        transform: scale(1.2);
        box-shadow: 0 0 0 4px ${isDark ? "rgba(45,212,191,0.22)" : "rgba(13,110,110,0.15)"};
      }

      /* ── Resource bars ──────────────────────────────────────────────────────── */
      .rbar { transition: width 1.1s cubic-bezier(.4,0,.2,1); }

      /* ── Tracking timeline ──────────────────────────────────────────────────── */
      .step-done   .step-dot { background: ${T.teal};  border-color: ${T.teal}; }
      .step-active .step-dot {
        background: ${T.card}; border-color: ${T.teal};
        box-shadow: 0 0 0 4px ${isDark ? "rgba(45,212,191,0.22)" : "rgba(13,110,110,0.16)"};
      }
      .step-pending .step-dot { background: ${T.card}; border-color: ${T.faint}; }

      /* ── Buttons ────────────────────────────────────────────────────────────── */
      .btn-primary { transition: background .18s, box-shadow .18s, transform .1s; }
      .btn-primary:hover {
        background: ${T.tealDk} !important;
        box-shadow: 0 4px 14px ${isDark ? "rgba(45,212,191,0.28)" : "rgba(13,110,110,0.28)"};
      }
      .btn-primary:active { transform: scale(.98); }

      .btn-ghost { transition: all .18s; }
      .btn-ghost:hover {
        background: ${T.tealLt} !important;
        border-color: ${T.teal} !important;
        color: ${T.teal} !important;
      }

      /* ── Scrollbars ─────────────────────────────────────────────────────────── */
      ::-webkit-scrollbar { width: 5px; height: 5px; }
      ::-webkit-scrollbar-track { background: ${T.bgSub}; }
      ::-webkit-scrollbar-thumb { background: ${isDark ? "#243245" : "#CBD5E1"}; border-radius: 3px; }

      /* ── Theme toggle ───────────────────────────────────────────────────────── */
      .theme-opt { transition: background .14s; }
      .theme-opt:hover { background: ${T.bgSub} !important; }

      input:focus, select:focus, textarea:focus { outline: none; }
    `}</style>
  );
}
