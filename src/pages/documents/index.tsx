"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, FileText, ArrowRight } from "lucide-react";
import { useRouter } from "next/router";
import Util from "@/utils/Util";

interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
}

const allDocumentTemplates: DocumentTemplate[] = [
  {
    id: "procuracao-inss",
    title: "Procuração INSS",
    description: "Instrumento de mandato para representação junto ao INSS.",
  },
  {
    id: "declaracao-nao-recebimento",
    title: "Declaração de não recebimento",
    description:
      "Declaração para fins de comprovação de não acúmulo de benefícios.",
  },
  {
    id: "termo-representacao",
    title: "Termo de representação",
    description: "Termo para formalizar a representação legal do cliente.",
  },
  {
    id: "autodeclaracao-rural",
    title: "Autodeclaração rural",
    description:
      "Documento para comprovação de atividade rural do segurado especial.",
  },
  {
    id: "contrato-honorarios",
    title: "Contrato de honorários",
    description: "Contrato para formalização dos honorários advocatícios.",
  },
  {
    id: "procuracao-declaracao-judicial",
    title: "Procuração e Declaração Judicial",
    description:
      "Procuração Ad Judicia para representação em processos judiciais.",
  },
  {
    id: "procuracao-ppp",
    title: "Procuração - PPP",
    description:
      "Procuração para solicitação do Perfil Profissiográfico Previdenciário.",
  },
  {
    id: "auxilio-doenca",
    title: "Petição de Auxílio Doença",
    description:
      "Petição inicial para requerimento de auxílio por incapacidade temporária.",
  },
  {
    id: "loas-idoso",
    title: "Petição de LOAS Idoso",
    description:
      "Petição para concessão de Benefício de Prestação Continuada para idosos.",
  },
  {
    id: "loas-deficiencia",
    title: "Petição de LOAS Deficiência",
    description:
      "Petição para concessão de Benefício de Prestação Continuada para pessoas com deficiência.",
  },
];

export default function Documents() {
  const router = useRouter();
  const [documents, setDocuments] =
    useState<DocumentTemplate[]>(allDocumentTemplates);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const filterDocuments = () => {
      if (searchTerm === "") {
        setDocuments(allDocumentTemplates);
      } else {
        const filtered = allDocumentTemplates.filter((doc) =>
          Util.compararStrings(doc.title, searchTerm)
        );
        setDocuments(filtered);
      }
    };

    filterDocuments();
  }, [searchTerm]);

  return (
    <div className="min-h-screen p-0 w-[100%]">
      <div className="max-w-[70%] w-full mx-auto">
        <Card className="border-none shadow-none gap-5">
          <h2 className="text-[24px] font-medium text-[#1C3552]">
            Modelos de Documentos
          </h2>
          <div className="flex gap-2 mt-4">
            <div className="relative flex-1 max-w-[400px]">
              <Input
                placeholder="Pesquisar documento..."
                className="pl-[15px] text-sm rounded-[50px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2 flex flex-col gap-3 mt-4">
            {documents.length > 0 ? (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between py-2 px-4 hover:bg-gray-50 border-[#CCCCCC] border-1 rounded-[8px] shadow-[0px_2px_4px_#0000001A]"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-[#13529C]" />
                    <div className="flex flex-col">
                      <span className="text-[16px] text-[#1C3552] font-medium">
                        {doc.title}
                      </span>
                      <span className="text-[14px] text-[#9A9A9A]">
                        {doc.description}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-[#13529C] bg-[#529FF626] px-3 py-1 text-[14px] rounded-[50px] font-medium flex items-center gap-2 cursor-pointer hover:bg-[#529FF640] h-auto"
                    onClick={() => router.push("/dashboard")}
                  >
                    Gerar <ArrowRight width={14} />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-10">
                Nenhum documento encontrado.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
