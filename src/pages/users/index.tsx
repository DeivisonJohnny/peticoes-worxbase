"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, EllipsisVertical, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRouter } from "next/router";

interface UserType {
  id: string;
  name: string | null;
  email: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  checked?: boolean;
}

import Api, { ApiErrorResponse } from "@/api";
import { FilterType } from "../dashboard";
import { Divider } from "antd";
import { toast } from "sonner";
import ClientItemSkeleton from "@/components/ClientItemSkeleton";

export default function Users() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterType>({
    filterName: false,
    filterEmail: false,
    search: "",
  });

  const toggleUser = (id: string, checked: boolean) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, checked } : user))
    );
  };

  const router = useRouter();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      if (filters.filterName) params.append("name", filters.search);
      if (filters.filterEmail) params.append("email", filters.search);

      const query = params.toString() ? `?${params.toString()}` : "";

      const usersData = await Api.get(
        `/users${query}`
      ) as UserType[] 

      const usersWithCheckbox = usersData.map((user) => ({
        ...user,
        checked: false,
      }));

      setUsers(usersWithCheckbox);
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error("Erro capturado no componente:", apiError);
      toast.error(`Erro inesperado: ${apiError.message}`);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters.filterEmail, filters.filterName, filters.search]);

  const toggleFilter = (field: string, checked: boolean) => {
    setFilters({
      filterName: field === "filterName" ? checked : false,
      filterEmail: field === "filterEmail" ? checked : false,
      search: filters.search,
    });
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen p-0 w-full">
      <div className="max-w-[70%] w-full mx-auto">
        <Card className=" border-none shadow-none gap-5">
          <h2 className="text-[24px] font-medium text-[#1C3552]">Usuários</h2>
          <div className="flex gap-2">
            <div className="relative flex-1 max-w-[400px]">
              <Input
                placeholder="Pesquisar usuário..."
                className="pl-[15px] text-sm rounded-[50px]"
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
                    htmlFor="filterEmail"
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      id="filterEmail"
                      checked={filters.filterEmail}
                      onCheckedChange={(checked) =>
                        toggleFilter("filterEmail", checked as boolean)
                      }
                      className="w-4 h-4 border-[#A7A7A7]"
                    />
                    <span>Email</span>
                  </label>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {isLoading ? (
            <div className="space-y-1 flex flex-col gap-2 mt-4">
              {[...Array(3)].map((_, i) => (
                <ClientItemSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-1 flex flex-col gap-2">
              {users?.length > 0 && users?.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between py-1 px-3 hover:bg-gray-50 cursor-pointer border-[#CCCCCC] border rounded-xl shadow-[0px_2px_4px_#0000001A]"
                >
                  <div className="flex items-center space-x-2 rounded-xl py-[5px]">
                    <Checkbox
                      id={user.id}
                      checked={user.checked}
                      onCheckedChange={(checked) =>
                        toggleUser(user.id, checked as boolean)
                      }
                      className="w-[17px] h-[17px]"
                    />
                    <div className="flex flex-col">
                      <label
                        htmlFor={user.id}
                        className="text-[16px] text-[#1C3552] cursor-pointer font-medium"
                      >
                        {user.name || "Usuário sem nome"}
                      </label>
                      <div className="flex gap-3 text-[14px] text-[#9A9A9A]">
                        {user.email && <span>{user.email}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-0.5 text-[14px] rounded-[50px] font-medium ${
                        user.isActive
                          ? "text-[#13529C] bg-[#529FF626]"
                          : "text-[#95A5A6] bg-[#EFEFEF]"
                      }`} 
                    >
                      {user.isActive ? "Ativo" : "Inativo"}
                    </span>
                    <span
                      className="text-[#13529C] bg-[#529FF626] px-[9px] py-px text-[14px] rounded-[50px] font-medium flex flex-row items-center flex-nowrap gap-[5px] cursor-pointer"
                      onClick={() => router.push(`/users/${user.id}`)}
                    >
                      Editar <Pencil width={14} />
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisVertical className="w-4 h-4 text-blue-600" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        side="bottom"
                        align="end"
                        className="rounded-[12px] rounded-tr-none"
                      >
                        <DropdownMenuItem className="text-[#1C3552] text-[14px]">
                          Excluir
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[#1C3552] text-[14px]" onClick={() => { /* Lógica para desativar */ }}>
                          {user.isActive ? 'Desativar' : 'Ativar'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
