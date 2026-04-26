import { useState, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import GlobalStyles from "./components/GlobalStyles";
import Nav from "./components/Nav";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import HospitalsPage from "./pages/HospitalsPage";
import { AllocationsPage, RequestsPage, TrackingPage, AlertsPage } from "./pages/OtherPages";
import UsersPage from "./pages/UsersPage";
import ProfilePage from "./pages/ProfilePage";
import InventoryPage from "./pages/InventoryPage";
import Footer from "./components/Footer";

// ─── Inner app (needs ThemeProvider to already be mounted) ────────────────────
function AppInner() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("carecube_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [page, setPageState] = useState(() => {
    return localStorage.getItem("carecube_page") || "home";
  });
  const [history, setHistory] = useState([page]);

  const setPage = (newPage) => {
    if (typeof newPage === 'function') {
      setPageState(prev => {
        const next = newPage(prev);
        if (next !== prev) setHistory(h => [...h, next]);
        return next;
      });
    } else {
      if (newPage !== page) {
        setHistory(h => [...h, newPage]);
        setPageState(newPage);
      }
    }
  };

  useEffect(() => {
    const handleGoBack = () => {
      setHistory(prev => {
        if (prev.length > 1) {
          const newHistory = prev.slice(0, -1);
          setPageState(newHistory[newHistory.length - 1]);
          return newHistory;
        }
        return prev;
      });
    };
    window.addEventListener("goBack", handleGoBack);
    return () => window.removeEventListener("goBack", handleGoBack);
  }, []);

  // Save to localStorage whenever they change
  useEffect(() => {
    if (user) localStorage.setItem("carecube_user", JSON.stringify(user));
    else localStorage.removeItem("carecube_user");
  }, [user]);

  useEffect(() => {
    localStorage.setItem("carecube_page", page);
  }, [page]);

  // Guard: redirect to login if protected page accessed while logged out
  const guard = (component) =>
    user ? component : <LoginPage setUser={setUser} setPage={setPage}/>;

  const renderPage = () => {
    switch (page) {
      case "home":        return <HomePage setPage={setPage}/>;
      case "login":       return <LoginPage setUser={setUser} setPage={setPage}/>;
      case "dashboard":   return guard(<DashboardPage user={user} setPage={setPage} setUser={setUser}/>);
      case "profile":     return guard(<ProfilePage user={user} setUser={setUser}/>);
      case "hospitals":   return <HospitalsPage/>;
      case "allocations": return <AllocationsPage/>;
      case "requests":    return guard(<RequestsPage user={user}/>);
      case "tracking":    return <TrackingPage user={user}/>;
      case "alerts":      return <AlertsPage/>;
      // Role-specific aliases
      case "inventory":   return guard(<InventoryPage user={user} />);
      case "search":      return guard(<DashboardPage user={user} setPage={setPage} setUser={setUser}/>);
      case "users":       return guard(<UsersPage user={user}/>);
      default:            return <HomePage setPage={setPage}/>;
    }
  };

  return (
    <>
      <GlobalStyles/>
      <Nav user={user} page={page} setPage={setPage} setUser={setUser}/>
      {renderPage()}
      {/* global footer */}
      <Footer/>
    </>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <AppInner/>
    </ThemeProvider>
  );
}
