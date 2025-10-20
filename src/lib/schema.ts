import { z } from 'zod';
import { FormField } from '@/stores/formBuilderStore';

export function buildZodSchema(fields: FormField[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const f of fields) {
    switch (f.type) {
      case 'text': {
        const s = z.string();
        shape[f.id] = f.required ? s.min(1, 'Campo obrigatório') : s.optional();
        break;
      }
      case 'number': {
        const base = z.preprocess((val) => {
          if (typeof val === 'string' && val.trim() === '') return undefined;
          if (typeof val === 'number' && Number.isNaN(val)) return undefined;
          return typeof val === 'string' ? Number(val) : val;
        }, z.number({ invalid_type_error: 'Número inválido' }));
        shape[f.id] = f.required ? base : base.optional();
        break;
      }
      case 'select': {
        const opts = (f.options ?? []).filter(Boolean);

        if (opts.length > 0) {
          const enumSchema = z.enum(opts as [string, ...string[]]);

          const withEmpty = z.union([enumSchema, z.literal('')]);
          shape[f.id] = f.required
            ? withEmpty.refine((v) => v !== '', 'Campo obrigatório')
            : z
                .preprocess((v) => (v === '' ? undefined : v), enumSchema)
                .optional();
        } else {
          const str = z.string();
          shape[f.id] = f.required ? str.min(1, 'Campo obrigatório') : str.optional();
        }
        break;
      }
      case 'checkbox': {
        const b = z.boolean();
        shape[f.id] = f.required
          ? b.refine((val) => !!val, 'Campo obrigatório')
          : b.optional();
        break;
      }
    }
  }

  return z.object(shape);
}

export const formModelSchema = z.object({
  version: z.string().default('1'),
  fields: z.array(z.object({
    id: z.string(),
    label: z.string(),
    type: z.enum(['text','number','select','checkbox']),
    required: z.boolean().optional(),
    options: z.array(z.string()).optional(),
  })),
});

export type FormModel = z.infer<typeof formModelSchema>;
