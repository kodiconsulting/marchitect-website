'use server'
import { cookies } from 'next/headers'
import { signOut } from '@/auth'

export async function selectClient(clientId: string, clientName: string) {
  const jar = await cookies()
  jar.set('selected_client_id', clientId, { path: '/', maxAge: 60 * 60 * 24 * 7 })
  jar.set('selected_client_name', clientName, { path: '/', maxAge: 60 * 60 * 24 * 7 })
}

export async function clearSelectedClient() {
  const jar = await cookies()
  jar.delete('selected_client_id')
  jar.delete('selected_client_name')
}

export async function signOutAction() {
  await signOut({ redirectTo: '/login' })
}
