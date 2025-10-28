"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Filter,
  ArrowRight,
  EllipsisVertical,
  Plus,
  Check,
  Loader2,
} from "lucide-react";
import { Divider } from "antd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/router";
import Api, { ApiErrorResponse } from "@/api";
import SpinLoader from "@/components/SpinLoader";
import { toast } from "sonner";
import { PopupCustom } from "@/components/PopupConfirm";
import { useGenerateDocument } from "@/contexts/GenerateContext";

const documentTypes: Documento[] = [
  {
    templateId: "procuracao-inss",
    title: "Procuração INSS",
    lastGenerated: null,
    status: "nao_gerado",
  },
  {
    templateId: "declaracao-nao-recebimento",
    title: "Declaração de não recebimento",
    lastGenerated: null,
    status: "nao_gerado",
  },
  {
    templateId: "termo-representacao",
    title: "Termo de representação",
    lastGenerated: null,
    status: "nao_gerado",
  },
  {
    templateId: "autodeclaracao-rural",
    title: "Autodeclaração rural",
    lastGenerated: null,
    status: "nao_gerado",
  },
  {
    templateId: "contrato-honorarios",
    title: "Contrato de honorários",
    lastGenerated: null,
    status: "nao_gerado",
  },

  {
    templateId: "cmgpqw4ag0000iotf8rji3pk5",
    title: "Procuração e Declaração Judicial",
    status: "nao_gerado",
    lastGenerated: null,
  },
];

export type ClientType = {
  id: string;
  name: string;
  cpf?: string | null;
  cnpj?: string | null;
  address?: string | null;
  phone?: string | null;
  dateOfBirth?: string | Date | null;
  rg?: string | null;
  maritalStatus?: string | null;
  birthPlace?: string | null;
  rgIssuer?: string | null;
  nickname?: string | null;
  nationality?: string | null;
  motherName?: string | null;
  occupation?: string | null;
  email?: string | null;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  documents: Documento[];
};

export type Documento = {
  templateId: string;
  title: string;
  status: "nao_gerado" | "gerado" | "em_andamento" | string;
  lastGenerated: LastGenerated | null;
  checked?: boolean;
};

export type LastGenerated = {
  generatedDocumentId: string;
  createdAt: string;
  generatorName: string;
  dataSnapshot: {
    client: {
      id: string;
      rg: string | null;
      cpf: string | null;
      cnpj: string | null;
      name: string;
      email: string | null;
      phone: string | null;
      address: string | null;
      isActive: boolean;
      nickname: string | null;
      rgIssuer: string | null;
      createdAt: string;
      updatedAt: string;
      birthPlace: string | null;
      motherName: string | null;
      occupation: string | null;
      dateOfBirth: string | null;
      nationality: string | null;
      maritalStatus: string | null;
    };
    document: Record<string, unknown>;
  };
};

type FilterType = {
  filterName: boolean;
  filterEmail: boolean;
  search: string;
};

export default function Dashboard() {
  const [selectedClient, setSelectedClient] = useState<ClientType>();
  const [selectedDocument, setSelectedDocument] =
    useState<Documento[]>(documentTypes);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [clients, setClients] = useState<ClientType[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const { generatedDocument } = useGenerateDocument();
  const [filters, setFilters] = useState<FilterType>({
    filterName: false,
    filterEmail: false,
    search: "",
  });

  const router = useRouter();

  const [isDocumentLoading, setIsDocumentLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  function formatTitle(text: string) {
    return text.toLowerCase().replace(/\s+/g, "");
  }

  const toggleDocumentCheckbox = (templateId: string, checked: boolean) => {
    setSelectedDocument((prev) =>
      prev.map((doc) =>
        doc.templateId === templateId ? { ...doc, checked: checked } : doc
      )
    );
  };

  const toggleFilter = (field: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams();

      if (filters.filterName) params.append("name", filters.search);
      if (filters.filterEmail) params.append("email", filters.search);

      const query = params.toString() ? `?${params.toString()}` : "";

      const res: { data: ClientType[]; meta: object } = await Api.get(
        `/clients${query}`
      );

      setClients(res.data);
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error("Erro capturado no componente:", apiError);
      toast.error(`Erro inesperado: ${apiError.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [filters.filterEmail, filters.filterName, filters.search]);

  const onDeleteCliente = async () => {
    setIsLoadingDelete(true);
    if (!selectedClient?.id) {
      toast.warning("Selecione o cliente antes de deletar");
      return;
    }

    try {
      await Api.delete(`/clients/${selectedClient.id}`);

      toast.success(`Cliente deletado com sucesso`);
    } catch (error) {
      const apiError = error as ApiErrorResponse;

      toast.error(`Erro inesperado: ${apiError.message}`);
    } finally {
      fetchData();
      setShowPopup(false);
      setIsLoadingDelete(false);
    }
  };

  const fetchDocuments = useCallback(async () => {
    setIsDocumentLoading(true);
    try {
      if (selectedClient?.id) {
        const data: Documento[] = await Api.get(
          `/clients/${selectedClient?.id}/document-status`
        );

        if (!data || data.length === 0) {
          const fallback = documentTypes.map((doc) => ({
            ...doc,
            checked: false,
          }));
          setSelectedDocument(fallback);
          return;
        }

        setSelectedDocument((prev) => {
          const baseDocs = prev.length > 0 ? prev : documentTypes;

          return baseDocs.map((doc) => {
            const apiDoc = data.find(
              (d) => formatTitle(d.title) === formatTitle(doc.title)
            );

            if (apiDoc) {
              return { ...apiDoc, checked: false };
            }

            return { ...doc, checked: false };
          });
        });
      }
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error("Erro capturado no componente:", apiError);
      toast.error(`Erro inesperado: ${apiError.message}`);
    } finally {
      setIsDocumentLoading(false);
    }
  }, [selectedClient?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments, selectedClient]);

  const downloadDocuments = async () => {
    setIsDownloading(true);
    const data = selectedDocument.filter((doc) => doc.checked);

    if (data.length == 1 && data[0].lastGenerated?.generatedDocumentId) {
      generatedDocument(data[0].lastGenerated.generatedDocumentId as string);
      setIsDownloading(false);
      return;
    }

    try {
      const response = await Api.post(
        `/generated-documents/download-batch`,
        {
          documentIds: data.map(
            (doc) => doc.lastGenerated?.generatedDocumentId
          ),
        },
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${
        selectedClient?.name
          ? selectedClient.name.replace(/\s+/g, "-") + "-documentos"
          : "documentos-cliente"
      }.zip`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Arquivo ZIP baixado com sucesso!");
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      toast.error(apiError.message || "Erro ao baixar o arquivo ZIP");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <SpinLoader />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh_-_70px)] p-2 w-[100%] ">
      <PopupCustom
        open={showPopup}
        onOpenChange={() => setShowPopup((prev) => !prev)}
      >
        <div className=" flex flex-col items-center gap-3 ">
          <p className="text-black  ">
            Deseja realmente excluir o cliente{" "}
            <strong className="text-[#1C3552]"> {selectedClient?.name}</strong>
          </p>

          <p className=" text-gray-400 text-[14px] ">
            Todos os documentos gerados com ele serão perdidos
          </p>
        </div>

        <div className="flex flex-row items-center gap-6   justify-end ">
          <Button
            className=" bg-blue-400 hover:bg-blue-700 duration-300 "
            onClick={() => setShowPopup((prev) => !prev)}
          >
            Cancelar
          </Button>
          <Button
            variant={"destructive"}
            className="hover:bg-black  "
            onClick={onDeleteCliente}
          >
            {isLoadingDelete ? (
              <>
                <Loader2 className="  h-5 w-5 animate-spin" />
              </>
            ) : (
              "Excluir"
            )}
          </Button>
        </div>
      </PopupCustom>

      <div className=" max-w-[1440px] w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <Card className="p-6 border-none shadow-none gap-5 ">
            <h2 className="text-[24px] font-medium text-[#1C3552]">
              Meus clientes
            </h2>
            <div className="flex gap-2">
              <div className="relative flex-1 max-w-[400px] ">
                <Input
                  placeholder="Pesquisar cliente..."
                  className="pl-[15px] text-sm rounded-[50px] "
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[#13529C] bg-[#F3F3F3] border-none cursor-pointer "
                  >
                    <Filter className="w-4 h-4 mr-1" />
                    Filtrar por
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="bottom"
                  align="end"
                  className=" rounded-[12px] rounded-tr-none"
                >
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className=" text-[#1C3552] text-[14px] cursor-pointer "
                  >
                    <Checkbox
                      id={"filterName"}
                      checked={filters.filterName}
                      onCheckedChange={(checked) =>
                        toggleFilter("filterName", checked as boolean)
                      }
                      className="w-4 h-4 border-[#A7A7A7]"
                    />
                    <label htmlFor="filterName" className="cursor-pointer">
                      Nome
                    </label>
                  </DropdownMenuItem>
                  <Divider className="p-0 m-0" style={{ margin: 0 }} />
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className=" text-[#1C3552] text-[14px] cursor-pointer"
                  >
                    <Checkbox
                      id={"filterEmail"}
                      checked={filters.filterEmail}
                      onCheckedChange={(checked) =>
                        toggleFilter("filterEmail", checked as boolean)
                      }
                      className="w-4 h-4 border-[#A7A7A7]"
                    />
                    <label htmlFor="filterEmail" className="cursor-pointer">
                      Email
                    </label>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-1 flex  flex-col gap-2">
              <Button
                className="text-[16px] text-[#529FF6] w-full border-2 border-[#529FF6] mb-2 rounded-[8px] bg-transparent flex items-center justify-center hover:bg-blue-700  hover:text-white hover:border-blue-600 cursor-pointer "
                onClick={() => router.push("/register-client")}
              >
                Adicionar novo cliente <Plus width={25} height={25} />
              </Button>

              <div className=" flex flex-col w-full gap-2 h-[300px] overflow-y-scroll scroll-list-clients  border-b-1 border-[#d6d6d6] pb-2 ">
                {clients.length > 0 &&
                  clients?.map((client) => (
                    <div
                      key={client.id}
                      className={` flex items-center justify-between py-2 px-3 hover:bg-gray-50  cursor-pointer bg-white  border-1 rounded-[8px] shadow-[0px_2px_4px_#0000001A] min-h-[42px]  ${
                        selectedClient?.id === client.id
                          ? "border-[royalblue] shadow-[#4169e183]"
                          : "border-[#CCCCCC]"
                      }  `}
                      onClick={() => setSelectedClient(client)}
                    >
                      <span className="text-[16px] text-[#1C3552] ">
                        {client.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className=" text-[#13529C] bg-[#529FF626] px-2 py-[0px] text-[14px] rounded-[50px] font-medium flex flex-row items-center flex-nowrap gap-[10px] cursor-pointer "
                          onClick={() =>
                            // generatedDocument("cmgvjqs500003lh11mqxwpmb2")
                            router.push(`/documents/${client.id}`)
                          }
                        >
                          Gerar documento
                          <ArrowRight width={12} />
                        </span>
                        <DropdownMenu
                          onOpenChange={(isOpen) => {
                            if (isOpen) setSelectedClient(client);
                          }}
                        >
                          <DropdownMenuTrigger className="cursor-pointer">
                            <EllipsisVertical className="w-4 h-4 text-blue-600  " />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            side="bottom"
                            align="end"
                            className=" rounded-[12px] rounded-tr-none"
                          >
                            <DropdownMenuItem
                              className=" text-[#1C3552] text-[14px] cursor-pointer "
                              onClick={() =>
                                router.push(`/clients/${client.id}`)
                              }
                            >
                              Editar dados
                            </DropdownMenuItem>
                            <Divider
                              className="p-0 m-0"
                              style={{ margin: 0 }}
                            />
                            <DropdownMenuItem
                              className=" text-[#1C3552] text-[14px] cursor-pointer"
                              onClick={() =>
                                router.push(`/history/${client?.id}`)
                              }
                            >
                              Ver histórico
                            </DropdownMenuItem>
                            <Divider
                              className="p-0 m-0"
                              style={{ margin: 0 }}
                            />
                            <DropdownMenuItem
                              className=" text-[#1C3552] text-[14px] cursor-pointer "
                              onClick={() => {
                                setShowPopup((prev) => !prev);
                              }}
                            >
                              Excluir cliente
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </Card>

          <Card className=" border-[#CCCCCC] h-fit border-1 rounded-[8px] gap-[10px] p-[15px] py-[10px] ">
            <h2 className="text-[#1C3552] font-medium text-[20px] mb-4">
              {selectedClient?.name}
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
                    {selectedClient?.cpf
                      ? selectedClient?.cpf
                      : selectedClient?.cnpj
                      ? selectedClient?.cnpj
                      : "XXXXXXXXXXXXX"}
                  </div>
                </div>
                <div className="  flex flex-row flex-nowrap items-center gap-[5px] ">
                  <label className="text-[16px]  font-medium text-gray-500">
                    E-mail:
                  </label>
                  <div className="text-[16px] font-normal text-gray-700">
                    {selectedClient?.email ?? "XXXXXXXXXXXXX"}
                  </div>
                </div>
                <div className="  flex flex-row flex-nowrap items-center gap-[5px] ">
                  <label className="text-[16px]  font-medium text-gray-500">
                    Endereço:
                  </label>
                  <div className="text-[16px] font-normal text-gray-700">
                    {selectedClient?.address ?? "XXXXXXXXXXXXX"}
                  </div>
                </div>
                <div className="  flex flex-row flex-nowrap items-center gap-[5px] ">
                  <label className="text-[16px]  font-medium text-gray-500">
                    Telefone:
                  </label>
                  <div className="text-[16px] font-normal text-gray-700">
                    {selectedClient?.phone ?? "XXXXXXXXXXXXX"}
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
                    {isDocumentLoading ? (
                      <>
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center space-x-2 bg-[#F5F5F5] rounded-[8px] py-[5px] pl-[10px] h-[38px]"
                          >
                            <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                            <div className="w-4/5 h-4 bg-gray-300 rounded animate-pulse"></div>
                          </div>
                        ))}
                      </>
                    ) : (
                      selectedDocument.length > 0 &&
                      selectedDocument.map((doc) => (
                        <div
                          key={doc.templateId}
                          className={`flex items-center space-x-2 bg-[#F5F5F5] rounded-[8px] gap-[8px] pl-[10px]  ${
                            !doc.lastGenerated
                              ? "opacity-[0.5] cursor-not-allowed"
                              : ""
                          } `}
                        >
                          <Checkbox
                            id={doc.templateId}
                            checked={!!doc.checked}
                            onCheckedChange={(checked) =>
                              toggleDocumentCheckbox(
                                doc.templateId,
                                checked as boolean
                              )
                            }
                            className={`w-4 h-4 mr-[0px_!important] border-[#A7A7A7]  ${
                              !doc.lastGenerated
                                ? "opacity-[0.5] cursor-not-allowed "
                                : "cursor-pointer"
                            }  `}
                            disabled={!doc.lastGenerated}
                          />
                          <label
                            htmlFor={doc.templateId}
                            className={`text-[16px] text-[#1C3552] w-full  py-[5px] ${
                              !doc.lastGenerated
                                ? "opacity-[0.5] cursor-not-allowed"
                                : " cursor-pointer"
                            }  `}
                          >
                            {doc.title}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <div className="space-y-2 flex flex-col gap-[5px] "></div>
                </div>
              </div>
            </div>

            <Button
              className=" rounded-[8px] h-[43px] w-[205px] bg-[#529FF6] hover:bg-blue-700 text-white text-[16px]  "
              onClick={downloadDocuments}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  Gerar documento <Check className=" w-[36px] " />
                </>
              )}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
