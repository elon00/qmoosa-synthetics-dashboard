import crypto from "node:crypto";
export class SyntheticsDashboard {
    events = [];
    minCollateralRatioBps = 20000n; // 200%
    constructor(minCollateralRatioBps = 20000n) {
        this.minCollateralRatioBps = minCollateralRatioBps;
    }
    classifyHealth(ratioBps) {
        if (ratioBps >= 30000n) {
            return "HEALTHY";
        }
        else if (ratioBps >= this.minCollateralRatioBps) {
            return "MODERATE";
        }
        else if (ratioBps >= 15000n) {
            return "WARNING";
        }
        else {
            return "LIQUIDATABLE";
        }
    }
    calculateLiquidationCollateralPrice(debtValueUsd, stakedCollateral, collateralDecimals = 18) {
        if (stakedCollateral <= 0n)
            return 0n;
        if (debtValueUsd <= 0n)
            return 0n;
        // Price at which collateralValue / debtValue = minCollateralRatio
        // (staked * price / 10^dec) * 10000 / debt = minRatio
        // price = (debt * minRatio * 10^dec) / (staked * 10000)
        const num = debtValueUsd * this.minCollateralRatioBps * (10n ** BigInt(collateralDecimals));
        const den = stakedCollateral * 10000n;
        return num / den;
    }
    recordEvent(type, actor, data) {
        const event = {
            id: `evt_${crypto.randomBytes(6).toString("hex")}`,
            type,
            actor,
            data,
            timestamp: Math.floor(Date.now() / 1000)
        };
        this.events.push(event);
        return event;
    }
    getEvents(filterType) {
        if (!filterType)
            return [...this.events];
        return this.events.filter(e => e.type === filterType);
    }
    summarizeGlobalDebt(synths, totalDebtShares) {
        let totalDebtUsd = 0n;
        const breakdown = {};
        for (const s of synths) {
            const val = (s.totalSupply * s.priceWad) / 10n ** 18n;
            totalDebtUsd += val;
            breakdown[s.currencyKey] = {
                totalSupply: s.totalSupply.toString(),
                priceUsd: (Number(s.priceWad) / 1e18).toFixed(4),
                valueUsd: val.toString()
            };
        }
        return {
            totalGlobalDebtUsd: totalDebtUsd.toString(),
            totalDebtShares: totalDebtShares.toString(),
            synthCount: synths.length,
            breakdown
        };
    }
}
