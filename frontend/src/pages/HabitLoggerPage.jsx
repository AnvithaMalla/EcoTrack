import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiCheck, FiSave } from 'react-icons/fi';
import { AppShell } from '../components/layout/AppShell';
import { Stepper } from '../components/forms/Stepper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import { calculateFootprint, formatKg } from '../utils/carbon';
import { submitLog } from '../services/logger';
import { fetchSuggestions } from '../services/suggestions';

const steps = ['Travel', 'Food', 'Energy', 'Summary'];

export default function HabitLoggerPage() {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const form = useForm({
    defaultValues: {
      travel: { mode: '', distance: undefined, passengers: undefined },
      food: { diet: '',mealCount: undefined, waste: undefined },
      energy: { type: '', units: undefined},
    },
    mode: 'onChange',
  });
  const watchValues = form.watch();

  const computed = useMemo(() => calculateFootprint({ ...watchValues, budget: 7 }), [watchValues]);

  const stepFields = [
    ['travel.mode', 'travel.distance', 'travel.passengers'],
    ['food.diet','food.mealCount', 'food.waste'],
    ['energy.type', 'energy.units'],
  ];

  const next = async () => {
    if (step < 3) {
      const valid = await form.trigger(stepFields[step]);
      if (valid) setStep((value) => value + 1);
    }
  };

  const back = () => setStep((value) => Math.max(0, value - 1));

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      const payload = {
        date: new Date().toISOString(),
        budget: 7,
        ...values,
      };
      const result = await submitLog(payload);
      const suggestions = await fetchSuggestions({
        travel: result.calculation.travel.emission,
        food: result.calculation.food.emission,
        energy: result.calculation.energy.emission,
        totalEmission: result.calculation.totalEmission,
      });
      pushToast('Daily log saved');
      navigate('/suggestions', { state: { suggestions: suggestions.suggestions, breakdown: result.calculation, fromLogger: true } });
    } catch (error) {
      pushToast(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const summary = computed;

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto grid max-w-5xl gap-6">
        <Card className="grid gap-5">
          <div className="grid gap-2">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-mint-500 dark:text-mint-300">Habit logger</div>
            <h2 className="text-3xl font-semibold tracking-tight text-ink-900 dark:text-white">Record today’s footprint</h2>
            <p className="max-w-3xl text-sm leading-6 text-ink-600 dark:text-ink-300">Walk through travel, food, and energy in a guided flow. The summary updates live so you can verify your carbon impact before submission.</p>
          </div>
          <Stepper steps={steps} currentStep={step} />
        </Card>

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          {step === 0 ? (
            <Card className="grid gap-5">
              <h3 className="text-xl font-semibold text-ink-900 dark:text-white">Travel</h3>
              <div className="grid gap-5 md:grid-cols-3">
                <Select label="Transport mode" {...form.register('travel.mode')}>
                  <option value="" disabled>Select mode</option>
                  <option value="car_petrol">Car Petrol</option>
                  <option value="car_diesel">Car Diesel</option>
                  <option value="ev">EV</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="bus">Bus</option>
                  <option value="metro">Metro</option>
                  <option value="train">Train</option>
                  <option value="flight">Flight</option>
                  <option value="walking">Walking</option>
                  <option value="cycling">Cycling</option>
                </Select>
                <Input type="number" placeholder="Example:12" step="0.1" min="0" label="Distance (km)" {...form.register('travel.distance', { valueAsNumber: true, min: 0 })} />
                <Input type="number" placeholder="Example:1" min="1" label="Passengers" {...form.register('travel.passengers', { valueAsNumber: true, min: 1 })} helperText="Shared trips divide emissions across passengers" />
              </div>
            </Card>
          ) : null}

          {step === 1 ? (
            <Card className="grid gap-5">
              <h3 className="text-xl font-semibold text-ink-900 dark:text-white">Food</h3>
              <div className="grid gap-5 md:grid-cols-3">

              <Select label="Diet Type" {...form.register('food.diet')}>
                <option value="" disabled>Select diet type</option>
                <option value="omnivore">omnivore</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="meat">Meat</option>
              </Select>

              <Input
                type="number"
                placeholder="Example:5"
                min="1"
                max="10"
                label="Meals Count"
                helperText="Number of meals consumed today"
                {...form.register('food.mealCount', {
                  valueAsNumber: true,
                  min: 1,
                })}
              />
              <Input
                type="number"
                placeholder="Example:25"
                min="0"
                max="100"
                step="1"
                label="Food Waste (%)"
                helperText="Enter estimated food wasted"
                {...form.register('food.waste', {
                  valueAsNumber: true,
                  min: 0,
                  max: 100,
                })}
              />

            </div>
            </Card>
          ) : null}

          {step === 2 ? (
            <Card className="grid gap-5">
              <h3 className="text-xl font-semibold text-ink-900 dark:text-white">Energy</h3>
              <div className="grid gap-5 md:grid-cols-2">
                <Select label="Energy source" {...form.register('energy.type')}>
                  <option value="" disabled>Select energy source</option>
                  <option value="electricity">Electricity</option>
                  <option value="natural_gas">Natural Gas</option>
                  <option value="lpg">LPG</option>
                  <option value="solar">Solar</option>
                </Select>
                <Input type="number" placeholder="Example:100" step="0.1" min="0" label="Units consumed" {...form.register('energy.units', { valueAsNumber: true, min: 0 })} helperText="kWh for electricity or equivalent unit for fuel" />
              </div>
            </Card>
          ) : null}

          {step === 3 ? (
            <Card className="grid gap-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-ink-900 dark:text-white">Summary</h3>
                  <p className="text-sm text-ink-600 dark:text-ink-300">Review the computed footprint before saving.</p>
                </div>
                <div className="rounded-2xl bg-ink-50 px-4 py-3 text-sm text-ink-700 dark:bg-ink-900/50 dark:text-ink-200">Daily budget {formatKg(7)}</div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl bg-mint-50 p-5 dark:bg-mint-950/40"><div className="text-xs uppercase tracking-[0.3em] text-mint-500">Travel</div><div className="mt-2 text-2xl font-semibold">{formatKg(summary.travel.emission)}</div></div>
                <div className="rounded-3xl bg-sand-50 p-5 dark:bg-sand-950/40"><div className="text-xs uppercase tracking-[0.3em] text-sand-500">Food</div><div className="mt-2 text-2xl font-semibold">{formatKg(summary.food.emission)}</div></div>
                <div className="rounded-3xl bg-ink-50 p-5 dark:bg-ink-900/50"><div className="text-xs uppercase tracking-[0.3em] text-ink-500">Energy</div><div className="mt-2 text-2xl font-semibold">{formatKg(summary.energy.emission)}</div></div>
              </div>
              <div className="rounded-3xl border border-ink-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
                <div className="flex items-center justify-between text-sm text-ink-600 dark:text-ink-300"><span>Total emission</span><span className="font-semibold text-ink-900 dark:text-white">{formatKg(summary.totalEmission)}</span></div>
                <div className="mt-3 flex items-center justify-between text-sm text-ink-600 dark:text-ink-300"><span>Budget remaining</span><span className={`font-semibold ${summary.budgetRemaining < 0 ? 'text-red-500' : 'text-mint-500'}`}>{formatKg(summary.budgetRemaining)}</span></div>
                <div className="mt-3 text-xs text-ink-500 dark:text-ink-300">Logged in as {user?.displayName || user?.email || 'EcoTrack user'}</div>
              </div>
            </Card>
          ) : null}

          <div className="flex flex-wrap justify-between gap-3">
            <Button type="button" variant="secondary" onClick={back} disabled={step === 0}><FiArrowLeft /> Back</Button>
            {step < 3 ? (
              <Button type="button" onClick={next}>Next <FiArrowRight /></Button>
            ) : (
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Submit log'} <FiSave /></Button>
            )}
          </div>
        </form>
      </motion.div>
    </AppShell>
  );
}
