# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Dev server at localhost:3000
npm run build      # Production build
npm run lint       # ESLint
npm run type-check # TypeScript checking
```

No test framework configured.

## Architecture

Client-side-only Next.js 15 (App Router) invoice generator. Single page app — no API routes, no backend.

**Flow:** Template selection → Form filling → PDF generation → Preview/Download

### Key layers

- **`src/app/page.tsx`** — Orchestrates the two-step flow (template selection + form) and PDF preview
- **`src/lib/services/pdf-generator.ts`** — `InvoicePDFGenerator` class builds PDFs via jsPDF. Gradients are simulated with interpolated color rectangles (20 steps). Letter size, 72pt margins.
- **`src/lib/templates/invoice-templates.ts`** — Color schemes (RGB triples), gradient types, layout styles. ~550 lines. `InvoiceTemplatePalette` is the core color interface.
- **`src/lib/validations/invoice.ts`** — Zod schemas for form validation. Cross-field: dueDate ≥ invoiceDate.
- **`src/lib/utils/invoice-calculations.ts`** — Subtotal/tax/discount math
- **`src/components/forms/`** — react-hook-form + Zod. `useFieldArray` for items/discounts.
- **`src/components/PDFPreview.tsx`** — react-pdf renders blob for in-browser preview
- **`src/components/TemplateSelector.tsx`** — Color scheme grid with gradient previews

### Persistence

localStorage only. Keys prefixed `invoice-maker:` — see `src/lib/constants/storage.ts`.

### Path aliases

`@/*`, `@/components/*`, `@/lib/*`, `@/types/*` — configured in tsconfig.json.

### PDF quirks

- `next.config.js` has webpack fallbacks for canvas/fs/path/crypto (pdfjs-dist browser compat)
- Gradient rendering in jsPDF is manual — no native PDF gradient support
