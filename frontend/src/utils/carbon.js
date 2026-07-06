export const TRAVEL_FACTORS = {
  car_petrol: 0.192,
  car_diesel: 0.171,
  ev: 0.053,
  motorcycle: 0.103,
  bus: 0.089,
  metro: 0.035,
  train: 0.041,
  flight: 0.255,
  walking: 0,
  cycling: 0,
};

export const FOOD_FACTORS = {
  meat_heavy: 7.2,
  omnivore: 5.6,
  vegetarian: 3.8,
  vegan: 2.9,
};

export const ENERGY_FACTORS = {
  electricity: 0.475,
  natural_gas: 0.184,
  lpg: 0.236,
  solar: 0,
};

export const formatKg = (value) => `${Number(value || 0).toFixed(2)} kg CO2e`;

export const calculateTravel = ({ mode, distance = 0, passengers = 1 }) => {
  const coefficient = TRAVEL_FACTORS[mode] ?? TRAVEL_FACTORS.car_petrol;
  const normalizedPassengers = Math.max(1, Number(passengers || 1));
  const emission = coefficient * Number(distance || 0) / (['car_petrol', 'car_diesel', 'ev', 'motorcycle'].includes(mode) ? normalizedPassengers : 1);
  return {
    mode,
    distance: Number(distance || 0),
    passengers: normalizedPassengers,
    coefficient,
    emission: Number(emission.toFixed(3)),
  };
};

export const calculateFood = ({ diet, waste = false }) => {
  const coefficient = FOOD_FACTORS[diet] ?? FOOD_FACTORS.omnivore;
  const emission = coefficient * (waste ? 1.1 : 1);
  return {
    diet,
    waste,
    coefficient,
    emission: Number(emission.toFixed(3)),
  };
};

export const calculateEnergy = ({ type, units = 0 }) => {
  const coefficient = ENERGY_FACTORS[type] ?? ENERGY_FACTORS.electricity;
  const emission = coefficient * Number(units || 0);
  return {
    type,
    units: Number(units || 0),
    coefficient,
    emission: Number(emission.toFixed(3)),
  };
};

export const calculateFootprint = ({ travel, food, energy, budget = 7 }) => {
  const travelResult = calculateTravel(travel);
  const foodResult = calculateFood(food);
  const energyResult = calculateEnergy(energy);
  const totalEmission = Number((travelResult.emission + foodResult.emission + energyResult.emission).toFixed(3));
  return {
    travel: travelResult,
    food: foodResult,
    energy: energyResult,
    totalEmission,
    budget,
    budgetRemaining: Number((budget - totalEmission).toFixed(3)),
    exceeded: totalEmission > budget,
  };
};

export const equivalentMetrics = (totalEmission) => ({
  treesPlanted: Number((totalEmission / 21.77).toFixed(2)),
  kilometersDriven: Number((totalEmission / 0.192).toFixed(2)),
  smartphoneCharges: Number((totalEmission / 0.009).toFixed(2)),
});
