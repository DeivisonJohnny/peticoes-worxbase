"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Util from "@/utils/Util";
import { Divider } from "antd";
import { useEffect, useState } from "react";
import { ClientType, Documento } from "@/pages/dashboard";
import Api, { ApiErrorResponse } from "@/api";
import { toast } from "sonner";
import { useGenerateDocument } from "@/contexts/GenerateContext";
import { Loader2 } from "lucide-react";

const FeeAgreementSchema = yup.object({
  clientFullName: yup
    .string()
    .min(3, "O nome completo deve ter no mínimo 3 caracteres")
    .required("O nome completo é obrigatório"),
  clientNationality: yup.string().required("A nacionalidade é obrigatória"),
  clientCpf: yup
    .string()
    .required("O CPF é obrigatório")
    .test("cpf-valid", "CPF inválido", (value) =>
      Util.validateCpfOrCnpj(value || "")
    ),

  clientStreet: yup.string().required("O logradouro é obrigatório"),
  clientStreetNumber: yup.string().required("O número é obrigatório"),
  clientNeighborhood: yup.string().required("O bairro é obrigatório"),
  clientCity: yup.string().required("A cidade é obrigatória"),
  clientState: yup.string().required("O estado é obrigatório"),
  clientZipCode: yup.string().required("O CEP é obrigatório"),

  administrativeSuccessPercentage: yup
    .string()
    .required("O percentual é obrigatório"),
  administrativeBenefitSalaries: yup
    .string()
    .required("A quantidade de salários é obrigatória"),
  administrativeInstallments: yup
    .string()
    .required("O número de parcelas é obrigatório"),
  judicialSuccessPercentage: yup
    .string()
    .required("O percentual é obrigatório"),
  judicialFutureInstallments: yup
    .string()
    .required("A quantidade de parcelas vincendas é obrigatória"),

  documentLocation: yup
    .string()
    .required("A cidade do documento é obrigatória"),
  documentDate: yup.string().required("A data do documento é obrigatória"),
});

type FeeAgreementFormData = yup.InferType<typeof FeeAgreementSchema>;
type FeeAgreementResolver = Resolver<FeeAgreementFormData>;

interface ContratoHonorariosProps {
  client?: ClientType | null;
  idForm?: string;
  documents?: Documento[];
}

export default function ContratoHonorarios({
  client,
  idForm,
}: ContratoHonorariosProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { generatedDocument } = useGenerateDocument();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FeeAgreementFormData>({
    resolver: yupResolver(FeeAgreementSchema) as FeeAgreementResolver,
    mode: "onChange",
  });

  useEffect(() => {
    if (client && "id" in client) {
      setValue("clientFullName", client.name || "");
      setValue("clientNationality", client.nationality || "");
      setValue("clientCpf", client.cpf || "");

      if(client.documentSelected?.dataSnapshot) {
        const snapshot = client.documentSelected.dataSnapshot;

        if (snapshot.client?.address) {
        
          const addressParts = snapshot.client.address.split(", ");
          const street = addressParts[0] || "";
          const number = addressParts[1] || "";
          const neighborhood = addressParts[2] || "";
          const city = addressParts[3] || "";
          const state = addressParts[4] || "";

          setValue("clientStreet", street);
          setValue("clientStreetNumber", number);
          setValue("clientNeighborhood", neighborhood);
          setValue("clientCity", city);
          setValue("clientState", state);
        }

        if (snapshot.contract) {
          setValue("administrativeSuccessPercentage", snapshot.contract.administrativePercentage || "");
          setValue("administrativeBenefitSalaries", snapshot.contract.administrativeSalaries || "");
          setValue("administrativeInstallments", snapshot.contract.administrativeInstallments || "");
          setValue("judicialSuccessPercentage", snapshot.contract.judicialPercentage || "");
          setValue("judicialFutureInstallments", snapshot.contract.judicialInstallments || "");
        }

        if (snapshot.document) {
          setValue("documentLocation", snapshot.document.location || "");
          if (snapshot.document.documentDate) {
            const date = new Date(snapshot.document.documentDate);
            const formattedDate = date.toISOString().split('T')[0];
            setValue("documentDate", formattedDate);
          }
        }
      }
    }
  }, [client, setValue]);

  const onSubmit = async (data: FeeAgreementFormData) => {
    setIsSubmitting(true);
    const body = {
      clientId: client?.id,
      templateId: idForm,
      extraData: data,
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: Record<string, any> = await Api.post(
        "/documents/generate",
        body
      );
      if (response?.documentId) {
        generatedDocument(response.documentId);
      }
      toast.success("Documento gerado com sucesso!");
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      toast.error(`${apiError.message}`);
      console.error("Erro capturado no componente:", apiError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCpf = Util.formatCpfCnpj(e.target.value);
    setValue("clientCpf", formattedCpf, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen p-6 md:p-0 w-[100%]">
      <div className="max-w-[1200px] w-full mx-auto">
        <Card className="p-0 border-none shadow-none gap-3">
          <CardHeader className="text-[#529FF6] font-[700] text-[24px] px-0">
            Contrato de Honorários Advocatícios
          </CardHeader>
          <CardContent className="px-0">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 flex flex-col gap-[40px]"
            >
              <div className="space-y-4">
                <div className="space-y-2 w-full">
                  <Label
                    htmlFor="clientFullName"
                    className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                  >
                    Nome Completo do Cliente
                  </Label>
                  <Input
                    id="clientFullName"
                    type="text"
                    {...register("clientFullName")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.clientFullName ? "border-red-500" : ""
                    }`}
                    placeholder="Digite o nome completo do cliente..."
                  />
                  {errors.clientFullName && (
                    <p className="text-red-500 text-sm">
                      {errors.clientFullName.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-row gap-[15px] items-start">
                  <div className="space-y-2 w-1/2">
                    <Label
                      htmlFor="clientNationality"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Nacionalidade
                    </Label>
                    <Input
                      id="clientNationality"
                      type="text"
                      {...register("clientNationality")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.clientNationality ? "border-red-500" : ""
                      }`}
                      placeholder="Ex: Brasileiro(a)"
                    />
                    {errors.clientNationality && (
                      <p className="text-red-500 text-sm">
                        {errors.clientNationality.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-1/2">
                    <Label
                      htmlFor="clientCpf"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      CPF
                    </Label>
                    <Input
                      id="clientCpf"
                      type="text"
                      {...register("clientCpf")}
                      onChange={handleCpfChange}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.clientCpf ? "border-red-500" : ""
                      }`}
                      placeholder="000.000.000-00"
                    />
                    {errors.clientCpf && (
                      <p className="text-red-500 text-sm">
                        {errors.clientCpf.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Divider />

              <div className="space-y-4">
                <div className="flex flex-row gap-[15px] items-start">
                  <div className="space-y-2 w-[60%]">
                    <Label
                      htmlFor="clientStreet"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Logradouro
                    </Label>
                    <Input
                      id="clientStreet"
                      type="text"
                      {...register("clientStreet")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.clientStreet ? "border-red-500" : ""
                      }`}
                      placeholder="Rua, Avenida..."
                    />
                    {errors.clientStreet && (
                      <p className="text-red-500 text-sm">
                        {errors.clientStreet.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-[40%]">
                    <Label
                      htmlFor="clientStreetNumber"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Número
                    </Label>
                    <Input
                      id="clientStreetNumber"
                      type="text"
                      {...register("clientStreetNumber")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.clientStreetNumber ? "border-red-500" : ""
                      }`}
                      placeholder="Nº"
                    />
                    {errors.clientStreetNumber && (
                      <p className="text-red-500 text-sm">
                        {errors.clientStreetNumber.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-row gap-[15px] items-start">
                  <div className="space-y-2 w-1/2">
                    <Label
                      htmlFor="clientNeighborhood"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Bairro
                    </Label>
                    <Input
                      id="clientNeighborhood"
                      type="text"
                      {...register("clientNeighborhood")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.clientNeighborhood ? "border-red-500" : ""
                      }`}
                      placeholder="Digite o bairro..."
                    />
                    {errors.clientNeighborhood && (
                      <p className="text-red-500 text-sm">
                        {errors.clientNeighborhood.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-1/2">
                    <Label
                      htmlFor="clientCity"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Cidade
                    </Label>
                    <Input
                      id="clientCity"
                      type="text"
                      {...register("clientCity")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.clientCity ? "border-red-500" : ""
                      }`}
                      placeholder="Digite a cidade..."
                    />
                    {errors.clientCity && (
                      <p className="text-red-500 text-sm">
                        {errors.clientCity.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-row gap-[15px] items-start">
                  <div className="space-y-2 w-[30%]">
                    <Label
                      htmlFor="clientState"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Estado
                    </Label>
                    <Input
                      id="clientState"
                      type="text"
                      {...register("clientState")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.clientState ? "border-red-500" : ""
                      }`}
                      placeholder="UF"
                    />
                    {errors.clientState && (
                      <p className="text-red-500 text-sm">
                        {errors.clientState.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-[70%]">
                    <Label
                      htmlFor="clientZipCode"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      CEP
                    </Label>
                    <Input
                      id="clientZipCode"
                      type="text"
                      {...register("clientZipCode")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.clientZipCode ? "border-red-500" : ""
                      }`}
                      placeholder="00000-000"
                    />
                    {errors.clientZipCode && (
                      <p className="text-red-500 text-sm">
                        {errors.clientZipCode.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Divider />

              <div className="space-y-4">
                <p className="text-lg font-semibold text-[#1C3552]">
                  Concessão Administrativa
                </p>
                <div className="flex flex-row gap-[15px] items-start">
                  <div className="space-y-2 w-1/3">
                    <Label htmlFor="administrativeSuccessPercentage">
                      Percentual dos Atrasados (%)
                    </Label>
                    <Input
                      id="administrativeSuccessPercentage"
                      type="text"
                      {...register("administrativeSuccessPercentage")}
                      placeholder="Ex: 30"
                    />
                    {errors.administrativeSuccessPercentage && (
                      <p className="text-red-500 text-sm">
                        {errors.administrativeSuccessPercentage.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-1/3">
                    <Label htmlFor="administrativeBenefitSalaries">
                      Qtd. Salários de Benefício
                    </Label>
                    <Input
                      id="administrativeBenefitSalaries"
                      type="text"
                      {...register("administrativeBenefitSalaries")}
                      placeholder="Ex: 4"
                    />
                    {errors.administrativeBenefitSalaries && (
                      <p className="text-red-500 text-sm">
                        {errors.administrativeBenefitSalaries.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-1/3">
                    <Label htmlFor="administrativeInstallments">
                      Nº de Parcelas
                    </Label>
                    <Input
                      id="administrativeInstallments"
                      type="text"
                      {...register("administrativeInstallments")}
                      placeholder="Ex: 4"
                    />
                    {errors.administrativeInstallments && (
                      <p className="text-red-500 text-sm">
                        {errors.administrativeInstallments.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-lg font-semibold text-[#1C3552]">
                  Concessão Judicial
                </p>
                <div className="flex flex-row gap-[15px] items-start">
                  <div className="space-y-2 w-1/2">
                    <Label htmlFor="judicialSuccessPercentage">
                      Percentual do Proveito Econômico (%)
                    </Label>
                    <Input
                      id="judicialSuccessPercentage"
                      type="text"
                      {...register("judicialSuccessPercentage")}
                      placeholder="Ex: 30"
                    />
                    {errors.judicialSuccessPercentage && (
                      <p className="text-red-500 text-sm">
                        {errors.judicialSuccessPercentage.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-1/2">
                    <Label htmlFor="judicialFutureInstallments">
                      Qtd. Parcelas Vincendas
                    </Label>
                    <Input
                      id="judicialFutureInstallments"
                      type="text"
                      {...register("judicialFutureInstallments")}
                      placeholder="Ex: 12"
                    />
                    {errors.judicialFutureInstallments && (
                      <p className="text-red-500 text-sm">
                        {errors.judicialFutureInstallments.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Divider />

              <div className="space-y-4">
                <div className="flex flex-row gap-[15px] items-start">
                  <div className="space-y-2 w-1/2">
                    <Label
                      htmlFor="documentLocation"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Cidade de Emissão do Documento
                    </Label>
                    <Input
                      id="documentLocation"
                      type="text"
                      {...register("documentLocation")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.documentLocation ? "border-red-500" : ""
                      }`}
                      placeholder="Ex: Barueri"
                    />
                    {errors.documentLocation && (
                      <p className="text-red-500 text-sm">
                        {errors.documentLocation.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-1/2">
                    <Label
                      htmlFor="documentDate"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Data de Emissão
                    </Label>
                    <Input
                      id="documentDate"
                      type="date"
                      {...register("documentDate")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.documentDate ? "border-red-500" : ""
                      }`}
                    />
                    {errors.documentDate && (
                      <p className="text-red-500 text-sm">
                        {errors.documentDate.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-center gap-5 pt-5">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-[194px] bg-[#529FF6] font-bold hover:bg-blue-700 text-white py-5 md:py-6 text-[15px] md:text-[15] rounded-[8px] cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    "Finalizar documento"
                  )}
                </Button>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  className="w-[177px] bg-[#fff] border-1 border-[#DDB100] font-bold hover:bg-[#DDB000] hover:text-white text-[#DDB000] py-5 md:py-6 text-[15px] md:text-[15] rounded-[8px] cursor-pointer"
                >
                  Limpar formulário
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
