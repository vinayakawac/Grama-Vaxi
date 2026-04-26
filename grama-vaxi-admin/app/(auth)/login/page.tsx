'use client'

import { useState } from 'react'
import { ShieldCheck, Phone, KeyRound, ArrowRight, Loader2 } from 'lucide-react'

type LoginStep = 'phone' | 'otp' | 'verifying'

export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number')
      return
    }

    // TODO: Integrate Firebase signInWithPhoneNumber
    // For now, advance to OTP step
    setStep('otp')
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP')
      return
    }

    setStep('verifying')

    // TODO: Verify OTP with Firebase, check admin role, set session cookie
    // Simulate verification delay
    setTimeout(() => {
      // For development: set a session cookie and redirect
      document.cookie = 'firebase-session=dev-session; path=/'
      window.location.href = '/dashboard'
    }, 1500)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-grama-50 via-background to-grama-50/30">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-grama/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-grama/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-grama text-white shadow-lg shadow-grama/25">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Grama-Vaxi
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Veterinary Officer Admin Panel
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl shadow-black/5">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-card-foreground">
              {step === 'phone' && 'Sign in'}
              {step === 'otp' && 'Enter OTP'}
              {step === 'verifying' && 'Verifying...'}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {step === 'phone' &&
                'Enter your registered phone number to receive an OTP'}
              {step === 'otp' &&
                `We sent a 6-digit code to +91 ${phone}`}
              {step === 'verifying' &&
                'Checking your credentials and admin access'}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Phone Step */}
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="phone-input"
                  className="text-sm font-medium text-foreground"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="phone-input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter 10-digit number"
                    className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm outline-none transition-colors focus:border-grama focus:ring-2 focus:ring-grama/20"
                    maxLength={10}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-grama text-sm font-medium text-white shadow-md shadow-grama/25 transition-all hover:bg-grama-dark hover:shadow-lg hover:shadow-grama/30"
              >
                Send OTP
                <ArrowRight className="h-4 w-4" />
              </button>
              <div id="recaptcha-container" />
            </form>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="otp-input"
                  className="text-sm font-medium text-foreground"
                >
                  Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="otp-input"
                    type="text"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                    }
                    placeholder="Enter 6-digit OTP"
                    className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-center font-mono text-lg tracking-[0.5em] outline-none transition-colors focus:border-grama focus:ring-2 focus:ring-grama/20"
                    maxLength={6}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-grama text-sm font-medium text-white shadow-md shadow-grama/25 transition-all hover:bg-grama-dark hover:shadow-lg hover:shadow-grama/30"
              >
                Verify & Sign In
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep('phone')
                  setOtp('')
                  setError('')
                }}
                className="w-full text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                ← Back to phone number
              </button>
            </form>
          )}

          {/* Verifying Step */}
          {step === 'verifying' && (
            <div className="flex flex-col items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-grama" />
              <p className="mt-4 text-sm text-muted-foreground">
                Verifying admin access...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Access restricted to authorized veterinary officers only
        </p>
      </div>
    </div>
  )
}
