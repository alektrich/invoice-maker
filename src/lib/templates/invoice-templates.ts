type RGB = [number, number, number];

export interface InvoiceTemplatePalette {
  headerText: RGB;
  headerSubtext: RGB;
  bodyText: RGB;
  accent: RGB;
  accentLight: RGB;
  tableHeaderFill: RGB;
  tableHeaderText: RGB;
  border: RGB;
  footerText: RGB;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  accentHex: string;
  accentForegroundHex: string;
  previewGradient: [string, string];
  palette: InvoiceTemplatePalette;
}

export const DEFAULT_TEMPLATE_ID = "default-classic";

export const INVOICE_TEMPLATES: InvoiceTemplate[] = [
  createTemplate({
    id: DEFAULT_TEMPLATE_ID,
    name: "Default Classic",
    description: "Timeless layout with deep navy accents and crisp structure.",
    accentHex: "#1D4ED8",
    accentForegroundHex: "#FFFFFF",
    previewGradient: ["#1D4ED8", "#2563EB"],
    palette: {
      accent: "#1D4ED8",
      accentLight: "#DBEAFE",
      headerText: "#1E3A8A",
      headerSubtext: "#475569",
      bodyText: "#1F2937",
      tableHeaderFill: "#E0E7FF",
      tableHeaderText: "#1E3A8A",
      border: "#CBD5F5",
      footerText: "#475569",
    },
  }),
  createTemplate({
    id: "emerald-elegance",
    name: "Emerald Elegance",
    description: "Refined green hues with soft neutrals for boutique studios.",
    accentHex: "#047857",
    accentForegroundHex: "#FFFFFF",
    previewGradient: ["#047857", "#059669"],
    palette: {
      accent: "#047857",
      accentLight: "#D1FAE5",
      headerText: "#065F46",
      headerSubtext: "#4B5563",
      bodyText: "#1F2937",
      tableHeaderFill: "#A7F3D0",
      tableHeaderText: "#047857",
      border: "#6EE7B7",
      footerText: "#047857",
    },
  }),
  createTemplate({
    id: "sunset-copper",
    name: "Sunset Copper",
    description: "Warm copper notes with amber highlights to stand out.",
    accentHex: "#B45309",
    accentForegroundHex: "#FFFFFF",
    previewGradient: ["#B45309", "#D97706"],
    palette: {
      accent: "#B45309",
      accentLight: "#FEF3C7",
      headerText: "#92400E",
      headerSubtext: "#78350F",
      bodyText: "#1F2937",
      tableHeaderFill: "#FDE68A",
      tableHeaderText: "#B45309",
      border: "#F59E0B",
      footerText: "#92400E",
    },
  }),
  createTemplate({
    id: "midnight-slate",
    name: "Midnight Slate",
    description: "Modern contrast with charcoal tones and crisp highlights.",
    accentHex: "#1E293B",
    accentForegroundHex: "#FFFFFF",
    previewGradient: ["#0F172A", "#1E293B"],
    palette: {
      accent: "#1E293B",
      accentLight: "#E2E8F0",
      headerText: "#0F172A",
      headerSubtext: "#475569",
      bodyText: "#1F2937",
      tableHeaderFill: "#CBD5F5",
      tableHeaderText: "#0F172A",
      border: "#94A3B8",
      footerText: "#1E293B",
    },
  }),
  createTemplate({
    id: "royal-plum",
    name: "Royal Plum",
    description: "Luxurious violet palette perfect for premium services.",
    accentHex: "#6B21A8",
    accentForegroundHex: "#FFFFFF",
    previewGradient: ["#6B21A8", "#7C3AED"],
    palette: {
      accent: "#6B21A8",
      accentLight: "#EDE9FE",
      headerText: "#581C87",
      headerSubtext: "#6B21A8",
      bodyText: "#1F2937",
      tableHeaderFill: "#DDD6FE",
      tableHeaderText: "#6B21A8",
      border: "#C4B5FD",
      footerText: "#6B21A8",
    },
  }),
];

export const getInvoiceTemplate = (id: string): InvoiceTemplate => {
  return INVOICE_TEMPLATES.find((template) => template.id === id) ?? INVOICE_TEMPLATES[0];
};

function createTemplate(config: {
  id: string;
  name: string;
  description: string;
  accentHex: string;
  accentForegroundHex: string;
  previewGradient: [string, string];
  palette: {
    accent: string;
    accentLight: string;
    headerText: string;
    headerSubtext: string;
    bodyText: string;
    tableHeaderFill: string;
    tableHeaderText: string;
    border: string;
    footerText: string;
  };
}): InvoiceTemplate {
  return {
    ...config,
    palette: {
      accent: hexToRgb(config.palette.accent),
      accentLight: hexToRgb(config.palette.accentLight),
      headerText: hexToRgb(config.palette.headerText),
      headerSubtext: hexToRgb(config.palette.headerSubtext),
      bodyText: hexToRgb(config.palette.bodyText),
      tableHeaderFill: hexToRgb(config.palette.tableHeaderFill),
      tableHeaderText: hexToRgb(config.palette.tableHeaderText),
      border: hexToRgb(config.palette.border),
      footerText: hexToRgb(config.palette.footerText),
    },
  };
}

function hexToRgb(hex: string): RGB {
  const sanitized = hex.replace("#", "");
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}
