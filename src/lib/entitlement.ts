import { supabase } from './supabase'

export type AppName = 'zaisim' | 'zaiblock' | 'zerospark' | 'zaipy' | 'kiosk'

export interface SchoolContact {
  name:    string | null
  country: string | null
  email:   string | null
  phone:   string | null
}

export type EntitlementState =
  | { status: 'loading' }
  | { status: 'anonymous' }
  | { status: 'allowed';  expiresAt: string | null; reason: AllowReason; school: SchoolContact }
  | { status: 'denied';   reason: DenyReason; school: SchoolContact }
  | { status: 'expired';  expiresAt: string; school: SchoolContact }

export type AllowReason = 'super_admin' | 'legacy_admin' | 'licensed'
export type DenyReason  = 'no_school' | 'not_licensed'

const EMPTY_SCHOOL: SchoolContact = { name: null, country: null, email: null, phone: null }

const SUPER_ADMIN_EMAIL = 'lottiemukuka@zeroaitech.tech'

interface CheckParams {
  app:                 AppName
  userEmail:           string | null      // null if no Supabase user (e.g., student session)
  studentClassId:      string | null
  isLegacyAdmin:       boolean
  schoolAdminSchoolId: string | null
}

export async function checkEntitlement(p: CheckParams): Promise<EntitlementState> {
  if (!p.userEmail && !p.studentClassId) return { status: 'anonymous' }

  if (p.userEmail === SUPER_ADMIN_EMAIL) {
    return { status: 'allowed', expiresAt: null, reason: 'super_admin', school: EMPTY_SCHOOL }
  }
  if (p.isLegacyAdmin) {
    return { status: 'allowed', expiresAt: null, reason: 'legacy_admin', school: EMPTY_SCHOOL }
  }

  let schoolId: string | null = p.schoolAdminSchoolId

  if (!schoolId && p.userEmail) {
    const { data } = await supabase
      .from('approved_teachers')
      .select('school_id')
      .eq('email', p.userEmail)
      .maybeSingle()
    schoolId = (data?.school_id as string | undefined) ?? null
  }

  if (!schoolId && p.studentClassId) {
    const { data } = await supabase
      .from('classes')
      .select('school_id')
      .eq('id', p.studentClassId)
      .maybeSingle()
    schoolId = (data?.school_id as string | undefined) ?? null
  }

  if (!schoolId) return { status: 'denied', reason: 'no_school', school: EMPTY_SCHOOL }

  const [{ data: schoolRow }, { data: appRow }] = await Promise.all([
    supabase.from('schools').select('name, country, contact_email, contact_phone').eq('id', schoolId).maybeSingle(),
    supabase.from('school_apps').select('expires_at').eq('school_id', schoolId).eq('app', p.app).maybeSingle(),
  ])

  const school: SchoolContact = {
    name:    (schoolRow?.name    as string | undefined) ?? null,
    country: (schoolRow?.country as string | undefined) ?? null,
    email:   (schoolRow?.contact_email as string | undefined) ?? null,
    phone:   (schoolRow?.contact_phone as string | undefined) ?? null,
  }

  if (!appRow) return { status: 'denied', reason: 'not_licensed', school }

  const expiresAt = (appRow.expires_at as string | null | undefined) ?? null
  if (expiresAt && new Date(expiresAt).getTime() < Date.now()) {
    return { status: 'expired', expiresAt, school }
  }

  return { status: 'allowed', expiresAt, reason: 'licensed', school }
}
