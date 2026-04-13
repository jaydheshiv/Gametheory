/**
 * Supply Chain Decision Game - Core Engine (Enhanced)
 * Handles logic for round outcomes, supplier behavior, and strategic insights.
 */

export const INITIAL_SUPPLIERS = {
  A: {
    name: "Supplier A",
    type: "PREMIUM",
    cost: 100,
    reliability: 0.88,
    reputation: 0.9,
    loyaltyBonus: 0,
  },
  B: {
    name: "Supplier B",
    type: "ECONOMY",
    cost: 70,
    reliability: 0.60,
    reputation: 0.5,
    squeezeLevel: 0,
  },
};

export const REVENUE_PER_ROUND = 250;

export const RANDOM_EVENTS = [
  {
    id: 'pandemic',
    name: 'Global Discord',
    description: 'Logistics costs surge. Reliability drops everywhere.',
    costMod: 1.4,
    reliabilityMod: 0.75,
    chance: 0.1,
    insight: 'Market-wide failure. Diversification is your only shield.'
  },
  {
    id: 'strike',
    name: 'Supplier B Strike',
    description: 'Supplier B workers are on strike! Failure is highly likely.',
    target: 'B',
    reliabilityMod: 0.2,
    chance: 0.15,
    insight: 'Supplier B is unstable. Avoid them until negotiations resolve.'
  },
  {
    id: 'boom',
    name: 'Market Boom',
    description: 'Demand is high! Higher revenue this round.',
    revenueMod: 1.5,
    chance: 0.1,
    insight: 'Ideal time to take risks for maximum profit.'
  },
  {
    id: 'inflation',
    name: 'Price Spikes',
    description: 'Raw material costs increased for everyone.',
    costMod: 1.25,
    chance: 0.15,
    insight: 'Margins are tight. Efficiency is key.'
  }
];

export const calculateRoundOutcome = (strategy, currentSuppliers, round) => {
  let selectedSuppliers = [];
  let event = null;
  let revenue = REVENUE_PER_ROUND;

  // 1. Event Logic (Requested frequency ~once in two rounds)
  if (round % 2 === 0 || Math.random() < 0.2) {
    const roll = Math.random();
    let accumulated = 0;
    for (const e of RANDOM_EVENTS) {
      accumulated += e.chance;
      if (roll < accumulated) {
        event = e;
        if (e.revenueMod) revenue *= e.revenueMod;
        break;
      }
    }
  }

  // 2. Map strategies
  if (strategy === "A") {
    selectedSuppliers = [{ ...currentSuppliers.A, weight: 1 }];
  } else if (strategy === "B") {
    selectedSuppliers = [{ ...currentSuppliers.B, weight: 1 }];
  } else if (strategy === "CHEAPEST") {
    const cheaper = currentSuppliers.A.cost < currentSuppliers.B.cost ? "A" : "B";
    selectedSuppliers = [{ ...currentSuppliers[cheaper], weight: 1 }];
  } else if (strategy === "DIVERSIFY") {
    selectedSuppliers = [
      { ...currentSuppliers.A, weight: 0.5 },
      { ...currentSuppliers.B, weight: 0.5 }
    ];
  }

  // 3. Process each supplier outcome
  const results = selectedSuppliers.map(s => {
    let cost = s.cost * s.weight;
    let rel = s.reliability;

    if (event) {
      if (!event.target || event.target === (s.type === 'PREMIUM' ? 'A' : 'B')) {
        if (event.costMod) cost *= event.costMod;
        if (event.reliabilityMod) rel *= event.reliabilityMod;
      }
    }

    const failed = Math.random() > rel;
    const loss = failed ? (s.weight * 120) : 0; // Slightly higher penalty for fails

    return {
      id: s.type === 'PREMIUM' ? 'A' : 'B',
      name: s.name,
      cost,
      failed,
      loss,
      reliabilityEffect: rel
    };
  });

  const roundCost = results.reduce((acc, curr) => acc + curr.cost, 0);
  const roundLoss = results.reduce((acc, curr) => acc + curr.loss, 0);
  const profit = revenue - roundCost - roundLoss;

  // 4. Strategic Insights Generation
  let insight = "Smooth logistics round. Keep monitoring margins.";
  if (event) insight = event.insight;
  else if (roundLoss > 0) insight = "Supply gap detected! Business health impacted.";
  else if (strategy === "CHEAPEST") insight = "Lean operations. But watch for supplier fatigue.";
  else if (strategy === "DIVERSIFY") insight = "Risk hedging successful. Balanced performance.";

  return {
    strategy,
    round,
    event,
    results,
    revenue,
    totalCost: roundCost,
    totalLoss: roundLoss,
    profit,
    insight,
    healthImpact: roundLoss > 0 ? -25 : 5,
  };
};

export const updateSupplierAI = (currentSuppliers, history) => {
  const newSuppliers = JSON.parse(JSON.stringify(currentSuppliers));
  const recentRounds = history.slice(-3);
  
  // Game Theory: Squeeze Logic
  const cheapestCount = recentRounds.filter(h => h.strategy === "CHEAPEST" || h.strategy === "B").length;
  if (cheapestCount >= 2) {
    newSuppliers.B.reliability = Math.max(0.35, newSuppliers.B.reliability - 0.08);
    newSuppliers.B.reputation = Math.max(0.1, newSuppliers.B.reputation - 0.1);
  } else {
    newSuppliers.B.reliability = Math.min(INITIAL_SUPPLIERS.B.reliability, newSuppliers.B.reliability + 0.02);
  }

  // Game Theory: Loyalty Logic
  const premiumCount = recentRounds.filter(h => h.strategy === "A" || h.strategy === "DIVERSIFY").length;
  if (premiumCount >= 2) {
    newSuppliers.A.reliability = Math.min(0.98, newSuppliers.A.reliability + 0.03);
    newSuppliers.A.reputation = Math.min(1.0, newSuppliers.A.reputation + 0.05);
  }

  return newSuppliers;
};

// Game Theory: Decision Analysis Tool
export const analyzeStrategy = (strategy, currentSuppliers) => {
  let selected = [];
  if (strategy === "A") selected = [{ ...currentSuppliers.A, weight: 1 }];
  else if (strategy === "B") selected = [{ ...currentSuppliers.B, weight: 1 }];
  else if (strategy === "CHEAPEST") {
    const cheaper = currentSuppliers.A.cost < currentSuppliers.B.cost ? "A" : "B";
    selected = [{ ...currentSuppliers[cheaper], weight: 1 }];
  } else if (strategy === "DIVERSIFY") {
    selected = [{ ...currentSuppliers.A, weight: 0.5 }, { ...currentSuppliers.B, weight: 0.5 }];
  }

  let totalCost = 0;
  let maxLoss = 0;
  let expectedLoss = 0;

  selected.forEach(s => {
    let cost = s.cost * s.weight;
    let probFail = 1 - s.reliability;
    let potentialLoss = s.weight * 120;
    
    totalCost += cost;
    maxLoss += potentialLoss;
    expectedLoss += (probFail * potentialLoss);
  });

  const expectedProfit = REVENUE_PER_ROUND - totalCost - expectedLoss;
  const worstCaseProfit = REVENUE_PER_ROUND - totalCost - maxLoss;
  
  return {
    expectedProfit: Math.round(expectedProfit),
    worstCaseProfit: Math.round(worstCaseProfit),
    totalCost: Math.round(totalCost),
    maxLoss: Math.round(maxLoss)
  };
};

export const getPayoffMatrix = (currentSuppliers) => {
  // Return the pure Normal-Form matrix values for rendering
  const strategies = ["A", "B", "DIVERSIFY"];
  
  const matrix = strategies.map(strat => {
    const analysis = analyzeStrategy(strat, currentSuppliers);
    return {
      strategy: strat,
      ev: analysis.expectedProfit,
      minimax: analysis.worstCaseProfit // Worst payoff
    };
  });

  return matrix;
};

