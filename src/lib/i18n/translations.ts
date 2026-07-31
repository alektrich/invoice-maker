export type Language = "en" | "sr";

export interface Translations {
  // PDF strings
  invoice: string;
  invoiceDetails: string;
  invoiceId: string;
  invoiceDate: string;
  dueDate: string;
  billFrom: string;
  billTo: string;
  taxId: string;
  description: string;
  qty: string;
  rate: string;
  total: string;
  subtotal: string;
  discount: string;
  tax: string;
  totalDue: string;
  email: string;
  phone: string;
  // Form UI strings
  step1of2: string;
  step2of2: string;
  chooseTemplate: string;
  chooseTemplateDesc: string;
  provideDetails: string;
  provideDetailsDesc: string;
  changeTemplate: string;
  selectedTemplate: string;
  nextInvoiceForm: string;
  canReturnToSwitch: string;
  generateInvoicePdf: string;
  generatingPdf: string;
  downloadPdf: string;
  invoiceItems: string;
  addItem: string;
  discounts: string;
  addDiscount: string;
  invoiceSummary: string;
  currency: string;
  taxRate: string;
  companyName: string;
  contactPerson: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateProvince: string;
  zipCode: string;
  country: string;
  noPdfYet: string;
  noPdfYetDesc: string;
  templatePreview: string;
  invoicePreview: string;
  previewOfInvoice: string;
  previewSampleContent: string;
  billFromYourInfo: string;
  billToClientInfo: string;
  fixErrors: string;
  discountDescription: string;
  amount: string;
  generateId: string;
  includeVat: string;
  language: string;
  quantity: string;
  loadingPreview: string;
  footerTagline: string;
  service: string;
  anotherService: string;
  yourCompanyName: string;
  clientCompanyName: string;
  bankAccount: string;
  vatExemptNote: string;
  vatExemptText: string;
  placeOfIssue: string;
  paymentInstructions: string;
  includePaymentInstructions: string;
  beneficiaryBankSwift: string;
  beneficiaryIban: string;
  correspondentBankSwift: string;
}

const en: Translations = {
  invoice: "INVOICE",
  invoiceDetails: "Invoice Details",
  invoiceId: "Invoice ID",
  invoiceDate: "Invoice Date",
  dueDate: "Due Date",
  billFrom: "Bill From",
  billTo: "Bill To",
  taxId: "Tax ID",
  description: "Description",
  qty: "Qty",
  rate: "Rate",
  total: "Total",
  subtotal: "Subtotal",
  discount: "Discount",
  tax: "Tax",
  totalDue: "Total Due",
  email: "Email",
  phone: "Phone",
  step1of2: "Step 1 of 2",
  step2of2: "Step 2 of 2",
  chooseTemplate: "Choose an Invoice Template",
  chooseTemplateDesc: "Select the look and feel for your invoice. You can adjust the details on the next step.",
  provideDetails: "Provide Invoice Details",
  provideDetailsDesc: "Review your template selection and complete the form to generate your invoice.",
  changeTemplate: "Change Template",
  selectedTemplate: "Selected Template",
  nextInvoiceForm: "Next: Invoice Form",
  canReturnToSwitch: "You can always return to this step to switch templates later.",
  generateInvoicePdf: "Generate Invoice PDF",
  generatingPdf: "Generating PDF...",
  downloadPdf: "Download PDF",
  invoiceItems: "Invoice Items",
  addItem: "+ Add Item",
  discounts: "Discounts",
  addDiscount: "+ Add Discount",
  invoiceSummary: "Invoice Summary",
  currency: "Currency",
  taxRate: "Tax Rate (%)",
  companyName: "Company Name *",
  contactPerson: "Contact Person",
  addressLine1: "Address Line 1",
  addressLine2: "Address Line 2",
  city: "City",
  stateProvince: "State/Province",
  zipCode: "ZIP/Postal Code",
  country: "Country",
  noPdfYet: "No PDF generated yet",
  noPdfYetDesc: 'Fill out the form and click "Generate Invoice PDF" to see the preview.',
  templatePreview: "Template Preview",
  invoicePreview: "Invoice Preview",
  previewOfInvoice: "Preview of invoice",
  previewSampleContent: "Preview of selected template with sample content",
  billFromYourInfo: "Bill From (Your Information)",
  billToClientInfo: "Bill To (Client Information)",
  fixErrors: "Please fix the following errors:",
  discountDescription: "Discount Description",
  amount: "Amount",
  generateId: "Generate ID",
  includeVat: "Include 20% VAT",
  language: "Language",
  quantity: "Quantity",
  loadingPreview: "Loading PDF preview...",
  footerTagline: "Invoice Generator - Professional invoices made simple",
  service: "Service",
  anotherService: "Another Service",
  yourCompanyName: "Your Company Name",
  clientCompanyName: "Client Company Name",
  bankAccount: "Bank Account",
  vatExemptNote: "Include VAT exemption note",
  vatExemptText: "",
  placeOfIssue: "Place of Issue",
  paymentInstructions: "Payment Instructions",
  includePaymentInstructions: "Include payment instructions",
  beneficiaryBankSwift: "Beneficiary Bank SWIFT (BIC)",
  beneficiaryIban: "Beneficiary IBAN",
  correspondentBankSwift: "Correspondent Bank SWIFT (BIC)",
};

const sr: Translations = {
  invoice: "FAKTURA",
  invoiceDetails: "Detalji fakture",
  invoiceId: "Broj fakture",
  invoiceDate: "Datum fakture",
  dueDate: "Rok placanja",
  billFrom: "Izdavalac",
  billTo: "Primalac",
  taxId: "PIB",
  description: "Opis",
  qty: "Kol.",
  rate: "Cena",
  total: "Ukupno",
  subtotal: "Medjuzbir",
  discount: "Popust",
  tax: "PDV",
  totalDue: "Za uplatu",
  email: "Email",
  phone: "Telefon",
  step1of2: "Korak 1 od 2",
  step2of2: "Korak 2 od 2",
  chooseTemplate: "Izaberite sablon fakture",
  chooseTemplateDesc: "Izaberite izgled fakture. Detalje mozete prilagoditi u sledecem koraku.",
  provideDetails: "Unesite podatke fakture",
  provideDetailsDesc: "Pregledajte izbor sablona i popunite formular za generisanje fakture.",
  changeTemplate: "Promeni sablon",
  selectedTemplate: "Izabrani sablon",
  nextInvoiceForm: "Dalje: Formular fakture",
  canReturnToSwitch: "Uvek mozete da se vratite na ovaj korak i promenite sablon.",
  generateInvoicePdf: "Generisi PDF fakture",
  generatingPdf: "Generisanje PDF-a...",
  downloadPdf: "Preuzmi PDF",
  invoiceItems: "Stavke fakture",
  addItem: "+ Dodaj stavku",
  discounts: "Popusti",
  addDiscount: "+ Dodaj popust",
  invoiceSummary: "Rezime fakture",
  currency: "Valuta",
  taxRate: "Stopa poreza (%)",
  companyName: "Naziv firme *",
  contactPerson: "Kontakt osoba",
  addressLine1: "Adresa 1",
  addressLine2: "Adresa 2",
  city: "Grad",
  stateProvince: "Opstina",
  zipCode: "Postanski broj",
  country: "Drzava",
  noPdfYet: "PDF jos nije generisan",
  noPdfYetDesc: 'Popunite formular i kliknite "Generisi PDF fakture" za pregled.',
  templatePreview: "Pregled sablona",
  invoicePreview: "Pregled fakture",
  previewOfInvoice: "Pregled fakture",
  previewSampleContent: "Pregled izabranog sablona sa primerom sadrzaja",
  billFromYourInfo: "Izdavalac (Vasi podaci)",
  billToClientInfo: "Primalac (Podaci klijenta)",
  fixErrors: "Ispravite sledece greske:",
  discountDescription: "Opis popusta",
  amount: "Iznos",
  generateId: "Generisi ID",
  includeVat: "Ukljuci 20% PDV",
  language: "Jezik",
  quantity: "Kolicina",
  loadingPreview: "Ucitavanje pregleda PDF-a...",
  footerTagline: "Generator faktura - Profesionalne fakture na jednostavan nacin",
  service: "Usluga",
  anotherService: "Druga usluga",
  yourCompanyName: "Naziv vase firme",
  clientCompanyName: "Naziv firme klijenta",
  bankAccount: "Ziro racun",
  vatExemptNote: "Firma nije u sistemu PDV-a",
  vatExemptText: "PDV nije obracunat u skladu sa clanom 33. Zakona o porezu na dodatu vrednost (firma nije u sistemu PDV-a).",
  placeOfIssue: "Mesto izdavanja",
  paymentInstructions: "Instrukcije za placanje",
  includePaymentInstructions: "Ukljuci instrukcije za placanje",
  beneficiaryBankSwift: "SWIFT (BIC) banke primaoca",
  beneficiaryIban: "IBAN primaoca",
  correspondentBankSwift: "SWIFT (BIC) korespondentne banke",
};

export const translations: Record<Language, Translations> = { en, sr };

export function t(lang: Language): Translations {
  return translations[lang];
}
