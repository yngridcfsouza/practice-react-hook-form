import { useState, useRef, useEffect } from "react";
import { Field, FieldType, useFormBuilderStore } from "@/stores/formBuilderStore";
import { nanoid } from "nanoid";

import { Reorder } from 'framer-motion';
import { toast } from 'sonner';
import { formModelSchema } from '@/lib/schema';
import { encodeFormModel, decodeFormModel } from '@/lib/share';

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

export function FormBuilder() {
  const { fields, setFields, addField, updateField, removeField } = useFormBuilderStore();

  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState<FieldType>("text");
  const [newRequired, setNewRequired] = useState(false);
  const [newSelectOptions, setNewSelectOptions] = useState("");

  const [editingField, setEditingField] = useState<Field | null>(null);

  const STORAGE_KEY = 'form:builder';
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSave = () => {
    const model = formModelSchema.parse({
      version: '1',
      fields,
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(model));
    toast.success('Formulário salvo');
  };

  const handleLoad = () => {
    const model = formModelSchema.parse(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'));
    setFields(model.fields);
    toast.success('Formulário carregado');
  };

  const handleExport = () => {
    const model = { version: '1', fields };
    const dataStr = JSON.stringify(model, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Formulário exportado');
  };

  const triggerImport = () => fileInputRef.current?.click();

  const onImportFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const result = formModelSchema.safeParse(parsed);
      if (!result.success) {
        toast.error('JSON inválido');
        return;
      }
      setFields(result.data.fields);
      toast.success('Formulário importado');
    } catch {
      toast.error('Erro ao importar JSON');
    } finally {
      e.target.value = '';
    }
  };

  const handleGenerateLink = async () => {
    const model = formModelSchema.parse({ version: '1', fields });
    const payload = encodeFormModel(model);
    const url = new URL(window.location.href);
    url.searchParams.set('form', payload);
    const shareUrl = url.toString();
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copiado para a área de transferência');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      toast.success('Link copiado');
    }
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const payload = url.searchParams.get('form');
    if (!payload) return;
    const result = decodeFormModel(payload);
    if (result.success && result.data) {
      setFields(result.data.fields);
      toast.success('Formulário carregado pelo link');
    } else {
      toast.error('Link inválido');
    }
  }, [setFields]);

  return (
    <div className="w-full max-w-xl rounded-lg border p-4 space-y-4 min-w-fit">
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
        <div className="flex gap-2 mt-2">
          <Button type="button" variant="outline" onClick={handleSave}>Salvar</Button>
          <Button type="button" variant="outline" onClick={handleLoad}>Carregar</Button>
          <Button type="button" variant="secondary" onClick={handleExport}>Exportar JSON</Button>
          <Button type="button" variant="secondary" onClick={triggerImport}>Importar JSON</Button>
          <Button type="button" variant="default" onClick={handleGenerateLink}>Gerar link</Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={onImportFileChange}
          />
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

