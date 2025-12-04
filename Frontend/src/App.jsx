import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Page from "./YogaPage";
import EachExercise from "./EachExercise";
import { DarkModeProvider } from "./DarkModeContext";

export default function App() {
  return (
    <DarkModeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Page />} />
          <Route path="/exercise/:id/*" element={<EachExercise />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </DarkModeProvider>
  );
}
