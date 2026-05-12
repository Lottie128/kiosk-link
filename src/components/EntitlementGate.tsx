import { useEffect, useState, type ReactNode } from 'react'
import { useAuthStore } from '../store/authStore'
import { checkEntitlement, type EntitlementState } from '../lib/entitlement'

interface Props { children: ReactNode }

const DEFAULT_SALES_EMAIL = 'app@zeroaitech.tech'

const COUNTRY_CONTACTS: Record<string, { email: string; whatsapp?: string }> = {
  philippines: { email: 'mizako@appletutors.org', whatsapp: '639656436979' },
}

function resolveContact(country: string | null, contactEmail: string | null, contactPhone: string | null) {
  if (contactEmail) return { email: contactEmail, whatsapp: contactPhone ?? undefined }
  if (country) {
    const partner = COUNTRY_CONTACTS[country.toLowerCase()]
    if (partner) return partner
  }
  return { email: DEFAULT_SALES_EMAIL }
}

export default function EntitlementGate({ children }: Props) {
  const student = useAuthStore(s => s.student)
  const logout  = useAuthStore(s => s.logout)

  const [state, setState] = useState<EntitlementState>({ status: 'loading' })

  useEffect(() => {
    if (!student) { setState({ status: 'anonymous' }); return }

    let cancelled = false
    void checkEntitlement({
      app:                 'kiosk',
      userEmail:           null,
      studentClassId:      student.class_id,
      isLegacyAdmin:       false,
      schoolAdminSchoolId: null,
    }).then(s => { if (!cancelled) setState(s) })
    return () => { cancelled = true }
  }, [student?.class_id])

  if (state.status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#06061a', color: '#94a3b8', fontSize: 13 }}>
        Checking access…
      </div>
    )
  }

  if (state.status === 'allowed' || state.status === 'anonymous') {
    return <>{children}</>
  }

  // ── Paywall ─────────────────────────────────────────────────────────────
  const schoolName = state.school?.name
  const headline =
    state.status === 'expired' ? 'Subscription expired'
                               : state.reason === 'not_licensed' ? 'Kiosk not licensed'
                               : 'School not configured'

  const detail =
    state.status === 'expired'
      ? `${schoolName ?? 'Your school'} had Kiosk Link access until ${new Date(state.expiresAt).toLocaleDateString()}. Contact your account manager to renew.`
    : state.reason === 'not_licensed'
      ? `${schoolName ?? 'Your school'} doesn't have Kiosk Link in its current STEM Suite plan. Contact your account manager to add it.`
      : `We couldn't find a school for your account. Ask your teacher to check your class assignment, or contact us about adding your institution.`

  const subject = `Kiosk Link access — ${schoolName ?? 'school inquiry'}`
  const waMsg   = `Hi! I'd like to enable Kiosk Link for ${schoolName ?? 'my school'}.`

  const contact = resolveContact(state.school?.country ?? null, state.school?.email ?? null, state.school?.phone ?? null)

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #06061a 0%, #0d0d2e 100%)', padding: 24,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{
        maxWidth: 520, width: '100%',
        background: '#0d0d2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16,
        padding: 36, textAlign: 'center', color: '#f1f5f9',
      }}>
        <div style={{
          width: 64, height: 64, margin: '0 auto 20px',
          borderRadius: '50%', background: state.status === 'expired' ? 'rgba(251,146,60,0.12)' : 'rgba(96,165,250,0.12)',
          border: `1px solid ${state.status === 'expired' ? 'rgba(251,146,60,0.3)' : 'rgba(96,165,250,0.3)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
        }}>{state.status === 'expired' ? '⏰' : '🔒'}</div>

        <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 12px' }}>{headline}</h1>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: '#94a3b8', margin: '0 0 28px' }}>{detail}</p>

        {schoolName && (
          <p style={{
            display: 'inline-block', margin: '0 0 24px',
            padding: '6px 12px', borderRadius: 999,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            fontSize: 11, fontWeight: 600, color: '#94a3b8',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>{schoolName}</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {contact.whatsapp && (
            <a
              href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(waMsg)}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '12px 20px', borderRadius: 12, textDecoration: 'none',
                background: '#25d366', color: '#fff', fontSize: 13, fontWeight: 700,
              }}
            >💬 WhatsApp</a>
          )}
          <a
            href={`mailto:${contact.email}?subject=${encodeURIComponent(subject)}`}
            style={{
              padding: '12px 20px', borderRadius: 12, textDecoration: 'none',
              background: 'rgba(255,255,255,0.04)', color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 600,
            }}
          >Email {contact.email}</a>
          <button
            onClick={() => logout()}
            style={{
              padding: '10px 20px', borderRadius: 12, marginTop: 4,
              background: 'transparent', color: '#94a3b8',
              border: '1px solid rgba(255,255,255,0.08)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
            }}
          >Sign out</button>
        </div>

        <p style={{ marginTop: 28, fontSize: 10, color: '#94a3b8', opacity: 0.6 }}>
          Part of the ZeroAI STEM Suite · Kiosk Link
        </p>
      </div>
    </div>
  )
}
