import { StatCard } from '@/components/dashboard/StatCard'
import {
  PawPrint,
  MapPin,
  FileWarning,
  Megaphone,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CoverageChart } from '@/components/dashboard/CoverageChart'
import { getDashboardStats, getCoverageData, getRecentActivity } from '@/lib/firestore/dashboard'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const stats = await getDashboardStats()
  const coverageData = await getCoverageData()
  const { reports: recentReports, camps: recentCamps } = await getRecentActivity()

  return (
    <div className="space-y-8">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Animals"
          value={stats.totalAnimals.toLocaleString()}
          icon={<PawPrint className="h-5 w-5" />}
        />
        <StatCard
          label="Total Villages"
          value={stats.totalVillages}
          icon={<MapPin className="h-5 w-5" />}
        />
        <StatCard
          label="Pending Reports"
          value={stats.pendingReports}
          icon={<FileWarning className="h-5 w-5" />}
        />
        <StatCard
          label="Camps This Month"
          value={stats.campsThisMonth}
          icon={<Megaphone className="h-5 w-5" />}
        />
      </div>

      {/* Charts + Activity Feed */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Vaccination Coverage Chart */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Vaccination Coverage by Village (%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CoverageChart data={coverageData} />
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Recent Camp Alerts */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Recent Camp Alerts
              </p>
              <div className="space-y-2">
                {recentCamps.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No recent camps</p>
                ) : (
                  recentCamps.map((camp) => (
                    <div
                      key={camp.id}
                      className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 transition-colors hover:bg-muted/60"
                    >
                      <div>
                        <p className="text-sm font-medium">{camp.village}</p>
                        <p className="text-xs text-muted-foreground">
                          {camp.date.toLocaleDateString()} · {camp.time}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-grama-50 text-grama-800 text-xs"
                      >
                        {camp.acknowledgedCount} ack
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Disease Reports */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Disease Reports
              </p>
              <div className="space-y-2">
                {recentReports.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No pending reports</p>
                ) : (
                  recentReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 transition-colors hover:bg-muted/60"
                    >
                      <div>
                        <p className="text-sm font-medium">{report.farmerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {report.village} · {report.reportedAt.toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          report.severity === 'CRITICAL'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className="text-xs"
                      >
                        {report.severity}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
