import styled from "styled-components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export default function TableEditable() {
  return (
    <TableEditableContainer>
      <Thead>
        <TableRow>
          <ThLeft>Forma de cessão*</ThLeft>
          <Th>Período (XX/XX/XXXX A XX/XX/XXXX)</Th>
          <ThRight>Área cedida em hectare - ha</ThRight>
        </TableRow>
      </Thead>
      <TableBody>
        <Tr>
          <Td>
            <Input />
          </Td>
          <Td>
            <Input />
          </Td>
          <Td>
            <Input />
          </Td>
        </Tr>
        <Tr>
          <Td>
            <Input />
          </Td>
          <Td>
            <Input />
          </Td>
          <Td>
            <Input />
          </Td>
        </Tr>
        <Tr>
          <Td>
            <Input />
          </Td>
          <Td>
            <Input />
          </Td>
          <Td>
            <Input />
          </Td>
        </Tr>
      </TableBody>
    </TableEditableContainer>
  );
}

const TableEditableContainer = styled(Table)`
  * {
    color: black;
  }

  border-collapse: separate;
  border-spacing: 0;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
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
  border-left: none;
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
