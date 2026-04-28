import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import KioskView from './pages/KioskView';
import MobileView from './pages/MobileView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<KioskView />} />
        <Route path="/remote" element={<MobileView />} />
      </Routes>
    </Router>
  );
}

export default App;
