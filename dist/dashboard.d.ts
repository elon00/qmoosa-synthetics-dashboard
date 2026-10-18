import { HealthStatus, GlobalDebtSummary, TelemetryEvent } from "./types.js";
export declare class SyntheticsDashboard {
    private readonly events;
    minCollateralRatioBps: bigint;
    constructor(minCollateralRatioBps?: bigint);
    classifyHealth(ratioBps: bigint): HealthStatus;
    calculateLiquidationCollateralPrice(debtValueUsd: bigint, stakedCollateral: bigint, collateralDecimals?: number): bigint;
    recordEvent(type: TelemetryEvent["type"], actor: string, data: Record<string, any>): TelemetryEvent;
    getEvents(filterType?: TelemetryEvent["type"]): TelemetryEvent[];
    summarizeGlobalDebt(synths: {
        currencyKey: string;
        totalSupply: bigint;
        priceWad: bigint;
    }[], totalDebtShares: bigint): GlobalDebtSummary;
}
