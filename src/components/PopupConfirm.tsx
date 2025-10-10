"use client";

import { ReactNode } from "react";
import styled from "styled-components";
import { Dialog, DialogContent, DialogOverlay } from "./ui/dialog";

interface PopupConfirmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: ReactNode;
}

export function PopupCustom({
  open,
  onOpenChange,
  children,
}: PopupConfirmProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay />
      <Content className="light">{children}</Content>
    </Dialog>
  );
}

const Content = styled(DialogContent)`
  background-color: white;
  gap: 30px;
  border-color: #155dfc;
`;
