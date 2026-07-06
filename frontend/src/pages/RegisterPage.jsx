import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function RegisterPage() {
  const { register: signUp } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await signUp(values);
      pushToast('Account created successfully');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      pushToast(error.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-[0_20px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-ink-950/70">
        <div className="mb-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-mint-500 to-sand-500 text-2xl font-black text-white shadow-glow">E</div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink-900 dark:text-white">Create account</h2>
          <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">Start tracking carbon habits in minutes.</p>
        </div>
        <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Full name" autoComplete="name" error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
          <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
          <Input label="Password" type="password" autoComplete="new-password" error={errors.password?.message} {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Use at least 8 characters' } })} />
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Creating account...' : 'Register'} <FiArrowRight />
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-ink-600 dark:text-ink-300">
          Already have an account? <Link to="/login" className="text-mint-600 hover:underline dark:text-mint-300">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
