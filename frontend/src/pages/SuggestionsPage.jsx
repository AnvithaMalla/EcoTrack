import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppShell } from '../components/layout/AppShell';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SuggestionCard } from '../components/ui/SuggestionCard';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { EmptyState } from '../components/ui/EmptyState';
import { fetchSuggestions } from '../services/suggestions';
import { fetchDashboard } from '../services/dashboard';
import { useToast } from '../hooks/useToast';

export default function SuggestionsPage() {
  const location = useLocation();
  const [suggestions, setSuggestions] = useState(location.state?.suggestions || []);
  const [loading, setLoading] = useState(!location.state?.suggestions);
  const [breakdown, setBreakdown] = useState(location.state?.breakdown || null);
  const { pushToast } = useToast();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        let payload = breakdown;
        if (!payload) {
          const dashboard = await fetchDashboard();
          const latest = dashboard.recentLogs?.[0];
          if (!latest) {
            if (mounted) {
              setLoading(false);
              setSuggestions([]);
            }
            return;
          }
          payload = {
            travel: latest.travel?.emission || 0,
            food: latest.food?.emission || 0,
            energy: latest.energy?.emission || 0,
            totalEmission: latest.totalEmission || 0,
          };
          if (mounted) setBreakdown(payload);
        }
        const response = await fetchSuggestions(payload);
        if (mounted) setSuggestions(response.suggestions || []);
      } catch (error) {
        pushToast(error.message, 'error');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [breakdown, pushToast]);

  if (loading) return <LoadingScreen />;

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6">
        <Card className="grid gap-3">
          <SectionHeader eyebrow="AI suggestions" title="Your next best actions" description="The app uses Groq when available and falls back to deterministic guidance when the API is unavailable." action={<Button as={Link} to="/logger" variant="secondary">Log new day</Button>} />
        </Card>
        {suggestions.length ? (
          <div className="grid gap-4 xl:grid-cols-3">
            {suggestions.map((suggestion, index) => <SuggestionCard key={`${suggestion.title}-${index}`} suggestion={suggestion} />)}
          </div>
        ) : (
          <EmptyState title="No suggestions yet" description="Record a log first, then we can generate personalized recommendations." actionLabel="Open logger" onAction={() => window.location.assign('/logger')} />
        )}
      </motion.div>
    </AppShell>
  );
}
