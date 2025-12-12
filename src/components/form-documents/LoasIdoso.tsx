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
import { ClientType } from "@/pages/dashboard";
import { useEffect, useState } from "react";
import Api, { ApiErrorResponse } from "@/api";
import { toast } from "sonner";
import { useGenerateDocument } from "@/contexts/GenerateContext";
import { Loader2 } from "lucide-react";

const LoasIdosoSchema = yup.object({
  fullName: yup
    .string()
    .min(3, "O nome completo deve ter ao menos 3 caracteres")
    .required("O nome completo é obrigatório"),
  nationality: yup.string().required("A nacionalidade é obrigatória"),
  birthDate: yup.string().required("A data de nascimento é obrigatória"),
  motherName: yup.string().required("O nome da mãe é obrigatório"),
  rg: yup.string().required("O RG (identidade) é obrigatório"),
  cpf: yup
    .string()
    .required("O CPF é obrigatório")
    .test("cpf-valid", "CPF inválido", (value) =>
      Util.validateCpfOrCnpj(value || "")
    ),
  phone: yup.string().required("O telefone é obrigatório"),

  street: yup.string().required("O logradouro é obrigatório"),
  number: yup.string().required("O número é obrigatório"),
  neighborhood: yup.string().required("O bairro é obrigatório"),
  city: yup.string().required("A cidade é obrigatória"),
  state: yup.string().required("O estado é obrigatório"),
  zipCode: yup.string().required("O CEP é obrigatório"),
  complement: yup.string().required("O complemento é obrigatório"),

  jurisdiction: yup.string().required("O foro é obrigatório"),
  livingSituation: yup.string().required("A situação domiciliar é obrigatória"),
  caseValue: yup.string().required("O valor da causa é obrigatório"),
  caseValueForTaxPurposes: yup
    .string()
    .required("O valor da causa para efeitos fiscais é obrigatório"),
  cessationDate: yup.string().required("A data de cessação é obrigatória"),
  benefitNumber: yup.string().required("O número do benefício é obrigatório"),
});

type BpcLoasFormData = yup.InferType<typeof LoasIdosoSchema>;
type BpcLoasResolver = Resolver<BpcLoasFormData>;

function formatPhone(value: string) {
  value = value.replace(/\D/g, "");
  if (value.length <= 10) {
    return value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  } else {
    return value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  }
}

interface LoasIdosoProps {
  client?: ClientType | null;
  idForm?: string;
}

export default function LoasIdoso({ client, idForm }: LoasIdosoProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { generatedDocument } = useGenerateDocument();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BpcLoasFormData>({
    resolver: yupResolver(LoasIdosoSchema) as BpcLoasResolver,
    mode: "onChange",
  });

  useEffect(() => {
    if (client && "id" in client) {
      setValue("fullName", client.name || "");
      setValue("nationality", client.nationality || "");
      setValue(
        "birthDate",
        client.dateOfBirth
          ? new Date(client.dateOfBirth).toISOString().split("T")[0]
          : ""
      );
      setValue("motherName", client.motherName || "");
      setValue("rg", client.rg || "");
      setValue("cpf", client.cpf || "");
      setValue("phone", client.phone || "");

      if (client.address) {
        const addressParts = client.address.split(", ");
        const street = addressParts[0] || "";
        const number = addressParts[1] || "";
        const neighborhood = addressParts[2] || "";

        const cityStatePart = addressParts[3] || "";
        const cityStateParts = cityStatePart.split(" - ");
        const city = cityStateParts[0]?.trim() || "";
        const state = cityStateParts[1]?.trim() || "";

        setValue("street", street);
        setValue("number", number);
        setValue("neighborhood", neighborhood);
        setValue("city", city);
        setValue("state", state);
      }

      if (client.cep) {
        setValue("zipCode", client.cep);
      }
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
    setValue("cpf", formattedCpf, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen p-6 md:p-0 w-[100%] ">
      <div className=" max-w-[1200px] w-full mx-auto">
        <Card className="p-0 border-none shadow-none gap-3">
          <CardHeader className="text-[#529FF6] font-[700] text-[24px] px-0">
            Loas Idoso
          </CardHeader>
          <CardContent className="px-0">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 flex flex-col gap-[40px] "
            >
              <div className="space-y-2 flex flex-col gap-[0px] ">
                <div className="space-y-2 w-1/2 ">
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
                <Divider />
                <div className="space-y-2 ">
                  <div className="flex flex-row gap-[15px] items-center ">
                    <div className="space-y-2 w-[40%] ">
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

                    <div className="space-y-2 w-[30%] ">
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

                    <div className="space-y-2 w-[30%] ">
                      <Label
                        htmlFor="birthDate"
                        className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                      >
                        Data de Nascimento
                      </Label>
                      <Input
                        id="birthDate"
                        type="date"
                        {...register("birthDate")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.birthDate ? "border-red-500" : ""
                        }`}
                      />
                      {errors.birthDate && (
                        <p className="text-red-500 text-sm">
                          {errors.birthDate.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-row items-center gap-[15px] ">
                    <div className="space-y-2 w-[50%] ">
                      <Label
                        htmlFor="motherName"
                        className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                      >
                        Nome da mãe:
                      </Label>
                      <Input
                        id="motherName"
                        type="text"
                        {...register("motherName")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.motherName ? "border-red-500" : ""
                        }`}
                        placeholder="Digite o nome da mãe..."
                      />
                      {errors.motherName && (
                        <p className="text-red-500 text-sm">
                          {errors.motherName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 w-[20%] ">
                      <Label
                        htmlFor="rg"
                        className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                      >
                        Identidade(RG)
                      </Label>
                      <Input
                        id="rg"
                        type="text"
                        {...register("rg")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.rg ? "border-red-500" : ""
                        }`}
                        placeholder="Digite o RG..."
                      />
                      {errors.rg && (
                        <p className="text-red-500 text-sm">
                          {errors.rg.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-row gap-[15px] items-center ">
                    <div className="space-y-2 w-[40%] ">
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

                    <div className="space-y-2 w-[60%] ">
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
                  </div>

                  <div className="flex flex-row gap-[15px] items-center ">
                    <div className="space-y-2 w-[20%] ">
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

                    <div className="space-y-2 w-[40%] ">
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

                    <div className="space-y-2 w-[40%] ">
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

                  <div className="flex flex-row gap-[15px] items-center ">
                    <div className="space-y-2 w-[30%] ">
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

                    <div className="space-y-2 w-[30%] ">
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
                    <div className="space-y-2 w-[30%] ">
                      <Label
                        htmlFor="complement"
                        className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                      >
                        Complemento
                      </Label>
                      <Input
                        id="complement"
                        type="text"
                        {...register("complement")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.complement ? "border-red-500" : ""
                        }`}
                        placeholder="Sala 01"
                      />
                      {errors.complement && (
                        <p className="text-red-500 text-sm">
                          {errors.complement.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <Divider />

                <div className=" flex flex-row gap-[15px] ">
                  <div className="space-y-2 w-[20%] ">
                    <Label
                      htmlFor="phone"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Telefone
                    </Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      onChange={(e) =>
                        setValue("phone", formatPhone(e.target.value), {
                          shouldValidate: true,
                        })
                      }
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.phone ? "border-red-500" : ""
                      }`}
                      maxLength={15}
                      placeholder="Digite aqui..."
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
                <Divider />
                <div className="space-y-2 flex gap-2 flex-col ">
                  <div className="space-y-2 w-1/2 ">
                    <Label
                      htmlFor="livingSituation"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Situação domiciliar
                    </Label>
                    <Input
                      id="livingSituation"
                      type="text"
                      {...register("livingSituation")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.livingSituation ? "border-red-500" : ""
                      }`}
                      placeholder="sozinha"
                    />
                    {errors.livingSituation && (
                      <p className="text-red-500 text-sm">
                        {errors.livingSituation.message}
                      </p>
                    )}
                  </div>
                </div>
                <Divider />
                <div className="space-y-2 flex gap-2 flex-col ">
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
                      placeholder="Ex: 32.409,96 (trinta e dois mil, quatrocentos e nove reais e noventa e seis centavos)"
                    />
                    {errors.caseValue && (
                      <p className="text-red-500 text-sm">
                        {errors.caseValue.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="caseValueForTaxPurposes"
                      className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                    >
                      Valor da causa para efeitos fiscais
                    </Label>
                    <Input
                      id="caseValueForTaxPurposes"
                      type="text"
                      {...register("caseValueForTaxPurposes")}
                      className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.caseValueForTaxPurposes ? "border-red-500" : ""
                      }`}
                      placeholder="Ex: R$ 15.840,00 (quinze mil, oitocentos e quarenta reais)"
                    />
                    {errors.caseValueForTaxPurposes && (
                      <p className="text-red-500 text-sm">
                        {errors.caseValueForTaxPurposes.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 flex flex-row gap-[15px] ">
                    <div className="space-y-2 w-[30%] ">
                      <Label
                        htmlFor="cessationDate"
                        className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                      >
                        Data cessação
                      </Label>
                      <Input
                        id="cessationDate"
                        type="date"
                        {...register("cessationDate")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.cessationDate ? "border-red-500" : ""
                        }`}
                      />
                      {errors.cessationDate && (
                        <p className="text-red-500 text-sm">
                          {errors.cessationDate.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="benefitNumber"
                        className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                      >
                        Número do benefício
                      </Label>
                      <Input
                        id="benefitNumber"
                        {...register("benefitNumber")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.benefitNumber ? "border-red-500" : ""
                        }`}
                        placeholder="Ex: 123.456.789-0"
                      />
                      {errors.benefitNumber && (
                        <p className="text-red-500 text-sm">
                          {errors.benefitNumber.message}
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
                  className="w-[194px] bg-[#529FF6] font-bold hover:bg-blue-700 text-white py-5 md:py-6 text-[15px] md:text-[15] rounded-[8px] cursor-pointer "
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
                  className="w-[177px] bg-[#fff] border-1 border-[#DDB100] font-bold hover:bg-[#DDB000] hover:text-white text-[#DDB000] py-5 md:py-6 text-[15px] md:text-[15] rounded-[8px] cursor-pointer "
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
