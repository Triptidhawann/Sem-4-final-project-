import { useTheme } from "../context/ThemeContext";
import { Ic } from "./icons";

/**
 * HospitalFilterBar
 *
 * Renders the filter sidebar / header bar for the Hospitals page.
 * Accepts the return value of useHospitalFilter() spread in as props.
 *
 * Props (all from useHospitalFilter):
 *   filters, setFilter, resetFilters, activeCount,
 *   availableStates, availableCities, availableDistricts,
 *   filtered (for showing result count)
 */
export default function HospitalFilterBar({
  filters, setFilter, resetFilters, activeCount,
  availableStates, availableCities, availableDistricts,
  totalCount,
}) {
  const { T } = useTheme();

  const selectStyle = {
    width: "100%",
    background: T.inputBg,
    border: `1.5px solid ${T.border}`,
    borderRadius: 8, padding: "9px 12px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13, color: T.text,
    outline: "none", cursor: "pointer",
    transition: "border-color .2s, background .3s, color .3s",
    appearance: "none",
  };

  const labelStyle = {
    fontSize: 11, fontWeight: 700, color: T.muted,
    textTransform: "uppercase", letterSpacing: ".08em",
    display: "block", marginBottom: 7,
  };

  const sectionStyle = { marginBottom: 20 };

  // ── Range slider helper ──────────────────────────────────────────────────────
  const RangeSlider = ({ filterKey, min, max, unit = "" }) => {
    const [lo, hi] = filters[filterKey];
    const pctLo = ((lo - min) / (max - min)) * 100;
    const pctHi = ((hi - min) / (max - min)) * 100;

    return (
      <div>
        {/* Values */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: T.teal, fontWeight: 600 }}>{lo}{unit}</span>
          <span style={{ fontSize: 12, color: T.teal, fontWeight: 600 }}>{hi}{unit}</span>
        </div>

        {/* Track with tinted fill */}
        <div style={{ position: "relative", height: 4, borderRadius: 99, background: T.border, marginBottom: 4 }}>
          <div style={{
            position: "absolute",
            left: `${pctLo}%`, right: `${100 - pctHi}%`,
            height: "100%", background: T.teal, borderRadius: 99,
            transition: "left .1s, right .1s",
          }}/>
        </div>

        {/* Min slider */}
        <input
          type="range" min={min} max={max}
          value={lo}
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), hi - 1);
            setFilter(filterKey, [v, hi]);
          }}
          style={{ marginBottom: 2 }}
        />
        {/* Max slider */}
        <input
          type="range" min={min} max={max}
          value={hi}
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), lo + 1);
            setFilter(filterKey, [lo, v]);
          }}
        />
      </div>
    );
  };

  return (
    <aside style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 14, padding: 22,
      boxShadow: T.shadow,
      transition: "background .3s, border-color .3s",
      position: "sticky", top: 80,
    }}>
      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {Ic.sliders(16)}
          <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Filters</span>
          {activeCount > 0 && (
            <span style={{
              background: T.teal, color: "#fff",
              borderRadius: 99, fontSize: 10, fontWeight: 700,
              padding: "1px 7px", lineHeight: "18px",
            }}>
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={resetFilters}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "none", border: "none", cursor: "pointer",
              color: T.danger, fontSize: 12, fontFamily: "'DM Sans'",
              padding: 0, fontWeight: 500,
            }}
          >
            {Ic.refresh(13)} Reset
          </button>
        )}
      </div>

      {/* Result count */}
      <div style={{
        background: T.tealLt, border: `1px solid ${T.tealMd}`,
        borderRadius: 8, padding: "8px 12px", marginBottom: 22,
        fontSize: 12, color: T.teal, fontWeight: 500,
      }}>
        Showing <strong>{totalCount}</strong> hospital{totalCount !== 1 ? "s" : ""}
      </div>

      {/* ── Location section ──────────────────────────────────────────────────── */}
      <div style={{
        marginBottom: 20, paddingBottom: 20,
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
          {Ic.pin(14)}
          <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Location</span>
        </div>

        <div style={sectionStyle}>
          <label style={labelStyle}>State</label>
          <div style={{ position: "relative" }}>
            <select
              className="field"
              value={filters.state}
              onChange={(e) => {
                setFilter("state", e.target.value);
                setFilter("city", "all");
                setFilter("district", "all");
              }}
              style={selectStyle}
            >
              {availableStates.map((s) => (
                <option key={s} value={s}>{s === "all" ? "All States" : s}</option>
              ))}
            </select>
            <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: T.faint, pointerEvents: "none" }}>
              {Ic.chevDown(14)}
            </span>
          </div>
        </div>

        <div style={sectionStyle}>
          <label style={labelStyle}>City</label>
          <div style={{ position: "relative" }}>
            <select
              className="field"
              value={filters.city}
              onChange={(e) => {
                setFilter("city", e.target.value);
                setFilter("district", "all");
              }}
              style={selectStyle}
            >
              {availableCities.map((c) => (
                <option key={c} value={c}>{c === "all" ? "All Cities" : c}</option>
              ))}
            </select>
            <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: T.faint, pointerEvents: "none" }}>
              {Ic.chevDown(14)}
            </span>
          </div>
        </div>

        <div style={{ ...sectionStyle, marginBottom: 0 }}>
          <label style={labelStyle}>District</label>
          <div style={{ position: "relative" }}>
            <select
              className="field"
              value={filters.district}
              onChange={(e) => setFilter("district", e.target.value)}
              style={selectStyle}
            >
              {availableDistricts.map((d) => (
                <option key={d} value={d}>{d === "all" ? "All Districts" : d}</option>
              ))}
            </select>
            <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: T.faint, pointerEvents: "none" }}>
              {Ic.chevDown(14)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Status section ────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${T.border}` }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: T.text, display: "block", marginBottom: 12 }}>Status</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {["all", "critical", "moderate", "stable"].map((s) => {
            const active = filters.status === s;
            const dotColor = s === "critical" ? T.danger : s === "moderate" ? T.warning : s === "stable" ? T.success : T.muted;
            return (
              <button
                key={s}
                onClick={() => setFilter("status", s)}
                style={{
                  display: "flex", alignItems: "center", gap: 9,
                  textAlign: "left", background: active ? T.tealLt : "transparent",
                  border: `1px solid ${active ? T.tealMd : "transparent"}`,
                  borderRadius: 8, padding: "8px 10px",
                  color: active ? T.teal : T.muted,
                  fontSize: 13, cursor: "pointer",
                  fontFamily: "'DM Sans'", fontWeight: active ? 600 : 400,
                  transition: "all .15s",
                }}
              >
                {s !== "all" && (
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: active ? T.teal : dotColor, flexShrink: 0, display: "inline-block" }}/>
                )}
                {s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
                {active && (
                  <span style={{ marginLeft: "auto", color: T.teal }}>
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Resource Availability section ─────────────────────────────────────── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 16 }}>
          {Ic.box(14)}
          <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Resource Availability</span>
        </div>

        {[
          { key: "beds",   label: "ICU Beds",    min: 0, max: 500, unit: "" },
          { key: "vents",  label: "Ventilators", min: 0, max: 150, unit: "" },
          { key: "oxygen", label: "Oxygen %",    min: 0, max: 100, unit: "%" },
          { key: "blood",  label: "Blood Units", min: 0, max: 300, unit: "" },
        ].map(({ key, label, min, max, unit }) => (
          <div key={key} style={{ marginBottom: 18 }}>
            <label style={labelStyle}>{label}</label>
            <RangeSlider filterKey={key} min={min} max={max} unit={unit} />
          </div>
        ))}
      </div>
    </aside>
  );
}
