'use client'

import { useEffect, useRef, useState } from 'react'
import { ShieldCheck, Phone, KeyRound, ArrowRight, Loader2 } from 'lucide-react'
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth'
import { clientAuth } from '@/lib/firebase/client'

type LoginStep = 'phone' | 'otp' | 'verifying'

export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null)
  const confirmationRef = useRef<ConfirmationResult | null>(null)

  useEffect(() => {
    return () => {
      if (recaptchaRef.current) {
        recaptchaRef.current.clear()
        recaptchaRef.current = null
      }
    }
  }, [])

  const ensureRecaptcha = () => {
    if (recaptchaRef.current) {
      return recaptchaRef.current
    }

    recaptchaRef.current = new RecaptchaVerifier(clientAuth, 'recaptcha-container', {
      size: 'normal',
    })
    return recaptchaRef.current
  }

  const formatPhoneNumber = (rawPhone: string) => {
    const trimmed = rawPhone.trim()
    if (trimmed.startsWith('+')) {
      return trimmed
    }

    const localDigits = trimmed.replace(/\D/g, '')
    return `+91${localDigits}`
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number')
      return
    }

    try {
      const verifier = ensureRecaptcha()
      const confirmation = await signInWithPhoneNumber(
        clientAuth,
        formatPhoneNumber(phone),
        verifier
      )

      confirmationRef.current = confirmation
      setStep('otp')
    } catch (authError) {
      console.error('Error sending OTP:', authError)
      setError('Failed to send OTP. Please try again.')
      recaptchaRef.current?.clear()
      recaptchaRef.current = null
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP')
      return
    }

    if (!confirmationRef.current) {
      setError('OTP session expired. Please request a new code.')
      setStep('phone')
      return
    }

    setStep('verifying')

    try {
      const userCredential = await confirmationRef.current.confirm(otp)
      const idToken = await userCredential.user.getIdToken(true)

      const sessionRes = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })

      if (!sessionRes.ok) {
        const payload = await sessionRes.json().catch(() => null)
        const errorMessage =
          payload?.error || 'Your account does not have admin access.'
        throw new Error(errorMessage)
      }

      window.location.href = '/dashboard'
    } catch (verifyError) {
      console.error('Error verifying OTP:', verifyError)
      setError(
        verifyError instanceof Error
          ? verifyError.message
          : 'Verification failed. Please try again.'
      )
      setStep('otp')
    }
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
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                    }
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
              <div id="recaptcha-container" className="pt-2" />
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
