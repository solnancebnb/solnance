export interface NetworkConfig {
  endpoint: string;
  maxRetries: number;
  timeout: number;
}

export class NetworkProvider {
  private endpoint: string;
  private maxRetries: number;
  private timeout: number;

  constructor(config: NetworkConfig) {
    this.endpoint = config.endpoint;
    this.maxRetries = config.maxRetries;
    this.timeout = config.timeout;
  }

  async connect(): Promise<boolean> {
    console.log(`[Solnance] Connecting to ${this.endpoint}`);
    await this.simulateLatency();
    console.log(`[Solnance] Connection established.`);
    return true;
  }

  async send(data: object): Promise<string> {
    console.log(`[Solnance] Sending data...`);
    await this.simulateLatency();
    return `TX-${Math.random().toString(36).substring(2, 10)}`;
  }

  async simulateLatency(): Promise<void> {
    const delay = Math.floor(Math.random() * 400 + 100);
    await new Promise((r) => setTimeout(r, delay));
  }
}
