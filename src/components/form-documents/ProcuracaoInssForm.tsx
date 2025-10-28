"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Controller, Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "../ui/checkbox";
import { useEffect, useState } from "react";
import { ClientType, Documento } from "@/pages/dashboard/index";
import Api, { ApiErrorResponse } from "@/api";
import { useGenerateDocument } from "@/contexts/GenerateContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const procuracaoSchema = yup.object({
  grantorName: yup
    .string()
    .min(3, "Nome deve ter ao menos 3 caracteres")
    .required("Nome completo é obrigatório"),
  grantorNationality: yup
    .string()
    .min(3, "Nacionalidade deve ter ao menos 3 caracteres")
    .required("Nacionalidade é obrigatória"),
  grantorMaritalStatus: yup
    .string()
    .min(5, "Estado civil deve ter ao menos 5 caracteres")
    .required("Estado civil é obrigatório"),
  grantorIdentity: yup
    .string()
    .min(5, "Identidade deve ter ao menos 5 caracteres")
    .required("Identidade é obrigatória"),
  grantorProfession: yup
    .string()
    .min(3, "Profissão deve ter ao menos 3 caracteres")
    .required("Profissão é obrigatória"),
  grantorAddress: yup
    .string()
    .min(5, "Endereço deve ter ao menos 5 caracteres")
    .required("Endereço é obrigatório"),
  grantorNumber: yup
    .string()
    .min(1, "Número deve ter ao menos 1 caractere")
    .required("Número é obrigatório"),
  grantorComplement: yup.string(),
  grantorNeighborhood: yup
    .string()
    .min(3, "Bairro deve ter ao menos 3 caracteres")
    .required("Bairro é obrigatório"),
  grantorCity: yup
    .string()
    .min(2, "Cidade deve ter ao menos 2 caracteres")
    .required("Cidade é obrigatória"),
  grantorState: yup
    .string()
    .min(2, "Estado deve ter ao menos 2 caracteres")
    .required("Estado é obrigatório"),
  grantorZipCode: yup
    .string()
    .required("CEP é obrigatório")
    .matches(/^\d{5}-?\d{3}$/, "CEP deve estar no formato 00000-000"),

  granteeName: yup
    .string()
    .min(3, "Nome deve ter ao menos 3 caracteres")
    .required("Nome completo é obrigatório"),
  granteeNationality: yup
    .string()
    .min(3, "Nacionalidade deve ter ao menos 3 caracteres")
    .required("Nacionalidade é obrigatória"),
  granteeMaritalStatus: yup
    .string()
    .min(5, "Estado civil deve ter ao menos 5 caracteres")
    .required("Estado civil é obrigatório"),
  granteeIdentity: yup
    .string()
    .min(5, "Identidade deve ter ao menos 5 caracteres")
    .required("Identidade é obrigatória"),
  granteeProfession: yup
    .string()
    .min(3, "Profissão deve ter ao menos 3 caracteres")
    .required("Profissão é obrigatória"),
  granteeAddress: yup
    .string()
    .min(5, "Endereço deve ter ao menos 5 caracteres")
    .required("Endereço é obrigatório"),
  granteeNumber: yup
    .string()
    .min(1, "Número deve ter ao menos 1 caractere")
    .required("Número é obrigatório"),
  granteeComplement: yup.string(),
  granteeNeighborhood: yup
    .string()
    .min(3, "Bairro deve ter ao menos 3 caracteres")
    .required("Bairro é obrigatório"),
  granteeCity: yup
    .string()
    .min(2, "Cidade deve ter ao menos 2 caracteres")
    .required("Cidade é obrigatória"),
  granteeState: yup
    .string()
    .min(2, "Estado deve ter ao menos 2 caracteres")
    .required("Estado é obrigatório"),
  granteeZipCode: yup
    .string()
    .required("CEP é obrigatório")
    .matches(/^\d{5}-?\d{3}$/, "CEP deve estar no formato 00000-000"),

  registerPasswordInternet: yup.boolean(),
  proofOfLifeBanking: yup.boolean(),
  receivePaymentsInability: yup.boolean(),
  receivePaymentsTravelWithinCountry: yup.boolean(),
  travelWithinCountryPeriod: yup
    .string()
    .when("receivePaymentsTravelWithinCountry", {
      is: true,
      then: (schema) => schema.required("O período da viagem é obrigatório."),
      otherwise: (schema) => schema.notRequired(),
    }),
  receivePaymentsTravelAbroad: yup.boolean(),
  travelAbroadPeriod: yup.string().when("receivePaymentsTravelAbroad", {
    is: true,
    then: (schema) => schema.required("O período da viagem é obrigatório."),
    otherwise: (schema) => schema.notRequired(),
  }),
  receivePaymentsResidenceAbroad: yup.boolean(),
  residenceAbroadCountry: yup.string().when("receivePaymentsResidenceAbroad", {
    is: true,
    then: (schema) => schema.required("O país de residência é obrigatório."),
    otherwise: (schema) => schema.notRequired(),
  }),
  requestBenefits: yup.boolean(),
  otherRequest: yup.boolean(),
  otherRequestDescription: yup.string().when("otherRequest", {
    is: true,
    then: (schema) =>
      schema.required("A descrição do requerimento é obrigatória."),
    otherwise: (schema) => schema.notRequired(),
  }),
  location: yup.string().required("O local é obrigatório"),
  date: yup.string().required("A data é obrigatória"),
});

type ProcuracaoFormData = yup.InferType<typeof procuracaoSchema>;
type ProcuracaoResolver = Resolver<ProcuracaoFormData>;

interface ProcuracaoInssFormProps {
  client?: ClientType | null;
  idForm?: string;
  documents?: Documento[];
}

export default function ProcuracaoInssForm({
  client,
  idForm,
  documents,
}: ProcuracaoInssFormProps) {
  console.log("🚀 ~ ProcuracaoInssForm ~ documents:", documents);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<ProcuracaoFormData>({
    resolver: yupResolver(procuracaoSchema) as ProcuracaoResolver,
    mode: "onChange",
    defaultValues: {
      registerPasswordInternet: false,
      proofOfLifeBanking: false,
      receivePaymentsInability: false,
      receivePaymentsTravelWithinCountry: false,
      receivePaymentsTravelAbroad: false,
      receivePaymentsResidenceAbroad: false,
      requestBenefits: false,
      otherRequest: false,
      travelWithinCountryPeriod: "",
      travelAbroadPeriod: "",
      residenceAbroadCountry: "",
      otherRequestDescription: "",
    },
  });

  const watchTravelWithinCountry = watch("receivePaymentsTravelWithinCountry");
  const watchTravelAbroad = watch("receivePaymentsTravelAbroad");
  const watchResidenceAbroad = watch("receivePaymentsResidenceAbroad");
  const watchOtherRequest = watch("otherRequest");

  const { generatedDocument } = useGenerateDocument();

  useEffect(() => {
    if (client) {
      setValue("grantorName", client.name || "");
      setValue("grantorNationality", client.nationality || "");
      setValue("grantorMaritalStatus", client.maritalStatus || "");
      setValue("grantorIdentity", client.rg || "");
      setValue("grantorProfession", client.occupation || "");

      setValue("grantorAddress", client.address || "");
    }
  }, [client, setValue]);

  const onSubmit = async (data: ProcuracaoFormData) => {
    setIsSubmitting(true);
    const bodyData = {
      grantor: {
        name: data.grantorName,
        nationality: data.grantorNationality,
        maritalStatus: data.grantorMaritalStatus,
        identity: data.grantorIdentity,
        profession: data.grantorProfession,
        address: data.grantorAddress,
        number: data.grantorNumber,
        complement: data.grantorComplement,
        neighborhood: data.grantorNeighborhood,
        city: data.grantorCity,
        state: data.grantorState,
        zipCode: data.grantorZipCode,
      },
      grantee: {
        name: data.granteeName,
        nationality: data.granteeNationality,
        maritalStatus: data.granteeMaritalStatus,
        identity: data.granteeIdentity,
        profession: data.granteeProfession,
        address: data.granteeAddress,
        number: data.granteeNumber,
        complement: data.granteeComplement,
        neighborhood: data.granteeNeighborhood,
        city: data.granteeCity,
        state: data.granteeState,
        zipCode: data.granteeZipCode,
      },

      registerPasswordInternet: data.registerPasswordInternet,
      proofOfLifeBanking: data.proofOfLifeBanking,
      receivePaymentsInability: data.receivePaymentsInability,
      receivePaymentsTravelWithinCountry:
        data.receivePaymentsTravelWithinCountry,
      travelWithinCountryPeriod: data.travelWithinCountryPeriod,
      receivePaymentsTravelAbroad: data.receivePaymentsTravelAbroad,
      travelAbroadPeriod: data.travelAbroadPeriod,
      receivePaymentsResidenceAbroad: data.receivePaymentsResidenceAbroad,
      residenceAbroadCountry: data.residenceAbroadCountry,
      requestBenefits: data.requestBenefits,
      otherRequest: data.otherRequest,
      otherRequestDescription: data.otherRequestDescription,
      location: data.location,
      date: data.date,
      templateId: idForm,
    };

    try {
      const body = {
        clientId: client?.id,
        templateId: idForm,
        extraData: bodyData,
      };
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

  return (
    <div className="min-h-screen p-6 md:p-0 w-[100%] ">
      <div className=" max-w-[1200px] w-full mx-auto">
        <Card className="p-0 border-none shadow-none gap-4 ">
          <CardHeader className="text-[#529FF6] font-[700] text-[24px] px-0">
            Procuração INSS{" "}
          </CardHeader>

          <CardContent className="px-0">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 flex flex-col gap-[40px] "
            >
              <div className="space-y-4">
                <p className=" text-[#1C3552] text-[18px] font-[600] ">
                  Dados do outorgante (segurado/dependente)
                </p>
                <div className="space-y-2">
                  <Label
                    htmlFor="grantorName"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Nome completo
                  </Label>
                  <Input
                    id="grantorName"
                    type="text"
                    {...register("grantorName")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.grantorName ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.grantorName && (
                    <p className="text-red-500 text-sm">
                      {errors.grantorName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="grantorNationality"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Nacionalidade{" "}
                  </Label>
                  <Input
                    id="grantorNationality"
                    type="text"
                    {...register("grantorNationality")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.grantorNationality ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.grantorNationality && (
                    <p className="text-red-500 text-sm">
                      {errors.grantorNationality.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="grantorMaritalStatus"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Estado Civil
                  </Label>
                  <Input
                    id="grantorMaritalStatus"
                    type="text"
                    {...register("grantorMaritalStatus")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.grantorMaritalStatus ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.grantorMaritalStatus && (
                    <p className="text-red-500 text-sm">
                      {errors.grantorMaritalStatus.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="grantorIdentity"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Identidade
                  </Label>
                  <Input
                    id="grantorIdentity"
                    type="text"
                    {...register("grantorIdentity")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.grantorIdentity ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.grantorIdentity && (
                    <p className="text-red-500 text-sm">
                      {errors.grantorIdentity.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="grantorProfession"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Profissão
                  </Label>
                  <Input
                    id="grantorProfession"
                    type="text"
                    {...register("grantorProfession")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.grantorProfession ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.grantorProfession && (
                    <p className="text-red-500 text-sm">
                      {errors.grantorProfession.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="grantorAddress"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Endereço
                  </Label>
                  <Input
                    id="grantorAddress"
                    type="text"
                    {...register("grantorAddress")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.grantorAddress ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.grantorAddress && (
                    <p className="text-red-500 text-sm">
                      {errors.grantorAddress.message}
                    </p>
                  )}
                </div>
                <div className="flex  flex-row gap-[15px] items-start ">
                  <div className="space-y-2 w-[20%] ">
                    <Label
                      htmlFor="grantorNumber"
                      className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                    >
                      Número
                    </Label>
                    <Input
                      id="grantorNumber"
                      type="text"
                      {...register("grantorNumber")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.grantorNumber ? "border-red-500" : ""
                      }`}
                      placeholder="Digite aqui..."
                    />
                    {errors.grantorNumber && (
                      <p className="text-red-500 text-sm">
                        {errors.grantorNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-[40%] ">
                    <Label
                      htmlFor="grantorComplement"
                      className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                    >
                      Complemento
                    </Label>
                    <Input
                      id="grantorComplement"
                      type="text"
                      {...register("grantorComplement")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.grantorComplement ? "border-red-500" : ""
                      }`}
                      placeholder="Digite aqui..."
                    />
                    {errors.grantorComplement && (
                      <p className="text-red-500 text-sm">
                        {errors.grantorComplement.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-[40%] ">
                    <Label
                      htmlFor="grantorNeighborhood"
                      className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
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
                      placeholder="Digite aqui..."
                    />
                    {errors.grantorNeighborhood && (
                      <p className="text-red-500 text-sm">
                        {errors.grantorNeighborhood.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex  flex-row gap-[15px] items-start ">
                  <div className="space-y-2 w-[30%] ">
                    <Label
                      htmlFor="grantorCity"
                      className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
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
                      placeholder="Digite aqui..."
                    />
                    {errors.grantorCity && (
                      <p className="text-red-500 text-sm">
                        {errors.grantorCity.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-[20%] ">
                    <Label
                      htmlFor="grantorState"
                      className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
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
                      placeholder="Digite aqui..."
                    />
                    {errors.grantorState && (
                      <p className="text-red-500 text-sm">
                        {errors.grantorState.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-[50%] ">
                    <Label
                      htmlFor="grantorZipCode"
                      className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
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

              <div className="space-y-4">
                <p className=" text-[#1C3552] text-[18px] font-[600] ">
                  Dados do outorgado (procurador){" "}
                </p>
                <div className="space-y-2">
                  <Label
                    htmlFor="granteeName"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Nome completo
                  </Label>
                  <Input
                    id="granteeName"
                    type="text"
                    {...register("granteeName")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.granteeName ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.granteeName && (
                    <p className="text-red-500 text-sm">
                      {errors.granteeName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="granteeNationality"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Nacionalidade{" "}
                  </Label>
                  <Input
                    id="granteeNationality"
                    type="text"
                    {...register("granteeNationality")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.granteeNationality ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.granteeNationality && (
                    <p className="text-red-500 text-sm">
                      {errors.granteeNationality.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="granteeMaritalStatus"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Estado Civil
                  </Label>
                  <Input
                    id="granteeMaritalStatus"
                    type="text"
                    {...register("granteeMaritalStatus")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.granteeMaritalStatus ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.granteeMaritalStatus && (
                    <p className="text-red-500 text-sm">
                      {errors.granteeMaritalStatus.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="granteeIdentity"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Identidade
                  </Label>
                  <Input
                    id="granteeIdentity"
                    type="text"
                    {...register("granteeIdentity")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.granteeIdentity ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.granteeIdentity && (
                    <p className="text-red-500 text-sm">
                      {errors.granteeIdentity.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="granteeProfession"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Profissão
                  </Label>
                  <Input
                    id="granteeProfession"
                    type="text"
                    {...register("granteeProfession")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.granteeProfession ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.granteeProfession && (
                    <p className="text-red-500 text-sm">
                      {errors.granteeProfession.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="granteeAddress"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Endereço
                  </Label>
                  <Input
                    id="granteeAddress"
                    type="text"
                    {...register("granteeAddress")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.granteeAddress ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.granteeAddress && (
                    <p className="text-red-500 text-sm">
                      {errors.granteeAddress.message}
                    </p>
                  )}
                </div>
                <div className="flex  flex-row gap-[15px] items-start ">
                  <div className="space-y-2 w-[20%] ">
                    <Label
                      htmlFor="granteeNumber"
                      className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                    >
                      Número
                    </Label>
                    <Input
                      id="granteeNumber"
                      type="text"
                      {...register("granteeNumber")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.granteeNumber ? "border-red-500" : ""
                      }`}
                      placeholder="Digite aqui..."
                    />
                    {errors.granteeNumber && (
                      <p className="text-red-500 text-sm">
                        {errors.granteeNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-[40%] ">
                    <Label
                      htmlFor="granteeComplement"
                      className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                    >
                      Complemento
                    </Label>
                    <Input
                      id="granteeComplement"
                      type="text"
                      {...register("granteeComplement")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.granteeComplement ? "border-red-500" : ""
                      }`}
                      placeholder="Digite aqui..."
                    />
                    {errors.granteeComplement && (
                      <p className="text-red-500 text-sm">
                        {errors.granteeComplement.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-[40%] ">
                    <Label
                      htmlFor="granteeNeighborhood"
                      className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                    >
                      Bairro
                    </Label>
                    <Input
                      id="granteeNeighborhood"
                      type="text"
                      {...register("granteeNeighborhood")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.granteeNeighborhood ? "border-red-500" : ""
                      }`}
                      placeholder="Digite aqui..."
                    />
                    {errors.granteeNeighborhood && (
                      <p className="text-red-500 text-sm">
                        {errors.granteeNeighborhood.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex  flex-row gap-[15px] items-start ">
                  <div className="space-y-2 w-[30%] ">
                    <Label
                      htmlFor="granteeCity"
                      className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                    >
                      Cidade
                    </Label>
                    <Input
                      id="granteeCity"
                      type="text"
                      {...register("granteeCity")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.granteeCity ? "border-red-500" : ""
                      }`}
                      placeholder="Digite aqui..."
                    />
                    {errors.granteeCity && (
                      <p className="text-red-500 text-sm">
                        {errors.granteeCity.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-[20%] ">
                    <Label
                      htmlFor="granteeState"
                      className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                    >
                      Estado
                    </Label>
                    <Input
                      id="granteeState"
                      type="text"
                      {...register("granteeState")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.granteeState ? "border-red-500" : ""
                      }`}
                      placeholder="Digite aqui..."
                    />
                    {errors.granteeState && (
                      <p className="text-red-500 text-sm">
                        {errors.granteeState.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-[50%] ">
                    <Label
                      htmlFor="granteeZipCode"
                      className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                    >
                      CEP
                    </Label>
                    <Input
                      id="granteeZipCode"
                      type="text"
                      {...register("granteeZipCode")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.granteeZipCode ? "border-red-500" : ""
                      }`}
                      placeholder="00000-000"
                    />
                    {errors.granteeZipCode && (
                      <p className="text-red-500 text-sm">
                        {errors.granteeZipCode.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-row items-center gap-2">
                  <Controller
                    name="registerPasswordInternet"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="registerPasswordInternet"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className=" border-1 border-[#A7A7A7] rounded-[0px] "
                      />
                    )}
                  />
                  <Label
                    htmlFor="registerPasswordInternet"
                    className="text-[14px] text-[#1C3552] font-[300]"
                  >
                    Cadastro de senha para informações previdenciárias pela
                    internet.
                  </Label>
                </div>

                <div className="flex flex-row items-center gap-2">
                  <Controller
                    name="proofOfLifeBanking"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="proofOfLifeBanking"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className=" border-1 border-[#A7A7A7] rounded-[0px] "
                      />
                    )}
                  />
                  <Label
                    htmlFor="proofOfLifeBanking"
                    className="text-[14px] text-[#1C3552] font-[300]"
                  >
                    Comprovação de vida junto à rede bancária.
                  </Label>
                </div>

                <p className="text-[14px] text-[#1C3552] font-[300]">
                  Receber mensalidades de benefícios, receber quantias atrasadas
                  e firmar os respectivos recibos, devido à:
                </p>

                <div className="space-y-4 ml-6">
                  <div className="flex flex-row items-center gap-2">
                    <Controller
                      name="receivePaymentsInability"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="receivePaymentsInability"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className=" border-1 border-[#A7A7A7] rounded-[0px] "
                        />
                      )}
                    />
                    <Label
                      htmlFor="receivePaymentsInability"
                      className="text-[14px] text-[#1C3552] font-[300]"
                    >
                      incapacidade do outorgante em se locomover ou ser portador
                      de moléstia contagiosa.
                    </Label>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex flex-row items-center gap-2">
                      <Controller
                        name="receivePaymentsTravelWithinCountry"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="receivePaymentsTravelWithinCountry"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className=" border-1 border-[#A7A7A7] rounded-[0px] "
                          />
                        )}
                      />
                      <Label
                        htmlFor="receivePaymentsTravelWithinCountry"
                        className="text-[14px] text-[#1C3552] font-[300]"
                      >
                        ausência devido à viagem dentro do país pelo período de:
                      </Label>
                      <Input
                        id="travelWithinCountryPeriod"
                        type="text"
                        {...register("travelWithinCountryPeriod")}
                        disabled={!watchTravelWithinCountry}
                        className={`w-full max-w-[300px] p-[0px] md:p-[0px] text-[15] md:text-[15px] border-0 shadow-none border-b-1 border-black rounded-none placeholder:text-[#CCCCCC] placeholder:italic disabled:bg-gray-100 disabled:cursor-not-allowed ${
                          errors.travelWithinCountryPeriod
                            ? "border-red-500"
                            : ""
                        }`}
                        placeholder="Digite o período..."
                      />
                    </div>
                    {errors.travelWithinCountryPeriod && (
                      <p className="text-red-500 text-sm mt-1 ml-6">
                        {errors.travelWithinCountryPeriod.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex flex-row items-center gap-2">
                      <Controller
                        name="receivePaymentsTravelAbroad"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="receivePaymentsTravelAbroad"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className=" border-1 border-[#A7A7A7] rounded-[0px] "
                          />
                        )}
                      />
                      <Label
                        htmlFor="receivePaymentsTravelAbroad"
                        className="text-[14px] text-[#1C3552] font-[300]"
                      >
                        ausência devido à viagem ao exterior pelo período de:
                      </Label>
                      <Input
                        id="travelAbroadPeriod"
                        type="text"
                        {...register("travelAbroadPeriod")}
                        disabled={!watchTravelAbroad}
                        className={`w-full max-w-[300px] p-[0px] md:p-[0px] text-[15] md:text-[15px] border-0 shadow-none border-b-1 border-black rounded-none placeholder:text-[#CCCCCC] placeholder:italic disabled:bg-gray-100 disabled:cursor-not-allowed ${
                          errors.travelAbroadPeriod ? "border-red-500" : ""
                        }`}
                        placeholder="Digite o período..."
                      />
                    </div>
                    {errors.travelAbroadPeriod && (
                      <p className="text-red-500 text-sm mt-1 ml-6">
                        {errors.travelAbroadPeriod.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex flex-row items-center gap-2">
                      <Controller
                        name="receivePaymentsResidenceAbroad"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="receivePaymentsResidenceAbroad"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className=" border-1 border-[#A7A7A7] rounded-[0px] "
                          />
                        )}
                      />
                      <Label
                        htmlFor="receivePaymentsResidenceAbroad"
                        className="text-[14px] text-[#1C3552] font-[300]"
                      >
                        residência no exterior. Qual país?
                      </Label>
                      <Input
                        id="residenceAbroadCountry"
                        type="text"
                        {...register("residenceAbroadCountry")}
                        disabled={!watchResidenceAbroad}
                        className={`w-full max-w-[300px] p-[0px] md:p-[0px] text-[15] md:text-[15px] border-0 shadow-none border-b-1 border-black rounded-none placeholder:text-[#CCCCCC] placeholder:italic disabled:bg-gray-100 disabled:cursor-not-allowed ${
                          errors.residenceAbroadCountry ? "border-red-500" : ""
                        }`}
                        placeholder="Digite o país..."
                      />
                    </div>
                    {errors.residenceAbroadCountry && (
                      <p className="text-red-500 text-sm mt-1 ml-6">
                        {errors.residenceAbroadCountry.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-row items-center gap-2">
                  <Controller
                    name="requestBenefits"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="requestBenefits"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className=" border-1 border-[#A7A7A7] rounded-[0px] "
                      />
                    )}
                  />
                  <Label
                    htmlFor="requestBenefits"
                    className="text-[14px] text-[#1C3552] font-[300]"
                  >
                    Requerer benefícios, revisão e interpor recursos.
                  </Label>
                </div>

                <div className="flex flex-col">
                  <div className="flex flex-row items-center gap-2">
                    <Controller
                      name="otherRequest"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="otherRequest"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className=" border-1 border-[#A7A7A7] rounded-[0px] "
                        />
                      )}
                    />
                    <Label
                      htmlFor="otherRequest"
                      className="text-[14px] text-[#1C3552] font-[300]"
                    >
                      requerer:
                    </Label>
                    <Input
                      id="otherRequestDescription"
                      type="text"
                      {...register("otherRequestDescription")}
                      disabled={!watchOtherRequest}
                      className={`w-full max-w-[400px] p-[0px] md:p-[0px] text-[15] md:text-[15px] border-0 shadow-none border-b-1 border-black rounded-none placeholder:text-[#CCCCCC] placeholder:italic disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        errors.otherRequestDescription ? "border-red-500" : ""
                      }`}
                      placeholder="Especifique o requerimento..."
                    />
                  </div>
                  {errors.otherRequestDescription && (
                    <p className="text-red-500 text-sm mt-1 ml-6">
                      {errors.otherRequestDescription.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 pt-4">
                  <div className="flex flex-row items-center gap-2 w-full md:w-1/2">
                    <Label
                      htmlFor="location"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Local:
                    </Label>
                    <div className="w-full">
                      <Input
                        id="location"
                        type="text"
                        {...register("location")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.location ? "border-red-500" : ""
                        }`}
                        placeholder="Cidade"
                      />
                      {errors.location && (
                        <p className="text-red-500 text-sm">
                          {errors.location.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-2 w-full md:w-1/2">
                    <Label
                      htmlFor="date"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Data:
                    </Label>
                    <div className="w-full">
                      <Input
                        id="date"
                        type="date"
                        {...register("date")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.date ? "border-red-500" : ""
                        }`}
                      />
                      {errors.date && (
                        <p className="text-red-500 text-sm">
                          {errors.date.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className=" flex flex-row items-center gap-5 ">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-[194px] bg-[#529FF6] font-bold hover:bg-blue-700 text-white py-5 md:py-6 text-[15px] md:text-[15] rounded-[8px] disabled:opacity-50"
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
                  className="w-[177px] bg-[#fff]   border-1 border-[#DDB100] font-bold hover:bg-[#DDB000] hover:text-white  text-[#DDB000] py-5 md:py-6 text-[15px] md:text-[15] rounded-[8px]"
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
