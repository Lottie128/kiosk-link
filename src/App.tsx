import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import KioskView from './pages/KioskView'
import StudentApp from './pages/StudentApp'
import StudentAuth from './components/StudentAuth'
import { useAuthStore } from './store/authStore'

function StudentRoot() {
  const student = useAuthStore(s => s.student)
  return student ? <StudentApp /> : <StudentAuth />
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentRoot />} />
        <Route path="/kiosk" element={<KioskView />} />
      </Routes>
    </Router>
  )
}
