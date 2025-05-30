import { MINING_CONFIG } from '../../config/mining.config';
import niceHashService from './niceHashService';
import whatToMineService from './whatToMineService';
import { notificationService } from '../notificationService';

interface SwitchHistory {
  timestamp: number;
  fromAlgorithm: string;
  toAlgorithm: string;
  profitIncrease: number;
}

class AutoSwitchService {
  private lastSwitch: number = 0;
  private switchHistory: SwitchHistory[] = [];

  private canSwitch(): boolean {
    const now = Date.now();
    return now - this.lastSwitch >= MINING_CONFIG.AUTO_SWITCH.COOLDOWN_PERIOD;
  }

  async checkAndSwitch(): Promise<void> {
    if (!this.canSwitch()) {
      return;
    }

    try {
      // Get current rigs and their algorithms
      const rigs = await niceHashService.getRigs();
      const currentAlgorithms = new Set(rigs.miningRigs.map((rig: any) => rig.algorithm));
      
      // Get current hashrates for profitability calculation
      const hashrates: { [key: string]: number } = {};
      rigs.miningRigs.forEach((rig: any) => {
        if (!hashrates[rig.algorithm]) {
          hashrates[rig.algorithm] = 0;
        }
        hashrates[rig.algorithm] += rig.speedAccepted;
      });

      // Find most profitable algorithm
      const bestAlgorithm = await whatToMineService.getMostProfitableAlgorithm(hashrates);

      // Calculate potential profit increase
      const currentProfitability = await whatToMineService.getCalculatedProfitability({
        hashrate: hashrates[Array.from(currentAlgorithms)[0]],
        power: 100,
        cost: 0.1,
        algorithm: Array.from(currentAlgorithms)[0]
      });

      const profitIncrease = (bestAlgorithm.estimatedProfit - currentProfitability.profit) 
        / currentProfitability.profit;

      // Check if profit increase meets threshold
      if (profitIncrease > MINING_CONFIG.AUTO_SWITCH.MIN_PROFIT_THRESHOLD) {
        // Switch all rigs to new algorithm
        for (const rig of rigs.miningRigs) {
          await niceHashService.setAlgorithm(rig.rigId, bestAlgorithm.algorithm);
        }

        // Record switch
        this.lastSwitch = Date.now();
        this.switchHistory.push({
          timestamp: this.lastSwitch,
          fromAlgorithm: Array.from(currentAlgorithms)[0],
          toAlgorithm: bestAlgorithm.algorithm,
          profitIncrease
        });

        // Send notification
        await notificationService.sendNotification({
          title: 'Algorithm Switch',
          message: `Switched from ${Array.from(currentAlgorithms)[0]} to ${bestAlgorithm.algorithm} for ${(profitIncrease * 100).toFixed(2)}% more profit`,
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Error in auto-switch service:', error);
      await notificationService.sendNotification({
        title: 'Auto-Switch Error',
        message: 'Failed to perform algorithm switch',
        type: 'error'
      });
    }
  }

  getSwitchHistory(): SwitchHistory[] {
    return this.switchHistory;
  }

  startAutoSwitch(): void {
    setInterval(
      () => this.checkAndSwitch(),
      MINING_CONFIG.AUTO_SWITCH.CHECK_INTERVAL
    );
  }
}

export const autoSwitchService = new AutoSwitchService();
export default autoSwitchService;
