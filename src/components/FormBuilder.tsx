import { useState } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Switch } from "./ui/Switch";
import { FieldType, useFormBuilderStore } from "../stores/formBuilderStore";
import { nanoid } from "nanoid";

export function FormBuilder() {
  const { fields, addField, removeField } = useFormBuilderStore();
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

  return (
    <div className="w-full max-w-xl rounded-lg border p-4 space-y-4">
      <h2 className="text-lg font-medium">Construtor de formulário</h2>

      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-sm mb-1 block">Label do campo</label>
          <Input
            placeholder="Digite o label do campo"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm mb-1 block">Tipo do campo</label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={type}
            onChange={(e) => setType(e.target.value as FieldType)}
          >
            <option value="text">Texto</option>
            <option value="number">Número</option>
            <option value="select">Seleção</option>
            <option value="checkbox">Checkbox</option>
          </select>
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
        <div className="space-y-2">
          {fields.map((field) => (
            <div
              key={field.id}
              className="flex items-center justify-between rounded-md border px-3 py-2"
            >
              <div className="text-sm">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
