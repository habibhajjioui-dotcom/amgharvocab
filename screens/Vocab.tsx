
import React, { useState } from 'react';
import { VocabItem } from '../types';

const Vocab: React.FC<{ store: any }> = ({ store }) => {
  const [search, setSearch] = useState('');
  const { vocab, removeVocab } = store;

  const masteredCount = vocab.filter((v: VocabItem) => (v.repetition || 0) >= 4).length;
  const masteryPercent = vocab.length > 0 ? Math.round((masteredCount / vocab.length) * 100) : 0;

  const filtered = vocab.filter((v: VocabItem) => 
    v.word.toLowerCase().includes(search.toLowerCase()) || 
    v.senses?.[0]?.translation?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 h-full flex flex-col animate-in fade-in duration-700 pb-24">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">The Vault</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Intelligence Database: {vocab.length}</p>
        </div>
        <div className="text-right">
          <div className="flex items-baseline gap-1 justify-end">
             <span className="text-3xl font-black text-emerald-400 italic">{masteryPercent}%</span>
          </div>
          <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden mt-1 ml-auto">
            <div className="h-full bg-emerald-400 transition-all duration-1000" style={{ width: `${masteryPercent}%` }}></div>
          </div>
        </div>
      </div>
      
      <div className="relative mb-8">
        <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-600"></i>
        <input 
          type="text" 
          placeholder="Search saved intelligence..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-card border border-white/10 rounded-2xl py-5 pl-14 pr-4 text-white font-bold outline-none focus:border-accent transition-all placeholder:text-slate-700 shadow-xl"
        />
      </div>

      <div className="space-y-4 overflow-y-auto pr-1 flex-1">
        {filtered.length === 0 ? (
          <div className="text-center py-24 opacity-20 border-2 border-dashed border-white/10 rounded-[3rem]">
            <i className="fa-solid fa-box-open text-5xl mb-6"></i>
            <p className="font-black uppercase tracking-widest text-[10px]">Registry is empty</p>
          </div>
        ) : (
          filtered.map((item: VocabItem) => {
            const isMastered = (item.repetition || 0) >= 4;
            return (
              <div key={item.id} className="bg-slate-card border border-white/5 rounded-[2.5rem] p-6 flex justify-between items-center group hover:border-accent/40 transition-all shadow-2xl">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-black text-white italic tracking-tighter">{item.word}</span>
                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border ${
                      isMastered ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-accent/10 border-accent/30 text-accent'
                    }`}>
                      {isMastered ? 'Mastered' : item.pos}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-wide opacity-80 italic">{item.senses[0].translation}</p>
                </div>
                <button 
                  onClick={() => removeVocab(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-700 hover:text-rose-500 transition-all p-3"
                >
                  <i className="fa-solid fa-trash-can text-lg"></i>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Vocab;
