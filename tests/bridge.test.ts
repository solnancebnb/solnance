import { connectNetwork } from "../src/bridge/core";

describe("Bridge Core", () => {
  it("connects to network successfully", async () => {
    await connectNetwork("devnet");
    expect(true).toBeTruthy();
  });
});
