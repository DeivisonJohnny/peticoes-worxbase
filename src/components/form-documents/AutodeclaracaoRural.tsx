"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "../ui/checkbox";
import Util from "@/utils/Util";
import TableEditable from "../TableEditable";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

const ruralSelfDeclarationSchema = yup.object({
  // Section 1: Dados do segurado
  fullName: yup
    .string()
    .min(3, "Nome deve ter ao menos 3 caracteres")
    .required("Nome completo é obrigatório"),
  nickname: yup.string(),
  birthDate: yup.string().required("Data de nascimento é obrigatória"),
  birthPlace: yup.string().required("Local de nascimento é obrigatório"),
  address: yup.string().required("Endereço é obrigatório"),
  addressNumber: yup.string().required("Número é obrigatório"),
  addressComplement: yup.string(),
  addressNeighborhood: yup.string().required("Bairro é obrigatório"),
  addressCity: yup.string().required("Cidade é obrigatória"),
  addressState: yup.string().required("Estado é obrigatório"),
  addressZipCode: yup.string().required("CEP é obrigatório"),
  expirationDate: yup.string().required("Data de expiração é obrigatória"),
  issuingPlace: yup.string().required("Local de expedição é obrigatório"),
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

  // Section 2.1
  familyEconomyCondition: yup.string().required("Esta opção é obrigatória"),

  // Section 2.2 (Single entry as per UI)
  familyMemberName: yup.string(),
  familyMemberBirthCertificate: yup.string(),
  familyMemberCpf: yup.string(),
  familyMemberMaritalStatus: yup.string(),
  familyMemberRelationship: yup.string(),

  // Section 3 (Single entry as per UI)
  propertyItrRegistration: yup.string(),
  propertyTotalArea: yup.string(),
  propertyCityState: yup.string(),
  propertyExploredArea: yup.string(),
  propertyName: yup.string(),
  propertyOwnerCpf: yup.string(),

  // Section 3.3
  hasIpiTax: yup.string().required("Esta opção é obrigatória"),

  // Section 3.4
  hasEmployees: yup.string().required("Esta opção é obrigatória"),

  // Section 4
  hasOtherActivityOrIncome: yup.string().required("Esta opção é obrigatória"),

  // Section 4.1
  hasSpecificIncomeSources: yup.string().required("Esta opção é obrigatória"),

  // Section 4.2
  isCooperativeMember: yup.string().required("Esta opção é obrigatória"),

  // Final Declaration Section
  declarationLocation: yup.string().required("Local é obrigatório"),
  declarationDate: yup.string().required("Data da declaração é obrigatória"),
  signature: yup.string().required("Assinatura é obrigatória"),
});

type RuralSelfDeclarationFormData = yup.InferType<
  typeof ruralSelfDeclarationSchema
>;
type RuralSelfDeclarationResolver = Resolver<RuralSelfDeclarationFormData>;

export default function AutodeclaracaoRural() {
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
    formState: { errors },
  } = useForm<RuralSelfDeclarationFormData>({
    resolver: yupResolver(
      ruralSelfDeclarationSchema
    ) as RuralSelfDeclarationResolver,
    mode: "onChange",
  });

  const onSubmit = (data: RuralSelfDeclarationFormData) => {
    console.log(data);
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCpf = Util.formatCpfCnpj(e.target.value);
    // This function can be adapted for multiple CPF fields if needed
    // For now, it targets the main 'cpf' field.
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
                    1. Dados do segurado
                  </p>
                  <Label
                    htmlFor="fullName"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Nome completo
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
                    Data de nascimento
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
                    Local de nascimento
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
                    Endereço
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
                        htmlFor="addressComplement"
                        className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                      >
                        Complemento
                      </Label>
                      <Input
                        id="addressComplement"
                        type="text"
                        {...register("addressComplement")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.addressComplement ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.addressComplement && (
                        <p className="text-red-500 text-sm">
                          {errors.addressComplement.message}
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
                        Cidade
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
                        Estado
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
                    Data Expiracao
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
                    htmlFor="issuingPlace"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Local de expedição
                  </Label>
                  <Input
                    id="issuingPlace"
                    type="text"
                    {...register("issuingPlace")}
                    className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.issuingPlace ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.issuingPlace && (
                    <p className="text-red-500 text-sm">
                      {errors.issuingPlace.message}
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
                  <div className=" flex flex-row items-center gap-2 ml-4 ">
                    <Checkbox
                      {...register("familyEconomyCondition")}
                      value="titular"
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
                      {...register("familyEconomyCondition")}
                      value="componente"
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
                  <div className="space-y-2 grid grid-cols-2 gap-4  border-1 border-[#529FF6] rounded-[8px] p-4 ">
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="familyMemberName"
                        className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                      >
                        Nome
                      </Label>
                      <Input
                        id="familyMemberName"
                        type="text"
                        {...register("familyMemberName")}
                        className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.familyMemberName ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.familyMemberName && (
                        <p className="text-red-500 text-sm">
                          {errors.familyMemberName.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="familyMemberBirthCertificate"
                        className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                      >
                        CN
                      </Label>
                      <Input
                        id="familyMemberBirthCertificate"
                        type="text"
                        {...register("familyMemberBirthCertificate")}
                        className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.familyMemberBirthCertificate
                            ? "border-red-500"
                            : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.familyMemberBirthCertificate && (
                        <p className="text-red-500 text-sm">
                          {errors.familyMemberBirthCertificate.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="familyMemberCpf"
                        className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                      >
                        CPF(Número)
                      </Label>
                      <Input
                        id="familyMemberCpf"
                        type="text"
                        {...register("familyMemberCpf")}
                        className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.familyMemberCpf ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.familyMemberCpf && (
                        <p className="text-red-500 text-sm">
                          {errors.familyMemberCpf.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="familyMemberMaritalStatus"
                        className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                      >
                        Estado Civil
                      </Label>
                      <Input
                        id="familyMemberMaritalStatus"
                        type="text"
                        {...register("familyMemberMaritalStatus")}
                        className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.familyMemberMaritalStatus
                            ? "border-red-500"
                            : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.familyMemberMaritalStatus && (
                        <p className="text-red-500 text-sm">
                          {errors.familyMemberMaritalStatus.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="familyMemberRelationship"
                        className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                      >
                        Parentesco
                      </Label>
                      <Input
                        id="familyMemberRelationship"
                        type="text"
                        {...register("familyMemberRelationship")}
                        className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.familyMemberRelationship
                            ? "border-red-500"
                            : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.familyMemberRelationship && (
                        <p className="text-red-500 text-sm">
                          {errors.familyMemberRelationship.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Button className=" w-full border-2 border-[#529FF6] bg-transparent text-[#529FF6] cursor-pointer hover:bg-[#529FF6] hover:text-white  ">
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
                      { label: "Tipo de cessão*" },
                      { label: "Período (DD/MM/AAAA a DD/MM/AAAA)" },
                      { label: "Nome do cessionário" },
                      { label: "CPF do cessionário" },
                    ]}
                    onChange={handleTableChange}
                    lineInitial={3}
                  />
                  <p className=" font-[300] text-[16px]  text-[#5F5F5F]  ">
                    *Exemplos: Arrendamento, parceria, meação, comodato, etc.
                  </p>
                </div>

                <div className=" flex flex-col gap-5 ">
                  <div className="space-y-2 grid grid-cols-2 gap-4  border-1 border-[#529FF6] rounded-[8px] p-4 ">
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="propertyItrRegistration"
                        className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                      >
                        Registro ITR, se possuir
                      </Label>
                      <Input
                        id="propertyItrRegistration"
                        type="text"
                        {...register("propertyItrRegistration")}
                        className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.propertyItrRegistration ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.propertyItrRegistration && (
                        <p className="text-red-500 text-sm">
                          {errors.propertyItrRegistration.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="propertyTotalArea"
                        className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                      >
                        Área total do imóvel (ha)
                      </Label>
                      <Input
                        id="propertyTotalArea"
                        type="text"
                        {...register("propertyTotalArea")}
                        className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.propertyTotalArea ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.propertyTotalArea && (
                        <p className="text-red-500 text-sm">
                          {errors.propertyTotalArea.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="propertyCityState"
                        className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                      >
                        Município/UF
                      </Label>
                      <Input
                        id="propertyCityState"
                        type="text"
                        {...register("propertyCityState")}
                        className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.propertyCityState ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.propertyCityState && (
                        <p className="text-red-500 text-sm">
                          {errors.propertyCityState.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="propertyExploredArea"
                        className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                      >
                        Área explorada pelo requerente (ha)
                      </Label>
                      <Input
                        id="propertyExploredArea"
                        type="text"
                        {...register("propertyExploredArea")}
                        className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.propertyExploredArea ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.propertyExploredArea && (
                        <p className="text-red-500 text-sm">
                          {errors.propertyExploredArea.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="propertyName"
                        className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                      >
                        Nome da propriedade
                      </Label>
                      <Input
                        id="propertyName"
                        type="text"
                        {...register("propertyName")}
                        className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.propertyName ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.propertyName && (
                        <p className="text-red-500 text-sm">
                          {errors.propertyName.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="propertyOwnerCpf"
                        className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                      >
                        CPF do Proprietário
                      </Label>
                      <Input
                        id="propertyOwnerCpf"
                        type="text"
                        {...register("propertyOwnerCpf")}
                        className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.propertyOwnerCpf ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.propertyOwnerCpf && (
                        <p className="text-red-500 text-sm">
                          {errors.propertyOwnerCpf.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Button className=" w-full border-2 border-[#529FF6] bg-transparent text-[#529FF6] cursor-pointer hover:bg-[#529FF6] hover:text-white  ">
                      Adicionar novo integrante <Plus />
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
                      { label: "Atividade" },
                      {
                        label: "Subsistência/venda",
                        type: "select",
                        options: ["Teste 1", "Teste 2"],
                      },
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
                    <Checkbox
                      {...register("hasIpiTax")}
                      value="sim"
                      className=" border-1 border-[#A7A7A7] rounded-[0px] "
                      id="hasIpiTaxYes"
                    />
                    <Label
                      htmlFor="hasIpiTaxYes"
                      className="text-[14px]   text-[#1C3552] font-[300] "
                    >
                      Sim
                    </Label>
                  </div>

                  <div className=" flex flex-row items-center gap-2 ml-4 ">
                    <Checkbox
                      {...register("hasIpiTax")}
                      value="nao"
                      className=" border-1 border-[#A7A7A7] rounded-[0px] "
                      id="hasIpiTaxNo"
                    />
                    <Label
                      htmlFor="hasIpiTaxNo"
                      className="text-[14px]   text-[#1C3552] font-[300] "
                    >
                      Não
                    </Label>
                  </div>
                  <TableEditable
                    name="ipiTaxDetails"
                    colums={[
                      { label: "Produto" },
                      { label: "Valor do IPI" },
                      { label: "Período" },
                    ]}
                    onChange={handleTableChange}
                    lineInitial={3}
                  />
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
                    <Checkbox
                      {...register("hasEmployees")}
                      value="sim"
                      className=" border-1 border-[#A7A7A7] rounded-[0px] "
                      id="hasEmployeesYes"
                    />
                    <Label
                      htmlFor="hasEmployeesYes"
                      className="text-[14px]   text-[#1C3552] font-[300] "
                    >
                      Sim
                    </Label>
                  </div>

                  <div className=" flex flex-row items-center gap-2 ml-4 ">
                    <Checkbox
                      {...register("hasEmployees")}
                      value="nao"
                      className=" border-1 border-[#A7A7A7] rounded-[0px] "
                      id="hasEmployeesNo"
                    />
                    <Label
                      htmlFor="hasEmployeesNo"
                      className="text-[14px]   text-[#1C3552] font-[300] "
                    >
                      Não
                    </Label>
                  </div>
                  <TableEditable
                    name="employeesDetails"
                    colums={[
                      { label: "Nome" },
                      { label: "CPF" },
                      { label: "Função" },
                      { label: "Período" },
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
                    <Checkbox
                      {...register("hasOtherActivityOrIncome")}
                      value="sim"
                      className=" border-1 border-[#A7A7A7] rounded-[0px] "
                      id="hasOtherActivityOrIncomeYes"
                    />
                    <Label
                      htmlFor="hasOtherActivityOrIncomeYes"
                      className="text-[14px]   text-[#1C3552] font-[300] "
                    >
                      Sim
                    </Label>
                  </div>

                  <div className=" flex flex-row items-center gap-2 ml-4 ">
                    <Checkbox
                      {...register("hasOtherActivityOrIncome")}
                      value="nao"
                      className=" border-1 border-[#A7A7A7] rounded-[0px] "
                      id="hasOtherActivityOrIncomeNo"
                    />
                    <Label
                      htmlFor="hasOtherActivityOrIncomeNo"
                      className="text-[14px]   text-[#1C3552] font-[300] "
                    >
                      Não
                    </Label>
                  </div>
                  <TableEditable
                    name="otherActivitiesIncome"
                    colums={[
                      { label: "Atividade" },
                      { label: "Renda Mensal" },
                      { label: "Período" },
                    ]}
                    onChange={handleTableChange}
                    lineInitial={3}
                  />
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
                    <Checkbox
                      {...register("hasSpecificIncomeSources")}
                      value="sim"
                      className=" border-1 border-[#A7A7A7] rounded-[0px] "
                      id="hasSpecificIncomeSourcesYes"
                    />
                    <Label
                      htmlFor="hasSpecificIncomeSourcesYes"
                      className="text-[14px]   text-[#1C3552] font-[300] "
                    >
                      Sim
                    </Label>
                  </div>

                  <div className=" flex flex-row items-center gap-2 ml-4 ">
                    <Checkbox
                      {...register("hasSpecificIncomeSources")}
                      value="nao"
                      className=" border-1 border-[#A7A7A7] rounded-[0px] "
                      id="hasSpecificIncomeSourcesNo"
                    />
                    <Label
                      htmlFor="hasSpecificIncomeSourcesNo"
                      className="text-[14px]   text-[#1C3552] font-[300] "
                    >
                      Não
                    </Label>
                  </div>
                  <TableEditable
                    name="specificIncomeSources"
                    colums={[
                      { label: "Tipo de Atividade" },
                      { label: "Renda Mensal" },
                      { label: "Período" },
                    ]}
                    onChange={handleTableChange}
                    lineInitial={3}
                  />
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
                    <Checkbox
                      {...register("isCooperativeMember")}
                      value="sim"
                      className=" border-1 border-[#A7A7A7] rounded-[0px] "
                      id="isCooperativeMemberYes"
                    />
                    <Label
                      htmlFor="isCooperativeMemberYes"
                      className="text-[14px]   text-[#1C3552] font-[300] "
                    >
                      Sim
                    </Label>
                  </div>

                  <div className=" flex flex-row items-center gap-2 ml-4 ">
                    <Checkbox
                      {...register("isCooperativeMember")}
                      value="nao"
                      className=" border-1 border-[#A7A7A7] rounded-[0px] "
                      id="isCooperativeMemberNo"
                    />
                    <Label
                      htmlFor="isCooperativeMemberNo"
                      className="text-[14px]   text-[#1C3552] font-[300] "
                    >
                      Não
                    </Label>
                  </div>
                  <TableEditable
                    name="cooperativeDetails"
                    colums={[
                      { label: "Nome da Cooperativa" },
                      { label: "CNPJ" },
                      { label: "Tipo de Participação" },
                    ]}
                    onChange={handleTableChange}
                    lineInitial={3}
                  />
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

                  <div className=" flex flex-row items-center gap-5 w-full ">
                    <div className="w-[50%] ">
                      <Label
                        htmlFor="signature"
                        className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                      >
                        Assinatura do segurado/requerente:
                      </Label>
                      <Input
                        id="signature"
                        type="text"
                        {...register("signature")}
                        className={` rounded-[0px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic border-t-0 border-r-0 border-l-0 border-b-1 border-[#CCCCCC]  shadow-none  ${
                          errors.signature ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.signature && (
                        <p className="text-red-500 text-sm">
                          {errors.signature.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Botões */}
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
