import { useState, useEffect } from 'react';

export interface BatteryStatus {
  level: number; // 0 to 1
  isCharging: boolean;
  lowBatteryThreshold: number;
}

/**
 * Hook to monitor battery status.
 * Currently implemented as a simulation/mock for UI demonstration.
 */
export const useBatteryStatus = () => {
  const [status, setStatus] = useState<BatteryStatus>({
    level: 0.85, // Default 85%
    isCharging: false,
    lowBatteryThreshold: 0.2, // 20%
  });

  // Simulation logic - can be removed when integrating expo-battery
  useEffect(() => {
    // For demo purposes, we can expose a way to trigger low battery
    // In a real app, this would use Battery.getBatteryStateAsync() and listeners
  }, []);

  const simulateLowBattery = (level: number = 0.15) => {
    setStatus(prev => ({ ...prev, level, isCharging: false }));
  };

  const simulateCharging = (isCharging: boolean = true) => {
    setStatus(prev => ({ ...prev, isCharging }));
  };

  const resetBattery = () => {
    setStatus({
      level: 0.85,
      isCharging: false,
      lowBatteryThreshold: 0.2,
    });
  };

  return {
    ...status,
    isLowBattery: status.level <= status.lowBatteryThreshold && !status.isCharging,
    simulateLowBattery,
    simulateCharging,
    resetBattery,
  };
};
