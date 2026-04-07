import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  Megaphone,
  UserRound,
  ShoppingBag,
  Swords,
  Radio,
  Info,
} from 'lucide-react'

const categories = [
  {
    icon: Building2,
    name: 'Company Identity',
    description: 'Core facts about the business',
  },
  {
    icon: Megaphone,
    name: 'Brand & Positioning',
    description: 'Positioning statement, mission, origin story',
  },
  {
    icon: UserRound,
    name: 'Customer Avatars',
    description: 'Target customer profiles',
  },
  {
    icon: ShoppingBag,
    name: 'Products & Services',
    description: 'Offer catalog and pricing',
  },
  {
    icon: Swords,
    name: 'Competitive Landscape',
    description: 'Competitor analysis and white space',
  },
  {
    icon: Radio,
    name: 'Channel Strategy',
    description: 'Active marketing channels and budgets',
  },
]

export default async function OraclePage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Content Oracle</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Structured knowledge base for this client — populated during Cowork sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {categories.map(({ icon: Icon, name, description }) => (
          <Card key={name} className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                    <Icon className="size-4 text-zinc-400" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-white leading-snug">
                    {name}
                  </CardTitle>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-zinc-800 text-zinc-400 border-0 shrink-0 text-xs"
                >
                  0 fields populated
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-500 text-xs">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3">
        <Info className="size-4 text-zinc-400 mt-0.5 shrink-0" />
        <p className="text-zinc-400 text-sm">
          Oracle fields are populated by pushing outputs from Cowork sessions via the API.
        </p>
      </div>
    </div>
  )
}
