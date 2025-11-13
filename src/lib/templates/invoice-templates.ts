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

export interface ColorScheme {
  id: string;
  name: string;
  accentHex: string;
  accentForegroundHex: string;
  previewGradient: [string, string];
  palette: InvoiceTemplatePalette;
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

// Color Scheme Definitions
const COLOR_SCHEMES: ColorScheme[] = [
  createColorScheme({
    id: "navy-blue",
    name: "Navy Blue",
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
  createColorScheme({
    id: "emerald-green",
    name: "Emerald Green",
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
  createColorScheme({
    id: "copper-orange",
    name: "Copper Orange",
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
  createColorScheme({
    id: "charcoal-slate",
    name: "Charcoal Slate",
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
  createColorScheme({
    id: "royal-plum",
    name: "Royal Plum",
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
  // Gray variants
  createColorScheme({
    id: "light-gray",
    name: "Light Gray",
    accentHex: "#6B7280",
    accentForegroundHex: "#FFFFFF",
    previewGradient: ["#9CA3AF", "#6B7280"],
    palette: {
      accent: "#6B7280",
      accentLight: "#F3F4F6",
      headerText: "#374151",
      headerSubtext: "#4B5563",
      bodyText: "#1F2937",
      tableHeaderFill: "#E5E7EB",
      tableHeaderText: "#374151",
      border: "#D1D5DB",
      footerText: "#4B5563",
    },
  }),
  createColorScheme({
    id: "medium-gray",
    name: "Medium Gray",
    accentHex: "#4B5563",
    accentForegroundHex: "#FFFFFF",
    previewGradient: ["#6B7280", "#4B5563"],
    palette: {
      accent: "#4B5563",
      accentLight: "#E5E7EB",
      headerText: "#1F2937",
      headerSubtext: "#374151",
      bodyText: "#111827",
      tableHeaderFill: "#D1D5DB",
      tableHeaderText: "#1F2937",
      border: "#9CA3AF",
      footerText: "#374151",
    },
  }),
  createColorScheme({
    id: "dark-gray",
    name: "Dark Gray",
    accentHex: "#374151",
    accentForegroundHex: "#FFFFFF",
    previewGradient: ["#4B5563", "#374151"],
    palette: {
      accent: "#374151",
      accentLight: "#D1D5DB",
      headerText: "#111827",
      headerSubtext: "#1F2937",
      bodyText: "#030712",
      tableHeaderFill: "#9CA3AF",
      tableHeaderText: "#111827",
      border: "#6B7280",
      footerText: "#1F2937",
    },
  }),
  createColorScheme({
    id: "charcoal-gray",
    name: "Charcoal Gray",
    accentHex: "#1F2937",
    accentForegroundHex: "#FFFFFF",
    previewGradient: ["#374151", "#1F2937"],
    palette: {
      accent: "#1F2937",
      accentLight: "#9CA3AF",
      headerText: "#030712",
      headerSubtext: "#111827",
      bodyText: "#000000",
      tableHeaderFill: "#6B7280",
      tableHeaderText: "#030712",
      border: "#4B5563",
      footerText: "#111827",
    },
  }),
];

export const DEFAULT_COLOR_SCHEME_ID = "navy-blue";

export const getColorScheme = (id: string): ColorScheme => {
  return COLOR_SCHEMES.find((scheme) => scheme.id === id) ?? COLOR_SCHEMES[0];
};

export const getAllColorSchemes = (): ColorScheme[] => {
  return COLOR_SCHEMES;
};

// Gradient Style Definitions
export type GradientType = "solid" | "linear-vertical" | "linear-horizontal" | "radial";

export interface GradientStyle {
  id: string;
  name: string;
  type: GradientType;
  description: string;
}

export const GRADIENT_STYLES: GradientStyle[] = [
  {
    id: "solid",
    name: "Solid",
    type: "solid",
    description: "Solid color fill without gradient",
  },
  {
    id: "linear-vertical",
    name: "Vertical Gradient",
    type: "linear-vertical",
    description: "Linear gradient from top to bottom",
  },
  {
    id: "linear-horizontal",
    name: "Horizontal Gradient",
    type: "linear-horizontal",
    description: "Linear gradient from left to right",
  },
  {
    id: "radial",
    name: "Radial Gradient",
    type: "radial",
    description: "Radial gradient from center outward",
  },
];

export const DEFAULT_GRADIENT_STYLE_ID = "solid";

export const getGradientStyle = (id: string): GradientStyle => {
  return GRADIENT_STYLES.find((style) => style.id === id) ?? GRADIENT_STYLES[0];
};

export const getAllGradientStyles = (): GradientStyle[] => {
  return GRADIENT_STYLES;
};

// Layout Style Definitions
export interface LayoutStyle {
  id: string;
  name: string;
  description: string;
}

export const LAYOUT_STYLES: LayoutStyle[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional layout with header top, side-by-side parties, and standard spacing",
  },
];

export const DEFAULT_LAYOUT_STYLE_ID = "classic";

export const getLayoutStyle = (id: string): LayoutStyle => {
  return LAYOUT_STYLES.find((style) => style.id === id) ?? LAYOUT_STYLES[0];
};

export const getAllLayoutStyles = (): LayoutStyle[] => {
  return LAYOUT_STYLES;
};

// Template Combination System
export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  colorSchemeId: string;
  gradientStyleId: string;
  layoutStyleId: string;
  isPreset?: boolean;
}

// Preset template combinations
export const PRESET_TEMPLATES: TemplateConfig[] = [
  {
    id: "classic-navy-solid",
    name: "Classic Navy",
    description: "Traditional navy blue with solid fill and classic layout",
    colorSchemeId: "navy-blue",
    gradientStyleId: "solid",
    layoutStyleId: "classic",
    isPreset: true,
  },
  {
    id: "modern-emerald-gradient",
    name: "Modern Emerald",
    description: "Emerald green with vertical gradient and modern layout",
    colorSchemeId: "emerald-green",
    gradientStyleId: "linear-vertical",
    layoutStyleId: "modern",
    isPreset: true,
  },
  {
    id: "compact-gray-radial",
    name: "Compact Gray",
    description: "Medium gray with radial gradient and compact layout",
    colorSchemeId: "medium-gray",
    gradientStyleId: "radial",
    layoutStyleId: "compact",
    isPreset: true,
  },
  {
    id: "elegant-plum-horizontal",
    name: "Elegant Plum",
    description: "Royal plum with horizontal gradient and classic layout",
    colorSchemeId: "royal-plum",
    gradientStyleId: "linear-horizontal",
    layoutStyleId: "classic",
    isPreset: true,
  },
];

export const getTemplateConfig = (
  colorSchemeId: string,
  gradientStyleId: string,
  layoutStyleId: string
): TemplateConfig => {
  const preset = PRESET_TEMPLATES.find(
    (p) =>
      p.colorSchemeId === colorSchemeId &&
      p.gradientStyleId === gradientStyleId &&
      p.layoutStyleId === layoutStyleId
  );

  if (preset) {
    return preset;
  }

  const colorScheme = getColorScheme(colorSchemeId);
  const gradientStyle = getGradientStyle(gradientStyleId);
  const layoutStyle = getLayoutStyle(layoutStyleId);

  return {
    id: `${colorSchemeId}-${gradientStyleId}-${layoutStyleId}`,
    name: `${colorScheme.name} ${gradientStyle.name} ${layoutStyle.name}`,
    description: `Custom combination of ${colorScheme.name}, ${gradientStyle.name}, and ${layoutStyle.name}`,
    colorSchemeId,
    gradientStyleId,
    layoutStyleId,
    isPreset: false,
  };
};

export const getAllPresetTemplates = (): TemplateConfig[] => {
  return PRESET_TEMPLATES;
};

// Legacy template system for backward compatibility
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

function createColorScheme(config: {
  id: string;
  name: string;
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
}): ColorScheme {
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
