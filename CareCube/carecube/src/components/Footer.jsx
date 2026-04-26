import { useTheme } from "../context/ThemeContext";

export default function Footer() {
  const { T } = useTheme();
  return (
    <footer style={{
      background: T.card,
      borderTop: `1px solid ${T.border}`,
      padding: "24px 0",
      textAlign: "center",
      color: T.muted,
      fontSize: 13,
      marginTop: 40,
    }}>
      <div>© {new Date().getFullYear()} CareCube. All rights reserved.</div>
    </footer>
  );
}
