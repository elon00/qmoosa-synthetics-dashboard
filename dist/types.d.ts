export type HealthStatus = "HEALTHY" | "MODERATE" | "WARNING" | "LIQUIDATABLE";
export interface DashboardStakerView {
    user: string;
    stakedCollateral: string;
    debtShares: string;
    debtValueUsd: string;
    collateralValueUsd: string;
    collateralRatioBps: string;
    healthStatus: HealthStatus;
    liquidationPriceUsd: string;
}
export interface GlobalDebtSummary {
    totalGlobalDebtUsd: string;
    totalDebtShares: string;
    synthCount: number;
    breakdown: Record<string, {
        totalSupply: string;
        priceUsd: string;
        valueUsd: string;
    }>;
}
export interface TelemetryEvent {
    id: string;
    type: "STAKE" | "UNSTAKE" | "ISSUE" | "BURN" | "EXCHANGE" | "LIQUIDATION";
    actor: string;
    data: Record<string, any>;
    timestamp: number;
}
