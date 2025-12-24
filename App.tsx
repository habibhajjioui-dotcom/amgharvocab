
import React, { useState } from 'react';
import { useAppState } from './store/useAppState';
import Onboarding from './screens/Onboarding';
import Reader from './screens/Reader';
import Vocab from './screens/Vocab';
import Training from './screens/Training';
import Profile from './screens/Profile';

enum Screen {
  READER = 'reader',
  VOCAB = 'vocab',
  TRAINING = 'training',
  PROFILE = 'profile'
}

const App: React.FC = () => {
  const store = useAppState();
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.READER);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Critical: prevent rendering before store hydration from localStorage
  if (!store || !store.isReady) {
    return (
      <div className="h-screen bg-midnight flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  const storeEnhanced = { ...store, setError };

  if (!store.settings.hasOnboarded) {
    return <Onboarding store={storeEnhanced} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.READER: return <Reader store={storeEnhanced} />;
      case Screen.VOCAB: return <Vocab store={storeEnhanced} />;
      case Screen.TRAINING: return <Training store={storeEnhanced} />;
      case Screen.PROFILE: return <Profile store={storeEnhanced} />;
      default: return <Reader store={storeEnhanced} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-midnight text-slate-100 max-w-md mx-auto relative shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden border-x border-white/5">
      {error && (
        <div className="absolute top-0 left-0 right-0 z-[100] bg-rose-600 text-white p-4 text-[10px] font-black uppercase tracking-widest flex justify-between items-center animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-triangle-exclamation text-lg"></i>
            {error}
          </div>
          <button onClick={() => setError(null)} className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      <header className="px-8 py-6 flex items-center justify-between bg-midnight/80 backdrop-blur-xl border-b border-white/5 z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="bg-accent h-3 w-3 rounded-full animate-pulse shadow-[0_0_10px_#E11D48]"></div>
          <h1 className="text-xl font-black italic uppercase tracking-tighter text-white">AMGHAR</h1>
        </div>
        <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-3">
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tier:</span>
           <span className="text-[10px] font-black uppercase tracking-widest text-accent italic">{store.settings.level}</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto relative bg-midnight pb-32">
        {renderScreen()}
      </main>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <button 
          onClick={() => setIsNavOpen(!isNavOpen)}
          className={`h-16 w-16 bg-accent text-white shadow-2xl flex items-center justify-center transition-all active:scale-90 rounded-[2rem] border-4 border-midnight ${isNavOpen ? 'rotate-90' : ''}`}
        >
          <i className={`fa-solid ${isNavOpen ? 'fa-xmark' : 'fa-compass'} text-2xl`}></i>
        </button>
      </div>

      {isNavOpen && (
        <div className="absolute inset-0 z-40 bg-midnight/90 backdrop-blur-lg flex items-center justify-center animate-in fade-in duration-300">
          <nav className="grid grid-cols-2 gap-8 p-8 max-w-xs">
            <NavButton 
              active={currentScreen === Screen.READER} 
              onClick={() => { setCurrentScreen(Screen.READER); setIsNavOpen(false); }} 
              icon="fa-book-open"
              label="Reading"
            />
            <NavButton 
              active={currentScreen === Screen.VOCAB} 
              onClick={() => { setCurrentScreen(Screen.VOCAB); setIsNavOpen(false); }} 
              icon="fa-vault"
              label="Vocab"
            />
            <NavButton 
              active={currentScreen === Screen.TRAINING} 
              onClick={() => { setCurrentScreen(Screen.TRAINING); setIsNavOpen(false); }} 
              icon="fa-brain"
              label="Training"
            />
            <NavButton 
              active={currentScreen === Screen.PROFILE} 
              onClick={() => { setCurrentScreen(Screen.PROFILE); setIsNavOpen(false); }} 
              icon="fa-user-ninja"
              label="Operator"
            />
          </nav>
        </div>
      )}
    </div>
  );
};

const NavButton: React.FC<{active: boolean, onClick: () => void, icon: string, label: string}> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-4 transition-all h-32 w-32 rounded-3xl border-2 ${active ? 'bg-accent/10 border-accent text-accent scale-110' : 'bg-slate-card border-white/5 text-slate-600 hover:text-white'}`}
  >
    <i className={`fa-solid ${icon} text-3xl`}></i>
    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
  </button>
);

export default App;

