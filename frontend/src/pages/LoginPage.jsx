import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function LoginPage() {
  const { login } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const destination = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await login(values);
      pushToast('Logged in successfully');
      navigate(destination, { replace: true });
    } catch (error) {
      pushToast(error.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative hidden overflow-hidden bg-ink-950 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(21,164,115,0.25),transparent_22%),radial-gradient(circle_at_80%_10%,rgba(249,138,18,0.18),transparent_18%)]" />
        <div className="relative z-10 grid gap-6">
          <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-xl">
            <FiShield /> Secure Firebase Authentication
          </div>
          <div className="max-w-xl grid gap-4">
            <h1 className="text-5xl font-black tracking-tight text-balance">Track your carbon footprint with the polish of a modern SaaS product.</h1>
            <p className="max-w-lg text-lg leading-8 text-white/75">EcoTrack turns daily travel, food, and energy habits into clear emissions insights, streaks, badges, AI guidance, and exportable reports.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl"><div className="text-xs uppercase tracking-[0.3em] text-white/50">Daily budget</div><div className="mt-1 text-2xl font-semibold">7 kg CO2e</div></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl"><div className="text-xs uppercase tracking-[0.3em] text-white/50">Built for</div><div className="mt-1 text-2xl font-semibold">Portfolio demos</div></div>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-3 text-sm text-white/60"><FiTrendingUp /> Momentum from small daily changes.</div>
      </section>
      <section className="flex items-center justify-center px-6 py-10 sm:px-10">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-[0_20px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-ink-950/70">
          <div className="mb-8 grid gap-2 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-mint-500 to-sand-500 text-2xl font-black text-white shadow-glow">E</div>
            <h2 className="text-3xl font-semibold tracking-tight text-ink-900 dark:text-white">Welcome back</h2>
            <p className="text-sm text-ink-500 dark:text-ink-300">Log in to continue tracking your emissions.</p>
          </div>
          <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
            <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
            <Input label="Password" type="password" autoComplete="current-password" error={errors.password?.message} {...register('password', { required: 'Password is required' })} />
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Signing in...' : 'Login'} <FiArrowRight />
            </Button>
          </form>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
            <Link to="/forgot-password" className="text-mint-600 hover:underline dark:text-mint-300">Forgot password?</Link>
            <Link to="/register" className="text-ink-600 hover:underline dark:text-ink-300">Create account</Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
