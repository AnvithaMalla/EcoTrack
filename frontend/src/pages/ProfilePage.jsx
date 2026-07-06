import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiSave, FiUser } from 'react-icons/fi';
import { AppShell } from '../components/layout/AppShell';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { SectionHeader } from '../components/ui/SectionHeader';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { fetchProfile, updateProfile } from '../services/profile';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const { pushToast } = useToast();
  const { updateUserProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    let mounted = true;
    fetchProfile()
      .then((payload) => mounted && reset(payload))
      .catch((error) => pushToast(error.message, 'error'))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [pushToast, reset]);

  const onSubmit = async (values) => {
    try {
      const payload = await updateProfile(values);
      await updateUserProfile({ displayName: payload.name, photoURL: payload.photo_url });
      setTheme(payload.theme);
      pushToast('Profile updated');
      reset(payload);
    } catch (error) {
      pushToast(error.message, 'error');
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="grid place-items-center gap-4 text-center">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-mint-500 to-sand-500 text-4xl font-black text-white shadow-glow">
            <FiUser />
          </div>
          <div className="grid gap-1">
            <div className="text-2xl font-semibold text-ink-900 dark:text-white">Profile settings</div>
            <div className="text-sm text-ink-600 dark:text-ink-300">Update personal details, theme, and daily budget.</div>
          </div>
          <div className="rounded-3xl bg-ink-50 p-4 text-left text-sm text-ink-600 dark:bg-ink-900/50 dark:text-ink-300">
            Current theme: <span className="font-semibold text-ink-900 dark:text-white">{theme}</span>
          </div>
        </Card>
        <Card className="grid gap-5">
          <SectionHeader eyebrow="Profile" title="Edit your details" description="Keep your dashboard personalized with the right budget, name, and theme." />
          <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
            <Input label="Name" {...register('name', { required: true })} />
            <Input label="Photo URL" {...register('photo_url')} placeholder="https://..." />
            <Input type="number" step="0.1" min="1" label="Daily carbon budget" {...register('daily_budget', { valueAsNumber: true })} />
            <Select label="Preferred units" {...register('preferred_units')}>
              <option value="metric">Metric</option>
              <option value="imperial">Imperial</option>
            </Select>
            <Select label="Theme" {...register('theme')}>
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </Select>
            <Button type="submit" disabled={isSubmitting}><FiSave /> {isSubmitting ? 'Saving...' : 'Save profile'}</Button>
          </form>
        </Card>
      </motion.div>
    </AppShell>
  );
}
