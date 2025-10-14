import { useForm } from 'react-hook-form';
import { useFormBuilderStore } from '../stores/formBuilderStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function FormPreview() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { fields } = useFormBuilderStore();

  const onSubmit = (data: any) => {
    console.log('Resposta:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xl rounded-lg border p-4 space-y-4">
      <h2 className="text-lg font-medium">Prévia do Formulário</h2>
      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground">Adicione campos no construtor para pré-visualizar aqui.</p>
      )}
      {fields.map((field) => {
        const baseRules = {
          required: field.required ? 'Campo obrigatório' : false,
        } as const;

        if (field.type === 'text' || field.type === 'number') {
          return (
            <div key={field.id} className="space-y-1">
              <label className="text-sm font-medium" htmlFor={field.id}>{field.label}</label>
              <Input
                id={field.id}
                type={field.type}
                {...register(field.id, {
                  ...baseRules,
                  valueAsNumber: field.type === 'number' ? true : undefined,
                })}
              />
              {errors[field.id] && (
                <p className="text-xs text-destructive">{String(errors[field.id]?.message || 'Inválido')}</p>
              )}
            </div>
          );
        }

        if (field.type === 'select') {
          return (
            <div key={field.id} className="space-y-1">
              <label className="text-sm font-medium" htmlFor={field.id}>{field.label}</label>
              <select
                id={field.id}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register(field.id, baseRules)}
              >
                <option value="">Selecione</option>
                {(field.options || []).map((opt) => (
                  <option key={`${field.id}-${opt}`} value={opt}>{opt}</option>
                ))}
              </select>
              {errors[field.id] && (
                <p className="text-xs text-destructive">{String(errors[field.id]?.message || 'Inválido')}</p>
              )}
            </div>
          );
        }

        if (field.type === 'checkbox') {
          return (
            <div key={field.id} className="flex items-center gap-2">
              <input
                id={field.id}
                type="checkbox"
                className="h-4 w-4"
                {...register(field.id, baseRules)}
              />
              <label htmlFor={field.id} className="text-sm">{field.label}</label>
              {errors[field.id] && (
                <p className="text-xs text-destructive">{String(errors[field.id]?.message || 'Inválido')}</p>
              )}
            </div>
          );
        }
        return null;
      })}

      <div className="pt-2">
        <Button type="submit">Enviar</Button>
      </div>
    </form>
  );
}
