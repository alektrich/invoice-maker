declare module "pdfjs-dist/legacy/build/pdf" {
  export * from "pdfjs-dist/types/src/display/api";
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };
  export const version: string;
}

declare module "pdfjs-dist/build/pdf" {
  export * from "pdfjs-dist/types/src/display/api";
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };
  export const version: string;
}
