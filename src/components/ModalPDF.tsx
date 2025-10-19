"use client";

import { useGenerateDocument } from "@/contexts/GenerateContext";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Loader2, X } from "lucide-react";
export default function ModalPDF() {
  const { pdfUrl, open, closeModal } = useGenerateDocument();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closeModal()}>
      <DialogContent className="w-[80%] max-w-[1400px_!important] h-[95vh] p-0 flex flex-col overflow-hidden bg-white [&>button]:hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold  text-black">
            <FileText className="h-5 w-5 text-primary " />
            Visualização do Documento
          </DialogTitle>
          <DialogClose asChild>
            <button className="absolute right-4 top-4 rounded-full p-2 hover:bg-muted">
              <X className="h-4 w-4 text-black" />
            </button>
          </DialogClose>
        </DialogHeader>

        <div className="flex-1 bg-muted/30">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full border-0"
              title="Visualizador de PDF"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Carregando documento...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
