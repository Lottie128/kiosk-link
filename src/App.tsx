import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import KioskView from './pages/KioskView';
import MobileView from './pages/MobileView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/kiosk" element={<KioskView />} />
        <Route path="/" element={<MobileView />} />
      </Routes>
    </Router>
  );
}

export default App;
