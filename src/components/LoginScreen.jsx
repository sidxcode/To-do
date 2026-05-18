import { supabase } from '../lib/supabase.js'

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" style={{ flex: '0 0 18px' }}>
      <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18Z"/>
      <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17Z"/>
      <path fill="#FBBC05" d="M4.5 10.48A4.8 4.8 0 0 1 4.5 7.5V5.43H1.83a8 8 0 0 0 0 7.12l2.67-2.07Z"/>
      <path fill="#EA4335" d="M8.98 3.58c1.32 0 2.5.45 3.44 1.35l2.54-2.54A8 8 0 0 0 1.83 5.43L4.5 7.5a4.77 4.77 0 0 1 4.48-3.92Z"/>
    </svg>
  )
}

export default function LoginScreen() {
  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', gap: 32,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: 'var(--c-blue)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 8px 24px rgba(0,122,255,.28)',
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ fontFamily: 'var(--font-rounded)', fontSize: 28, fontWeight: 700, color: 'var(--ink)' }}>
          To-Do
        </div>
        <div style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 4 }}>
          Your reminders, everywhere.
        </div>
      </div>

      <button
        onClick={signIn}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 24px', borderRadius: 12,
          background: 'var(--surface)',
          border: '0.5px solid var(--separator)',
          fontSize: 15, fontWeight: 600, color: 'var(--ink)',
          boxShadow: '0 2px 8px rgba(0,0,0,.08)',
          cursor: 'pointer',
        }}
      >
        <GoogleLogo />
        Sign in with Google
      </button>
    </div>
  )
}
