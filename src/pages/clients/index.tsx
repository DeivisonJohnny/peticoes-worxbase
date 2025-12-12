"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Filter,
  Eye,
  Pencil,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRouter } from "next/router";

interface ClientType {
  id: string;
  name: string;
  cpf: string | null;
  cnpj: string | null;
  address: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  rg: string | null;
  maritalStatus: string | null;
  birthPlace: string | null;
  rgIssuer: string | null;
  nickname: string | null;
  nationality: string | null;
  motherName: string | null;
  occupation: string | null;
  email: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  checked?: boolean;
}

import Api, { ApiErrorResponse } from "@/api";
import { toast } from "sonner";

import ClientDetailsModal from "@/components/ClientDetailsModal";
import { ClientFilterType, SortType } from "../dashboard";
import { Divider } from "antd";
import ClientItemSkeleton from "@/components/ClientItemSkeleton";

export default function Clients() {
  const [clients, setClients] = useState<ClientType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [filters, setFilters] = useState<ClientFilterType>({
    filterName: false,
    filterPhone: false,
    filterCpfCnpj: false,
    search: "",
  });
  const [sortConfig, setSortConfig] = useState<SortType>({
    field: "createdAt",
    order: "desc",
  });

  const router = useRouter();


  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };


  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };


  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 10) {
      return cleaned
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1");
    }
    return cleaned
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };


  const handleSearchInput = (value: string) => {
    const cleaned = value.replace(/\D/g, "");


    if (cleaned.length === 0) {
      setFilters((prev) => ({ ...prev, search: value }));
      return;
    }

    let formatted = value;


    if (cleaned.length <= 11) {

      if (cleaned.length === 11) {

        const ddd = parseInt(cleaned.substring(0, 2));
        if (ddd >= 11 && ddd <= 99) {
          formatted = formatPhone(value);
        } else {
          formatted = formatCPF(value);
        }
      } else if (cleaned.length === 10) {
        formatted = formatPhone(value);
      } else if (cleaned.length < 10) {

        if (value.includes("(") || value.includes(")")) {
          formatted = formatPhone(value);
        } else {
          formatted = value;
        }
      }
    } else if (cleaned.length <= 14) {

      formatted = formatCNPJ(value);
    }

    setFilters((prev) => ({ ...prev, search: formatted }));
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      if (filters.filterName) params.append("name", filters.search);
      if (filters.filterPhone) params.append("phone", filters.search);
      if (filters.filterCpfCnpj) params.append("cpfCnpj", filters.search);

      if (sortConfig.field) {
        params.append("sortBy", sortConfig.field);
        params.append("order", sortConfig.order);
      }

      const query = params.toString() ? `?${params.toString()}` : "";

      const res: { data: ClientType[]; meta: object } = await Api.get(
        `/clients${query}`
      );

      const clientsWithCheckbox = res.data.map((client) => ({
        ...client,
        checked: false,
      }));

      setClients(clientsWithCheckbox);
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error("Erro capturado no componente:", apiError);
      toast.error(`Erro inesperado: ${apiError.message}`);
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters.filterCpfCnpj, filters.filterName, filters.filterPhone, filters.search, sortConfig.field, sortConfig.order]);

  const toggleFilter = (field: string, checked: boolean) => {
    setFilters({
      filterName: field === "filterName" ? checked : false,
      filterPhone: field === "filterPhone" ? checked : false,
      filterCpfCnpj: field === "filterCpfCnpj" ? checked : false,
      search: filters.search,
    });
  };

  const handleSort = (field: "name" | "createdAt") => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        return {
          field,
          order: prev.order === "asc" ? "desc" : "asc",
        };
      }
      return {
        field,
        order: field === "createdAt" ? "desc" : "asc",
      };
    });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [filters.search, filters.filterName, filters.filterPhone, filters.filterCpfCnpj, fetchData]);

  const handleViewDetails = (clientId: string) => {
    setSelectedClientId(clientId);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedClientId(null);
  };

  return (
    <div className="min-h-screen p-0 w-[100%]">
      <div className="max-w-[70%] w-full mx-auto">
        <Card className=" border-none shadow-none gap-5">
          <h2 className="text-[24px] font-medium text-[#1C3552]">Clientes</h2>
          <div className="flex gap-2">
            <div className="relative flex-1 max-w-[400px]">
              <Input
                placeholder="Pesquisar cliente..."
                className="pl-[15px] text-sm rounded-[50px]"
                value={filters.search}
                onChange={(e) => handleSearchInput(e.target.value)}
              />
              {isLoading ? (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4 animate-spin" />
              ) : (
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
              )}
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
                  className="text-[#1C3552] text-[14px] cursor-pointer"
                >
                  <label
                    htmlFor="filterName"
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      id="filterName"
                      checked={filters.filterName}
                      onCheckedChange={(checked) =>
                        toggleFilter("filterName", checked as boolean)
                      }
                      className="w-4 h-4 border-[#A7A7A7]"
                    />
                    <span>Nome</span>
                  </label>
                </DropdownMenuItem>
                <Divider className="p-0 m-0" style={{ margin: 0 }} />
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-[#1C3552] text-[14px] cursor-pointer"
                >
                  <label
                    htmlFor="filterPhone"
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      id="filterPhone"
                      checked={filters.filterPhone}
                      onCheckedChange={(checked) =>
                        toggleFilter("filterPhone", checked as boolean)
                      }
                      className="w-4 h-4 border-[#A7A7A7]"
                    />
                    <span>Telefone</span>
                  </label>
                </DropdownMenuItem>
                <Divider className="p-0 m-0" style={{ margin: 0 }} />
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-[#1C3552] text-[14px] cursor-pointer"
                >
                  <label
                    htmlFor="filterCpfCnpj"
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      id="filterCpfCnpj"
                      checked={filters.filterCpfCnpj}
                      onCheckedChange={(checked) =>
                        toggleFilter("filterCpfCnpj", checked as boolean)
                      }
                      className="w-4 h-4 border-[#A7A7A7]"
                    />
                    <span>CPF/CNPJ</span>
                  </label>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {isLoading ? (
            <div className="space-y-1 flex flex-col gap-2 mt-4">
              {[...Array(5)].map((_, i) => (
                <ClientItemSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-1 flex flex-col gap-2">
              <div className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded-[8px] mb-1 sticky top-0 z-10">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-2 text-[14px] font-medium text-[#1C3552] hover:text-[#13529C] transition-colors cursor-pointer"
                >
                  Nome
                  {sortConfig.field === "name" ? (
                    sortConfig.order === "asc" ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )
                  ) : (
                    <ArrowUpDown className="w-4 h-4 opacity-40" />
                  )}
                </button>
                <button
                  onClick={() => handleSort("createdAt")}
                  className="flex items-center gap-2 text-[14px] font-medium text-[#1C3552] hover:text-[#13529C] transition-colors cursor-pointer"
                >
                  Data de criação
                  {sortConfig.field === "createdAt" ? (
                    sortConfig.order === "asc" ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )
                  ) : (
                    <ArrowUpDown className="w-4 h-4 opacity-40" />
                  )}
                </button>
              </div>
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between py-1 px-3 hover:bg-gray-50 cursor-pointer border-[#CCCCCC] border-1 rounded-[8px] shadow-[0px_2px_4px_#0000001A]"
                >
                  <div className="flex items-center space-x-2 rounded-[8px] py-[5px]">
                    {/* <Checkbox
                      id={client.id}
                      checked={client.checked}
                      onCheckedChange={(checked) =>
                        toggleClient(client.id, checked as boolean)
                      }
                      className="w-[17px] h-[17px]"
                    /> */}
                    <div className="flex flex-col ml-1">
                      <label
                        htmlFor={client.id}
                        className="text-[16px] text-[#1C3552] cursor-pointer font-medium"
                      >
                        {client.name}
                      </label>
                      <div className="flex gap-3 text-[14px] text-[#9A9A9A]">
                        {client.cpf && <span>CPF: {client.cpf}</span>}
                        {client.phone && <span>Tel: {client.phone}</span>}
                        {client.address && <span>{client.address}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[#13529C] bg-[#EFEFEF] px-[9px] py-[1px] text-[14px] rounded-[50px] font-medium flex flex-row items-center flex-nowrap gap-[5px] cursor-pointer"
                      onClick={() => handleViewDetails(client.id)}
                    >
                      Ver detalhes <Eye width={16} color="#13529C" />
                    </span>
                    <span
                      className="text-[#13529C] bg-[#529FF626] px-[9px] py-[1px] text-[14px] rounded-[50px] font-medium flex flex-row items-center flex-nowrap gap-[5px] mr-[25px] cursor-pointer"
                      onClick={() => router.push(`/clients/${client.id}`)}
                    >
                      Editar <Pencil width={14} />
                    </span>
                
                
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
      <ClientDetailsModal
        clientId={selectedClientId}
        isOpen={showDetailsModal}
        onClose={handleCloseDetailsModal}
      />
    </div>
  );
}
