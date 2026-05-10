import { useState } from "react";
import { usePluginData, usePluginAction, type PluginPageProps } from "@paperclipai/plugin-sdk/ui";
import type { RoadmapItem, RoadmapColumn, RoadmapStatus, UpsertItemParams } from "../types.js";

const COLUMNS: { key: RoadmapColumn; label: string; color: string }[] = [
  { key: "now", label: "Now", color: "#2563eb" },
  { key: "next", label: "Next", color: "#7c3aed" },
  { key: "later", label: "Later", color: "#6b7280" },
];

const STATUS_COLORS: Record<RoadmapStatus, string> = {
  planned: "#d1d5db",
  "in-progress": "#fde68a",
  done: "#bbf7d0",
};

const STATUS_TEXT: Record<RoadmapStatus, string> = {
  planned: "Planned",
  "in-progress": "In Progress",
  done: "Done",
};

const BLANK_FORM: UpsertItemParams = {
  title: "",
  description: "",
  status: "planned",
  column: "now",
  targetTimeframe: "",
  owner: "",
  team: "",
};

function StatusBadge({ status }: { status: RoadmapStatus }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        backgroundColor: STATUS_COLORS[status],
        color: "#111",
      }}
    >
      {STATUS_TEXT[status]}
    </span>
  );
}

function RoadmapCard({
  item,
  onEdit,
  onDelete,
  onMove,
}: {
  item: RoadmapItem;
  onEdit: (item: RoadmapItem) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, column: RoadmapColumn) => void;
}) {
  const otherColumns = COLUMNS.filter((c) => c.key !== item.column);

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: "12px 14px",
        marginBottom: 10,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: "#111", flex: 1, lineHeight: 1.4 }}>
          {item.title}
        </div>
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          <button
            onClick={() => onEdit(item)}
            style={buttonStyle("ghost")}
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(item.id)}
            style={buttonStyle("ghost")}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {item.description && (
        <div
          style={{
            marginTop: 6,
            fontSize: 12,
            color: "#6b7280",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.description}
        </div>
      )}

      <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
        <StatusBadge status={item.status} />
        {item.targetTimeframe && (
          <span style={{ fontSize: 11, color: "#6b7280" }}>📅 {item.targetTimeframe}</span>
        )}
        {item.team && (
          <span style={{ fontSize: 11, color: "#6b7280" }}>🏷 {item.team}</span>
        )}
        {item.owner && (
          <span style={{ fontSize: 11, color: "#6b7280" }}>👤 {item.owner}</span>
        )}
      </div>

      {otherColumns.length > 0 && (
        <div style={{ marginTop: 8, display: "flex", gap: 4 }}>
          {otherColumns.map((col) => (
            <button
              key={col.key}
              onClick={() => onMove(item.id, col.key)}
              style={{
                ...buttonStyle("ghost"),
                fontSize: 10,
                padding: "2px 6px",
                color: col.color,
                borderColor: col.color,
                border: `1px solid ${col.color}`,
                borderRadius: 4,
              }}
            >
              → {col.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function buttonStyle(variant: "primary" | "ghost" | "danger"): React.CSSProperties {
  if (variant === "primary") {
    return {
      background: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      padding: "8px 16px",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
    };
  }
  if (variant === "danger") {
    return {
      background: "#fee2e2",
      color: "#991b1b",
      border: "1px solid #fca5a5",
      borderRadius: 6,
      padding: "8px 16px",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
    };
  }
  return {
    background: "transparent",
    color: "#6b7280",
    border: "none",
    borderRadius: 6,
    padding: "4px 6px",
    fontSize: 13,
    cursor: "pointer",
  };
}

function ItemModal({
  initial,
  onSave,
  onCancel,
}: {
  initial: UpsertItemParams & { id?: string };
  onSave: (data: UpsertItemParams & { id?: string }) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const field = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 28,
          width: 480,
          maxWidth: "90vw",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: "#111" }}>
          {form.id ? "Edit Roadmap Item" : "New Roadmap Item"}
        </h2>

        <label style={labelStyle}>Title *</label>
        <input
          style={inputStyle}
          value={form.title}
          onChange={(e) => field("title", e.target.value)}
          placeholder="What are we building?"
          autoFocus
        />

        <label style={labelStyle}>Description</label>
        <textarea
          style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
          value={form.description}
          onChange={(e) => field("description", e.target.value)}
          placeholder="More details..."
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Column</label>
            <select
              style={inputStyle}
              value={form.column}
              onChange={(e) => field("column", e.target.value as RoadmapColumn)}
            >
              {COLUMNS.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select
              style={inputStyle}
              value={form.status}
              onChange={(e) => field("status", e.target.value as RoadmapStatus)}
            >
              <option value="planned">Planned</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <label style={labelStyle}>Target Timeframe</label>
        <input
          style={inputStyle}
          value={form.targetTimeframe}
          onChange={(e) => field("targetTimeframe", e.target.value)}
          placeholder="e.g. Q1 2026, H2 2026"
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Owner</label>
            <input
              style={inputStyle}
              value={form.owner}
              onChange={(e) => field("owner", e.target.value)}
              placeholder="Person name"
            />
          </div>
          <div>
            <label style={labelStyle}>Team</label>
            <input
              style={inputStyle}
              value={form.team}
              onChange={(e) => field("team", e.target.value)}
              placeholder="Team name"
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24 }}>
          <button onClick={onCancel} style={buttonStyle("ghost")}>Cancel</button>
          <button
            onClick={() => form.title.trim() && onSave(form)}
            style={buttonStyle("primary")}
            disabled={!form.title.trim()}
          >
            {form.id ? "Save Changes" : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 4,
  marginTop: 12,
};

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "8px 10px",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  fontSize: 13,
  color: "#111",
  background: "#fafafa",
  boxSizing: "border-box",
};

export function RoadmapPage(_props: PluginPageProps) {
  const { data, loading, error, refresh } = usePluginData<RoadmapItem[]>("roadmap");
  const upsertItem = usePluginAction("upsert-item");
  const deleteItem = usePluginAction("delete-item");
  const moveItem = usePluginAction("move-item");

  const [modalItem, setModalItem] = useState<(UpsertItemParams & { id?: string }) | null>(null);

  const items: RoadmapItem[] = data ?? [];

  const handleSave = async (form: UpsertItemParams & { id?: string }) => {
    await upsertItem(form as Record<string, unknown>);
    setModalItem(null);
    refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this roadmap item?")) return;
    await deleteItem({ id });
    refresh();
  };

  const handleMove = async (id: string, column: RoadmapColumn) => {
    await moveItem({ id, column });
    refresh();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#111" }}>Company Roadmap</h1>
            <p style={{ margin: "4px 0 0", fontSize: 14, color: "#6b7280" }}>
              {items.length} item{items.length !== 1 ? "s" : ""} across all columns
            </p>
          </div>
          <button
            style={buttonStyle("primary")}
            onClick={() => setModalItem({ ...BLANK_FORM })}
          >
            + Add Item
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>Loading roadmap…</div>
        )}

        {error && (
          <div style={{ background: "#fee2e2", color: "#991b1b", padding: 16, borderRadius: 8 }}>
            Error loading roadmap: {error.message}
          </div>
        )}

        {!loading && !error && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {COLUMNS.map((col) => {
              const colItems = items.filter((i) => i.column === col.key);
              return (
                <div key={col.key}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 14,
                      paddingBottom: 10,
                      borderBottom: `2px solid ${col.color}`,
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: col.color,
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>{col.label}</span>
                    <span
                      style={{
                        marginLeft: "auto",
                        background: "#e5e7eb",
                        color: "#6b7280",
                        borderRadius: 10,
                        padding: "1px 8px",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {colItems.length}
                    </span>
                  </div>

                  {colItems.length === 0 && (
                    <div
                      style={{
                        border: "2px dashed #e5e7eb",
                        borderRadius: 8,
                        padding: 24,
                        textAlign: "center",
                        color: "#d1d5db",
                        fontSize: 13,
                      }}
                    >
                      No items
                    </div>
                  )}

                  {colItems.map((item) => (
                    <RoadmapCard
                      key={item.id}
                      item={item}
                      onEdit={(i) =>
                        setModalItem({
                          id: i.id,
                          title: i.title,
                          description: i.description,
                          status: i.status,
                          column: i.column,
                          targetTimeframe: i.targetTimeframe,
                          owner: i.owner,
                          team: i.team,
                        })
                      }
                      onDelete={handleDelete}
                      onMove={handleMove}
                    />
                  ))}

                  <button
                    style={{
                      width: "100%",
                      padding: "8px",
                      background: "transparent",
                      border: "1px dashed #d1d5db",
                      borderRadius: 8,
                      color: "#9ca3af",
                      fontSize: 12,
                      cursor: "pointer",
                      marginTop: 4,
                    }}
                    onClick={() => setModalItem({ ...BLANK_FORM, column: col.key })}
                  >
                    + Add to {col.label}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modalItem && (
        <ItemModal
          initial={modalItem}
          onSave={handleSave}
          onCancel={() => setModalItem(null)}
        />
      )}
    </div>
  );
}
