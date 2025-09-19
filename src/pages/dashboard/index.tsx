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
} from "lucide-react";
import { Divider } from "antd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/router";

const clients = [
  "Nome do cliente",
  "Nome do cliente",
  "Nome do cliente",
  "Nome do cliente",
  "Nome do cliente",
  "Nome do cliente",
];

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

const petitionModels = [
  {
    id: "procuracao-declaracao",
    label: "Procuração e declaração judiciais",
    checked: false,
  },
  {
    id: "procuracao-ppp",
    label: "Procuração PPP",
    checked: false,
  },
  {
    id: "modelo-peticao-loas-deficientes",
    label: "Modelo Petição - LOAS Deficientes",
    checked: false,
  },
  {
    id: "modelo-peticao-loas-idoso",
    label: "Modelo Petição - LOAS Idoso",
    checked: false,
  },
  {
    id: "modelo-peticao-auxilio-doenca",
    label: "Modelo Petição - Auxílio Doença",
    checked: false,
  },
];

export default function Dashboard() {
  const [selectedClient, setSelectedClient] = useState("Nome do cliente");
  const [documents, setDocuments] = useState(documentTypes);
  const [petitions, setPetitions] = useState(petitionModels);

  const router = useRouter();

  const toggleDocument = (id: string, checked: boolean) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, checked } : doc))
    );
  };

  const togglePetition = (id: string, checked: boolean) => {
    setPetitions((prev) =>
      prev.map((petition) =>
        petition.id === id ? { ...petition, checked } : petition
      )
    );
  };

  return (
    <div className="min-h-screen p-2 w-[100%] ">
      <div className=" max-w-[1440px] w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <Card className="p-6 border-none shadow-none gap-5 ">
            <CardHeader className="text-[#9A9A9A] font-light text-[14px] px-0">
              Cadastro de clientes &gt; Meus clientes
            </CardHeader>
            <h2 className="text-[24px] font-medium text-[#1C3552]">
              Meus clientes
            </h2>
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
              <Button className="text-[16px] text-[#529FF6] w-full border-2 border-[#529FF6] mb-2 rounded-[8px] bg-transparent flex items-center justify-center hover:bg-blue-700  hover:text-white hover:border-blue-600 cursor-pointer ">
                Adicionar novo cliente <Plus width={25} height={25} />
              </Button>

              {clients.map((client, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 px-3 hover:bg-gray-50  cursor-pointer border-[#CCCCCC] border-1 rounded-[8px] shadow-[0px_2px_4px_#0000001A] "
                  onClick={() => setSelectedClient(client)}
                >
                  <span className="text-[16px] text-[#1C3552] ">{client}</span>
                  <div className="flex items-center gap-2">
                    <span className=" text-[#13529C] bg-[#529FF626] px-2 py-[0px] text-[14px] rounded-[50px] font-medium flex flex-row items-center flex-nowrap gap-[10px] ">
                      Gerar documento
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
                          Editar dados
                        </DropdownMenuItem>
                        <Divider className="p-0 m-0" style={{ margin: 0 }} />
                        <DropdownMenuItem
                          className=" text-[#1C3552] text-[14px] "
                          onClick={() =>
                            router.push(`/history/${"asdakshdkahdkja"}`)
                          }
                        >
                          Ver histórico
                        </DropdownMenuItem>
                        <Divider className="p-0 m-0" style={{ margin: 0 }} />
                        <DropdownMenuItem className=" text-[#1C3552] text-[14px] ">
                          Excluir cliente
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className=" border-[#CCCCCC] border-1 rounded-[8px] gap-[10px] p-[15px] py-[10px] ">
            <h2 className="text-[#1C3552] font-medium text-[20px] mb-4">
              {selectedClient}
            </h2>

            <div className="mb-0">
              <h3 className="text-[16px] font-medium text-[#1C3552] mb-3">
                Dados do cliente:
              </h3>
              <div className="grid grid-cols-2 gap-3 ">
                <div className="  flex flex-row flex-nowrap items-center gap-[5px] ">
                  <label className="text-[16px]  font-medium text-gray-500 ">
                    CPF/CNPJ:
                  </label>
                  <div className="text-[16px] font-normal text-gray-700">
                    XXXXXXXXXXXXX
                  </div>
                </div>
                <div className="  flex flex-row flex-nowrap items-center gap-[5px] ">
                  <label className="text-[16px]  font-medium text-gray-500">
                    E-mail:
                  </label>
                  <div className="text-[16px] font-normal text-gray-700">
                    XXXXXXXXXXXXX
                  </div>
                </div>
                <div className="  flex flex-row flex-nowrap items-center gap-[5px] ">
                  <label className="text-[16px]  font-medium text-gray-500">
                    Endereço:
                  </label>
                  <div className="text-[16px] font-normal text-gray-700">
                    XXXXXXXXXXXXX
                  </div>
                </div>
                <div className="  flex flex-row flex-nowrap items-center gap-[5px] ">
                  <label className="text-[16px]  font-medium text-gray-500">
                    Telefone:
                  </label>
                  <div className="text-[16px] font-normal text-gray-700">
                    XXXXXXXXXXXXX
                  </div>
                </div>
              </div>
            </div>
            <Divider style={{ margin: 0 }} />

            <div className="mb-0">
              <h3 className="text-[16px] font-medium text-[#1C3552] mb-3">
                Gerar novo documento:
              </h3>

              <h4 className="text-[14px] text-[#9A9A9A] mb-2">
                Tipo de documento:
              </h4>
              <div className="space-y-3 grid grid-cols-2 gap-[20px] ">
                <div>
                  <div className="space-y-2 flex flex-col gap-[5px] ">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center space-x-2 bg-[#F5F5F5] rounded-[8px] py-[5px] pl-[10px]"
                      >
                        <Checkbox
                          id={doc.id}
                          checked={doc.checked}
                          onCheckedChange={(checked) =>
                            toggleDocument(doc.id, checked as boolean)
                          }
                          className="w-4 h-4 border-[#A7A7A7]"
                        />
                        <label
                          htmlFor={doc.id}
                          className="text-[16px] text-[#1C3552] cursor-pointer"
                        >
                          {doc.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="space-y-2 flex flex-col gap-[5px] ">
                    {petitions.map((model) => (
                      <div
                        key={model.id}
                        className="flex items-center space-x-2 bg-[#F5F5F5] rounded-[8px] py-[5px] pl-[10px] "
                      >
                        <Checkbox
                          id={model.id}
                          checked={model.checked}
                          onCheckedChange={(checked) =>
                            togglePetition(model.id, checked as boolean)
                          }
                          className="w-4 h-4 border-[#A7A7A7] "
                        />
                        <label
                          htmlFor={model.id}
                          className="text-[16px] text-[#1C3552] cursor-pointer"
                        >
                          {model.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Button className=" rounded-[8px] h-[43px] w-[205px] bg-[#529FF6] hover:bg-blue-700 text-white text-[16px]  ">
              Gerar documento <Check className=" w-[36px] " />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
