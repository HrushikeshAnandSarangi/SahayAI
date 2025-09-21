"use client"

import React, { createContext, useReducer, useContext, useEffect, FC, ReactNode } from 'react';

// --- 1. Centralized Type Definitions ---
export interface IKeyTerm {
  term: string;
  definition: string;
}

export interface IClauseAnalysis {
  clause: string;
  meaning: string;
  citation: string;
}

export interface IKeyDetails {
  confidence_score: string;
  document_type: string;
  parties_involved: string[];
  effective_period: string;
  clauses_involved: string[];
  key_terms: IKeyTerm[];
}

export interface IAnalysis {
  summary: string;
  clauses_analysis: IClauseAnalysis[];
  references: string[];
}

export interface IAnalysisResult {
  scraped_text: string;
  key_details: IKeyDetails;
  analysis: IAnalysis;
  actionable_checklist: string[];
}

// Fixed the IChatMessage interface - using array type instead of tuple
export interface IChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[]; // Changed from tuple [{ text: string }] to array
}

interface AppState {
  userRole: 'Plaintiff' | 'Defendant' | null;
  isLoading: boolean;
  error: string | null;
  analysisResult: IAnalysisResult | null;
  chatHistory: IChatMessage[];
}

type Action =
  | { type: 'START_PROCESSING' }
  | { type: 'SET_ANALYSIS_SUCCESS'; payload: IAnalysisResult }
  | { type: 'ADD_CHAT_MESSAGE'; payload: IChatMessage }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_USER_ROLE'; payload: 'Plaintiff' | 'Defendant' }
  | { type: 'CLEAR_STATE' }
  | { type: 'LOAD_STATE'; payload: AppState };

const initialState: AppState = {
  userRole: null,
  isLoading: false,
  error: null,
  analysisResult: null,
  chatHistory: [],
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'START_PROCESSING':
      return { ...state, isLoading: true, error: null };
    case 'SET_ANALYSIS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        analysisResult: action.payload,
        chatHistory: [
          {
            role: 'model',
            parts: [{ text: "Hello! I've analyzed your document. How can I help you?" }],
          },
        ],
      };
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatHistory: [...state.chatHistory, action.payload] };
    case 'SET_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'SET_USER_ROLE':
      return { ...state, userRole: action.payload };
    case 'CLEAR_STATE':
      return initialState;
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
};

interface AppContextProps {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem('appState');
      if (savedState) {
        const parsedState: AppState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      }
    } catch (error) {
      console.error("Could not load state from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('appState', JSON.stringify(state));
    } catch (error) {
      console.error("Could not save state to localStorage", error);
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};