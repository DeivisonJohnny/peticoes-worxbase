"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, Eye, EllipsisVertical, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const clientsData = [
  {
    id: "client-1",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 98765-4321",
    status: "Ativo",
    checked: false,
  },
  {
    id: "client-2",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "(21) 97654-3210",
    status: "Ativo",
    checked: false,
  },
  {
    id: "client-3",
    name: "Pedro Oliveira",
    email: "pedro.oliveira@email.com",
    phone: "(31) 96543-2109",
    status: "Pendente",
    checked: false,
  },
  {
    id: "client-4",
    name: "Ana Costa",
    email: "ana.costa@email.com",
    phone: "(41) 95432-1098",
    status: "Ativo",
    checked: false,
  },
  {
    id: "client-5",
    name: "Carlos Ferreira",
    email: "carlos.ferreira@email.com",
    phone: "(51) 94321-0987",
    status: "Inativo",
    checked: false,
  },
];

export default function Clients() {
  const [clients, setClients] = useState(clientsData);

  const toggleClient = (id: string, checked: boolean) => {
    setClients((prev) =>
      prev.map((client) => (client.id === id ? { ...client, checked } : client))
    );
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
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-[#13529C] bg-[#F3F3F3] border-none"
            >
              <Filter className="w-4 h-4 mr-1" />
              Filtrar por
            </Button>
          </div>
          <div className="space-y-1 flex flex-col gap-2">
            {clients.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between py-1 px-3 hover:bg-gray-50 cursor-pointer border-[#CCCCCC] border-1 rounded-[8px] shadow-[0px_2px_4px_#0000001A]"
              >
                <div className="flex items-center space-x-2 rounded-[8px] py-[5px]">
                  <Checkbox
                    id={client.id}
                    checked={client.checked}
                    onCheckedChange={(checked) =>
                      toggleClient(client.id, checked as boolean)
                    }
                    className="w-[17px] h-[17px]"
                  />
                  <div className="flex flex-col">
                    <label
                      htmlFor={client.id}
                      className="text-[16px] text-[#1C3552] cursor-pointer font-medium"
                    >
                      {client.name}
                    </label>
                    <div className="flex gap-3 text-[14px] text-[#9A9A9A]">
                      <span>{client.email}</span>
                      <span>{client.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-[12px] py-[2px] text-[14px] rounded-[50px] font-medium ${
                      client.status === "Ativo"
                        ? "text-[#13529C] bg-[#529FF626]"
                        : client.status === "Pendente"
                        ? "text-[#E67E22] bg-[#FFF3E0]"
                        : "text-[#95A5A6] bg-[#EFEFEF]"
                    }`}
                  >
                    {client.status}
                  </span>
                  <span className="text-[#13529C] bg-[#EFEFEF] px-[9px] py-[1px] text-[14px] rounded-[50px] font-medium flex flex-row items-center flex-nowrap gap-[5px]">
                    Ver detalhes <Eye width={16} color="#13529C" />
                  </span>
                  <span className="text-[#13529C] bg-[#529FF626] px-[9px] py-[1px] text-[14px] rounded-[50px] font-medium flex flex-row items-center flex-nowrap gap-[5px] mr-[25px]">
                    Editar
                    <Pencil width={14} />
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
                      <DropdownMenuItem className="text-[#1C3552] text-[14px]">
                        Exportar dados
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
