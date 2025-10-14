import { useState } from "react";
import { Input } from "./ui/Input";
import { FieldType, useFormBuilderStore } from "../stores/formBuilderStore";
import { nanoid } from "nanoid";

export function FormBuilder() {
  const { fields, addField, removeField } = useFormBuilderStore();
  const [label, setLabel] = useState("");
  const [type, setType] = useState<FieldType>("text");

  const handleAddField = () => {
    addField({ id: nanoid(), label, type });
    setLabel("");
    setType("text");
  };

  return (
    <div>
      <h2>Construtor de formulário</h2>
      <Input
        placeholder="Digite aqui..."
      />
      <select value={type} onChange={(e) => setType(e.target.value as FieldType)}>
        <option value="text">Texto</option>
        <option value="number">Número</option>
        <option value="select">Seleção</option>
        <option value="checkbox">Checkbox</option>
      </select>
      <button onClick={handleAddField}>Adicionar campo</button>
      <div>
        {fields.map((field) => (
          <div key={field.id}>
            {field.label} - ({field.type}){' '}
            <button onClick={() => removeField(field.id)}>Remover</button>
          </div>
        ))}
      </div>
    </div>
  );
}
