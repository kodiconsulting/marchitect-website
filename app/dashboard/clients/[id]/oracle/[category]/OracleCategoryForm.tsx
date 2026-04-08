'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import type { OracleCategory } from '@/lib/oracle-schema'

interface OracleCategoryFormProps {
  category: OracleCategory
  initialValues: Record<string, string>
  workspaceId: string
}

export default function OracleCategoryForm({
  category,
  initialValues,
  workspaceId,
}: OracleCategoryFormProps) {
  const router = useRouter()
  const [values, setValues] = useState<Record<string, string>>(initialValues)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const oracleUrl = `/dashboard/clients/${workspaceId}/oracle`

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setStatus('idle')
    setErrorMessage('')

    try {
      const res = await fetch(
        `/api/workspaces/${workspaceId}/oracle/${category.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: values,
            updatedBy: 'Admin',
          }),
        }
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `Request failed with status ${res.status}`)
      }

      setStatus('success')
      router.refresh()
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {category.fields.map((field) => (
        <div key={field.id}>
          <label
            htmlFor={field.id}
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            {field.label}
          </label>
          <p className="text-xs text-gray-400 mb-2">{field.description}</p>
          {field.type === 'textarea' ? (
            <textarea
              id={field.id}
              name={field.id}
              value={values[field.id] ?? ''}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [field.id]: e.target.value }))
              }
              placeholder={field.label}
              className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
            />
          ) : (
            <Input
              id={field.id}
              name={field.id}
              type={field.type === 'url' ? 'url' : 'text'}
              value={values[field.id] ?? ''}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [field.id]: e.target.value }))
              }
              placeholder={field.label}
              className="bg-gray-100 border-gray-200 text-gray-900"
            />
          )}
        </div>
      ))}

      {status === 'success' && (
        <p className="text-sm text-green-400 font-medium">Saved!</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-400 font-medium">{errorMessage}</p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-9 items-center justify-center rounded-lg bg-violet-600 px-4 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving…' : 'Save Changes'}
        </button>
        <Link
          href={oracleUrl}
          className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-600 transition-colors hover:border-zinc-500 hover:text-gray-900"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
