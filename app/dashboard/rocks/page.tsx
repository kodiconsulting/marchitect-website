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
          <h1 className="text-2xl font-bold text-[#252f4a]">Rocks & Goals</h1>
          <p className="text-[#78829d] mt-1 text-sm">
            Quarterly priorities and key performance indicators.
          </p>
        </div>
      </div>

      {/* Rocks section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#78829d] uppercase tracking-wider">
            Rocks — {quarter}
          </h2>
          <Button
            disabled
            className="bg-[#1B84FF] hover:bg-[#1366cc] text-white border-transparent opacity-60 cursor-not-allowed"
          >
            Add Rock
          </Button>
        </div>
        <Card className="bg-white border-[#e8e8e8]">
          <CardContent className="py-12 text-center">
            <p className="text-[#78829d] text-sm">
              No rocks defined yet for this quarter.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Goals & KPIs section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#78829d] uppercase tracking-wider">
            Goals & KPIs
          </h2>
          <Button
            disabled
            variant="outline"
            className="border-[#e8e8e8] text-[#4b5675] opacity-60 cursor-not-allowed"
          >
            Add KPI
          </Button>
        </div>
        <Card className="bg-white border-[#e8e8e8]">
          <CardContent className="py-12 text-center">
            <p className="text-[#78829d] text-sm">
              No goals or KPIs defined yet.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
