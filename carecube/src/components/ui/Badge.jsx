import { useTheme } from "../../context/ThemeContext";

/**
 * Badge — coloured status/priority pill with a dot indicator.
 * type: "critical" | "high" | "medium" | "low" | "in-transit" |
 *       "delivered" | "processing" | "pending" | "approved" | "fulfilled" |
 *       "stable" | "moderate"
 */
export default function Badge({ type }) {
  const { T } = useTheme();

  const map = {
    critical:    { bg: T.dangerLt,  text: T.danger,  bd: T.dangerBd,  label: "Critical"    },
    high:        { bg: T.warnLt,    text: "#B45309",  bd: T.warnBd,    label: "High"        },
    medium:      { bg: T.warnLt,    text: T.warning,  bd: T.warnBd,    label: "Medium"      },
    low:         { bg: T.tealLt,    text: T.teal,     bd: T.tealMd,    label: "Low"         },
    "in-transit":{ bg: T.tealLt,    text: T.teal,     bd: T.tealMd,    label: "In Transit"  },
    delivered:   { bg: T.successLt, text: T.success,  bd: T.successBd, label: "Delivered"   },
    processing:  { bg: T.tealLt,    text: T.teal,     bd: T.tealMd,    label: "Processing"  },
    pending:     { bg: T.warnLt,    text: T.warning,  bd: T.warnBd,    label: "Pending"     },
    approved:    { bg: T.successLt, text: T.success,  bd: T.successBd, label: "Approved"    },
    fulfilled:   { bg: T.successLt, text: T.success,  bd: T.successBd, label: "Fulfilled"   },
    stable:      { bg: T.successLt, text: T.success,  bd: T.successBd, label: "Stable"      },
    moderate:    { bg: T.warnLt,    text: T.warning,  bd: T.warnBd,    label: "Moderate"    },
  };

  const normalizedType = type?.toLowerCase();
  const c = map[normalizedType] || map.low;

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: c.bg, color: c.text, border: `1px solid ${c.bd}`,
      borderRadius: 6, padding: "3px 10px",
      fontSize: 12, fontWeight: 500, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.text, display: "inline-block", flexShrink: 0 }}/>
      {c.label}
    </span>
  );
}
