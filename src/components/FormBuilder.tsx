import { useState } from "react";
import { Field, FieldType, useFormBuilderStore } from "@/stores/formBuilderStore";
import { nanoid } from "nanoid";
import { Reorder } from 'framer-motion';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit2, GripVertical, Trash } from 'lucide-react';
import CreationFields from "@/components/CreationFields";
import { toast } from 'sonner';

export function FormBuilder() {
  const { fields, setFields, addField, updateField, removeField } = useFormBuilderStore();

  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState<FieldType>("text");
  const [newRequired, setNewRequired] = useState(false);
  const [newSelectOptions, setNewSelectOptions] = useState("");

  const [editingField, setEditingField] = useState<Field | null>(null);

  const resetCreationForm = () => {
    setNewLabel("");
    setNewType("text");
    setNewRequired(false);
    setNewSelectOptions("");
  };

  const handleAddField = () => {
    if (!newLabel.trim()) {
      toast.warning('Informe um label para adicionar o campo.');
      return;
    }
    const options = newType === "select"
      ? newSelectOptions.split(",").map((opt) => opt.trim()).filter(Boolean)
      : undefined;
    addField({ id: nanoid(), label: newLabel.trim(), type: newType, required: newRequired, options });
    resetCreationForm();
    toast.success('Campo adicionado');
  };

  const handleUpdateField = () => {
    if (!editingField) return;
    if (!editingField.label.trim()) {
      toast.warning('Informe um label válido.');
      return;
    }
    updateField(editingField.id, editingField);
    setEditingField(null); // Fecha o modal após a atualização
    toast.success('Campo atualizado');
  };

  // Função para abrir o modal de edição com os dados do campo selecionado
  const openEditModal = (field: Field) => {
    setEditingField(field);
  };

  return (
    <div className="w-full max-w-xl rounded-lg border p-4 space-y-4">
      <div className="border-b pb-4 space-y-4">
        <h2 className="text-lg font-medium">Comece a montar seu formulário</h2>
        <h3 className="text-sm text-muted-foreground mt-1">Determine abaixo os campos que deseja incluir.</h3>
        <CreationFields
          label={newLabel}
          type={newType}
          selectOptions={newSelectOptions}
          required={newRequired}
          setLabel={setNewLabel}
          setType={setNewType}
          setSelectOptions={setNewSelectOptions}
          setRequired={setNewRequired}
        />
        <div className="mt-4">
          <Button type="button" onClick={handleAddField}>
            Adicionar campo
          </Button>
        </div>
      </div>

      <div className="pt-2">
        <h3 className="text-sm font-medium mb-2">Campos adicionados</h3>
        <Reorder.Group axis="y" values={fields} onReorder={setFields} className="space-y-2">
          {fields.map((field) => (
            <Reorder.Item key={field.id} value={field} className="flex items-center justify-between rounded-md border bg-card text-card-foreground p-3 shadow-sm">
              <div className="text-sm flex items-center gap-2">
                <GripVertical size={16} className="cursor-grab text-muted-foreground" />
                <span className="font-medium">{field.label}</span>
                <span className="text-muted-foreground">({field.type})</span>
                {field.required && <span className="text-xs text-destructive">obrigatório</span>}
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => openEditModal(field)}>
                  <Edit2 size={12} />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    removeField(field.id);
                    toast.success('Campo removido');
                  }}
                >
                  <Trash size={12} />
                </Button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
        {fields.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Nenhum campo adicionado ainda.</p>}
      </div>

      <Dialog open={!!editingField} onOpenChange={(isOpen) => !isOpen && setEditingField(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar campo</DialogTitle>
            <DialogDescription>Edite as informações do campo abaixo.</DialogDescription>
          </DialogHeader>
          {editingField && (
            <CreationFields
              label={editingField.label}
              type={editingField.type}
              selectOptions={editingField.options?.join(", ") || ""}
              required={editingField.required}
              setLabel={(label) => setEditingField(prev => ({...prev!, label: label.trim()}))}
              setType={(type) => setEditingField(prev => ({...prev!, type, options: type !== 'select' ? [] : prev!.options}))}
              setSelectOptions={(opts) => setEditingField(prev => ({...prev!, options: opts.split(',').map(s => s.trim()).filter(Boolean)}))}
              setRequired={(req) => setEditingField(prev => ({...prev!, required: req}))}
            />
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditingField(null)}>Cancelar</Button>
            <Button type="button" onClick={handleUpdateField}>Atualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

