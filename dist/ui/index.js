// src/ui/index.tsx
import { useState } from "react";
import { usePluginData, usePluginAction } from "@paperclipai/plugin-sdk/ui";
import { jsx, jsxs } from "react/jsx-runtime";
var COLUMNS = [
  { key: "now", label: "Now", color: "#2563eb" },
  { key: "next", label: "Next", color: "#7c3aed" },
  { key: "later", label: "Later", color: "#6b7280" }
];
var STATUS_COLORS = {
  planned: "#d1d5db",
  "in-progress": "#fde68a",
  done: "#bbf7d0"
};
var STATUS_TEXT = {
  planned: "Planned",
  "in-progress": "In Progress",
  done: "Done"
};
var BLANK_FORM = {
  title: "",
  description: "",
  status: "planned",
  column: "now",
  targetTimeframe: "",
  owner: "",
  team: ""
};
function StatusBadge({ status }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      style: {
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        backgroundColor: STATUS_COLORS[status],
        color: "#111"
      },
      children: STATUS_TEXT[status]
    }
  );
}
function RoadmapCard({
  item,
  onEdit,
  onDelete,
  onMove
}) {
  const otherColumns = COLUMNS.filter((c) => c.key !== item.column);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: "12px 14px",
        marginBottom: 10,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }, children: [
          /* @__PURE__ */ jsx("div", { style: { fontWeight: 600, fontSize: 14, color: "#111", flex: 1, lineHeight: 1.4 }, children: item.title }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 4, flexShrink: 0 }, children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => onEdit(item),
                style: buttonStyle("ghost"),
                title: "Edit",
                children: "\u270F\uFE0F"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => onDelete(item.id),
                style: buttonStyle("ghost"),
                title: "Delete",
                children: "\u{1F5D1}\uFE0F"
              }
            )
          ] })
        ] }),
        item.description && /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              marginTop: 6,
              fontSize: 12,
              color: "#6b7280",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            },
            children: item.description
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: { marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }, children: [
          /* @__PURE__ */ jsx(StatusBadge, { status: item.status }),
          item.targetTimeframe && /* @__PURE__ */ jsxs("span", { style: { fontSize: 11, color: "#6b7280" }, children: [
            "\u{1F4C5} ",
            item.targetTimeframe
          ] }),
          item.team && /* @__PURE__ */ jsxs("span", { style: { fontSize: 11, color: "#6b7280" }, children: [
            "\u{1F3F7} ",
            item.team
          ] }),
          item.owner && /* @__PURE__ */ jsxs("span", { style: { fontSize: 11, color: "#6b7280" }, children: [
            "\u{1F464} ",
            item.owner
          ] })
        ] }),
        otherColumns.length > 0 && /* @__PURE__ */ jsx("div", { style: { marginTop: 8, display: "flex", gap: 4 }, children: otherColumns.map((col) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => onMove(item.id, col.key),
            style: {
              ...buttonStyle("ghost"),
              fontSize: 10,
              padding: "2px 6px",
              color: col.color,
              borderColor: col.color,
              border: `1px solid ${col.color}`,
              borderRadius: 4
            },
            children: [
              "\u2192 ",
              col.label
            ]
          },
          col.key
        )) })
      ]
    }
  );
}
function buttonStyle(variant) {
  if (variant === "primary") {
    return {
      background: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      padding: "8px 16px",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer"
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
      cursor: "pointer"
    };
  }
  return {
    background: "transparent",
    color: "#6b7280",
    border: "none",
    borderRadius: 6,
    padding: "4px 6px",
    fontSize: 13,
    cursor: "pointer"
  };
}
function ItemModal({
  initial,
  onSave,
  onCancel
}) {
  const [form, setForm] = useState(initial);
  const field = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100
      },
      onClick: onCancel,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            background: "#fff",
            borderRadius: 12,
            padding: 28,
            width: 480,
            maxWidth: "90vw",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
          },
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsx("h2", { style: { margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: "#111" }, children: form.id ? "Edit Roadmap Item" : "New Roadmap Item" }),
            /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Title *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                style: inputStyle,
                value: form.title,
                onChange: (e) => field("title", e.target.value),
                placeholder: "What are we building?",
                autoFocus: true
              }
            ),
            /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Description" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                style: { ...inputStyle, minHeight: 80, resize: "vertical" },
                value: form.description,
                onChange: (e) => field("description", e.target.value),
                placeholder: "More details..."
              }
            ),
            /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Column" }),
                /* @__PURE__ */ jsx(
                  "select",
                  {
                    style: inputStyle,
                    value: form.column,
                    onChange: (e) => field("column", e.target.value),
                    children: COLUMNS.map((c) => /* @__PURE__ */ jsx("option", { value: c.key, children: c.label }, c.key))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Status" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    style: inputStyle,
                    value: form.status,
                    onChange: (e) => field("status", e.target.value),
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "planned", children: "Planned" }),
                      /* @__PURE__ */ jsx("option", { value: "in-progress", children: "In Progress" }),
                      /* @__PURE__ */ jsx("option", { value: "done", children: "Done" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Target Timeframe" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                style: inputStyle,
                value: form.targetTimeframe,
                onChange: (e) => field("targetTimeframe", e.target.value),
                placeholder: "e.g. Q1 2026, H2 2026"
              }
            ),
            /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Owner" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    style: inputStyle,
                    value: form.owner,
                    onChange: (e) => field("owner", e.target.value),
                    placeholder: "Person name"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Team" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    style: inputStyle,
                    value: form.team,
                    onChange: (e) => field("team", e.target.value),
                    placeholder: "Team name"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24 }, children: [
              /* @__PURE__ */ jsx("button", { onClick: onCancel, style: buttonStyle("ghost"), children: "Cancel" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => form.title.trim() && onSave(form),
                  style: buttonStyle("primary"),
                  disabled: !form.title.trim(),
                  children: form.id ? "Save Changes" : "Add Item"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
var labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 4,
  marginTop: 12
};
var inputStyle = {
  display: "block",
  width: "100%",
  padding: "8px 10px",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  fontSize: 13,
  color: "#111",
  background: "#fafafa",
  boxSizing: "border-box"
};
function RoadmapPage(_props) {
  const { data, loading, error, refresh } = usePluginData("roadmap");
  const upsertItem = usePluginAction("upsert-item");
  const deleteItem = usePluginAction("delete-item");
  const moveItem = usePluginAction("move-item");
  const [modalItem, setModalItem] = useState(null);
  const items = data ?? [];
  const handleSave = async (form) => {
    await upsertItem(form);
    setModalItem(null);
    refresh();
  };
  const handleDelete = async (id) => {
    if (!confirm("Delete this roadmap item?")) return;
    await deleteItem({ id });
    refresh();
  };
  const handleMove = async (id, column) => {
    await moveItem({ id, column });
    refresh();
  };
  return /* @__PURE__ */ jsxs("div", { style: { minHeight: "100vh", background: "#f9fafb", fontFamily: "system-ui, sans-serif" }, children: [
    /* @__PURE__ */ jsxs("div", { style: { maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { style: { margin: 0, fontSize: 24, fontWeight: 800, color: "#111" }, children: "Company Roadmap" }),
          /* @__PURE__ */ jsxs("p", { style: { margin: "4px 0 0", fontSize: 14, color: "#6b7280" }, children: [
            items.length,
            " item",
            items.length !== 1 ? "s" : "",
            " across all columns"
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            style: buttonStyle("primary"),
            onClick: () => setModalItem({ ...BLANK_FORM }),
            children: "+ Add Item"
          }
        )
      ] }),
      loading && /* @__PURE__ */ jsx("div", { style: { textAlign: "center", padding: 60, color: "#9ca3af" }, children: "Loading roadmap\u2026" }),
      error && /* @__PURE__ */ jsxs("div", { style: { background: "#fee2e2", color: "#991b1b", padding: 16, borderRadius: 8 }, children: [
        "Error loading roadmap: ",
        error.message
      ] }),
      !loading && !error && /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }, children: COLUMNS.map((col) => {
        const colItems = items.filter((i) => i.column === col.key);
        return /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
                paddingBottom: 10,
                borderBottom: `2px solid ${col.color}`
              },
              children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: col.color,
                      display: "inline-block",
                      flexShrink: 0
                    }
                  }
                ),
                /* @__PURE__ */ jsx("span", { style: { fontWeight: 700, fontSize: 15, color: "#111" }, children: col.label }),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      marginLeft: "auto",
                      background: "#e5e7eb",
                      color: "#6b7280",
                      borderRadius: 10,
                      padding: "1px 8px",
                      fontSize: 12,
                      fontWeight: 600
                    },
                    children: colItems.length
                  }
                )
              ]
            }
          ),
          colItems.length === 0 && /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                border: "2px dashed #e5e7eb",
                borderRadius: 8,
                padding: 24,
                textAlign: "center",
                color: "#d1d5db",
                fontSize: 13
              },
              children: "No items"
            }
          ),
          colItems.map((item) => /* @__PURE__ */ jsx(
            RoadmapCard,
            {
              item,
              onEdit: (i) => setModalItem({
                id: i.id,
                title: i.title,
                description: i.description,
                status: i.status,
                column: i.column,
                targetTimeframe: i.targetTimeframe,
                owner: i.owner,
                team: i.team
              }),
              onDelete: handleDelete,
              onMove: handleMove
            },
            item.id
          )),
          /* @__PURE__ */ jsxs(
            "button",
            {
              style: {
                width: "100%",
                padding: "8px",
                background: "transparent",
                border: "1px dashed #d1d5db",
                borderRadius: 8,
                color: "#9ca3af",
                fontSize: 12,
                cursor: "pointer",
                marginTop: 4
              },
              onClick: () => setModalItem({ ...BLANK_FORM, column: col.key }),
              children: [
                "+ Add to ",
                col.label
              ]
            }
          )
        ] }, col.key);
      }) })
    ] }),
    modalItem && /* @__PURE__ */ jsx(
      ItemModal,
      {
        initial: modalItem,
        onSave: handleSave,
        onCancel: () => setModalItem(null)
      }
    )
  ] });
}
export {
  RoadmapPage
};
//# sourceMappingURL=index.js.map
