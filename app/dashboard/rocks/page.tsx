import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function getCurrentQuarter(): string {
  const now = new Date()
  const q = Math.ceil((now.getMonth() + 1) / 3)
  return `Q${q} ${now.getFullYear()}`
}

export default function RocksPage() {
  const quarter = getCurrentQuarter()

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rocks & Goals</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Quarterly priorities and key performance indicators.
          </p>
        </div>
      </div>

      {/* Rocks section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Rocks — {quarter}
          </h2>
          <Button
            disabled
            className="bg-violet-600 hover:bg-violet-700 text-white border-transparent opacity-60 cursor-not-allowed"
          >
            Add Rock
          </Button>
        </div>
        <Card className="bg-white border-gray-200">
          <CardContent className="py-12 text-center">
            <p className="text-gray-400 text-sm">
              No rocks defined yet for this quarter.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Goals & KPIs section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Goals & KPIs
          </h2>
          <Button
            disabled
            variant="outline"
            className="border-gray-200 text-gray-600 opacity-60 cursor-not-allowed"
          >
            Add KPI
          </Button>
        </div>
        <Card className="bg-white border-gray-200">
          <CardContent className="py-12 text-center">
            <p className="text-gray-400 text-sm">
              No goals or KPIs defined yet.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
