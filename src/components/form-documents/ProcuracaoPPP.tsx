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
import { ClientType, Documento } from "@/pages/dashboard";
import { useEffect, useState } from "react";
import Api, { ApiErrorResponse } from "@/api";
import { toast } from "sonner";
import { useGenerateDocument } from "@/contexts/GenerateContext";
import { Loader2 } from "lucide-react";

const PppPowerOfAttorneySchema = yup.object({
  grantorFullName: yup
    .string()
    .min(3, "O nome completo deve ter no mínimo 3 caracteres")
    .required("O nome completo é obrigatório"),
  grantorNationality: yup.string().required("A nacionalidade é obrigatória"),
  grantorCpf: yup
    .string()
    .required("O CPF é obrigatório")
    .test("cpf-valid", "CPF inválido", (value) =>
      Util.validateCpfOrCnpj(value || "")
    ),
  grantorStreet: yup.string().required("O logradouro é obrigatório"),
  grantorStreetNumber: yup.string().required("O número é obrigatório"),
  grantorNeighborhood: yup.string().required("O bairro é obrigatório"),
  grantorCity: yup.string().required("A cidade é obrigatória"),
  grantorState: yup.string().required("O estado é obrigatório"),
  grantorZipCode: yup.string().required("O CEP é obrigatório"),
});

type PppPowerOfAttorneyFormData = yup.InferType<
  typeof PppPowerOfAttorneySchema
>;
type PppPowerOfAttorneyResolver = Resolver<PppPowerOfAttorneyFormData>;

interface PppPowerOfAttorneyFormProps {
  client?: ClientType | null;
  idForm?: string;
  documents?: Documento[];
}

export default function PppPowerOfAttorneyForm({
  client,
  idForm,
}: PppPowerOfAttorneyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { generatedDocument } = useGenerateDocument();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PppPowerOfAttorneyFormData>({
    resolver: yupResolver(
      PppPowerOfAttorneySchema
    ) as PppPowerOfAttorneyResolver,
    mode: "onChange",
  });

  useEffect(() => {
    if (client) {
      setValue("grantorFullName", client.name || "");
      setValue("grantorNationality", client.nationality || "");
      setValue("grantorCpf", client.cpf || "");
      setValue("grantorStreet", client.address || "");
    }
  }, [client, setValue]);

  const onSubmit = async (data: PppPowerOfAttorneyFormData) => {
    setIsSubmitting(true);
    const body = {
      clientId: client?.id,
      templateId: idForm,
      extraData: data,
    };

    try {
      const response = await Api.post(
        "/documents/generate",
        body
      ) as { documentId?: string };
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
    setValue("grantorCpf", formattedCpf, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen p-6 md:p-0 w-[100%]">
      <div className="max-w-[1200px] w-full mx-auto">
        <Card className="p-0 border-none shadow-none gap-3">
          <CardHeader className="text-[#529FF6] font-[700] text-[24px] px-0">
            Procuração PPP
          </CardHeader>
          <CardContent className="px-0">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 flex flex-col gap-[40px]"
            >
              <div className="space-y-4">
                <div className="space-y-2 w-full">
                  <Label
                    htmlFor="grantorFullName"
                    className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                  >
                    Nome Completo do Outorgante
                  </Label>
                  <Input
                    id="grantorFullName"
                    type="text"
                    {...register("grantorFullName")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.grantorFullName ? "border-red-500" : ""
                    }`}
                    placeholder="Digite o nome completo..."
                  />
                  {errors.grantorFullName && (
                    <p className="text-red-500 text-sm">
                      {errors.grantorFullName.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-row gap-[15px] items-start">
                  <div className="space-y-2 w-1/2">
                    <Label
                      htmlFor="grantorNationality"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Nacionalidade
                    </Label>
                    <Input
                      id="grantorNationality"
                      type="text"
                      {...register("grantorNationality")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.grantorNationality ? "border-red-500" : ""
                      }`}
                      placeholder="Ex: Brasileiro(a)"
                    />
                    {errors.grantorNationality && (
                      <p className="text-red-500 text-sm">
                        {errors.grantorNationality.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-1/2">
                    <Label
                      htmlFor="grantorCpf"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      CPF
                    </Label>
                    <Input
                      id="grantorCpf"
                      type="text"
                      {...register("grantorCpf")}
                      onChange={handleCpfChange}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.grantorCpf ? "border-red-500" : ""
                      }`}
                      placeholder="000.000.000-00"
                    />
                    {errors.grantorCpf && (
                      <p className="text-red-500 text-sm">
                        {errors.grantorCpf.message}
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
                      htmlFor="grantorStreet"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Logradouro
                    </Label>
                    <Input
                      id="grantorStreet"
                      type="text"
                      {...register("grantorStreet")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.grantorStreet ? "border-red-500" : ""
                      }`}
                      placeholder="Rua, Avenida..."
                    />
                    {errors.grantorStreet && (
                      <p className="text-red-500 text-sm">
                        {errors.grantorStreet.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-[40%]">
                    <Label
                      htmlFor="grantorStreetNumber"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Número
                    </Label>
                    <Input
                      id="grantorStreetNumber"
                      type="text"
                      {...register("grantorStreetNumber")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.grantorStreetNumber ? "border-red-500" : ""
                      }`}
                      placeholder="Nº"
                    />
                    {errors.grantorStreetNumber && (
                      <p className="text-red-500 text-sm">
                        {errors.grantorStreetNumber.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-row gap-[15px] items-start">
                  <div className="space-y-2 w-1/2">
                    <Label
                      htmlFor="grantorNeighborhood"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Bairro
                    </Label>
                    <Input
                      id="grantorNeighborhood"
                      type="text"
                      {...register("grantorNeighborhood")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.grantorNeighborhood ? "border-red-500" : ""
                      }`}
                      placeholder="Digite o bairro..."
                    />
                    {errors.grantorNeighborhood && (
                      <p className="text-red-500 text-sm">
                        {errors.grantorNeighborhood.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-1/2">
                    <Label
                      htmlFor="grantorCity"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Cidade
                    </Label>
                    <Input
                      id="grantorCity"
                      type="text"
                      {...register("grantorCity")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.grantorCity ? "border-red-500" : ""
                      }`}
                      placeholder="Digite a cidade..."
                    />
                    {errors.grantorCity && (
                      <p className="text-red-500 text-sm">
                        {errors.grantorCity.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-row gap-[15px] items-start">
                  <div className="space-y-2 w-[30%]">
                    <Label
                      htmlFor="grantorState"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Estado
                    </Label>
                    <Input
                      id="grantorState"
                      type="text"
                      {...register("grantorState")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.grantorState ? "border-red-500" : ""
                      }`}
                      placeholder="UF"
                    />
                    {errors.grantorState && (
                      <p className="text-red-500 text-sm">
                        {errors.grantorState.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-[70%]">
                    <Label
                      htmlFor="grantorZipCode"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      CEP
                    </Label>
                    <Input
                      id="grantorZipCode"
                      type="text"
                      {...register("grantorZipCode")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.grantorZipCode ? "border-red-500" : ""
                      }`}
                      placeholder="00000-000"
                    />
                    {errors.grantorZipCode && (
                      <p className="text-red-500 text-sm">
                        {errors.grantorZipCode.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-center gap-5">
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
