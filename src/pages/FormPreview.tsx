import { useForm } from 'react-hook-form';
import { useFormBuilderStore } from '../stores/formBuilderStore';
import { Input } from '@/components/ui/Input';

export default function FormPreview() {
  const { register, handleSubmit } = useForm();
  const { fields } = useFormBuilderStore();

  const onSubmit = (data: any) => {
    console.log('Resposta:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Prévia do Formulário</h2>
      {fields.map((field) => {
        if (field.type === 'text' || field.type === 'number') {
          return (
            <div key={field.id}>
              <label>{field.label}</label>
              <Input
                type={field.type}
                {...register(field.id)}
              />
            </div>
          );
        }

        if (field.type === 'select') {
          return (
            <div key={field.id}>
              <label>{field.label}</label>
              <select {...register(field.id)}>
                <option value="">Selecione</option>
                <option value="opcao1">Opção 1</option>
                <option value="opcao2">Opção 2</option>
              </select>
            </div>
          );
        }
        return null;
      })}

      <button type="submit">Enviar</button>
    </form>
  );
}
