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

export const STRATEGIES = ["A", "B", "DIVERSIFY", "CHEAPEST"];

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

const createSeededRng = (seed = 1) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const strategySupplierUsage = (strategy, suppliers) => {
  if (strategy === "A") return { A: 1, B: 0 };
  if (strategy === "B") return { A: 0, B: 1 };
  if (strategy === "DIVERSIFY") return { A: 0.5, B: 0.5 };

  const cheaper = suppliers.A.cost <= suppliers.B.cost ? "A" : "B";
  return cheaper === "A" ? { A: 1, B: 0 } : { A: 0, B: 1 };
};

const expandFiveRoundPlans = (depth, acc = [], out = []) => {
  if (depth === 0) {
    out.push(acc.slice());
    return out;
  }

  STRATEGIES.forEach((s) => {
    acc.push(s);
    expandFiveRoundPlans(depth - 1, acc, out);
    acc.pop();
  });

  return out;
};

export const calculateRoundOutcome = (strategy, currentSuppliers, round) => {
  return calculateRoundOutcomeWithRng(strategy, currentSuppliers, round);
};

export const calculateRoundOutcomeWithRng = (strategy, currentSuppliers, round, rng) => {
  const random = typeof rng === 'function' ? rng : Math.random;
  let selectedSuppliers = [];
  let event = null;
  let revenue = REVENUE_PER_ROUND;

  // 1. Event Logic (Requested frequency ~once in two rounds)
  if (round % 2 === 0 || random() < 0.2) {
    const roll = random();
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

    const failed = random() > rel;
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

export const simulateFiveRoundPlan = (plan, seed = 1) => {
  const rng = createSeededRng(seed);
  let suppliers = JSON.parse(JSON.stringify(INITIAL_SUPPLIERS));
  let health = 100;
  let totalProfit = 0;
  const history = [];

  for (let i = 0; i < 5; i += 1) {
    const strategy = plan[i];
    const result = calculateRoundOutcomeWithRng(strategy, suppliers, i + 1, rng);
    history.push(result);
    totalProfit += result.profit;
    health = Math.min(100, Math.max(0, health + result.healthImpact));
    suppliers = updateSupplierAI(suppliers, history);

    if (health <= 0) break;
  }

  return {
    plan,
    totalProfit: Math.round(totalProfit),
    finalHealth: health,
    survivedAllRounds: history.length === 5 && health > 0,
    roundsPlayed: history.length,
    history,
  };
};

export const sweepAllFiveRoundPlans = (seeds = [11, 17, 23, 29, 31]) => {
  const plans = expandFiveRoundPlans(5);

  return plans
    .map((plan) => {
      const runs = seeds.map((seed) => simulateFiveRoundPlan(plan, seed));
      const avgProfit = runs.reduce((acc, run) => acc + run.totalProfit, 0) / runs.length;
      const avgHealth = runs.reduce((acc, run) => acc + run.finalHealth, 0) / runs.length;
      const survivalRate = runs.filter((run) => run.survivedAllRounds).length / runs.length;

      return {
        plan: plan.join(" -> "),
        avgProfit: Math.round(avgProfit),
        avgHealth: Math.round(avgHealth),
        survivalRate: Math.round(survivalRate * 100),
        sampleRuns: runs,
      };
    })
    .sort((a, b) => b.avgProfit - a.avgProfit);
};

export const buildNashAnalysis = (currentSuppliers) => {
  const strategies = STRATEGIES;
  const payoff = {};

  const congestionA = (1 - currentSuppliers.A.reliability) * 40 + currentSuppliers.A.cost * 0.06;
  const congestionB = (1 - currentSuppliers.B.reliability) * 40 + currentSuppliers.B.cost * 0.06;

  strategies.forEach((s1) => {
    payoff[s1] = {};

    strategies.forEach((s2) => {
      const ev1 = analyzeStrategy(s1, currentSuppliers).expectedProfit;
      const ev2 = analyzeStrategy(s2, currentSuppliers).expectedProfit;

      const u1 = strategySupplierUsage(s1, currentSuppliers);
      const u2 = strategySupplierUsage(s2, currentSuppliers);

      const overlapPenalty1 = (u1.A * u2.A * congestionA) + (u1.B * u2.B * congestionB);
      const overlapPenalty2 = (u2.A * u1.A * congestionA) + (u2.B * u1.B * congestionB);

      payoff[s1][s2] = {
        p1: Math.round(ev1 - overlapPenalty1),
        p2: Math.round(ev2 - overlapPenalty2),
      };
    });
  });

  const equilibria = [];

  strategies.forEach((s1) => {
    strategies.forEach((s2) => {
      const current = payoff[s1][s2];
      const p1BestResponse = Math.max(...strategies.map((candidate) => payoff[candidate][s2].p1));
      const p2BestResponse = Math.max(...strategies.map((candidate) => payoff[s1][candidate].p2));

      if (current.p1 === p1BestResponse && current.p2 === p2BestResponse) {
        equilibria.push({
          player: s1,
          opponent: s2,
          payoff: current,
        });
      }
    });
  });

  return {
    strategies,
    payoff,
    equilibria,
  };
};

