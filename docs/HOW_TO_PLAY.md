# How to Play — Supply-Chain Strategy Simulator

This project is a short, interactive simulator where you choose a **strategy** under uncertainty (supplier reliability vs. unit cost) across **5 rounds**. Each round you:

1. Review supplier signals
2. (Optional) Run EV (Expected Value) analysis
3. Deploy a strategy
4. Read the round result + trends

---

## Goal (Win Condition)

Maximize **Total Profit** across 5 rounds while keeping **Brand Health** above zero.

- **Total Profit**: the accumulated money you earn.
- **Brand Health**: your resilience. If it collapses, the simulation ends early.

Think of this as a tradeoff between **profit** and **risk**.

---

## The Screen, Explained

### 1) Supplier Modules
You have two suppliers:

- **Supplier A**: typically more reliable, higher cost
- **Supplier B**: typically cheaper, lower reliability

Each supplier shows:

- **Unit Cost** (₹): what you pay per unit
- **Reliability** (%): chance your round runs smoothly
- **Market Reputation Index**: quality/brand signal

These values can change during the simulation.

### 2) Deploy Strategy
This is your main decision panel. You pick one of the strategy cards.

### 3) Run EV Analysis (Scanner)
Click **Run EV Analysis** to turn on the scanner.

When it’s ON, each strategy card shows two metric boxes:

- **Expected Profit (EV)**: the average profit you should expect under uncertainty.
- **Max Risk (Worst)**: a worst-case / downside estimate.

Use this to compare strategies when you’re unsure.

### 4) Impact Preview
When you hover/select a strategy (and the preview is visible), you’ll see a quick summary:

- EV
- Worst

This is meant to reduce decision time.

### 5) Dashboard (after you play at least one round)
After you deploy a strategy, the dashboard becomes more informative.

It includes trends and the **Game Theory Matrix**, which summarizes key outcomes and highlights a suggested equilibrium/dominant baseline.

---

## Strategy Cards (What Each One Does)

You’ll see these options in the Deploy Strategy panel:

- **Tier 1 Partnership**
  - A stability-first approach.
  - Usually safer, lower downside.

- **Economy Protocol**
  - Margin-first approach.
  - Often higher risk if reliability fails.

- **Hedge Diversification (50/50)**
  - Splits exposure across suppliers.
  - Reduces variance; often a balanced option.

- **Lean Cost Optimization**
  - Automatically pushes toward lowest unit cost.
  - Can be volatile if the cheapest option is unreliable.

---

## A Typical Round (Quick Start)

1. Scroll to **Supplier Modules** and compare Unit Cost + Reliability.
2. Click **Run EV Analysis** (optional but recommended) to reveal EV and Worst.
3. Choose a strategy in **Deploy Strategy**.
4. Read the result modal/report.
5. Watch how the dashboard metrics and matrix evolve.

Repeat until round 5 (or until Brand Health reaches zero).

---

## How This Game Helps You

This simulator is a compact way to practice decision-making with real-world style constraints:

### 1) Expected Value thinking
EV teaches you to choose based on long-run averages rather than one-off outcomes.

### 2) Downside/risk management
The **Worst** metric trains you to consider failure modes (what happens when things go wrong), not only the best-case.

### 3) Strategy selection under uncertainty
Supplier reliability is uncertainty. You learn how different policies behave when probability + cost compete.

### 4) Game theory intuition
The matrix helps you compare strategies as a structured payoff view and highlights stable choices (e.g., a dominant baseline / equilibrium-style recommendation).

### 5) Tradeoff discipline
You’ll repeatedly face:

- Take higher EV with higher risk
- Or accept a slightly lower EV to protect Brand Health

That’s the core of many real operations / procurement decisions.

---

## Tips

- If your **Brand Health** drops quickly, switch to safer strategies and prioritize reliability.
- If EV is close between two strategies, choose the one with the better **Worst**.
- Use **Diversification** when both suppliers look unstable.

---

## Controls

- **Run EV Analysis**: toggles EV/Worst metric boxes
- **Click a strategy card**: deploy it
- **Restart**: resets the simulation
- **Guide / Quick Start**: opens the onboarding tutorial
