import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const { pushToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email }) => {
    setSubmitting(true);
    try {
      await resetPassword(email);
      pushToast('Password reset email sent');
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
          <h2 className="text-3xl font-semibold tracking-tight text-ink-900 dark:text-white">Reset password</h2>
          <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">We will send a reset link to your email.</p>
        </div>
        <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
          <Button type="submit" disabled={submitting} className="w-full">{submitting ? 'Sending...' : 'Send reset link'}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-ink-600 dark:text-ink-300"><Link to="/login" className="text-mint-600 hover:underline dark:text-mint-300">Back to login</Link></p>
      </motion.div>
    </div>
  );
}
