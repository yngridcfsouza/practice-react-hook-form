import { useState } from "react";
import { FieldType, useFormBuilderStore } from "../stores/formBuilderStore";
import { nanoid } from "nanoid";
import { Reorder, useDragControls } from 'framer-motion';

import { Button } from "./ui/Button";
import { Switch } from "./ui/Switch";
import { Input } from "./ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { GripVertical } from 'lucide-react';

export function FormBuilder() {
  const { fields, setFields, addField, removeField } = useFormBuilderStore();
  const [label, setLabel] = useState("");
  const [type, setType] = useState<FieldType>("text");
  const [required, setRequired] = useState(false);
  const [selectOptions, setSelectOptions] = useState("");

  const handleAddField = () => {
    if (!label.trim()) return;

    const options = type === "select"
      ? selectOptions
          .split(",")
          .map((opt) => opt.trim())
          .filter(Boolean)
      : undefined;

    addField({ id: nanoid(), label: label.trim(), type, required, options });
    setLabel("");
    setType("text");
    setRequired(false);
    setSelectOptions("");
  };

  const controls = useDragControls();

  return (
    <div className="w-full max-w-xl rounded-lg border p-4 space-y-4">
      <h2 className="text-lg font-medium">Comece a montar seu formulário</h2>
      <h3 className="font-small">Determine abaixo os campos que deseja incluir</h3>

      <div className="grid grid-cols-1 gap-3">
        <div>
          <Input
            placeholder="Digite o label do campo"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        <div>
          <Select onValueChange={(value: FieldType) => setType(value)}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder="Selecione o tipo do campo"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Texto</SelectItem>
              <SelectItem value="number">Número</SelectItem>
              <SelectItem value="select">Seleção</SelectItem>
              <SelectItem value="checkbox">Checkbox</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {type === "select" && (
          <div>
            <label className="text-sm mb-1 block">Opções (separadas por vírgula)</label>
            <Input
              placeholder="ex.: Opcão 1, Opcão 2, Opcão 3"
              value={selectOptions}
              onChange={(e) => setSelectOptions(e.target.value)}
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <label className="text-sm">Obrigatório</label>
          <Switch
            checked={required}
            onCheckedChange={(checked: boolean) => setRequired(checked)}
            aria-label="Campo obrigatório"
          />
        </div>

        <div>
          <Button type="button" onClick={handleAddField}>
            Adicionar campo
          </Button>
        </div>
      </div>

      <div className="pt-2">
        <h3 className="text-sm font-medium mb-2">Campos adicionados</h3>

        <Reorder.Group
          axis="y"
          values={fields}
          onReorder={setFields}
        >
          {fields.map((field) => (
            <Reorder.Item
              key={field.id}
              value={field}
              className="flex items-center justify-between rounded-md border px-3 py-2 mb-4"
            >
              <div className="text-sm flex items-center gap-2">
                <button
                  type="button"
                  onPointerDown={(e) => controls.start(e)}
                >
                  <GripVertical size={12} className="cursor-grab mr-4"/>
                </button>
                <span className="font-medium">{field.label}</span>{" "}
                <span className="text-muted-foreground">({field.type})</span>
                {field.required && (
                  <span className="ml-2 text-xs text-destructive">obrigatório</span>
                )}
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeField(field.id)}
              >
                Remover
              </Button>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
}
