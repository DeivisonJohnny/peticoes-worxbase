import { useEffect, useState, type ElementType } from "react";

import AutodeclaracaoRural from "@/components/form-documents/AutodeclaracaoRural";
import DeclaracaoNaoRecebimentoForm from "@/components/form-documents/DeclaracaoNaoRecebimento";
import ProcuracaoInssForm from "@/components/form-documents/ProcuracaoInssForm";
import TermoRepresentacao from "@/components/form-documents/TermoRepresentacao";
import { Button } from "@/components/ui/button";
import { Divider } from "antd";
import { ArrowRight, CircleCheckBig, LucideProps, Play } from "lucide-react";
import styled from "styled-components";
import LoasDeficiencia from "@/components/form-documents/LoasDeficiencia";
import LoasIdoso from "@/components/form-documents/LoasIdoso";
import AuxilioDoenca from "@/components/form-documents/AuxilioDoenca";
import ProcuracaoPPP from "@/components/form-documents/ProcuracaoPPP";
import ProcuracaoDeclaracaoJudicial from "@/components/form-documents/ProcuracaoDeclaracaoJudicial";
import ContratoHonorarios from "@/components/form-documents/ContratoHonorarios";

interface classNameStatusProps {
  div: string;
  text: string;
}

interface listFormsProps {
  idForm: string;
  label: string;
  completed: "preenchido" | "parcial" | "vazio";
  icon: ElementType;
  form: React.ReactNode;
  propsIcon: LucideProps;
  classNameStatus?: classNameStatusProps;
}

const listForms: listFormsProps[] = [
  {
    idForm: "contrato-honorarios",
    label: "Contrato de Honorarios",
    completed: "preenchido",
    icon: CircleCheckBig,
    form: <ContratoHonorarios />,
    propsIcon: {
      color: "#F5F5F5",
      fill: "#00B215",
      size: 24,
    },
    classNameStatus: {
      div: " bg-[#00B2151A] rounded-[50px] h-fit px-[10px] py-[2px]  hover:bg-[#77ff874f] ",
      text: " text-[#00B215] text-[14px] font-[500] cursor-pointer",
    },
  },
  {
    idForm: "procuracao-declaracao-judicial",
    label: "Procuração e Declaracão Judicias",
    completed: "preenchido",
    icon: CircleCheckBig,
    form: <ProcuracaoDeclaracaoJudicial />,
    propsIcon: {
      color: "#F5F5F5",
      fill: "#00B215",
      size: 24,
    },
    classNameStatus: {
      div: " bg-[#00B2151A] rounded-[50px] h-fit px-[10px] py-[2px]  hover:bg-[#77ff874f] ",
      text: " text-[#00B215] text-[14px] font-[500] cursor-pointer",
    },
  },
  {
    idForm: "procuracao-ppp",
    label: "Procuração - PPP",
    completed: "preenchido",
    icon: CircleCheckBig,
    form: <ProcuracaoPPP />,
    propsIcon: {
      color: "#F5F5F5",
      fill: "#00B215",
      size: 24,
    },
    classNameStatus: {
      div: " bg-[#00B2151A] rounded-[50px] h-fit px-[10px] py-[2px]  hover:bg-[#77ff874f] ",
      text: " text-[#00B215] text-[14px] font-[500] cursor-pointer",
    },
  },
  {
    idForm: "auxilio-doenca",
    label: "Auxilio Doença",
    completed: "preenchido",
    icon: CircleCheckBig,
    form: <AuxilioDoenca />,
    propsIcon: {
      color: "#F5F5F5",
      fill: "#00B215",
      size: 24,
    },
    classNameStatus: {
      div: " bg-[#00B2151A] rounded-[50px] h-fit px-[10px] py-[2px]  hover:bg-[#77ff874f] ",
      text: " text-[#00B215] text-[14px] font-[500] cursor-pointer",
    },
  },
  {
    idForm: "loas-idoso",
    label: "Loas Idoso",
    completed: "preenchido",
    icon: CircleCheckBig,
    form: <LoasIdoso />,
    propsIcon: {
      color: "#F5F5F5",
      fill: "#00B215",
      size: 24,
    },
    classNameStatus: {
      div: " bg-[#00B2151A] rounded-[50px] h-fit px-[10px] py-[2px]  hover:bg-[#77ff874f] ",
      text: " text-[#00B215] text-[14px] font-[500] cursor-pointer",
    },
  },
  {
    idForm: "loas-deficiencia",
    label: "Loas Deficiência",
    completed: "preenchido",
    icon: CircleCheckBig,
    form: <LoasDeficiencia />,
    propsIcon: {
      color: "#F5F5F5",
      fill: "#00B215",
      size: 24,
    },
    classNameStatus: {
      div: " bg-[#00B2151A] rounded-[50px] h-fit px-[10px] py-[2px]  hover:bg-[#77ff874f] ",
      text: " text-[#00B215] text-[14px] font-[500] cursor-pointer",
    },
  },
  {
    idForm: "procuracao-inss",
    label: "Procuração INSS",
    completed: "preenchido",
    icon: CircleCheckBig,
    form: <ProcuracaoInssForm />,
    propsIcon: {
      color: "#F5F5F5",
      fill: "#00B215",
      size: 24,
    },
    classNameStatus: {
      div: " bg-[#00B2151A] rounded-[50px] h-fit px-[10px] py-[2px]  hover:bg-[#77ff874f] ",
      text: " text-[#00B215] text-[14px] font-[500] cursor-pointer",
    },
  },
  {
    idForm: "autodeclaracao-rural",

    label: "Autodeclaração rural",
    completed: "parcial",
    icon: CircleCheckBig,
    form: <AutodeclaracaoRural />,

    propsIcon: {
      color: "#00B215",
      className: " w-[18px] h-[18px] ",
    },
    classNameStatus: {
      div: "bg-[#A1A1A126] rounded-[50px] h-fit px-[10px] py-[2px] hover:bg-[#E1E1E1]",
      text: "text-[#13529C] text-[14px] font-[500] cursor-pointer ",
    },
  },
  {
    idForm: "termo-representacao",

    label: "Termo de representação",
    completed: "vazio",
    icon: Play,
    form: <TermoRepresentacao />,

    propsIcon: {
      color: "#529FF6",
      className: " w-[18px] h-[18px] ",
      fill: "#529FF6",
    },
    classNameStatus: {
      div: " bg-[#529FF626] rounded-[50px] h-fit px-[10px] py-[2px]  hover:bg-[#77ff874f] flex flex-row items-center gap-1",
      text: "text-[#13529C] text-[14px] font-[500] cursor-pointer",
    },
  },
  {
    idForm: "declaracao-nao-recebimento",
    label: "Declaração de não recebimento",
    completed: "vazio",
    icon: Play,
    form: <DeclaracaoNaoRecebimentoForm />,
    propsIcon: {
      color: "#529FF6",
      className: " w-[18px] h-[18px] ",
      fill: "#529FF6",
    },
    classNameStatus: {
      div: " bg-[#529FF626] rounded-[50px] h-fit px-[10px] py-[2px]  hover:bg-[#77ff874f] flex flex-row items-center gap-1",
      text: "text-[#13529C] text-[14px] font-[500] cursor-pointer",
    },
  },
];

const FormContainer = styled.div`
  transition: all 0.3s ease-in-out;
  opacity: 1;
  transform: translateY(0);

  &.changing {
    opacity: 0;
    transform: translateY(10px);
  }
`;

export default function Documents() {
  const [formIsShown, setFormIsShown] = useState<{
    idForm: string;
    component: React.ReactNode;
  }>({
    idForm: listForms[0].idForm,
    component: listForms[0].form,
  });
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    console.log("click reconhecido");
    console.log(formIsShown);
  }, [formIsShown]);

  const handleFormChange = (dataForm: {
    idForm: string;
    newForm: React.ReactNode;
  }) => {
    setIsChanging(true);
    setTimeout(() => {
      setFormIsShown({ idForm: dataForm.idForm, component: dataForm.newForm });
      setIsChanging(false);
    }, 150);
  };

  return (
    <main className=" max-w-[1200px] w-full mx-auto pb-[100px] px-5 ">
      <div className="text-[#9A9A9A] font-light text-[14px] px-0  py-6  ">
        Cadastro de clientes &gt; Documentos
      </div>

      <div className="w-full flex flex-col justify-center items-center gap-[15px] border-1 border-[#DFDFDF] rounded-[8px] py-[8px] px-[34px] mb-[25px] ">
        <p className=" text-[14px] text-[#529FF6] ">Procuração INSS</p>
        <div className="flex flex-row items-center gap-[10px]">
          <Ball className="active" />
          <Ball />
          <Ball />
        </div>
        <p className=" text-[12px] text-[#529FF6] font-[300] ">
          Documento 1 de 3
        </p>
      </div>

      <FormContainer className={isChanging ? "changing" : ""}>
        {formIsShown.component}
      </FormContainer>

      <Divider />
      <div className=" flex flex-col gap-4 ">
        <p className="text-[#529FF6] font-[700] text-[24px] px-0">
          Próximos docs
        </p>

        <div className=" w-full flex flex-col gap-3 ">
          {listForms.map((item) => {
            const IconDynamic = item.icon;

            return item.idForm !== formIsShown.idForm ? (
              <Button
                key={item.idForm}
                className=" bg-[#F5F5F5] text-[#1C3552] text-[16px] flex flex-row items-center justify-between  w-full rounded-[8px] h-[40px] cursor-pointer  hover:bg-[#E1E1E1]  "
                onClick={() =>
                  handleFormChange({ idForm: item.idForm, newForm: item.form })
                }
              >
                <div className=" flex flex-row items-center gap-2 ">
                  <IconDynamic {...item.propsIcon} />

                  <span className=" text-[#13529C]  text-[16px] font-[400]  ">
                    {item.label}
                  </span>
                </div>

                <div className={item.classNameStatus?.div}>
                  <p className={item.classNameStatus?.text}>
                    {item.completed === "vazio"
                      ? "Clique para preencher este documento"
                      : item.completed === "parcial"
                      ? "Em processo..."
                      : "Documento preenchido!"}
                  </p>

                  {item.completed === "vazio" && <ArrowRight color="#13529C" />}
                </div>
              </Button>
            ) : null;
          })}
        </div>
      </div>
    </main>
  );
}

const Ball = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #d9d9d9;

  & .active {
    background-color: #529ff6 !important ;
  }
`;
