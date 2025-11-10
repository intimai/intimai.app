import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const DuplicateIntimationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    window.location.reload();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex flex-col items-center justify-center text-center">
            <AlertTriangle className="h-16 w-16 text-yellow-400 mb-4" />
            <DialogTitle className="text-2xl font-bold">Intimação Duplicada</DialogTitle>
          </div>
        </DialogHeader>
        <DialogDescription className="text-center text-base">
          Já existe uma intimação com este número de telefone. Verifique os dados e tente novamente.
        </DialogDescription>
        <DialogFooter>
          <Button onClick={handleClose} className="w-full bg-purple-600 hover:bg-purple-700">
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateIntimationModal;