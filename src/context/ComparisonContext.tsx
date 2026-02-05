import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { DiagnosticResult } from '../data/sonicDiagnosticPool';

interface ComparisonContextType {
    selectedModels: string[];
    listenerPreference: 'MUSICAL' | 'ANALYTICAL' | 'BALANCED' | null;
    diagnosticResult: DiagnosticResult | null;
    aiProvider: 'GEMINI' | 'OPENAI' | 'SIMULATED' | 'LOCAL_API';
    apiKey: string;
    setListenerPreference: (pref: 'MUSICAL' | 'ANALYTICAL' | 'BALANCED' | null) => void;
    setDiagnosticResult: (result: DiagnosticResult | null) => void;
    setAiProvider: (provider: 'GEMINI' | 'OPENAI' | 'SIMULATED' | 'LOCAL_API') => void;
    setApiKey: (key: string) => void;
    addModel: (id: string) => void;
    removeModel: (id: string) => void;
    toggleModel: (id: string) => void;
    clearModels: () => void;
    isInComparison: (id: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const useComparison = () => {
    const context = useContext(ComparisonContext);
    if (!context) {
        throw new Error('useComparison must be used within a ComparisonProvider');
    }
    return context;
};

interface ComparisonProviderProps {
    children: ReactNode;
}

export const ComparisonProvider: React.FC<ComparisonProviderProps> = ({ children }) => {
    const [selectedModels, setSelectedModels] = useState<string[]>(() => {
        const saved = localStorage.getItem('sonic_lab_comparison');
        return saved ? JSON.parse(saved) : [];
    });

    const [listenerPreference, setListenerPreference] = useState<'MUSICAL' | 'ANALYTICAL' | 'BALANCED' | null>(() => {
        const saved = localStorage.getItem('sonic_lab_listener_preference');
        return saved ? (saved as 'MUSICAL' | 'ANALYTICAL' | 'BALANCED') : null;
    });

    const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(() => {
        const saved = localStorage.getItem('sonic_lab_diagnostic_result');
        return saved ? JSON.parse(saved) : null;
    });

    const [aiProvider, setAiProvider] = useState<'GEMINI' | 'OPENAI' | 'SIMULATED' | 'LOCAL_API'>(() => {
        const saved = localStorage.getItem('sonic_lab_ai_provider');
        if (saved) return saved as any;
        return import.meta.env.VITE_OPENAI_API_KEY ? 'OPENAI' : 'SIMULATED';
    });

    const [apiKey, setApiKey] = useState(() => {
        return localStorage.getItem('serio_api_key') || import.meta.env.VITE_OPENAI_API_KEY || '';
    });

    useEffect(() => {
        localStorage.setItem('sonic_lab_comparison', JSON.stringify(selectedModels));
    }, [selectedModels]);

    useEffect(() => {
        if (listenerPreference) {
            localStorage.setItem('sonic_lab_listener_preference', listenerPreference);
        } else {
            localStorage.removeItem('sonic_lab_listener_preference');
        }
    }, [listenerPreference]);

    useEffect(() => {
        if (diagnosticResult) {
            localStorage.setItem('sonic_lab_diagnostic_result', JSON.stringify(diagnosticResult));
        } else {
            localStorage.removeItem('sonic_lab_diagnostic_result');
        }
    }, [diagnosticResult]);

    useEffect(() => {
        localStorage.setItem('sonic_lab_ai_provider', aiProvider);
    }, [aiProvider]);

    useEffect(() => {
        localStorage.setItem('serio_api_key', apiKey);
    }, [apiKey]);

    const addModel = (id: string) => {
        if (selectedModels.length >= 4) {
            alert("You can compare up to 4 models at a time.");
            return;
        }
        if (!selectedModels.includes(id)) {
            setSelectedModels(prev => [...prev, id]);
        }
    };

    const removeModel = (id: string) => {
        setSelectedModels(prev => prev.filter(m => m !== id));
    };

    const toggleModel = (id: string) => {
        if (selectedModels.includes(id)) {
            removeModel(id);
        } else {
            addModel(id);
        }
    };

    const clearModels = () => {
        setSelectedModels([]);
        setListenerPreference(null);
        setDiagnosticResult(null);
    };

    const isInComparison = (id: string) => selectedModels.includes(id);

    return (
        <ComparisonContext.Provider value={{
            selectedModels,
            listenerPreference,
            diagnosticResult,
            aiProvider,
            apiKey,
            setListenerPreference,
            setDiagnosticResult,
            setAiProvider,
            setApiKey,
            addModel,
            removeModel,
            toggleModel,
            clearModels,
            isInComparison
        }}>
            {children}
        </ComparisonContext.Provider>
    );
};
