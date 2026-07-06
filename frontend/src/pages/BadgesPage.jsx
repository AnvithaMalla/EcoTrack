import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiZap } from 'react-icons/fi';
import { AppShell } from '../components/layout/AppShell';
import { Card } from '../components/ui/Card';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BadgeCard } from '../components/ui/BadgeCard';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { fetchBadges } from '../services/badges';
import { fetchDashboard } from '../services/dashboard';
import { useToast } from '../hooks/useToast';

export default function BadgesPage() {
  const [badges, setBadges] = useState([]);
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0 });
  const [loading, setLoading] = useState(true);
  const { pushToast } = useToast();

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchBadges(), fetchDashboard()])
      .then(([badgesPayload, dashboard]) => {
        if (!mounted) return;
        setBadges(badgesPayload.badges || []);
        setStreak({ currentStreak: dashboard.stats.currentStreak, longestStreak: dashboard.stats.longestStreak });
      })
      .catch((error) => pushToast(error.message, 'error'))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [pushToast]);

  if (loading) return <LoadingScreen />;

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6">
        <Card className="grid gap-4 overflow-hidden bg-gradient-to-br from-ink-900 via-ink-900 to-mint-900 text-white">
          <SectionHeader eyebrow="Achievements" title="Badge system" description="Track progress toward milestones and unlock them with a subtle animation when you complete them." />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="text-xs uppercase tracking-[0.3em] text-white/50">Current streak</div>
              <div className="mt-2 text-4xl font-black">{streak.currentStreak}d</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="text-xs uppercase tracking-[0.3em] text-white/50">Longest streak</div>
              <div className="mt-2 text-4xl font-black">{streak.longestStreak}d</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="text-xs uppercase tracking-[0.3em] text-white/50">Unlock rule</div>
              <div className="mt-2 text-sm leading-6 text-white/80">Each badge tracks real progress, not just status, so users can see how close they are to the next win.</div>
            </div>
          </div>
        </Card>
        <div className="grid gap-4 xl:grid-cols-2">
          {badges.map((badge) => <BadgeCard key={badge.badge_id} badge={badge} />)}
        </div>
        <Card className="flex items-center gap-3">
          <FiZap className="text-mint-500" />
          <div className="text-sm text-ink-600 dark:text-ink-300">Unlocked badges animate by lifting into the layout and glowing with the mint accent used across the dashboard.</div>
        </Card>
      </motion.div>
    </AppShell>
  );
}
