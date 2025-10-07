export async function initBridge(): Promise<void> {
  console.log("[Solnance] Bridge module online");
}

export async function connectNetwork(network: string): Promise<void> {
  console.log(`[Solnance] Connecting to ${network}...`);
}
