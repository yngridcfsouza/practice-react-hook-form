import { create } from 'zustand';

export type FieldType = 'text' | 'number' | 'select' | 'checkbox';

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
}

interface FormBuilderState {
  fields: FormField[];
  addField: (field: FormField) => void;
  setFields: (fields: FormField[]) => void;
  updateField: (id: string, field: FormField) => void;
  removeField: (id: string) => void;
}

export const useFormBuilderStore = create<FormBuilderState>((set) => ({
  fields: [],
  setFields: (fields: FormField[]) =>
    set({ fields }),
  addField: (field: FormField) =>
    set((state) => ({ fields: [...state.fields, field]})),
  updateField: (id: string, field: FormField) =>
    set((state) => ({
      fields: state.fields.map(
      (f) => f.id === id ? { ...f, ...field } : f
      ),
    })),
  removeField: (id: string) =>
    set((state) => ({ fields: state.fields.filter((f) => f.id !== id)})),
}));
