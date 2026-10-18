import { test } from "node:test";
import assert from "node:assert/strict";
import { SyntheticsDashboard } from "../dist/index.js";

const WAD = 10n ** 18n;

test("1. Dashboard health status classification", () => {
  const dash = new SyntheticsDashboard(20000n); // 200% min ratio

  assert.equal(dash.classifyHealth(40000n), "HEALTHY");    // 400% >= 300%
  assert.equal(dash.classifyHealth(25000n), "MODERATE");   // 250% >= 200%
  assert.equal(dash.classifyHealth(18000n), "WARNING");    // 180% >= 150%
  assert.equal(dash.classifyHealth(12000n), "LIQUIDATABLE"); // 120% < 150%
});

test("2. Liquidation collateral price calculation", () => {
  const dash = new SyntheticsDashboard(20000n); // 200% min ratio

  // Debt: $2000 USD
  // Staked: 1000 SNX (18 decimals)
  // At 200% ratio, required collateral value = $4000
  // Liquidation price = $4000 / 1000 = $4.00
  const liqPrice = dash.calculateLiquidationCollateralPrice(2000n * WAD, 1000n * WAD, 18);
  assert.equal(liqPrice, 4n * WAD);
});

test("3. Telemetry event logging and querying", () => {
  const dash = new SyntheticsDashboard();

  dash.recordEvent("STAKE", "0xAlice", { amount: "1000" });
  dash.recordEvent("ISSUE", "0xAlice", { susd: "2000" });
  dash.recordEvent("EXCHANGE", "0xAlice", { from: "sUSD", to: "sETH", amount: "2000" });

  const all = dash.getEvents();
  assert.equal(all.length, 3);

  const exchanges = dash.getEvents("EXCHANGE");
  assert.equal(exchanges.length, 1);
  assert.equal(exchanges[0].actor, "0xAlice");
});

test("4. Global debt breakdown summary", () => {
  const dash = new SyntheticsDashboard();

  const synths = [
    { currencyKey: "sUSD", totalSupply: 10000n * WAD, priceWad: 1n * WAD },
    { currencyKey: "sETH", totalSupply: 5n * WAD, priceWad: 2000n * WAD },
    { currencyKey: "sBTC", totalSupply: 1n * 10n ** 17n, priceWad: 50000n * WAD } // 0.1 sBTC = $5000
  ];

  const summary = dash.summarizeGlobalDebt(synths, 25000n * WAD);
  assert.equal(summary.synthCount, 3);
  assert.equal(summary.totalGlobalDebtUsd, (25000n * WAD).toString());
  assert.equal(summary.breakdown["sETH"].valueUsd, (10000n * WAD).toString());
});
