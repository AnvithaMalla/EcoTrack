import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { calculateFootprint } from '../utils/carbon';
import { ProgressBar } from '../components/ui/ProgressBar';

describe('carbon utilities', () => {
  it('calculates a fallback daily footprint', () => {
    const result = calculateFootprint({
      travel: { mode: 'bus', distance: 10, passengers: 1 },
      food: { diet: 'vegan', waste: true },
      energy: { type: 'electricity', units: 5 },
      budget: 7,
    });

    expect(result.totalEmission).toBeGreaterThan(0);
    expect(result.budgetRemaining).toBeLessThan(7);
  });

  it('renders a progress bar label', () => {
    render(<ProgressBar value={42} label="Budget used" />);
    expect(screen.getByText('Budget used')).toBeInTheDocument();
    expect(screen.getByText('42%')).toBeInTheDocument();
  });
});
