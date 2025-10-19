import Api, { ApiErrorResponse } from "@/api";
import ModalPDF from "@/components/ModalPDF";
import { createContext, useCallback, useContext, useState } from "react";
import { toast } from "sonner";

type GenerateContextType = {
  listDocuments: string[];
  generatedDocument: (documentId: string) => Promise<void>;
  pdfUrl: string | null;
  open: boolean;
  closeModal: () => void;
};

const GenerateContext = createContext<GenerateContextType>({
  listDocuments: [],
  generatedDocument: async () => {},
  pdfUrl: null,
  open: false,
  closeModal: () => {},
});

type GenerateDocumentProviderProps = {
  children: React.ReactNode;
};

export const useGenerateDocument = () => useContext(GenerateContext);

export default function GenerateDocumentProvider({
  children,
}: GenerateDocumentProviderProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const generatedDocument = useCallback(async (documentId: string) => {
    try {
      const res = await Api.get<Blob>(
        `/generated-documents/${documentId}/download`,
        {
          responseType: "blob",
          headers: {
            Accept: "application/pdf",
          },
        }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setPdfUrl(url);
      setOpen(true);

      toast.success("Documento gerado com sucesso!");
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error("Erro ao gerar documento:", error);
      toast.error(
        `Erro inesperado ao gerar documento: ${
          apiError?.message || "desconhecido"
        }`
      );
    }
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  }, [pdfUrl]);

  return (
    <GenerateContext.Provider
      value={{
        listDocuments: [],
        generatedDocument,
        pdfUrl,
        open,
        closeModal,
      }}
    >
      <ModalPDF />
      {children}
    </GenerateContext.Provider>
  );
}
