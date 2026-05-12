import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import KioskView from './pages/KioskView'
import StudentApp from './pages/StudentApp'
import StudentAuth from './components/StudentAuth'
import EntitlementGate from './components/EntitlementGate'
import { useAuthStore } from './store/authStore'

function StudentRoot() {
  const student = useAuthStore(s => s.student)
  // Logged-in students hit the entitlement gate. Anonymous (StudentAuth)
  // bypasses — the gate would return "anonymous" anyway, skipping the
  // round trip keeps the login screen snappy.
  if (!student) return <StudentAuth />
  return (
    <EntitlementGate>
      <StudentApp />
    </EntitlementGate>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* KioskView is a public lab display — no auth, no gate */}
        <Route path="/" element={<KioskView />} />
        <Route path="/join" element={<StudentRoot />} />
      </Routes>
    </Router>
  )
}
