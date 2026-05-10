import { describe, expect, it } from "vitest";
import { createTestHarness } from "@paperclipai/plugin-sdk/testing";
import manifest from "../src/manifest.js";
import plugin from "../src/worker.js";

describe("roadmap plugin", () => {
  it("returns empty roadmap on fresh state", async () => {
    const harness = createTestHarness({ manifest, capabilities: [...manifest.capabilities] });
    await plugin.definition.setup(harness.ctx);

    const data = await harness.getData<unknown[]>("roadmap");
    expect(data).toEqual([]);
  });

  it("creates and retrieves a roadmap item", async () => {
    const harness = createTestHarness({ manifest, capabilities: [...manifest.capabilities] });
    await plugin.definition.setup(harness.ctx);

    await harness.performAction("upsert-item", {
      title: "Launch new API",
      description: "Public REST API v2",
      status: "planned",
      column: "now",
      targetTimeframe: "Q2 2026",
      owner: "Alice",
      team: "Platform",
    });

    const items = await harness.getData<{ title: string; column: string }[]>("roadmap");
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe("Launch new API");
    expect(items[0].column).toBe("now");
  });

  it("updates an existing roadmap item", async () => {
    const harness = createTestHarness({ manifest, capabilities: [...manifest.capabilities] });
    await plugin.definition.setup(harness.ctx);

    await harness.performAction("upsert-item", {
      title: "Initial title",
      description: "",
      status: "planned",
      column: "later",
      targetTimeframe: "",
      owner: "",
      team: "",
    });

    const items = await harness.getData<{ id: string; title: string; status: string }[]>("roadmap");
    const id = items[0].id;

    await harness.performAction("upsert-item", {
      id,
      title: "Updated title",
      description: "",
      status: "in-progress",
      column: "later",
      targetTimeframe: "",
      owner: "",
      team: "",
    });

    const updated = await harness.getData<{ id: string; title: string; status: string }[]>("roadmap");
    expect(updated).toHaveLength(1);
    expect(updated[0].title).toBe("Updated title");
    expect(updated[0].status).toBe("in-progress");
  });

  it("moves a roadmap item to a different column", async () => {
    const harness = createTestHarness({ manifest, capabilities: [...manifest.capabilities] });
    await plugin.definition.setup(harness.ctx);

    await harness.performAction("upsert-item", {
      title: "Feature X",
      description: "",
      status: "planned",
      column: "later",
      targetTimeframe: "",
      owner: "",
      team: "",
    });

    const items = await harness.getData<{ id: string; column: string }[]>("roadmap");
    const id = items[0].id;

    await harness.performAction("move-item", { id, column: "now" });

    const moved = await harness.getData<{ id: string; column: string }[]>("roadmap");
    expect(moved[0].column).toBe("now");
  });

  it("deletes a roadmap item", async () => {
    const harness = createTestHarness({ manifest, capabilities: [...manifest.capabilities] });
    await plugin.definition.setup(harness.ctx);

    await harness.performAction("upsert-item", {
      title: "To be deleted",
      description: "",
      status: "planned",
      column: "now",
      targetTimeframe: "",
      owner: "",
      team: "",
    });

    const items = await harness.getData<{ id: string }[]>("roadmap");
    const id = items[0].id;

    await harness.performAction("delete-item", { id });

    const remaining = await harness.getData<unknown[]>("roadmap");
    expect(remaining).toHaveLength(0);
  });
});
