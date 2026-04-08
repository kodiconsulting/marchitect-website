import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lock, UserPlus } from 'lucide-react'

const toggles = [
  { label: 'CORE', locked: true },
  { label: 'Lead-Gen', locked: false },
  { label: 'Ecommerce', locked: false },
  { label: 'B2B', locked: false },
  { label: 'B2C', locked: false },
]

export default async function SettingsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#252f4a]">Settings</h1>
        <p className="text-[#78829d] mt-1 text-sm">
          Workspace and account configuration.
        </p>
      </div>

      <div className="space-y-6">
        {/* Workspace card */}
        <Card className="bg-white border-[#e8e8e8]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-[#252f4a]">Workspace</CardTitle>
              <button
                type="button"
                className="inline-flex h-7 items-center justify-center rounded-lg border border-[#e8e8e8] px-3 text-xs font-medium text-[#4b5675] transition-colors hover:border-[#1B84FF] hover:text-[#252f4a]"
              >
                Edit
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-[#78829d] uppercase tracking-wider mb-1">
                  Client Name
                </p>
                <p className="text-sm text-[#78829d]">—</p>
              </div>
              <div>
                <p className="text-xs font-medium text-[#78829d] uppercase tracking-wider mb-1">
                  Engagement Start Date
                </p>
                <p className="text-sm text-[#78829d]">—</p>
              </div>
              <div>
                <p className="text-xs font-medium text-[#78829d] uppercase tracking-wider mb-1">
                  Current Phase
                </p>
                <p className="text-sm text-[#78829d]">—</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Model Toggles card */}
        <Card className="bg-white border-[#e8e8e8]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-[#252f4a]">
              Business Model Toggles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-[#78829d] mb-4">
              Toggles control which audit items are active and which playbooks are visible.
            </p>
            <div className="space-y-2">
              {toggles.map((toggle) => (
                <div
                  key={toggle.label}
                  className="flex items-center justify-between rounded-lg border border-[#e8e8e8] px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#252f4a]">{toggle.label}</span>
                    {toggle.locked && (
                      <Lock className="size-3 text-[#78829d]" />
                    )}
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-[#f1f1f4] text-[#78829d] border-0 text-xs"
                  >
                    {toggle.locked ? 'Always on' : 'Off'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Members card */}
        <Card className="bg-white border-[#e8e8e8]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-[#252f4a]">Team Members</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8 gap-4">
            <p className="text-[#78829d] text-sm">No team members added.</p>
            <button
              type="button"
              className="inline-flex h-8 items-center justify-center gap-2 rounded-lg bg-[#1B84FF] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1366cc]"
            >
              <UserPlus className="size-4" />
              Invite User
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
