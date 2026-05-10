import { definePlugin, runWorker } from "@paperclipai/plugin-sdk";
import type { RoadmapData, UpsertItemParams, DeleteItemParams, MoveItemParams } from "./types.js";

const ROADMAP_STATE_KEY = { scopeKind: "instance" as const, stateKey: "roadmap-items" };

const plugin = definePlugin({
  async setup(ctx) {
    ctx.data.register("roadmap", async () => {
      const items = await ctx.state.get<RoadmapData>(ROADMAP_STATE_KEY);
      return items ?? [];
    });

    ctx.actions.register("upsert-item", async (params) => {
      const p = params as unknown as UpsertItemParams;
      const items = (await ctx.state.get<RoadmapData>(ROADMAP_STATE_KEY)) ?? [];
      const now = new Date().toISOString();

      if (p.id) {
        const idx = items.findIndex((item) => item.id === p.id);
        if (idx === -1) throw new Error(`Item not found: ${p.id}`);
        items[idx] = { ...items[idx], ...p, id: p.id, updatedAt: now };
      } else {
        items.push({
          id: crypto.randomUUID(),
          title: p.title,
          description: p.description,
          status: p.status,
          column: p.column,
          targetTimeframe: p.targetTimeframe,
          owner: p.owner,
          team: p.team,
          createdAt: now,
          updatedAt: now,
        });
      }

      await ctx.state.set(ROADMAP_STATE_KEY, items);
      return { ok: true };
    });

    ctx.actions.register("delete-item", async (params) => {
      const { id } = params as unknown as DeleteItemParams;
      const items = (await ctx.state.get<RoadmapData>(ROADMAP_STATE_KEY)) ?? [];
      const filtered = items.filter((item) => item.id !== id);
      await ctx.state.set(ROADMAP_STATE_KEY, filtered);
      return { ok: true };
    });

    ctx.actions.register("move-item", async (params) => {
      const { id, column } = params as unknown as MoveItemParams;
      const items = (await ctx.state.get<RoadmapData>(ROADMAP_STATE_KEY)) ?? [];
      const idx = items.findIndex((item) => item.id === id);
      if (idx === -1) throw new Error(`Item not found: ${id}`);
      items[idx] = { ...items[idx], column, updatedAt: new Date().toISOString() };
      await ctx.state.set(ROADMAP_STATE_KEY, items);
      return { ok: true };
    });
  },

  async onHealth() {
    return { status: "ok", message: "Roadmap plugin worker is running" };
  },
});

export default plugin;
runWorker(plugin, import.meta.url);
