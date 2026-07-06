import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiFilter } from 'react-icons/fi';
import { AppShell } from '../components/layout/AppShell';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { SectionHeader } from '../components/ui/SectionHeader';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { EmptyState } from '../components/ui/EmptyState';
import { LogCard } from '../components/ui/LogCard';
import { StatCard } from '../components/ui/StatCard';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { exportHistoryCsv, fetchHistory } from '../services/history';
import { downloadBlob } from '../utils/export';
import { formatKg } from '../utils/carbon';
import { useToast } from '../hooks/useToast';

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rangePreset, setRangePreset] = useState('30');
  const { pushToast } = useToast();

  const load = async (params = {}) => {
    setLoading(true);
    try {
      const payload = await fetchHistory(params);
      setData(payload);
    } catch (error) {
      pushToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredLogs = useMemo(() => {
    const logs = data?.logs || [];
    if (!search) return logs;
    return logs.filter((log) => log.date.includes(search));
  }, [data, search]);

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const currentPageLogs = filteredLogs.slice((page - 1) * pageSize, page * pageSize);

  const lineData = useMemo(() => ({
    labels: (data?.history || []).map((item) => item.date.slice(5, 10)),
    datasets: [
      {
        label: 'Daily emissions',
        data: (data?.history || []).map((item) => Number(item.totalEmission || 0)),
        borderColor: '#15a473',
        backgroundColor: 'rgba(21,164,115,0.12)',
        fill: true,
        tension: 0.35,
      },
      {
        label: 'Budget reference',
        data: (data?.history || []).map(() => Number(data?.stats?.budget || 7)),
        borderColor: '#f98a12',
        borderDash: [6, 4],
        fill: false,
        tension: 0,
      },
    ],
  }), [data]);

  const stackedData = useMemo(() => ({
    labels: (data?.logs || []).slice(-14).map((item) => item.date.slice(5, 10)),
    datasets: [
      { label: 'Travel', data: (data?.logs || []).slice(-14).map((item) => Number(item.travel?.emission || 0)), backgroundColor: '#15a473' },
      { label: 'Food', data: (data?.logs || []).slice(-14).map((item) => Number(item.food?.emission || 0)), backgroundColor: '#f98a12' },
      { label: 'Energy', data: (data?.logs || []).slice(-14).map((item) => Number(item.energy?.emission || 0)), backgroundColor: '#35506d' },
    ],
  }), [data]);

  const heatmap = data?.heatmap || [];
  const maxHeat = Math.max(1, ...heatmap.map((item) => item.value || 0));

  const applyFilters = async () => {
    const params = {};
    if (fromDate) params.from = fromDate;
    if (toDate) params.to = toDate;
    await load(params);
  };

  const quickRange = async (days) => {
    setRangePreset(days);
    if (days === '30') {
      setFromDate('');
      setToDate('');
      await load();
      return;
    }
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - Number(days));
    const from = start.toISOString().slice(0, 10);
    const to = end.toISOString().slice(0, 10);
    setFromDate(from);
    setToDate(to);
    await load({ from, to });
  };

  const handleExport = async () => {
    try {
      const blob = await exportHistoryCsv({ from: fromDate || undefined, to: toDate || undefined });
      downloadBlob('ecotrack-history.csv', blob);
    } catch (error) {
      pushToast(error.message, 'error');
    }
  };

  if (loading && !data) return <LoadingScreen />;

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6">
        <Card className="grid gap-4">
          <SectionHeader eyebrow="History" title="Historical analytics" description="Review your recent footprint with charted trends, filters, and exportable data." action={<Button onClick={handleExport} variant="secondary"><FiDownload /> Export CSV</Button>} />
          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard label="7-day average" value={formatKg(data?.stats?.weeklyAverage || 0)} hint="Average of the last seven logged days" tone="mint" />
              <StatCard label="Best day" value={formatKg(data?.bestDay?.totalEmission || 0)} hint={data?.bestDay?.date || 'No data'} tone="sand" />
              <StatCard label="Worst day" value={formatKg(data?.worstDay?.totalEmission || 0)} hint={data?.worstDay?.date || 'No data'} tone="red" />
            </div>
            <Card className="grid gap-3 bg-ink-50 dark:bg-ink-900/30">
              <div className="text-sm font-medium text-ink-700 dark:text-ink-200">Filters</div>
              <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                <Input type="date" label="From" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
                <Input type="date" label="To" value={toDate} onChange={(event) => setToDate(event.target.value)} />
                <Button className="self-end" variant="secondary" onClick={applyFilters}><FiFilter /> Apply</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {['7', '14', '30'].map((option) => (
                  <Button key={option} type="button" variant={rangePreset === option ? 'primary' : 'secondary'} onClick={() => quickRange(option)}>
                    {option} days
                  </Button>
                ))}
              </div>
              <Input label="Search history" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Filter by date (YYYY-MM-DD)" />
            </Card>
          </div>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Card className="grid gap-4">
            <SectionHeader eyebrow="Trend" title="30-day line chart" description="The dashed line marks your daily carbon budget." />
            <div className="h-[320px]"><LineChart labels={lineData.labels} datasets={lineData.datasets} /></div>
          </Card>
          <Card className="grid gap-4">
            <SectionHeader eyebrow="Composition" title="14-day stacked bars" description="See which category dominates your recent footprint." />
            <div className="h-[320px]"><BarChart labels={stackedData.labels} datasets={stackedData.datasets} /></div>
          </Card>
        </div>

        <Card className="grid gap-4">
          <SectionHeader eyebrow="Heatmap" title="30-day calendar" description="Darker days indicate higher emissions." />
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-10 lg:grid-cols-[repeat(15,minmax(0,1fr))]">
            {heatmap.map((entry) => {
              const opacity = Math.min(1, entry.value / maxHeat || 0);
              return (
                <div key={entry.date} className="group rounded-xl border border-ink-200 p-2 text-center text-[10px] text-ink-500 transition hover:scale-105 dark:border-ink-800 dark:text-ink-300" style={{ backgroundColor: `rgba(21, 164, 115, ${opacity * 0.85})` }}>
                  <div className="font-semibold text-white">{entry.date.slice(8, 10)}</div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="grid gap-4">
          <SectionHeader eyebrow="Logs" title="Paginated history" description="Search, scan, and inspect recent entries." />
          <div className="grid gap-4">
            {currentPageLogs.length ? currentPageLogs.map((log) => <LogCard key={log._id || log.date} log={log} />) : <EmptyState title="No matching logs" description="Adjust filters or add new entries to populate this view." />}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-ink-500 dark:text-ink-300">Page {page} of {totalPages}</div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1}>Previous</Button>
              <Button variant="secondary" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page === totalPages}>Next</Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AppShell>
  );
}
