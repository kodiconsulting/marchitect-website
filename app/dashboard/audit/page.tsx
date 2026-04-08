import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const PILLARS = [
  'Strategy & Positioning',
  'Brand & Identity',
  'Website & SEO',
  'Content Marketing',
  'Email Marketing',
  'Social Media',
  'Paid Advertising',
  'Lead Generation',
  'Analytics & Reporting',
  'CRM & Automation',
  'Sales Enablement',
  'Customer Experience',
]

function scoreColor(score: number) {
  if (score >= 70) return 'text-green-400 bg-green-400/10'
  if (score >= 40) return 'text-yellow-400 bg-yellow-400/10'
  return 'text-red-400 bg-red-400/10'
}

function HealthRing({ score }: { score: number }) {
  const color =
    score >= 70 ? '#4ade80' : score >= 40 ? '#facc15' : '#f87171'
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const filled = (score / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#27272a"
          strokeWidth="12"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - filled}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-gray-900">{score}%</span>
      </div>
    </div>
  )
}

export default function AuditPage() {
  const overallScore = 0

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Marketing Audit</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Health score and pillar breakdown for the selected client workspace.
        </p>
      </div>

      {/* Health score */}
      <Card className="bg-white border-gray-200 mb-8">
        <CardContent className="flex flex-col sm:flex-row items-center gap-6 py-8">
          <HealthRing score={overallScore} />
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Marketing Health Score
            </p>
            <p className="text-4xl font-bold text-gray-900">{overallScore}%</p>
            <p className="text-gray-400 text-sm mt-1">
              No client workspace selected — select a client to see live data.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pillar cards */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Pillar Scores
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {PILLARS.map((pillar, i) => {
            const score = 0
            const colorClass = scoreColor(score)
            return (
              <Card key={i} className="bg-white border-gray-200">
                <CardContent className="py-4 px-4">
                  <p className="text-xs text-gray-500 mb-2 leading-snug">{pillar}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">{score}%</span>
                    <span
                      className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${colorClass}`}
                    >
                      Low
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Audit items table */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Audit Items
        </h2>
        <Card className="bg-white border-gray-200">
          <CardContent className="py-12 text-center">
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              No audit data yet. Items will appear here once audit items are seeded
              and a client workspace is set up.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
