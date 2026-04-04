export function uiFromApi(item = {}) {
  if (!item) return null;
  return {
    id: item._id || item.id,
    name: item.itemName || "",
    sku: item.sku || "",
    // Convert backend UPPERCASE back to lowercase for the UI select input
    category: (item.category || "OTHER").toLowerCase(),
    currentStock: Number(item.currentStock ?? 0),
    minimumStock: Number(item.reorderLevel ?? 0),
    unit: item.unit || "kg",
    unitCost: Number(item.costPerUnit ?? 0),
    updatedAt: item.updatedAt || null,
    // Provide both spellings to be resilient to backend field names
    // handle a few possible backend field names
    lastRestock:
      item.lastRestock ||
      item.lastRestocked ||
      item.last_restock ||
      item.last_restocked ||
      null,
    lastRestocked:
      item.lastRestock ||
      item.lastRestocked ||
      item.last_restock ||
      item.last_restocked ||
      null,
    supplierContact: item.supplierContact || item.supplier || item.supplier_contact || "",
    supplier: item.supplierContact || item.supplier || item.supplier_contact || "",
    raw: item
  };
}

export function apiFromUi(ui = {}) {
  if (!ui) return null;

  // 1. Force Integers for stock levels to satisfy the Number type constraints
  const current = Math.floor(Number(ui.currentStock) || 0);
  const reorder = Math.floor(Number(ui.minimumStock) || 0);

  return {
    itemName: ui.name?.trim(),
    sku: ui.sku?.trim(),
    // 2. IMPORTANT: Convert lowercase UI category back to UPPERCASE for the backend Enum
    category: ui.category?.toUpperCase() || "OTHER",
    currentStock: current,
    reorderLevel: reorder,
    unit: ui.unit || "kg",
    costPerUnit: Number(ui.unitCost) || 0,
    supplierContact: ui.supplierContact?.trim() || "",
    // Send both possible last-restock field names so backend accepts either
    lastRestock: ui.lastRestock || ui.lastRestocked || null,
    lastRestocked: ui.lastRestock || ui.lastRestocked || null,
  };
}

export function normalizeApiList(items = []) {
  return (items || []).map(uiFromApi);
}