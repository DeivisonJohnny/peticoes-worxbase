"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Controller, Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "../ui/checkbox";
import Util from "@/utils/Util";
import { useEffect, useState } from "react";
import { ClientType } from "@/pages/dashboard";
import Api, { ApiErrorResponse } from "@/api";
import { toast } from "sonner";
import { useGenerateDocument } from "@/contexts/GenerateContext";
import { Loader2 } from "lucide-react";

const termoRepresentacaoSchema = yup.object({
  representedName: yup
    .string()
    .min(3, "Nome deve ter ao menos 3 caracteres")
    .required("Nome completo é obrigatório"),
  representedCpf: yup
    .string()
    .required("CPF é obrigatório")
    .test("cpf-valid", "CPF inválido", (value) =>
      Util.validateCpfOrCnpj(value || "")
    ),
  representedRg: yup
    .string()
    .min(5, "RG deve ter ao menos 5 caracteres")
    .required("RG é obrigatório"),
  representedAddress: yup
    .string()
    .min(5, "Endereço deve ter ao menos 5 caracteres")
    .required("Endereço é obrigatório"),
  representedCity: yup
    .string()
    .min(3, "Município deve ter ao menos 3 caracteres")
    .required("Município é obrigatório"),
  representedCep: yup
    .string()
    .required("CEP é obrigatório")
    .matches(/^\d{5}-?\d{3}$/, "CEP deve estar no formato 00000-000"),

  attorneyName: yup
    .string()
    .min(3, "Nome do advogado deve ter ao menos 3 caracteres")
    .required("Nome do advogado é obrigatório"),
  attorneyCpf: yup
    .string()
    .required("CPF do advogado é obrigatório")
    .test("cpf-valid", "CPF do advogado inválido", (value) =>
      Util.validateCpfOrCnpj(value || "")
    ),
  attorneyOab: yup.string().required("OAB é obrigatória"),
  attorneyNit: yup.string().required("NIT é obrigatório"),

  retirementAge: yup.boolean().default(false),
  retirementAgeUrban: yup.boolean().default(false),
  retirementAgeRural: yup.boolean().default(false),
  retirementContributionTime: yup.boolean().default(false),
  retirementSpecial: yup.boolean().default(false),
  pensionDeath: yup.boolean().default(false),
  pensionDeathUrban: yup.boolean().default(false),
  pensionDeathRural: yup.boolean().default(false),
  reclusionAid: yup.boolean().default(false),
  reclusionAidUrban: yup.boolean().default(false),
  reclusionAidRural: yup.boolean().default(false),
  maternityPay: yup.boolean().default(false),
  maternityPayUrban: yup.boolean().default(false),
  maternityPayRural: yup.boolean().default(false),
  cadastralUpdate: yup.boolean().default(false),

  location: yup.string().required("Local é obrigatório"),
  documentDate: yup.string().required("Data do documento é obrigatória"),
});

type TermoRepresentacaoFormData = yup.InferType<
  typeof termoRepresentacaoSchema
>;
type TermoRepresentacaoResolver = Resolver<TermoRepresentacaoFormData>;

interface TermoRepresentacaoFormProps {
  client?: ClientType | null;
  idForm?: string;
}

export default function TermoRepresentacaoForm({
  client,
  idForm,
}: TermoRepresentacaoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { generatedDocument } = useGenerateDocument();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<TermoRepresentacaoFormData>({
    resolver: yupResolver(
      termoRepresentacaoSchema
    ) as TermoRepresentacaoResolver,
    mode: "onChange",
    defaultValues: {
      representedName: "",
      representedCpf: "",
      representedRg: "",
      representedAddress: "",
      representedCity: "",
      representedCep: "",
      attorneyName: "",
      attorneyCpf: "",
      attorneyOab: "",
      attorneyNit: "",
      retirementAge: false,
      retirementAgeUrban: false,
      retirementAgeRural: false,
      retirementContributionTime: false,
      retirementSpecial: false,
      pensionDeath: false,
      pensionDeathUrban: false,
      pensionDeathRural: false,
      reclusionAid: false,
      reclusionAidUrban: false,
      reclusionAidRural: false,
      maternityPay: false,
      maternityPayUrban: false,
      maternityPayRural: false,
      cadastralUpdate: false,
      location: "",
      documentDate: "",
    },
  });

  useEffect(() => {
    if (client && "id" in client) {
      setValue("representedName", client.name || "");
      setValue("representedCpf", client.cpf || "");
      setValue("representedRg", client.rg || "");

      if (client.address) {
        const addressParts = client.address.split(", ");
        const street = addressParts[0] || "";
        const number = addressParts[1] || "";
        const neighborhood = addressParts[2] || "";

        const cityStatePart = addressParts[3] || "";
        const cityStateParts = cityStatePart.split(" - ");
        const city = cityStateParts[0]?.trim() || "";
        const state = cityStateParts[1]?.trim() || "";

        // Combina rua, número e bairro para o campo de endereço
        const fullAddress = [street, number, neighborhood].filter(Boolean).join(", ");
        setValue("representedAddress", fullAddress);

        // Combina cidade e estado para o campo de município
        const cityWithState = [city, state].filter(Boolean).join(" - ");
        setValue("representedCity", cityWithState);
      }

      if (client.cep) {
        setValue("representedCep", client.cep);
      }
    }

    setValue("attorneyName", "CELSO DE SOUSA BRITO");
    setValue("attorneyCpf", "254.536.858-09");
    setValue("attorneyOab", "240.574");
    setValue("attorneyNit", "125.153.288-32");
  }, [client, setValue]);

  const onSubmit = async (data: TermoRepresentacaoFormData) => {
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

  const handleCpfChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "representedCpf" | "attorneyCpf"
  ) => {
    const formattedCpf = Util.formatCpfCnpj(e.target.value);
    setValue(fieldName, formattedCpf, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen p-6 md:p-0 w-[100%] ">
      <div className=" max-w-[1200px] w-full mx-auto">
        <Card className="p-0 border-none shadow-none gap-4 ">
          <CardHeader className="text-[#529FF6] font-[700] text-[24px] px-0">
            Termo de Representação
          </CardHeader>

          <CardContent className="px-0">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 flex flex-col gap-[40px] "
            >
              <div className="space-y-2 flex flex-col gap-[20px] ">
                <div className="space-y-2">
                  <p className=" text-[#1C3552] text-[18px] font-[600] ">
                    Dados do Representado(a)
                  </p>
                  <Label
                    htmlFor="representedName"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] cursor-pointer  "
                  >
                    Nome completo
                  </Label>
                  <Input
                    id="representedName"
                    type="text"
                    {...register("representedName")}
                    className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.representedName ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.representedName && (
                    <p className="text-red-500 text-sm">
                      {errors.representedName.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col md:flex-row gap-[15px]">
                  <div className="space-y-2 w-full">
                    <Label
                      htmlFor="representedCpf"
                      className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] cursor-pointer "
                    >
                      CPF
                    </Label>
                    <Input
                      id="representedCpf"
                      type="text"
                      {...register("representedCpf")}
                      onChange={(e) => handleCpfChange(e, "representedCpf")}
                      className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.representedCpf ? "border-red-500" : ""
                      }`}
                      placeholder="000.000.000-00"
                    />
                    {errors.representedCpf && (
                      <p className="text-red-500 text-sm">
                        {errors.representedCpf.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-full">
                    <Label
                      htmlFor="representedRg"
                      className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] cursor-pointer "
                    >
                      RG
                    </Label>
                    <Input
                      id="representedRg"
                      type="text"
                      {...register("representedRg")}
                      className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.representedRg ? "border-red-500" : ""
                      }`}
                      placeholder="Digite aqui..."
                    />
                    {errors.representedRg && (
                      <p className="text-red-500 text-sm">
                        {errors.representedRg.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="representedAddress"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] cursor-pointer "
                  >
                    Residente e domiciliado(a) em
                  </Label>
                  <Input
                    id="representedAddress"
                    type="text"
                    {...register("representedAddress")}
                    className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.representedAddress ? "border-red-500" : ""
                    }`}
                    placeholder="Ex: Rua, Avenida, etc."
                  />
                  {errors.representedAddress && (
                    <p className="text-red-500 text-sm">
                      {errors.representedAddress.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col md:flex-row gap-[15px]">
                  <div className="space-y-2 w-full">
                    <Label
                      htmlFor="representedCity"
                      className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] cursor-pointer "
                    >
                      Município
                    </Label>
                    <Input
                      id="representedCity"
                      type="text"
                      {...register("representedCity")}
                      className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.representedCity ? "border-red-500" : ""
                      }`}
                      placeholder="Digite aqui..."
                    />
                    {errors.representedCity && (
                      <p className="text-red-500 text-sm">
                        {errors.representedCity.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-full">
                    <Label
                      htmlFor="representedCep"
                      className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] cursor-pointer "
                    >
                      CEP
                    </Label>
                    <Input
                      id="representedCep"
                      type="text"
                      {...register("representedCep")}
                      className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.representedCep ? "border-red-500" : ""
                      }`}
                      placeholder="00000-000"
                    />
                    {errors.representedCep && (
                      <p className="text-red-500 text-sm">
                        {errors.representedCep.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2 pt-4">
                  <p className=" text-[#1C3552] text-[18px] font-[600] ">
                    Dados do Advogado(a)
                  </p>
                  <Label
                    htmlFor="attorneyName"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] cursor-pointer "
                  >
                    Nome do Advogado(a)
                  </Label>
                  <Input
                    id="attorneyName"
                    type="text"
                    {...register("attorneyName")}
                    className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.attorneyName ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.attorneyName && (
                    <p className="text-red-500 text-sm">
                      {errors.attorneyName.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col md:flex-row gap-[15px]">
                  <div className="space-y-2 w-full">
                    <Label
                      htmlFor="attorneyCpf"
                      className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] cursor-pointer "
                    >
                      CPF do Advogado(a)
                    </Label>
                    <Input
                      id="attorneyCpf"
                      type="text"
                      {...register("attorneyCpf")}
                      onChange={(e) => handleCpfChange(e, "attorneyCpf")}
                      className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.attorneyCpf ? "border-red-500" : ""
                      }`}
                      placeholder="000.000.000-00"
                    />
                    {errors.attorneyCpf && (
                      <p className="text-red-500 text-sm">
                        {errors.attorneyCpf.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-full">
                    <Label
                      htmlFor="attorneyOab"
                      className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] cursor-pointer "
                    >
                      OAB Nº
                    </Label>
                    <Input
                      id="attorneyOab"
                      type="text"
                      {...register("attorneyOab")}
                      className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.attorneyOab ? "border-red-500" : ""
                      }`}
                      placeholder="Digite aqui..."
                    />
                    {errors.attorneyOab && (
                      <p className="text-red-500 text-sm">
                        {errors.attorneyOab.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-full">
                    <Label
                      htmlFor="attorneyNit"
                      className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] cursor-pointer "
                    >
                      NIT Nº
                    </Label>
                    <Input
                      id="attorneyNit"
                      type="text"
                      {...register("attorneyNit")}
                      className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.attorneyNit ? "border-red-500" : ""
                      }`}
                      placeholder="Digite aqui..."
                    />
                    {errors.attorneyNit && (
                      <p className="text-red-500 text-sm">
                        {errors.attorneyNit.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <p className=" text-[#1C3552] text-[18px] font-[600] ">
                    Serviço ou Benefício Solicitado
                  </p>

                  <div className="flex items-center gap-2">
                    <Controller
                      name="retirementAge"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          className="cursor-pointer"
                          id="retirementAge"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label
                      className="w-1/3 text-[14px] text-[#1C3552] font-[400] cursor-pointer"
                      htmlFor="retirementAge"
                    >
                      Aposentadoria por Idade:
                    </Label>
                    <div className="flex items-center gap-2">
                      <Controller
                        name="retirementAgeUrban"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            className="cursor-pointer"
                            id="retirementAgeUrban"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label
                        htmlFor="retirementAgeUrban"
                        className="text-[14px] text-[#1C3552] font-[300] cursor-pointer"
                      >
                        Urbana
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Controller
                        name="retirementAgeRural"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            className="cursor-pointer"
                            id="retirementAgeRural"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label
                        htmlFor="retirementAgeRural"
                        className="text-[14px] text-[#1C3552] font-[300] cursor-pointer"
                      >
                        Rural
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Controller
                      name="retirementContributionTime"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          className="cursor-pointer"
                          id="retirementContributionTime"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label
                      htmlFor="retirementContributionTime"
                      className="text-[14px] text-[#1C3552] font-[300] cursor-pointer"
                    >
                      Aposentadoria por Tempo de Contribuição
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Controller
                      name="retirementSpecial"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          className="cursor-pointer"
                          id="retirementSpecial"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label
                      htmlFor="retirementSpecial"
                      className="text-[14px] text-[#1C3552] font-[300] cursor-pointer"
                    >
                      Aposentadoria Especial
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Controller
                      name="pensionDeath"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          className="cursor-pointer"
                          id="pensionDeath"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label
                      className="w-1/3 text-[14px] text-[#1C3552] font-[400] cursor-pointer"
                      htmlFor="pensionDeath"
                    >
                      Pensão por Morte Previdenciária:
                    </Label>
                    <div className="flex items-center gap-2">
                      <Controller
                        name="pensionDeathUrban"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            className="cursor-pointer"
                            id="pensionDeathUrban"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label
                        htmlFor="pensionDeathUrban"
                        className="text-[14px] text-[#1C3552] font-[300] cursor-pointer"
                      >
                        Urbana
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Controller
                        name="pensionDeathRural"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            className="cursor-pointer"
                            id="pensionDeathRural"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label
                        htmlFor="pensionDeathRural"
                        className="text-[14px] text-[#1C3552] font-[300] cursor-pointer"
                      >
                        Rural
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Controller
                      name="reclusionAid"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          className="cursor-pointer"
                          id="reclusionAid"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label
                      className="w-1/3 text-[14px] text-[#1C3552] font-[400] cursor-pointer"
                      htmlFor="reclusionAid"
                    >
                      Auxílio-Reclusão:
                    </Label>
                    <div className="flex items-center gap-2">
                      <Controller
                        name="reclusionAidUrban"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            className="cursor-pointer"
                            id="reclusionAidUrban"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label
                        htmlFor="reclusionAidUrban"
                        className="text-[14px] text-[#1C3552] font-[300] cursor-pointer"
                      >
                        Urbano
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Controller
                        name="reclusionAidRural"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            className="cursor-pointer"
                            id="reclusionAidRural"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label
                        htmlFor="reclusionAidRural"
                        className="text-[14px] text-[#1C3552] font-[300] cursor-pointer"
                      >
                        Rural
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Controller
                      name="maternityPay"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          className="cursor-pointer"
                          id="maternityPay"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label
                      className="w-1/3 text-[14px] text-[#1C3552] font-[400] cursor-pointer"
                      htmlFor="maternityPay"
                    >
                      Salário Maternidade:
                    </Label>
                    <div className="flex items-center gap-2">
                      <Controller
                        name="maternityPayUrban"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            className="cursor-pointer"
                            id="maternityPayUrban"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label
                        htmlFor="maternityPayUrban"
                        className="text-[14px] text-[#1C3552] font-[300] cursor-pointer"
                      >
                        Urbano
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Controller
                        name="maternityPayRural"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            className="cursor-pointer"
                            id="maternityPayRural"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label
                        htmlFor="maternityPayRural"
                        className="text-[14px] text-[#1C3552] font-[300] cursor-pointer"
                      >
                        Rural
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Controller
                      name="cadastralUpdate"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          className="cursor-pointer"
                          id="cadastralUpdate"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label
                      htmlFor="cadastralUpdate"
                      className="text-[14px] text-[#1C3552] font-[300] cursor-pointer"
                    >
                      Atualização cadastral
                    </Label>
                  </div>

                  {errors.root && (
                    <p className="text-red-500 text-sm">
                      {errors.root.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 pt-4">
                  <div className="flex flex-col md:flex-row gap-[15px] ">
                    <div className=" flex flex-col gap-[5px] w-full md:w-[60%] ">
                      <Label
                        className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] cursor-pointer "
                        htmlFor="location"
                      >
                        Local:
                      </Label>
                      <Input
                        id="location"
                        type="text"
                        {...register("location")}
                        className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
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

                    <div className=" flex flex-col gap-[5px] w-full md:w-[40%] ">
                      <Label
                        htmlFor="documentDate"
                        className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] cursor-pointer "
                      >
                        Data
                      </Label>
                      <Input
                        id="documentDate"
                        type="date"
                        {...register("documentDate")}
                        className={`rounded-[8px] w-full h-[35px] px-[18px] text-[15px] text-[#1C3552] placeholder:text-[#CCCCCC] placeholder:italic ${
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
              </div>

              <div className=" flex flex-row items-center gap-5 ">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-[194px] bg-[#529FF6] font-bold hover:bg-blue-700 text-white py-5 md:py-6 text-[15px] md:text-[15] rounded-[8px]"
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
