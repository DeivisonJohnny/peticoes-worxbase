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
import { Textarea } from "../ui/textarea";
import { ClientType, Documento } from "@/pages/dashboard";
import { useEffect, useState } from "react";
import Api, { ApiErrorResponse } from "@/api";
import { toast } from "sonner";
import { useGenerateDocument } from "@/contexts/GenerateContext";
import { Loader2 } from "lucide-react";

const LoasDeficienciaSchema = yup.object({
  jurisdiction: yup.string().required("O foro é obrigatório"),

  fullName: yup
    .string()
    .min(3, "O nome completo deve ter ao menos 3 caracteres")
    .required("O nome completo é obrigatório"),
  nationality: yup.string().required("A nacionalidade é obrigatória"),
  cpf: yup
    .string()
    .required("O CPF é obrigatório")
    .test("cpf-valid", "CPF inválido", (value) =>
      Util.validateCpfOrCnpj(value || "")
    ),
  rg: yup.string().required("O RG é obrigatório"),

  street: yup.string().required("O logradouro é obrigatório"),
  number: yup.string().required("O número é obrigatório"),
  neighborhood: yup.string().required("O bairro é obrigatório"),
  city: yup.string().required("A cidade é obrigatória"),
  state: yup.string().required("O estado é obrigatório"),
  zipCode: yup.string().required("O CEP é obrigatório"),

  legalRequirements: yup
    .string()
    .required("Os requisitos legais são obrigatórios"),
  legalFoundation: yup.string().required("A fundamentação legal é obrigatória"),
  deniedBenefitNumber: yup
    .string()
    .required("O número do benefício é obrigatório"),
  der: yup.string().required("A DER é obrigatória"),
  denialReason: yup.string().required("A razão do indeferimento é obrigatória"),

  illness: yup.string().required("A doença/enfermidade é obrigatória"),
  resultingLimitations: yup.string().required("As limitações são obrigatórias"),
  mainSymptoms: yup.string().required("Os sintomas são obrigatórios"),
  occupation: yup.string().required("A ocupação é obrigatória"),
  summaryDescription: yup
    .string()
    .required("A descrição sumária é obrigatória"),
  generalWorkConditions: yup
    .string()
    .required("As condições de serviço são obrigatórias"),

  caseValue: yup.string().required("O valor da causa é obrigatório"),
  jurisdictionCompetenceClause: yup
    .string()
    .required("O trecho sobre competência é obrigatório"),
  waiverClause: yup.string().required("O trecho de renúncia é obrigatório"),

  expertSpecialty: yup
    .string()
    .required("A especialidade da perícia é obrigatória"),
  medicalDiagnosis: yup.string().required("O diagnóstico médico é obrigatório"),
  workCapacityConclusion: yup
    .string()
    .required("A conclusão sobre capacidade é obrigatória"),
  benefitRequestDate: yup.string().required("A data do pedido é obrigatória"),

  requiredBenefitNumber: yup.string().required("O NB é obrigatório"),
});

type BpcLoasFormData = yup.InferType<typeof LoasDeficienciaSchema>;
type BpcLoasResolver = Resolver<BpcLoasFormData>;

interface AuxilioDoencaProps {
  client?: ClientType | null;
  idForm?: string;
  documents?: Documento[];
}

export default function AuxilioDoenca({ client, idForm }: AuxilioDoencaProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { generatedDocument } = useGenerateDocument();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BpcLoasFormData>({
    resolver: yupResolver(LoasDeficienciaSchema) as BpcLoasResolver,
    mode: "onChange",
  });

  useEffect(() => {
    if (client) {
      setValue("fullName", client.name || "");
      setValue("nationality", client.nationality || "");
      setValue("cpf", client.cpf || "");
      setValue("rg", client.rg || "");
      setValue("occupation", client.occupation || "");
      // O endereço do cliente é uma string única, preenchendo o campo de rua.
      setValue("street", client.address || "");
    }
  }, [client, setValue]);

  const onSubmit = async (data: BpcLoasFormData) => {
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
    setValue("cpf", formattedCpf, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen p-6 md:p-0 w-[100%]">
      <div className="max-w-[1200px] w-full mx-auto">
        <Card className="p-0 border-none shadow-none gap-3">
          <CardHeader className="text-[#529FF6] font-[700] text-[24px] px-0">
            Petição Inicial BPC-LOAS
          </CardHeader>
          <CardContent className="px-0">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 flex flex-col gap-[40px]"
            >
              <div className="space-y-2">
                <div className="space-y-2 w-1/2">
                  <Label
                    htmlFor="jurisdiction"
                    className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                  >
                    Foro
                  </Label>
                  <Input
                    id="jurisdiction"
                    type="text"
                    {...register("jurisdiction")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.jurisdiction ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.jurisdiction && (
                    <p className="text-red-500 text-sm">
                      {errors.jurisdiction.message}
                    </p>
                  )}
                </div>
              </div>

              <Divider />

              <div className="space-y-4">
                <div className="flex flex-row gap-[15px] items-start">
                  <div className="space-y-2 w-[40%]">
                    <Label
                      htmlFor="fullName"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Nome Completo
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      {...register("fullName")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.fullName ? "border-red-500" : ""
                      }`}
                      placeholder="Digite o nome completo..."
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-[30%]">
                    <Label
                      htmlFor="nationality"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Nacionalidade
                    </Label>
                    <Input
                      id="nationality"
                      type="text"
                      {...register("nationality")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.nationality ? "border-red-500" : ""
                      }`}
                      placeholder="Ex: Brasileira"
                    />
                    {errors.nationality && (
                      <p className="text-red-500 text-sm">
                        {errors.nationality.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-row gap-[15px] items-start">
                  <div className="space-y-2 w-[33%]">
                    <Label
                      htmlFor="cpf"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      CPF
                    </Label>
                    <Input
                      id="cpf"
                      type="text"
                      {...register("cpf")}
                      onChange={handleCpfChange}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.cpf ? "border-red-500" : ""
                      }`}
                      placeholder="000.000.000-00"
                    />
                    {errors.cpf && (
                      <p className="text-red-500 text-sm">
                        {errors.cpf.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-[33%]">
                    <Label
                      htmlFor="rg"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      RG
                    </Label>
                    <Input
                      id="rg"
                      type="text"
                      {...register("rg")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.rg ? "border-red-500" : ""
                      }`}
                      placeholder="00.000.000-0"
                    />
                    {errors.rg && (
                      <p className="text-red-500 text-sm">
                        {errors.rg.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-row gap-[15px] items-start">
                  <div className="space-y-2 w-[60%]">
                    <Label
                      htmlFor="street"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Logradouro
                    </Label>
                    <Input
                      id="street"
                      type="text"
                      {...register("street")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.street ? "border-red-500" : ""
                      }`}
                      placeholder="Rua, Avenida..."
                    />
                    {errors.street && (
                      <p className="text-red-500 text-sm">
                        {errors.street.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-[40%]">
                    <Label
                      htmlFor="number"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Número
                    </Label>
                    <Input
                      id="number"
                      type="text"
                      {...register("number")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.number ? "border-red-500" : ""
                      }`}
                      placeholder="Nº"
                    />
                    {errors.number && (
                      <p className="text-red-500 text-sm">
                        {errors.number.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-row gap-[15px] items-start">
                  <div className="space-y-2 w-1/2">
                    <Label
                      htmlFor="neighborhood"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Bairro
                    </Label>
                    <Input
                      id="neighborhood"
                      type="text"
                      {...register("neighborhood")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.neighborhood ? "border-red-500" : ""
                      }`}
                      placeholder="Digite o bairro..."
                    />
                    {errors.neighborhood && (
                      <p className="text-red-500 text-sm">
                        {errors.neighborhood.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-1/2">
                    <Label
                      htmlFor="city"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Cidade
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      {...register("city")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.city ? "border-red-500" : ""
                      }`}
                      placeholder="Digite a cidade..."
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-row gap-[15px] items-start">
                  <div className="space-y-2 w-[30%]">
                    <Label
                      htmlFor="state"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Estado
                    </Label>
                    <Input
                      id="state"
                      type="text"
                      {...register("state")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.state ? "border-red-500" : ""
                      }`}
                      placeholder="UF"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-[70%]">
                    <Label
                      htmlFor="zipCode"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      CEP
                    </Label>
                    <Input
                      id="zipCode"
                      type="text"
                      {...register("zipCode")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.zipCode ? "border-red-500" : ""
                      }`}
                      placeholder="00000-000"
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm">
                        {errors.zipCode.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Divider />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="legalRequirements"
                    className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                  >
                    Requisitos Legais (Art. 129-A)
                  </Label>
                  <Textarea
                    id="legalRequirements"
                    {...register("legalRequirements")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.legalRequirements ? "border-red-500" : ""
                    }`}
                    placeholder="Ex: DO VALOR DA CAUSA E REQUISITOS ART. 129-A NA LEI 8.213/91"
                  />
                  {errors.legalRequirements && (
                    <p className="text-red-500 text-sm">
                      {errors.legalRequirements.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="legalFoundation"
                    className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                  >
                    Fundamentação Legal
                  </Label>
                  <Textarea
                    id="legalFoundation"
                    {...register("legalFoundation")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.legalFoundation ? "border-red-500" : ""
                    }`}
                    placeholder="Ex: Fundamentação sobre o direito ao benefício..."
                  />
                  {errors.legalFoundation && (
                    <p className="text-red-500 text-sm">
                      {errors.legalFoundation.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-row gap-[15px] items-start">
                  <div className="space-y-2 w-1/3">
                    <Label
                      htmlFor="deniedBenefitNumber"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Número do benefício indeferido
                    </Label>
                    <Input
                      id="deniedBenefitNumber"
                      {...register("deniedBenefitNumber")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.deniedBenefitNumber ? "border-red-500" : ""
                      }`}
                      placeholder="Ex: 123.456.789-0"
                    />
                    {errors.deniedBenefitNumber && (
                      <p className="text-red-500 text-sm">
                        {errors.deniedBenefitNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-1/3">
                    <Label
                      htmlFor="der"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      DER
                    </Label>
                    <Input
                      id="der"
                      type="date"
                      {...register("der")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.der ? "border-red-500" : ""
                      }`}
                    />
                    {errors.der && (
                      <p className="text-red-500 text-sm">
                        {errors.der.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-1/3">
                    <Label
                      htmlFor="denialReason"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Data razão indeferimento/ cessação
                    </Label>
                    <Input
                      id="denialReason"
                      type="date"
                      {...register("denialReason")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.denialReason ? "border-red-500" : ""
                      }`}
                      placeholder="Ex: Falta de comprovação da incapacidade"
                    />
                    {errors.denialReason && (
                      <p className="text-red-500 text-sm">
                        {errors.denialReason.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-row gap-[15px] items-start">
                  <div className="space-y-2 w-1/3">
                    <Label
                      htmlFor="illness"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Doença/enfermidade
                    </Label>
                    <Textarea
                      id="illness"
                      {...register("illness")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.illness ? "border-red-500" : ""
                      }`}
                      placeholder="Ex: TRANSTORNOS DE DISCOS INTERVERTEBRAIS E SACROILEÍTE."
                    />
                    {errors.illness && (
                      <p className="text-red-500 text-sm">
                        {errors.illness.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-1/3">
                    <Label
                      htmlFor="resultingLimitations"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Limitações decorrentes
                    </Label>
                    <Textarea
                      id="resultingLimitations"
                      {...register("resultingLimitations")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.resultingLimitations ? "border-red-500" : ""
                      }`}
                      placeholder="Ex: Dor constante a movimentos mínimos."
                    />
                    {errors.resultingLimitations && (
                      <p className="text-red-500 text-sm">
                        {errors.resultingLimitations.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-1/3">
                    <Label
                      htmlFor="mainSymptoms"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Principais Sintomas experimentados
                    </Label>
                    <Textarea
                      id="mainSymptoms"
                      {...register("mainSymptoms")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.mainSymptoms ? "border-red-500" : ""
                      }`}
                      placeholder="Ex: Dor lombar e sacrococcígea de difícil tratamento."
                    />
                    {errors.mainSymptoms && (
                      <p className="text-red-500 text-sm">
                        {errors.mainSymptoms.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-row gap-[15px] items-start">
                  <div className="space-y-2 w-1/3">
                    <Label
                      htmlFor="occupation"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Ocupação
                    </Label>
                    <Input
                      id="occupation"
                      {...register("occupation")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.occupation ? "border-red-500" : ""
                      }`}
                      placeholder="Ex: Diarista"
                    />
                    {errors.occupation && (
                      <p className="text-red-500 text-sm">
                        {errors.occupation.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-1/3">
                    <Label
                      htmlFor="summaryDescription"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Descrição Sumária
                    </Label>
                    <Input
                      id="summaryDescription"
                      {...register("summaryDescription")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.summaryDescription ? "border-red-500" : ""
                      }`}
                      placeholder="Ex: Permanecer por longos períodos em pé..."
                    />
                    {errors.summaryDescription && (
                      <p className="text-red-500 text-sm">
                        {errors.summaryDescription.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-1/3">
                    <Label
                      htmlFor="generalWorkConditions"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Condições gerais do serviço
                    </Label>
                    <Input
                      id="generalWorkConditions"
                      {...register("generalWorkConditions")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.generalWorkConditions ? "border-red-500" : ""
                      }`}
                      placeholder="Ex: Jornada em pé com esforço físico."
                    />
                    {errors.generalWorkConditions && (
                      <p className="text-red-500 text-sm">
                        {errors.generalWorkConditions.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Divider />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="caseValue"
                    className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                  >
                    Valor da causa (R$)
                  </Label>
                  <Input
                    id="caseValue"
                    type="text"
                    {...register("caseValue")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.caseValue ? "border-red-500" : ""
                    }`}
                    placeholder="Ex: R$ 132.911,99"
                  />
                  {errors.caseValue && (
                    <p className="text-red-500 text-sm">
                      {errors.caseValue.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="jurisdictionCompetenceClause"
                    className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                  >
                    Trecho sobre competência (valor da causa)
                  </Label>
                  <Textarea
                    id="jurisdictionCompetenceClause"
                    {...register("jurisdictionCompetenceClause")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.jurisdictionCompetenceClause
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="Ex: a planilha de cálculo anexa demonstra que..."
                  />
                  {errors.jurisdictionCompetenceClause && (
                    <p className="text-red-500 text-sm">
                      {errors.jurisdictionCompetenceClause.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="waiverClause"
                    className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                  >
                    Trecho de Renúncia ao Excedente
                  </Label>
                  <Input
                    id="waiverClause"
                    type="text"
                    {...register("waiverClause")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.waiverClause ? "border-red-500" : ""
                    }`}
                    placeholder="Ex: A parte autora renuncia expressamente..."
                  />
                  {errors.waiverClause && (
                    <p className="text-red-500 text-sm">
                      {errors.waiverClause.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-row gap-[15px] items-start">
                  <div className="space-y-2 w-1/2">
                    <Label
                      htmlFor="medicalDiagnosis"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Diagnóstico Médico
                    </Label>
                    <Input
                      id="medicalDiagnosis"
                      type="text"
                      {...register("medicalDiagnosis")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.medicalDiagnosis ? "border-red-500" : ""
                      }`}
                      placeholder="TRANSTORNOS DE DISCOS INTERVERTEBRAIS E SACROILEÍTE."
                    />
                    {errors.medicalDiagnosis && (
                      <p className="text-red-500 text-sm">
                        {errors.medicalDiagnosis.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-1/2">
                    <Label
                      htmlFor="workCapacityConclusion"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Conclusão sobre Capacidade Laboral
                    </Label>
                    <Input
                      id="workCapacityConclusion"
                      type="text"
                      {...register("workCapacityConclusion")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.workCapacityConclusion ? "border-red-500" : ""
                      }`}
                      placeholder="não tem condições de exercer suas atividades laborais"
                    />
                    {errors.workCapacityConclusion && (
                      <p className="text-red-500 text-sm">
                        {errors.workCapacityConclusion.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-row gap-[15px] items-start">
                  <div className="space-y-2 w-[25%]">
                    <Label
                      htmlFor="benefitRequestDate"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Data do Pedido do Benefício
                    </Label>
                    <Input
                      id="benefitRequestDate"
                      type="date"
                      {...register("benefitRequestDate")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.benefitRequestDate ? "border-red-500" : ""
                      }`}
                    />
                    {errors.benefitRequestDate && (
                      <p className="text-red-500 text-sm">
                        {errors.benefitRequestDate.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-[25%]">
                    <Label
                      htmlFor="requiredBenefitNumber"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Identificação do Benefício (NB)
                    </Label>
                    <Input
                      id="requiredBenefitNumber"
                      type="text"
                      {...register("requiredBenefitNumber")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.requiredBenefitNumber ? "border-red-500" : ""
                      }`}
                      placeholder="639.074.796-2"
                    />
                    {errors.requiredBenefitNumber && (
                      <p className="text-red-500 text-sm">
                        {errors.requiredBenefitNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-[25%]">
                    <Label
                      htmlFor="expertSpecialty"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Especialidade da Perícia
                    </Label>
                    <Input
                      id="expertSpecialty"
                      type="text"
                      {...register("expertSpecialty")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.expertSpecialty ? "border-red-500" : ""
                      }`}
                      placeholder="ORTOPEDIA"
                    />
                    {errors.expertSpecialty && (
                      <p className="text-red-500 text-sm">
                        {errors.expertSpecialty.message}
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
