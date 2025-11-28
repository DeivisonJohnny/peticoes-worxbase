import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Api, { ApiErrorResponse } from "@/api";
import { toast } from "sonner";
import SpinLoader from "./SpinLoader";
import { ClientType } from "@/pages/dashboard";

interface ClientDetailsModalProps {
  clientId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ClientDetailsModal({
  clientId,
  isOpen,
  onClose,
}: ClientDetailsModalProps) {
  const [clientDetails, setClientDetails] = useState<ClientType | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  useEffect(() => {
    if (!isOpen || !clientId) {
      setClientDetails(null);
      setIsLoadingDetails(true);
      return;
    }

    const fetchClientDetails = async () => {
      setIsLoadingDetails(true);
      try {
        const client: ClientType = await Api.get(`/clients/${clientId}`);
        setClientDetails(client);
      } catch (error) {
        const apiError = error as ApiErrorResponse;
        console.error("🚀 ~ fetchClientDetails ~ error:", apiError);
        toast.error(`Erro ao buscar detalhes do cliente: ${apiError.message}`);
        setClientDetails(null);
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchClientDetails();
  }, [clientId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white text-black max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Cliente</DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre o cliente.
          </DialogDescription>
        </DialogHeader>
        {isLoadingDetails ? (
          <div className="flex justify-center items-center h-40">
            <SpinLoader />
          </div>
        ) : clientDetails ? (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium col-span-1">Nome:</span>
              <span className="text-sm col-span-3">{clientDetails.name}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium col-span-1">CPF/CNPJ:</span>
              <span className="text-sm col-span-3">
                {clientDetails.cpf || clientDetails.cnpj || "N/A"}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium col-span-1">E-mail:</span>
              <span className="text-sm col-span-3">
                {clientDetails.email || "N/A"}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium col-span-1">Telefone:</span>
              <span className="text-sm col-span-3">
                {clientDetails.phone || "N/A"}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium col-span-1">Endereço:</span>
              <span className="text-sm col-span-3">
                {clientDetails.address || "N/A"}
              </span>
            </div>
            {clientDetails.rg && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium col-span-1">RG:</span>
                <span className="text-sm col-span-3">{clientDetails.rg}</span>
              </div>
            )}
            {clientDetails.rgIssuer && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium col-span-1">
                  Órgão Emissor RG:
                </span>
                <span className="text-sm col-span-3">
                  {clientDetails.rgIssuer}
                </span>
              </div>
            )}
            {clientDetails.dateOfBirth && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium col-span-1">
                  Data de Nascimento:
                </span>
                <span className="text-sm col-span-3">
                  {new Date(clientDetails.dateOfBirth).toLocaleDateString()}
                </span>
              </div>
            )}
            {clientDetails.maritalStatus && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium col-span-1">
                  Estado Civil:
                </span>
                <span className="text-sm col-span-3">
                  {clientDetails.maritalStatus}
                </span>
              </div>
            )}
            {clientDetails.nationality && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium col-span-1">
                  Nacionalidade:
                </span>
                <span className="text-sm col-span-3">
                  {clientDetails.nationality}
                </span>
              </div>
            )}
            {clientDetails.occupation && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium col-span-1">
                  Ocupação:
                </span>
                <span className="text-sm col-span-3">
                  {clientDetails.occupation}
                </span>
              </div>
            )}
            {clientDetails.motherName && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium col-span-1">
                  Nome da Mãe:
                </span>
                <span className="text-sm col-span-3">
                  {clientDetails.motherName}
                </span>
              </div>
            )}
            {clientDetails.birthPlace && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium col-span-1">
                  Local de Nascimento:
                </span>
                <span className="text-sm col-span-3">
                  {clientDetails.birthPlace}
                </span>
              </div>
            )}
            {clientDetails.nickname && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium col-span-1">Apelido:</span>
                <span className="text-sm col-span-3">
                  {clientDetails.nickname}
                </span>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium col-span-1">Criado em:</span>
              <span className="text-sm col-span-3">
                {new Date(clientDetails.createdAt!).toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium col-span-1">
                Última atualização:
              </span>
              <span className="text-sm col-span-3">
                {new Date(clientDetails.updatedAt!).toLocaleString()}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500">
            Não foi possível carregar os detalhes do cliente.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
