export const BADGE_PROGRESS_LABELS = {
  first_log: 'First log',
  seven_day_streak: '7 day streak',
  thirty_day_streak: '30 day streak',
  hundred_kg_saved: '100 kg saved',
  vegetarian_week: 'Vegetarian week',
  public_transport_hero: 'Public transport hero',
  eco_warrior: 'Eco warrior',
};

export const getBadgeTone = (badge) => (badge.unlocked ? 'mint' : badge.progress > 0.5 ? 'sand' : 'ink');
