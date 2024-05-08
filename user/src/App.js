import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Bot from "./Bot";
import Clinician from "./Clinician";

const App = () => {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/bot" element={<Bot />} />
          <Route path="/clinician" element={<Clinician />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
