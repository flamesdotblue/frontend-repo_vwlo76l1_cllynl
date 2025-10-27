import { useEffect, useState } from 'react';
import LoginView from './components/LoginView';
import Sidebar from './components/Sidebar';
import Predictor from './components/Predictor';
import History from './components/History';
import Topbar from './components/Topbar';
import HeroSpline from './components/HeroSpline';

function App() {
  const [user, setUser] = useState(null);
  const [active, setActive] = useState('predictor'); // 'predictor' | 'history'

  useEffect(() => {
    const raw = localStorage.getItem('betafold_session_v1');
    if (raw) {
      try {
        const u = JSON.parse(raw);
        if (u?.email) setUser(u);
      } catch {}
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('betafold_session_v1');
    setUser(null);
  };

  if (!user) {
    return <LoginView onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-black">
      <div className="flex">
        <Sidebar user={user} active={active} onNavigate={setActive} onSignOut={handleSignOut} />
        <div className="flex-1 min-h-screen text-white">
          <Topbar active={active} />
          <HeroSpline />
          {active === 'predictor' ? (
            <Predictor user={user} onSaved={() => setActive('history')} />
          ) : (
            <History user={user} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
