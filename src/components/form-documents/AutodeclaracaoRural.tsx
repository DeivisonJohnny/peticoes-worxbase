"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Controller, Resolver, useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "../ui/checkbox";
import Util from "@/utils/Util";
import TableEditable from "../TableEditable";
import { Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ClientType, Documento } from "@/pages/dashboard";

const ruralSelfDeclarationSchema = yup.object({
  fullName: yup
    .string()
    .min(3, "Nome deve ter ao menos 3 caracteres")
    .required("Nome completo é obrigatório"),
  nickname: yup.string(),
  birthDate: yup.string().required("Data de nascimento é obrigatória"),
  birthPlace: yup.string().required("Local de nascimento é obrigatório"),
  address: yup.string().required("Endereço é obrigatório"),
  addressNumber: yup.string().required("Número é obrigatório"),
  addressNeighborhood: yup.string().required("Bairro é obrigatório"),
  addressCity: yup.string().required("Cidade é obrigatória"),
  addressState: yup.string().required("Estado é obrigatório"),
  addressZipCode: yup.string().required("CEP é obrigatório"),
  expirationDate: yup.string().required("Data de expiração é obrigatória"),
  rg: yup
    .string()
    .min(5, "RG deve ter ao menos 5 caracteres")
    .required("RG é obrigatório"),
  cpf: yup
    .string()
    .required("CPF é obrigatório")
    .test("cpf-valid", "CPF inválido", (value) =>
      Util.validateCpfOrCnpj(value || "")
    ),

  familyEconomyCondition: yup.string().required("Esta opção é obrigatória"),

  familyMembers: yup.array().of(
    yup.object().shape({
      name: yup.string(),
      birthDate: yup.string(),
      cpf: yup.string(),
      maritalStatus: yup.string(),
      relationship: yup.string(),
    })
  ),

  properties: yup.array().of(
    yup.object().shape({
      itrRegistration: yup.string(),
      totalArea: yup.string(),
      cityState: yup.string(),
      exploredArea: yup.string(),
      name: yup.string(),
      ownerName: yup.string(),
      ownerCpf: yup.string(),
    })
  ),

  hasIpiTax: yup.boolean(),
  ipiPeriod: yup.string(),

  hasEmployees: yup.boolean(),

  hasOtherActivityOrIncome: yup.boolean(),

  hasSpecificIncomeSources: yup.boolean(),

  isCooperativeMember: yup.boolean(),
  cooperativeEntity: yup.string(),
  cooperativeCnpj: yup.string(),
  cooperativeType: yup.string(),

  declarationLocation: yup.string().required("Local é obrigatório"),
  declarationDate: yup.string().required("Data da declaração é obrigatória"),
});

type RuralSelfDeclarationFormData = yup.InferType<
  typeof ruralSelfDeclarationSchema
>;
type RuralSelfDeclarationResolver = Resolver<RuralSelfDeclarationFormData>;

interface AutodeclaracaoRuralProps {
  client?: ClientType | null;
  idForm?: string;
  documents?: Documento[];
}

export default function AutodeclaracaoRural({
  client,
  idForm,
}: AutodeclaracaoRuralProps) {
  const [tablesData, setTablesData] = useState<{ [key: string]: string[][] }>(
    {}
  );

  const handleTableChange = useCallback(
    ({ name, values }: { name: string; values: string[][] }) => {
      setTablesData((prev) => ({ ...prev, [name]: values }));
    },
    []
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<RuralSelfDeclarationFormData>({
    resolver: yupResolver(
      ruralSelfDeclarationSchema
    ) as RuralSelfDeclarationResolver,
    mode: "onChange",
    defaultValues: {
      fullName: "",
      nickname: "",
      birthDate: "",
      birthPlace: "",
      address: "",
      addressNumber: "",
      addressNeighborhood: "",
      addressCity: "",
      addressState: "",
      addressZipCode: "",
      expirationDate: "",
      rg: "",
      cpf: "",
      familyEconomyCondition: "",
      familyMembers: [
        {
          name: "",
          birthDate: "",
          cpf: "",
          maritalStatus: "",
          relationship: "",
        },
      ],
      properties: [
        {
          itrRegistration: "",
          totalArea: "",
          cityState: "",
          exploredArea: "",
          name: "",
          ownerName: "",
          ownerCpf: "",
        },
      ],
      ipiPeriod: "",
      cooperativeEntity: "",
      cooperativeCnpj: "",
      cooperativeType: "",
      declarationLocation: "",
      declarationDate: "",
      hasIpiTax: false,
      hasEmployees: false,
      hasOtherActivityOrIncome: false,
      hasSpecificIncomeSources: false,
      isCooperativeMember: false,
    },
  });

  const {
    fields: familyMemberFields,
    append: appendFamilyMember,
    remove: removeFamilyMember,
  } = useFieldArray({
    control,
    name: "familyMembers",
  });

  const {
    fields: propertyFields,
    append: appendProperty,
    remove: removeProperty,
  } = useFieldArray({
    control,
    name: "properties",
  });

  useEffect(() => {
    if (client) {
      setValue("fullName", client.name || "");
      setValue("nickname", client.nickname || "");
      setValue(
        "birthDate",
        client.dateOfBirth
          ? new Date(client.dateOfBirth).toISOString().split("T")[0]
          : ""
      );
      setValue("birthPlace", client.birthPlace || "");
      setValue("address", client.address || "");
      setValue("rg", client.rg || "");
      setValue("cpf", client.cpf || "");
      // O endereço do cliente é uma string única, preenchendo o campo de endereço principal.
      // Você pode querer dividir o endereço em seus respectivos campos.
    }
  }, [client, setValue]);

  const onSubmit = (data: RuralSelfDeclarationFormData) => {
    console.log({ templateId: idForm, ...data, ...tablesData });
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCpf = Util.formatCpfCnpj(e.target.value);
    setValue("cpf", formattedCpf, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen p-6 md:p-0 w-[100%] ">
      <div className=" max-w-[1200px] w-full mx-auto">
        <Card className="p-0 border-none shadow-none gap-4 ">
          <CardHeader className="text-[#529FF6] font-[700] text-[24px] px-0">
            Autodeclaração rural
          </CardHeader>

          <CardContent className="px-0">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 flex flex-col gap-[40px] "
            >
              <div className="space-y-2 flex flex-col gap-[20px] ">
                <div className="space-y-2">
                  <p className=" text-[#1C3552] text-[18px] font-[600] ">
                    1. Dados do Segurado
                  </p>
                  <Label
                    htmlFor="fullName"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Nome
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    {...register("fullName")}
                    className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.fullName ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="nickname"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Apelido
                  </Label>
                  <Input
                    id="nickname"
                    type="text"
                    {...register("nickname")}
                    className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.nickname ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.nickname && (
                    <p className="text-red-500 text-sm">
                      {errors.nickname.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="birthDate"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Data de Nascimento/DN
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    {...register("birthDate")}
                    className={`rounded-[8px] w-fit h-[35px] px-[18px]  text-[15px] text-[#CCCCCC]  placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.birthDate ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.birthDate && (
                    <p className="text-red-500 text-sm">
                      {errors.birthDate.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="birthPlace"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Local de Nascimento
                  </Label>
                  <Input
                    id="birthPlace"
                    type="text"
                    {...register("birthPlace")}
                    className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.birthPlace ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.birthPlace && (
                    <p className="text-red-500 text-sm">
                      {errors.birthPlace.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="address"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Endereço Residencial
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    {...register("address")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.address ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm">
                      {errors.address.message}
                    </p>
                  )}
                  <div className="flex  flex-row gap-[15px] items-center ">
                    <div className="space-y-2 w-[20%] ">
                      <Label
                        htmlFor="addressNumber"
                        className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                      >
                        Número
                      </Label>
                      <Input
                        id="addressNumber"
                        type="text"
                        {...register("addressNumber")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.addressNumber ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.addressNumber && (
                        <p className="text-red-500 text-sm">
                          {errors.addressNumber.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 w-[40%] ">
                      <Label
                        htmlFor="addressNeighborhood"
                        className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                      >
                        Bairro
                      </Label>
                      <Input
                        id="addressNeighborhood"
                        type="text"
                        {...register("addressNeighborhood")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.addressNeighborhood ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.addressNeighborhood && (
                        <p className="text-red-500 text-sm">
                          {errors.addressNeighborhood.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex  flex-row gap-[15px] items-center ">
                    <div className="space-y-2 w-[30%] ">
                      <Label
                        htmlFor="addressCity"
                        className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                      >
                        Município
                      </Label>
                      <Input
                        id="addressCity"
                        type="text"
                        {...register("addressCity")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.addressCity ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.addressCity && (
                        <p className="text-red-500 text-sm">
                          {errors.addressCity.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 w-[20%] ">
                      <Label
                        htmlFor="addressState"
                        className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                      >
                        UF
                      </Label>
                      <Input
                        id="addressState"
                        type="text"
                        {...register("addressState")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.addressState ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.addressState && (
                        <p className="text-red-500 text-sm">
                          {errors.addressState.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 w-[50%] ">
                      <Label
                        htmlFor="addressZipCode"
                        className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                      >
                        CEP
                      </Label>
                      <Input
                        id="addressZipCode"
                        type="text"
                        {...register("addressZipCode")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.addressZipCode ? "border-red-500" : ""
                        }`}
                        placeholder="00000-000"
                      />
                      {errors.addressZipCode && (
                        <p className="text-red-500 text-sm">
                          {errors.addressZipCode.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="expirationDate"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Data de Expedição
                  </Label>
                  <Input
                    id="expirationDate"
                    type="date"
                    {...register("expirationDate")}
                    className={`rounded-[8px] w-fit h-[35px] px-[18px]  text-[15px] text-[#CCCCCC]  placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.expirationDate ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.expirationDate && (
                    <p className="text-red-500 text-sm">
                      {errors.expirationDate.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="rg"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    RG
                  </Label>
                  <Input
                    id="rg"
                    type="text"
                    {...register("rg")}
                    className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.rg ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.rg && (
                    <p className="text-red-500 text-sm">{errors.rg.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="cpf"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    CPF
                  </Label>
                  <Input
                    id="cpf"
                    type="text"
                    {...register("cpf")}
                    onChange={handleCpfChange}
                    className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.cpf ? "border-red-500" : ""
                    }`}
                    placeholder="000.000.000-00"
                  />
                  {errors.cpf && (
                    <p className="text-red-500 text-sm">{errors.cpf.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <p className=" text-[#1C3552] text-[18px] font-[600] ">
                    2. Período(s) de atividade rural (dia/mês/ano)
                  </p>

                  <TableEditable
                    name="ruralPeriod"
                    colums={[
                      { label: "Período (DD/MM/AAAA a DD/MM/AAAA)" },
                      { label: "CONDIÇÃO EM RELAÇÃO AO IMÓVEL" },
                      {
                        label: "Situação",
                        type: "checkbox",
                        options: ["Individual", "Regime de economia familiar"],
                      },
                    ]}
                    onChange={handleTableChange}
                    lineInitial={3}
                  />
                  <p className=" font-[300] text-[16px]  text-[#5F5F5F]  ">
                    * Proprietário / Possuidor / Comodatário / Arrendatário /
                    Parceiro / Meeiro / Usufrutuário / Condômino / Posseiro
                    Assentado / Acampado
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[#1C3552] text-[18px] font-[600]">
                    2.1 No caso de exercício de atividade em regime de economia
                    familiar, informe sua condição no grupo na data do
                    requerimento
                  </p>
                  <Controller
                    name="familyEconomyCondition"
                    control={control}
                    render={({ field }) => (
                      <>
                        <div className=" flex flex-row items-center gap-2 ml-4 ">
                          <Checkbox
                            checked={field.value === "titular"}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange("titular");
                              }
                            }}
                            className=" border-1 border-[#A7A7A7] rounded-[0px] "
                            id="familyEconomyConditionHolder"
                          />
                          <Label
                            htmlFor="familyEconomyConditionHolder"
                            className="text-[14px]   text-[#1C3552] font-[300] "
                          >
                            Titular
                          </Label>
                        </div>

                        <div className=" flex flex-row items-center gap-2 ml-4 ">
                          <Checkbox
                            checked={field.value === "componente"}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange("componente");
                              }
                            }}
                            className=" border-1 border-[#A7A7A7] rounded-[0px] "
                            id="familyEconomyConditionComponent"
                          />
                          <Label
                            htmlFor="familyEconomyConditionComponent"
                            className="text-[14px]   text-[#1C3552] font-[300] "
                          >
                            Componente
                          </Label>
                        </div>
                      </>
                    )}
                  />
                  {errors.familyEconomyCondition && (
                    <p className="text-red-500 text-sm">
                      {errors.familyEconomyCondition.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-[#1C3552] text-[18px] font-[600]">
                    2.2 Grupo Familiar, se exerceu ou exerce a atividade em
                    regime de economia familiar, informe os componentes do grupo
                    familiar
                  </p>
                </div>

                <div className=" flex flex-col gap-5 ">
                  {familyMemberFields.map((item, index) => (
                    <div
                      key={item.id}
                      className="space-y-2 grid grid-cols-2 gap-4  border-1 border-[#529FF6] rounded-[8px] p-4 relative pt-10"
                    >
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor={`familyMembers.${index}.name`}
                          className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                        >
                          Nome
                        </Label>
                        <Input
                          id={`familyMembers.${index}.name`}
                          type="text"
                          {...register(`familyMembers.${index}.name`)}
                          className="rounded-[8px] w-full h-[35px] px-[18px] text-[15] placeholder:text-[#CCCCCC] placeholder:italic"
                          placeholder="Digite aqui..."
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor={`familyMembers.${index}.birthDate`}
                          className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                        >
                          DN
                        </Label>
                        <Input
                          id={`familyMembers.${index}.birthDate`}
                          type="date"
                          {...register(`familyMembers.${index}.birthDate`)}
                          className="rounded-[8px] w-full h-[35px] px-[18px] text-[15] placeholder:text-[#CCCCCC] placeholder:italic"
                          placeholder="Digite aqui..."
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor={`familyMembers.${index}.cpf`}
                          className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                        >
                          CPF(Número)
                        </Label>
                        <Input
                          id={`familyMembers.${index}.cpf`}
                          type="text"
                          {...register(`familyMembers.${index}.cpf`)}
                          className="rounded-[8px] w-full h-[35px] px-[18px] text-[15] placeholder:text-[#CCCCCC] placeholder:italic"
                          placeholder="Digite aqui..."
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor={`familyMembers.${index}.maritalStatus`}
                          className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                        >
                          Estado Civil
                        </Label>
                        <Input
                          id={`familyMembers.${index}.maritalStatus`}
                          type="text"
                          {...register(`familyMembers.${index}.maritalStatus`)}
                          className="rounded-[8px] w-full h-[35px] px-[18px] text-[15] placeholder:text-[#CCCCCC] placeholder:italic"
                          placeholder="Digite aqui..."
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor={`familyMembers.${index}.relationship`}
                          className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                        >
                          Parentesco
                        </Label>
                        <Input
                          id={`familyMembers.${index}.relationship`}
                          type="text"
                          {...register(`familyMembers.${index}.relationship`)}
                          className="rounded-[8px] w-full h-[35px] px-[18px] text-[15] placeholder:text-[#CCCCCC] placeholder:italic"
                          placeholder="Digite aqui..."
                        />
                      </div>
                      {familyMemberFields.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeFamilyMember(index)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white p-2 h-auto rounded-full cursor-pointer "
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                  <div>
                    <Button
                      type="button"
                      onClick={() =>
                        appendFamilyMember({
                          name: "",
                          birthDate: "",
                          cpf: "",
                          maritalStatus: "",
                          relationship: "",
                        })
                      }
                      className=" w-full border-2 border-[#529FF6] bg-transparent text-[#529FF6] cursor-pointer hover:bg-[#529FF6] hover:text-white  "
                    >
                      Adicionar novo integrante <Plus />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className=" text-[#1C3552] text-[18px] font-[600] ">
                    3. Se o segurado for proprietário, posseiro/possuidor,
                    assentado, usufrutuário e houve cessão da terra, informar:
                  </p>

                  <TableEditable
                    name="landCession"
                    colums={[
                      { label: "FORMA DE CESSÃO*" },
                      { label: "PERÍODO(XX/XX/XXXX A XX/XX/XXXX)" },
                      { label: "ÁREA CEDIDA em hectare - ha" },
                    ]}
                    onChange={handleTableChange}
                    lineInitial={3}
                  />
                  <p className=" font-[300] text-[16px]  text-[#5F5F5F]  ">
                    *Exemplos: Arrendamento, parceria, meação, comodato, etc.
                  </p>
                </div>

                <div className=" flex flex-col gap-5 ">
                  <p className=" text-[#1C3552] text-[18px] font-[600] ">
                    3.1. Informe os dados da(s) terra(s), onde exerceu ou exerce
                    a atividade rural (conforme item 2):
                  </p>
                  {propertyFields.map((item, index) => (
                    <div
                      key={item.id}
                      className="space-y-2 grid grid-cols-2 gap-4  border-1 border-[#529FF6] rounded-[8px] p-4 relative pt-10"
                    >
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor={`properties.${index}.itrRegistration`}
                          className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                        >
                          Registro ITR, se possuir
                        </Label>
                        <Input
                          id={`properties.${index}.itrRegistration`}
                          type="text"
                          {...register(`properties.${index}.itrRegistration`)}
                          className="rounded-[8px] w-full h-[35px] px-[18px] text-[15] placeholder:text-[#CCCCCC] placeholder:italic"
                          placeholder="Digite aqui..."
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor={`properties.${index}.totalArea`}
                          className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                        >
                          Área total do imóvel (ha)
                        </Label>
                        <Input
                          id={`properties.${index}.totalArea`}
                          type="text"
                          {...register(`properties.${index}.totalArea`)}
                          className="rounded-[8px] w-full h-[35px] px-[18px] text-[15] placeholder:text-[#CCCCCC] placeholder:italic"
                          placeholder="Digite aqui..."
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor={`properties.${index}.cityState`}
                          className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                        >
                          Município/UF
                        </Label>
                        <Input
                          id={`properties.${index}.cityState`}
                          type="text"
                          {...register(`properties.${index}.cityState`)}
                          className="rounded-[8px] w-full h-[35px] px-[18px] text-[15] placeholder:text-[#CCCCCC] placeholder:italic"
                          placeholder="Digite aqui..."
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor={`properties.${index}.exploredArea`}
                          className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                        >
                          Área explorada pelo requerente (ha)
                        </Label>
                        <Input
                          id={`properties.${index}.exploredArea`}
                          type="text"
                          {...register(`properties.${index}.exploredArea`)}
                          className="rounded-[8px] w-full h-[35px] px-[18px] text-[15] placeholder:text-[#CCCCCC] placeholder:italic"
                          placeholder="Digite aqui..."
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor={`properties.${index}.name`}
                          className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                        >
                          Nome da propriedade
                        </Label>
                        <Input
                          id={`properties.${index}.name`}
                          type="text"
                          {...register(`properties.${index}.name`)}
                          className="rounded-[8px] w-full h-[35px] px-[18px] text-[15] placeholder:text-[#CCCCCC] placeholder:italic"
                          placeholder="Digite aqui..."
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor={`properties.${index}.ownerName`}
                          className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                        >
                          Nome do proprietário
                        </Label>
                        <Input
                          id={`properties.${index}.ownerName`}
                          type="text"
                          {...register(`properties.${index}.ownerName`)}
                          className="rounded-[8px] w-full h-[35px] px-[18px] text-[15] placeholder:text-[#CCCCCC] placeholder:italic"
                          placeholder="Digite aqui..."
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor={`properties.${index}.ownerCpf`}
                          className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                        >
                          CPF do Proprietário
                        </Label>
                        <Input
                          id={`properties.${index}.ownerCpf`}
                          type="text"
                          {...register(`properties.${index}.ownerCpf`)}
                          className="rounded-[8px] w-full h-[35px] px-[18px] text-[15] placeholder:text-[#CCCCCC] placeholder:italic"
                          placeholder="Digite aqui..."
                        />
                      </div>
                      {propertyFields.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeProperty(index)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white p-2 h-auto rounded-full"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                  <div>
                    <Button
                      type="button"
                      onClick={() =>
                        appendProperty({
                          itrRegistration: "",
                          totalArea: "",
                          cityState: "",
                          exploredArea: "",
                          name: "",
                          ownerName: "",
                          ownerCpf: "",
                        })
                      }
                      className=" w-full border-2 border-[#529FF6] bg-transparent text-[#529FF6] cursor-pointer hover:bg-[#529FF6] hover:text-white  "
                    >
                      Adicionar nova terra <Plus />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className=" text-[#1C3552] text-[18px] font-[600] ">
                    3.2. Informe o que explora na atividade rural e destinação
                    (milho, feijão, porcos, etc.)
                  </p>

                  <TableEditable
                    name="ruralExploration"
                    colums={[
                      { label: "ATIVIDADE" },
                      { label: "SUBSISTÊNCIA/VENDA" },
                    ]}
                    onChange={handleTableChange}
                    lineInitial={3}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-[#1C3552] text-[18px] font-[600]">
                    3.3. Informe se houve recolhimento de Imposto Sobre Produtos
                    Industrializados - IPI sobre a venda da produção:
                  </p>
                  <div className=" flex flex-row items-center gap-2 ml-4 ">
                    <Controller
                      name="hasIpiTax"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-1 border-[#A7A7A7] rounded-[0px]"
                          id="hasIpiTax"
                        />
                      )}
                    />
                    <Label
                      htmlFor="hasIpiTax"
                      className="text-[14px]   text-[#1C3552] font-[300] "
                    >
                      Sim
                    </Label>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="ipiPeriod"
                      className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                    >
                      Período (XX/XX/XXXX A XX/XX/XXXX)
                    </Label>
                    <Input
                      id="ipiPeriod"
                      type="text"
                      {...register("ipiPeriod")}
                      className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                        errors.ipiPeriod ? "border-red-500" : ""
                      }`}
                      placeholder="Ex: 01/01/2020 a 31/12/2020"
                    />
                    {errors.ipiPeriod && (
                      <p className="text-red-500 text-sm">
                        {errors.ipiPeriod.message}
                      </p>
                    )}
                  </div>
                  {errors.hasIpiTax && (
                    <p className="text-red-500 text-sm">
                      {errors.hasIpiTax.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-[#1C3552] text-[18px] font-[600]">
                    3.4. Possui empregado(s) ou prestador(es) de serviço:
                  </p>
                  <div className=" flex flex-row items-center gap-2 ml-4 ">
                    <Controller
                      name="hasEmployees"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-1 border-[#A7A7A7] rounded-[0px]"
                          id="hasEmployees"
                        />
                      )}
                    />
                    <Label
                      htmlFor="hasEmployees"
                      className="text-[14px]   text-[#1C3552] font-[300] "
                    >
                      Sim
                    </Label>
                  </div>
                  <TableEditable
                    name="employeesDetails"
                    colums={[
                      { label: "NOME" },
                      { label: "CPF, se possuir" },
                      { label: "PERÍODO (XX/XX/XXXX a XX/XX/XXXX)" },
                    ]}
                    onChange={handleTableChange}
                    lineInitial={3}
                  />
                  {errors.hasEmployees && (
                    <p className="text-red-500 text-sm">
                      {errors.hasEmployees.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-[#1C3552] text-[18px] font-[600]">
                    4. Informe se exerce ou exerceu outra atividade e/ou
                    recebe/recebeu outra renda:
                  </p>
                  <div className=" flex flex-row items-center gap-2 ml-4 ">
                    <Controller
                      name="hasOtherActivityOrIncome"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-1 border-[#A7A7A7] rounded-[0px]"
                          id="hasOtherActivityOrIncome"
                        />
                      )}
                    />
                    <Label
                      htmlFor="hasOtherActivityOrIncome"
                      className="text-[14px]   text-[#1C3552] font-[300] "
                    >
                      Sim
                    </Label>
                  </div>
                  <TableEditable
                    name="otherActivitiesIncome"
                    colums={[
                      { label: "ATIVIDADE/RENDA*" },
                      { label: "LOCAL" },
                      { label: "PERÍODO (XX/XX/XXXX a XX/XX/XXXX)" },
                    ]}
                    onChange={handleTableChange}
                    lineInitial={3}
                  />
                  <p className=" font-[300] text-[16px]  text-[#5F5F5F]  ">
                    *Pedreiro, carpinteiro, pintor, servidor público, empregado
                    rural, entre outros.
                  </p>
                  {errors.hasOtherActivityOrIncome && (
                    <p className="text-red-500 text-sm">
                      {errors.hasOtherActivityOrIncome.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-[#1C3552] text-[18px] font-[600]">
                    4.1 Informe se recebe/recebeu outra renda nas seguintes
                    atividades: atividade turística, artística, artesanal,
                    dirigente sindical ou de cooperativa, mandato de vereador:
                  </p>
                  <div className=" flex flex-row items-center gap-2 ml-4 ">
                    <Controller
                      name="hasSpecificIncomeSources"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-1 border-[#A7A7A7] rounded-[0px]"
                          id="hasSpecificIncomeSources"
                        />
                      )}
                    />
                    <Label
                      htmlFor="hasSpecificIncomeSources"
                      className="text-[14px]   text-[#1C3552] font-[300] "
                    >
                      Sim
                    </Label>
                  </div>
                  <TableEditable
                    name="specificIncomeSources"
                    colums={[
                      { label: "ATIVIDADE" },
                      { label: "PERÍODO (xx/xx/xxxx a xx/xx/xxxx)" },
                      { label: "RENDA (R$)" },
                      { label: "OUTRAS INFORMAÇÕES*" },
                    ]}
                    onChange={handleTableChange}
                    lineInitial={3}
                  />
                  <p className=" font-[300] text-[16px]  text-[#5F5F5F]  ">
                    * Para atividade artesanal, informar a origem da matéria
                    prima. Para mandato de vereador, informar o Município. Para
                    exploração de atividade turística na propriedade, indicar os
                    dias de hospedagem por exercício.
                  </p>
                  {errors.hasSpecificIncomeSources && (
                    <p className="text-red-500 text-sm">
                      {errors.hasSpecificIncomeSources.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-[#1C3552] text-[18px] font-[600]">
                    4.2. Informe se participa de cooperativa:
                  </p>
                  <div className=" flex flex-row items-center gap-2 ml-4 ">
                    <Controller
                      name="isCooperativeMember"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-1 border-[#A7A7A7] rounded-[0px]"
                          id="isCooperativeMember"
                        />
                      )}
                    />
                    <Label
                      htmlFor="isCooperativeMember"
                      className="text-[14px]   text-[#1C3552] font-[300] "
                    >
                      Sim
                    </Label>
                  </div>
                  <div className="flex flex-col gap-4 mt-4">
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="cooperativeEntity"
                        className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                      >
                        ENTIDADE
                      </Label>
                      <Input
                        id="cooperativeEntity"
                        type="text"
                        {...register("cooperativeEntity")}
                        className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.cooperativeEntity ? "border-red-500" : ""
                        }`}
                        placeholder="Digite o nome da entidade"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="cooperativeCnpj"
                        className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                      >
                        CNPJ
                      </Label>
                      <Input
                        id="cooperativeCnpj"
                        type="text"
                        {...register("cooperativeCnpj")}
                        className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.cooperativeCnpj ? "border-red-500" : ""
                        }`}
                        placeholder="Digite o CNPJ"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="cooperativeType"
                        className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                      >
                        INFORMAR SE É AGROPECUÁRIA OU DE CREDITO RURAL
                      </Label>
                      <Input
                        id="cooperativeType"
                        type="text"
                        {...register("cooperativeType")}
                        className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.cooperativeType ? "border-red-500" : ""
                        }`}
                        placeholder="Agropecuária ou Crédito Rural"
                      />
                    </div>
                  </div>
                  {errors.isCooperativeMember && (
                    <p className="text-red-500 text-sm">
                      {errors.isCooperativeMember.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className=" text-[#1C3552] text-[18px] font-[600] ">
                    Declaro sob as penas previstas na legislação, que as
                    informações prestadas nesta declaração são verdadeiras,
                    estando ciente das penalidades do Art. 299 do Código Penal
                    Brasileiro.
                  </p>

                  <div className=" flex flex-row items-center gap-5 w-full ">
                    <div className="w-[50%] ">
                      <Label
                        htmlFor="declarationLocation"
                        className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                      >
                        Local
                      </Label>
                      <Input
                        id="declarationLocation"
                        type="text"
                        {...register("declarationLocation")}
                        className={` rounded-[0px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic border-t-0 border-r-0 border-l-0 border-b-1 border-[#CCCCCC]  shadow-none  ${
                          errors.declarationLocation ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.declarationLocation && (
                        <p className="text-red-500 text-sm">
                          {errors.declarationLocation.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="declarationDate"
                        className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                      >
                        Data
                      </Label>
                      <Input
                        id="declarationDate"
                        type="date"
                        {...register("declarationDate")}
                        className={`rounded-[0px] w-fit h-[35px] px-[18px]  text-[15px] text-[#CCCCCC]  placeholder:text-[#CCCCCC] placeholder:italic  border-t-0 border-r-0 border-l-0 border-b-1 border-[#CCCCCC] shadow-none  ${
                          errors.declarationDate ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.declarationDate && (
                        <p className="text-red-500 text-sm">
                          {errors.declarationDate.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className=" flex flex-row items-center gap-5 ">
                <Button
                  type="submit"
                  className="w-[194px] bg-[#529FF6] font-bold hover:bg-blue-700 text-white py-5 md:py-6 text-[15px] md:text-[15] rounded-[8px] cursor-pointer "
                >
                  Finalizar documento
                </Button>
                <Button
                  type="button"
                  className="w-[177px] bg-[#fff]   border-1 border-[#DDB100] font-bold hover:bg-[#DDB000] hover:text-white  text-[#DDB000] py-5 md:py-6 text-[15px] md:text-[15] rounded-[8px] cursor-pointer "
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
