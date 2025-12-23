
import React, { useState } from 'react';
import Flashcards from '../components/Flashcards';
import FlashcardQuiz from '../components/FlashcardQuiz';

enum TrainingMode {
  HUB = 'hub',
  CARDS = 'cards',
  WORDS = 'words'
}

const Training: React.FC<{ store: any }> = ({ store }) => {
  const [mode, setMode] = useState<TrainingMode>(TrainingMode.HUB);
  const { vocab, getReviewBatch } = store;

  if (mode === TrainingMode.CARDS) return <Flashcards store={store} onClose={() => setMode(TrainingMode.HUB)} />;
  if (mode === TrainingMode.WORDS) return <FlashcardQuiz store={store} onClose={() => setMode(TrainingMode.HUB)} />;

  const dueCount = getReviewBatch().length;

  return (
    <div className="p-8 h-full animate-in fade-in duration-700">
      <div className="mb-12">
        <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">Training Hub</h2>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
          Review Protocol: <span className={dueCount > 0 ? 'text-accent' : ''}>{dueCount} items due</span>
        </p>
      </div>

      <div className="space-y-6">
        <TrainingCard 
          icon="fa-address-card"
          title="Card Training"
          desc="Standard 3D flip-cards. Focus on rapid visual recall and phonetic mastery."
          onClick={() => setMode(TrainingMode.CARDS)}
          disabled={vocab.length === 0}
        />

        <TrainingCard 
          icon="fa-list-check"
          title="Word Training"
          desc="AI-powered gap fill. Tests context, syntax, and deep semantics."
          onClick={() => setMode(TrainingMode.WORDS)}
          disabled={vocab.length === 0}
        />
      </div>

      {vocab.length === 0 && (
        <div className="mt-12 p-10 border-2 border-dashed border-white/5 rounded-[3rem] text-center opacity-40">
           <i className="fa-solid fa-lock text-4xl mb-4"></i>
           <p className="text-[10px] font-black uppercase tracking-widest leading-loose text-center">The vault is currently empty.<br/>Save words in the library to begin.</p>
        </div>
      )}
    </div>
  );
};

const TrainingCard: React.FC<{icon: string, title: string, desc: string, onClick: () => void, disabled: boolean}> = ({icon, title, desc, onClick, disabled}) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`w-full text-left p-8 rounded-[2.5rem] border transition-all active:scale-95 group ${
      disabled ? 'bg-slate-card/40 border-white/5 opacity-50 grayscale cursor-not-allowed' : 'bg-slate-card border-white/5 hover:border-accent shadow-2xl shadow-black/50'
    }`}
  >
    <div className="flex items-center gap-6 mb-4">
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-2xl ${disabled ? 'bg-white/5 text-slate-700' : 'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all'}`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div>
        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">{title}</h3>
      </div>
    </div>
    <p className="text-slate-400 text-sm font-medium leading-relaxed">{desc}</p>
  </button>
);

export default Training;
