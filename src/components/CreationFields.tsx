import { FieldType } from "@/stores/formBuilderStore";

import { Input } from "./ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";

interface CreationFieldsProps {
  label: string;
  type: FieldType;
  selectOptions: string;
  required: boolean;
  setLabel: (label: string) => void;
  setType: (type: FieldType) => void;
  setSelectOptions: (selectOptions: string) => void;
  setRequired: (required: boolean) => void;
}

export default function CreationFields({
  label,
  type,
  selectOptions,
  required,
  setLabel,
  setType,
  setSelectOptions,
  setRequired
}: CreationFieldsProps) {
  return(
    <div className="grid grid-cols-1 gap-3">
      <div>
        <Input
          placeholder="Digite o label do campo"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </div>

      <div>
        <Select value={type} onValueChange={(value: FieldType) => setType(value)}>
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
          onCheckedChange={setRequired}
          aria-label="Campo obrigatório"
        />
      </div>
    </div>
  );
}
