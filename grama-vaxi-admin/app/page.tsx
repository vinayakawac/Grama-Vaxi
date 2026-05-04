import { redirect } from 'next/navigation'
import { getAdminSessionFromCookies } from '@/lib/auth/session'

export default async function RootPage() {
  const session = await getAdminSessionFromCookies()

  if (session) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}
