// frontend/src/context/QuizSetupContext.jsx
import React, { createContext, useState } from 'react';

export const QuizSetupContext = createContext();

export function QuizSetupProvider({ children }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFile, setSelectedFile]         = useState(null);
  const [selectedTeams, setSelectedTeams]       = useState([]);

  return (
    <QuizSetupContext.Provider value={{
      selectedCategory,
      setSelectedCategory,
      selectedFile,
      setSelectedFile,
      selectedTeams,
      setSelectedTeams,
    }}>
      {children}
    </QuizSetupContext.Provider>
  );
}
