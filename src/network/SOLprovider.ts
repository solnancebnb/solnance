import { DEFAULT_NETWORK_CONFIG } from "../system/config";
import { Logger } from "../system/logger";
import { sleep, generateId } from "../utils/helpers";

export type ProviderConfig = {
  endpoint?: string;
  maxRetries?: number;
  timeoutMs?: number;
};

export class Provider {
  private endpoint: string;
  private maxRetries: number;
  private timeoutMs: number;
  private connected = false;
  private sessionId?: string;

  constructor(cfg?: ProviderConfig) {
    this.endpoint = cfg?.endpoint ?? DEFAULT_NETWORK_CONFIG.endpoint;
    this.maxRetries = cfg?.maxRetries ?? DEFAULT_NETWORK_CONFIG.maxRetries;
    this.timeoutMs = cfg?.timeoutMs ?? DEFAULT_NETWORK_CONFIG.timeoutMs;
    this.sessionId = undefined;
  }

  getSessionId() {
    return this.sessionId;
  }

  async connect(): Promise<void> {
    if (this.connected) {
      Logger.debug("Provider already connected.");
      return;
    }
    Logger.info(`Attempting to connect to provider ${this.endpoint}`);
    const attemptId = generateId("connect");
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        // simulated network handshake
        await sleep(120 + Math.random() * 300);
        if (Math.random() < 0.12 && attempt < this.maxRetries) {
          throw new Error("Transient network error");
        }
        this.sessionId = `${attemptId}-${Date.now()}`;
        this.connected = true;
        Logger.info(`Connected to ${this.endpoint} (session=${this.sessionId})`);
        return;
      } catch (err: any) {
        Logger.warn(`Connect attempt ${attempt} failed: ${err?.message ?? err}`);
        if (attempt === this.maxRetries) {
          Logger.error("Max retries reached - connection failed.");
          throw new Error("Unable to connect to provider");
        }
        await sleep(150 * attempt);
      }
    }
  }

  async disconnect(): Promise<void> {
    if (!this.connected) return;
    Logger.info("Disconnecting provider");
    await sleep(50);
    this.connected = false;
    this.sessionId = undefined;
    Logger.info("Provider disconnected");
  }

  private ensureConnected() {
    if (!this.connected) throw new Error("Provider not connected");
  }

  /**
   * Simulate sending a raw payload to the network
   */
  async sendRaw(payload: object): Promise<{ txHash: string; confirmations: number }> {
    this.ensureConnected();
    Logger.debug(`Sending payload: ${JSON.stringify(payload).slice(0, 200)}`);
    // random latency + chance of transient failure
    const latency = 80 + Math.random() * 220;
    await sleep(latency);
    if (Math.random() < 0.08) {
      Logger.warn("Transient failure while sending payload.");
      throw new Error("TransientSendError");
    }
    const txHash = `tx_${generateId("tx")}`;
    const confirmations = Math.floor(1 + Math.random() * 12);
    Logger.info(`Payload sent (tx=${txHash}, conf=${confirmations})`);
    return { txHash, confirmations };
  }

  /**
   * Confirm a given transaction over time.
   * This simulates confirmations arriving over time and optionally failing.
   */
  async awaitConfirm(txHash: string, requiredConfirmations = 6, pollMs = 500): Promise<boolean> {
    this.ensureConnected();
    Logger.info(`Awaiting confirmations for ${txHash} (need ${requiredConfirmations})`);
    let confs = 0;
    for (let i = 0; i < 60; i++) {
      // simulate confirmation progression
      await sleep(pollMs + Math.random() * 200);
      confs += Math.random() < 0.6 ? 1 : 0;
      Logger.debug(`Tx ${txHash} confirmations=${confs}`);
      if (confs >= requiredConfirmations) {
        Logger.info(`Tx ${txHash} confirmed`);
        return true;
      }
      // occasional fail
      if (Math.random() < 0.01) {
        Logger.error(`Tx ${txHash} failed to confirm`);
        return false;
      }
    }
    Logger.warn(`Timeout waiting for confirmations on ${txHash}`);
    return false;
  }
}
