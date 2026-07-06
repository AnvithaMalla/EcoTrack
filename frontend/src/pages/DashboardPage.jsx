import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiDownload, FiPlus } from 'react-icons/fi';
import { fetchDashboard } from '../services/dashboard';
import { downloadReport } from '../services/reports';
import { AppShell } from '../components/layout/AppShell';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import { CarbonGauge } from '../components/ui/CarbonGauge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { CategoryCard } from '../components/ui/CategoryCard';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { EmptyState } from '../components/ui/EmptyState';
import { LogCard } from '../components/ui/LogCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { DoughnutChart } from '../components/charts/DoughnutChart';
import { LineChart } from '../components/charts/LineChart';
import { formatKg, equivalentMetrics } from '../utils/carbon';
import { useToast } from '../hooks/useToast';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { pushToast } = useToast();

  useEffect(() => {
    let mounted = true;
    fetchDashboard()
      .then((payload) => mounted && setData(payload))
      .catch((error) => pushToast(error.message, 'error'))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [pushToast]);

  const chartData = useMemo(() => {
    const totals = data?.categoryTotals || { travel: 0, food: 0, energy: 0 };
    return {
      doughnut: {
        labels: ['Travel', 'Food', 'Energy'],
        datasets: [{ data: [totals.travel, totals.food, totals.energy], backgroundColor: ['#15a473', '#f98a12', '#35506d'], borderWidth: 0 }],
      },
      line: {
        labels: (data?.recentLogs || []).map((item) => item.date.slice(5, 10)).reverse(),
        datasets: [
          {
            label: 'Daily emissions',
            data: (data?.recentLogs || []).map((item) => Number(item.totalEmission || 0)).reverse(),
            borderColor: '#15a473',
            backgroundColor: 'rgba(21,164,115,0.12)',
            tension: 0.35,
            fill: true,
          },
        ],
      },
    };
  }, [data]);

  if (loading) return <LoadingScreen />;
  if (!data) return <AppShell><EmptyState title="Dashboard unavailable" description="We could not load your dashboard right now." actionLabel="Try again" onAction={() => window.location.reload()} /></AppShell>;

  const totalEmission = Number(data.stats.totalEmission || 0);
  const budget = Number(data.profile.daily_budget || 7);
  const budgetUsed = Math.min(100, (totalEmission / budget) * 100);
  const equivalents = equivalentMetrics(totalEmission);

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6">
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="grid gap-6 overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="grid gap-2">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-mint-500 dark:text-mint-300">Carbon overview</div>
                <h2 className="text-3xl font-semibold tracking-tight text-ink-900 dark:text-white">Daily footprint at a glance</h2>
                <p className="max-w-2xl text-sm leading-6 text-ink-600 dark:text-ink-300">Monitor your travel, food, and energy emissions against the daily budget with an interface designed for clarity and momentum.</p>
              </div>
              <Button as={Link} to="/logger"><FiPlus /> Quick add</Button>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
              <CarbonGauge value={totalEmission} budget={budget} />
              <div className="grid gap-4">
                <div className="grid gap-2 rounded-3xl bg-ink-50 p-5 dark:bg-ink-900/50">
                  <div className="flex items-center justify-between text-sm font-medium text-ink-600 dark:text-ink-300"><span>Budget used</span><span>{budgetUsed.toFixed(0)}%</span></div>
                  <ProgressBar value={budgetUsed} tone={budgetUsed < 50 ? 'mint' : budgetUsed < 75 ? 'sand' : budgetUsed < 100 ? 'orange' : 'red'} />
                  <div className="flex items-center justify-between text-sm text-ink-600 dark:text-ink-300">
                    <span>Current: {formatKg(totalEmission)}</span>
                    <span>Remaining: {formatKg(data.stats.budgetRemaining)}</span>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <StatCard label="Current streak" value={`${data.stats.currentStreak}d`} hint="Missed days reset the streak" tone="mint" />
                  <StatCard label="Longest streak" value={`${data.stats.longestStreak}d`} hint="Best historical consistency" tone="sand" />
                  <StatCard label="Latest badge" value={data.latestBadge?.name || 'Locked'} hint={data.latestBadge?.description || 'Earn your first badge by logging today.'} tone="ink" />
                </div>
              </div>
            </div>
          </Card>
          <Card className="grid gap-5">
            <SectionHeader eyebrow="Summary" title="What matters today" description="A compact view of your emissions, savings, and impact equivalents." />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <StatCard label="Daily emissions" value={formatKg(totalEmission)} hint={`Budget ${formatKg(budget)}`} tone={totalEmission > budget ? 'red' : totalEmission > budget * 0.75 ? 'sand' : 'mint'} />
              <StatCard label="Budget remaining" value={formatKg(data.stats.budgetRemaining)} hint="Stay below zero to remain in budget" tone={data.stats.budgetRemaining < 0 ? 'red' : 'mint'} />
            </div>
            <div className="grid gap-3 rounded-3xl bg-ink-50 p-5 dark:bg-ink-900/40">
              <div className="text-sm font-medium text-ink-700 dark:text-ink-200">Equivalent impact</div>
              <div className="grid gap-2 text-sm text-ink-600 dark:text-ink-300">
                <div>{equivalents.treesPlanted} trees planted</div>
                <div>{equivalents.kilometersDriven} km driven</div>
                <div>{equivalents.smartphoneCharges} smartphone charges</div>
              </div>
              <Button variant="secondary" onClick={async () => {
                try {
                  const blob = await downloadReport({});
                  const url = URL.createObjectURL(blob);
                  const anchor = document.createElement('a');
                  anchor.href = url;
                  anchor.download = 'ecotrack-report.pdf';
                  anchor.click();
                  URL.revokeObjectURL(url);
                } catch (error) {
                  pushToast(error.message, 'error');
                }
              }}><FiDownload /> Export report</Button>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr_1fr]">
          <CategoryCard label="Travel" value={data.categoryTotals.travel} color="mint" />
          <CategoryCard label="Food" value={data.categoryTotals.food} color="sand" />
          <CategoryCard label="Energy" value={data.categoryTotals.energy} color="ink" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="grid gap-5">
            <SectionHeader eyebrow="Charts" title="Recent trend" description="See how your recent daily footprint is changing over time." />
            <div className="h-[320px]"><LineChart labels={chartData.line.labels} datasets={chartData.line.datasets} /></div>
          </Card>
          <Card className="grid gap-5">
            <SectionHeader eyebrow="Breakdown" title="Category split" description="Travel tends to be the easiest lever to pull first." />
            <div className="grid place-items-center">
              <div className="h-[280px] w-full max-w-sm"><DoughnutChart labels={chartData.doughnut.labels} datasets={chartData.doughnut.datasets} /></div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Card className="grid gap-5">
            <SectionHeader eyebrow="Recent logs" title="Latest activity" description="Your most recent footprint entries." />
            <div className="grid gap-4">
              {(data.recentLogs || []).length ? data.recentLogs.map((log) => <LogCard key={log._id || log.date} log={log} />) : <EmptyState title="No logs yet" description="Add your first entry to start the dashboard timeline." actionLabel="Add first log" onAction={() => window.location.assign('/logger')} />}
            </div>
          </Card>
          <Card className="grid gap-5">
            <SectionHeader eyebrow="Momentum" title="Weekly and monthly summary" description="These aggregate numbers help you spot whether you’re trending down." />
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard label={data.weeklySummary.title} value={formatKg(data.weeklySummary.value)} hint={`Average ${formatKg(data.weeklySummary.average)}`} tone="mint" />
              <StatCard label={data.monthlySummary.title} value={formatKg(data.monthlySummary.value)} hint="Rolling 30-day total" tone="sand" />
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-mint-500 to-ink-900 p-5 text-white shadow-glow">
              <div className="text-xs uppercase tracking-[0.3em] text-white/60">Tip</div>
              <p className="mt-2 text-sm leading-6 text-white/80">Open the habit logger after lunch or before dinner to build a reliable streak around real daily routines.</p>
              <Button as={Link} to="/logger" variant="secondary" className="mt-4 bg-white text-ink-900 hover:bg-white/90">Go to logger <FiArrowRight /></Button>
            </div>
          </Card>
        </div>
      </motion.div>
    </AppShell>
  );
}
