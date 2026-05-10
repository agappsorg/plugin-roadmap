const manifest = {
  id: "aga.plugin-roadmap",
  apiVersion: 1,
  version: "0.1.0",
  displayName: "Company Roadmap",
  description: "Living company roadmap",
  author: "Plugin Author",
  categories: ["ui"],
  capabilities: [
    "plugin.state.read",
    "plugin.state.write"
  ],
  entrypoints: {
    worker: "./dist/worker.js",
    ui: "./dist/ui"
  },
  ui: {
    slots: [
      {
        type: "page",
        id: "roadmap-page",
        displayName: "Company Roadmap",
        exportName: "RoadmapPage"
      }
    ]
  }
};
var manifest_default = manifest;
export {
  manifest_default as default
};
//# sourceMappingURL=manifest.js.map
