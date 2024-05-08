import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NumberEntryPage from './NumberEntryPage';
//import TestResult from './TestResult';
import Fast from './Fast';
import './App.css';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/test" element={<NumberEntryPage />} />
        <Route path="/data" element={<Fast />} />
      </Routes>
    </Router>
  );
}

export default App;