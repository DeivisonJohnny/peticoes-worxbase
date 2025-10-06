import styled from "styled-components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";

type TableEditableColumnsType = {
  label: string;
  type?: "input" | "select" | "checkbox";
  options?: string[];
};

interface TableEditableProps {
  name: string;
  lineInitial: number;
  colums: TableEditableColumnsType[];
  onChange?: (data: { name: string; values: string[][] }) => void;
}

export default function TableEditable({
  name,
  lineInitial = 3,
  colums,
  onChange,
}: TableEditableProps) {
  const [col] = useState<TableEditableColumnsType[]>(colums);
  const [countLines, setCountLines] = useState(lineInitial);

  const [values, setValues] = useState<string[][]>(
    Array.from({ length: lineInitial }, () =>
      Array.from({ length: col.length }, () => "")
    )
  );

  useEffect(() => {
    if (onChange) {
      onChange({ name, values });
    }
  }, [values, name, onChange]);

  const removeLine = () => {
    if (countLines <= 1) return;
    setCountLines((prev) => prev - 1);
    setValues((prev) => prev.slice(0, -1));
  };

  const addLine = () => {
    setCountLines((prev) => prev + 1);
    setValues((prev) => [
      ...prev,
      Array.from({ length: col.length }, () => ""),
    ]);
  };

  const handleChange = (row: number, column: number, newValue: string) => {
    setValues((prev) =>
      prev.map((line, rowIndex) =>
        rowIndex === row
          ? line.map((cell, colIndex) =>
              colIndex === column ? newValue : cell
            )
          : line
      )
    );
  };

  const renderCell = (
    col: TableEditableColumnsType,
    value: string,
    onChange: (v: string) => void
  ) => {
    switch (col.type) {
      case "select":
        return (
          <SelectField value={value} onValueChange={onChange}>
            <SelectTrigger className="w-[90%] border-1 border-[#DADADA] rounded-[4px] mx-auto text-[#1C3552_!important] ">
              <SelectValue
                placeholder="Clique para selecionar opção"
                className="text-[#1C3552] text-center "
              />
            </SelectTrigger>
            <SelectContent>
              {col.options?.map((opt) => (
                <SelectItem key={opt} value={opt} className="text-[#1C3552]">
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectField>
        );

      case "checkbox":
        const selected = value ? value.split(",") : [];
        return (
          <div className="flex flex-col gap-2 items-start">
            {col.options?.map((opt, i) => {
              const id = `${col.label}-${i}`;
              return (
                <div key={opt} className="flex items-center gap-2 ml-2">
                  <CheckboxField
                    id={id}
                    checked={selected.includes(opt)}
                    onCheckedChange={(checked) => {
                      let newSelected = [...selected];
                      if (checked) {
                        newSelected.push(opt);
                      } else {
                        newSelected = newSelected.filter((s) => s !== opt);
                      }
                      onChange(newSelected.join(","));
                    }}
                  />
                  <LabelCheckbox htmlFor={id}>{opt}</LabelCheckbox>
                </div>
              );
            })}
          </div>
        );

      default:
        return (
          <Input value={value} onChange={(e) => onChange(e.target.value)} />
        );
    }
  };

  return (
    <Container>
      <TableEditableContainer>
        <Thead>
          <TableRow>
            {col.map((c, i) =>
              i === 0 ? (
                <ThLeft key={i}>{c.label}</ThLeft>
              ) : i === col.length - 1 ? (
                <ThRight key={i}>{c.label}</ThRight>
              ) : (
                <Th key={i}>{c.label}</Th>
              )
            )}
          </TableRow>
        </Thead>
        <TableBody>
          {Array.from({ length: countLines }).map((_, rowIndex) => (
            <Tr key={`${name}-${rowIndex}`}>
              {col.map((colItem, colIndex) => (
                <Td
                  key={`${name}-${rowIndex}-${colIndex}`}
                  className={
                    colItem.type == "checkbox" || colItem.type == "select"
                      ? "py-[8px_!important]"
                      : ""
                  }
                >
                  {renderCell(
                    col[colIndex],
                    values[rowIndex]?.[colIndex] ?? "",
                    (newVal) => handleChange(rowIndex, colIndex, newVal)
                  )}
                </Td>
              ))}
            </Tr>
          ))}
        </TableBody>
      </TableEditableContainer>
      <ContainerButtonsActions>
        <RemoveLine onClick={removeLine} type="button">
          <Minus color="#529ff6" />
        </RemoveLine>
        <AddLine onClick={addLine} type="button">
          <Plus color="#529ff6" />
        </AddLine>
      </ContainerButtonsActions>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
`;

const TableEditableContainer = styled(Table)`
  border-collapse: separate;
  border-spacing: 0;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const ContainerButtonsActions = styled.div`
  position: absolute;
  bottom: -10px;
  left: -10px;
  width: calc(100% + 20px);

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AddLine = styled(Button)`
  padding: 0px;
  width: 20px;
  height: 20px;

  background-color: white;
  border-radius: 50%;
  color: #529ff6;
  border: 2px solid #529ff6;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  cursor: pointer;
  transition: all 400ms;
  &:hover {
    opacity: 1;
  }
`;

const RemoveLine = styled(Button)`
  padding: 0px;
  width: 20px;
  height: 20px;

  background-color: white;
  border-radius: 50%;
  color: #529ff6;
  border: 2px solid #529ff6;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  cursor: pointer;
  transition: all 400ms;
  &:hover {
    opacity: 1;
  }
`;
const Thead = styled(TableHeader)`
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  overflow: hidden;

  border: none;
`;

const Th = styled(TableHead)`
  padding: 0px;
  height: fit-content;
  border: 1px solid #ccc;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;

  color: #7d7d7d;
  font-size: 14px;
  padding-left: 5px;
`;

const ThLeft = styled(TableHead)`
  padding: 0px;
  height: fit-content;
  border: 1px solid #ccc;
  border-right: none;
  border-top-left-radius: 8px;
  color: #7d7d7d;
  font-size: 14px;
  padding-left: 5px;
`;

const ThRight = styled(TableHead)`
  padding: 0px;
  height: fit-content;
  border: 1px solid #ccc;
  border-top-right-radius: 8px;
  color: #7d7d7d;
  font-size: 14px;
  padding-left: 5px;
`;

// BODY TABVLE

const Tr = styled(TableRow)`
  min-height: 50px;
`;

const Td = styled(TableCell)`
  border-right: 1px solid #ccc;

  padding: 0px;
  border-bottom: 1px solid #ccc;
`;

// INPUTS, CHECKBOX, SELECT

const Input = styled.input`
  width: 100%;
  min-height: 50px;
  color: #1c3552;
  font-size: 16px;

  height: 100%;
  text-align: center;
  border: none;
  outline: none;
`;

const SelectField = styled(Select)`
  text-align: center;
  border: 1px solid #dadada;
`;

const CheckboxField = styled(Checkbox)`
  width: 16px;
  height: 16px;
  border: 1px solid #a7a7a7;
  border-radius: 2px;
  svg {
    stroke: white;
  }
`;

const LabelCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;

  font-family: "Roboto", sans-serif;
  font-weight: 300;
  font-size: 14px;
  cursor: pointer;
  color: #1c3552;
`;
