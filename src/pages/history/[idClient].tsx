"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Filter,
  ArrowRight,
  EllipsisVertical,
  Plus,
  Check,
  Eye,
} from "lucide-react";
import { Divider } from "antd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const documentTypes = [
  { id: "procuracao-inss", label: "Procuração INSS", checked: true },
  {
    id: "declaracao-nao-recebimento",
    label: "Declaração de não recebimento",
    checked: false,
  },
  {
    id: "termo-representacao",
    label: "Termo de representação",
    checked: false,
  },
  {
    id: "autodeclaracao-rural",
    label: "Autodeclaração rural",
    checked: false,
  },
  {
    id: "contrato-honorarios",
    label: "Contrato de honorários",
    checked: false,
  },
];

export default function HistoryClient() {
  const [documents, setDocuments] = useState(documentTypes);

  const toggleDocument = (id: string, checked: boolean) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, checked } : doc))
    );
  };

  return (
    <div className="min-h-screen p-6 w-[100%] ">
      <div className=" max-w-[1440px] w-full mx-auto">
        <Card className="p-6 border-none shadow-none gap-5 ">
          <CardHeader className="text-[#9A9A9A] font-light text-[14px] px-0">
            Cadastro de clientes &gt; Historico
          </CardHeader>
          <h2 className="text-[24px] font-medium text-[#1C3552]">Historico</h2>
          <div className="flex gap-2">
            <div className="relative flex-1 max-w-[400px] ">
              <Input
                placeholder="Pesquisar cliente..."
                className="pl-[15px] text-sm rounded-[50px] "
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-[#13529C] bg-[#F3F3F3] border-none "
            >
              <Filter className="w-4 h-4 mr-1" />
              Filtrar por
            </Button>
          </div>
          <div className="space-y-1 flex  flex-col gap-2">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-1 px-3 hover:bg-gray-50  cursor-pointer border-[#CCCCCC] border-1 rounded-[8px] shadow-[0px_2px_4px_#0000001A] "
              >
                <span className="text-[16px] text-[#1C3552] ">
                  {" "}
                  <div
                    key={doc.id}
                    className="flex items-center space-x-2 rounded-[8px] py-[5px] "
                  >
                    <Checkbox
                      id={doc.id}
                      checked={doc.checked}
                      onCheckedChange={(checked) =>
                        toggleDocument(doc.id, checked as boolean)
                      }
                      className="w-[17px] h-[17px] "
                    />
                    <label
                      htmlFor={doc.id}
                      className="text-[16px] text-[#1C3552] cursor-pointer"
                    >
                      {doc.label}
                    </label>
                  </div>
                </span>
                <div className="flex items-center gap-2">
                  <span className=" text-[#13529C] bg-[#EFEFEF] px-[9px] py-[1px] text-[14px] rounded-[50px] font-medium flex flex-row items-center flex-nowrap gap-[5px] ">
                    Ver documento <Eye width={16} color="#13529C" />
                  </span>
                  <span className=" text-[#13529C] bg-[#529FF626] px-[9px] py-[1px] text-[14px] rounded-[50px] font-medium flex flex-row items-center flex-nowrap gap-[10px] mr-[25px] ">
                    Gerar novo documento
                    <ArrowRight width={12} />
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisVertical className="w-4 h-4 text-blue-600" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="bottom"
                      align="end"
                      className=" rounded-[12px] rounded-tr-none"
                    >
                      <DropdownMenuItem className=" text-[#1C3552] text-[14px] ">
                        Baixar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
