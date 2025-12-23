
import { useState, useEffect } from 'react';
import { UserSettings, CEFRLevel, VocabItem, GenerateTextResponse } from '../types';
import { updateSRS } from '../services/srs';

const STORAGE_KEY = 'amghar_protocol_final';

const initialSettings: UserSettings = {
  userName: '',
  nativeLanguage: 'English',
  targetLanguage: 'Spanish',
  targetLanguages: ['Spanish'],
  level: CEFRLevel.A1,
  preferredLevel: CEFRLevel.A1,
  hasOnboarded: false,
  optOutAI: false,
  interests: []
};

export const useAppState = () => {
  const [settings, setSettings] = useState<UserSettings>(initialSettings);
  const [vocab, setVocab] = useState<VocabItem[]>([]);
  const [currentText, setCurrentText] = useState<GenerateTextResponse | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed.settings || initialSettings);
        setVocab(parsed.vocab || []);
        setCurrentText(parsed.currentText || null);
      } catch (e) { console.error("Protocol recovery failed", e); }
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ settings, vocab, currentText }));
    }
  }, [settings, vocab, currentText, isReady]);

  const updateSettings = (u: Partial<UserSettings>) => setSettings(s => ({ ...s, ...u }));
  const completeOnboarding = () => updateSettings({ hasOnboarded: true });

  const addVocab = (item: VocabItem) => {
    setVocab(prev => {
      if (prev.some(v => v.word.toLowerCase() === item.word.toLowerCase())) return prev;
      return [item, ...prev];
    });
  };

  const removeVocab = (id: string) => setVocab(v => v.filter(x => x.id !== id));

  const reviewVocab = (id: string, quality: number) => {
    setVocab(prev => prev.map(v => v.id === id ? { ...v, ...updateSRS(v, quality) } : v));
  };

  const getReviewBatch = () => {
    const now = Date.now();
    return vocab.filter(v => (v.nextReview || 0) <= now);
  };

  return { 
    settings, 
    updateSettings, 
    completeOnboarding, 
    vocab, 
    addVocab, 
    removeVocab, 
    reviewVocab, 
    getReviewBatch, 
    currentText, 
    setCurrentText 
  };
};
