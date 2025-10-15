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
  removeField: (id: string) => void;
}

export const useFormBuilderStore = create<FormBuilderState>((set) => ({
  fields: [],
  addField: (field: FormField) =>
    set((state) => ({ fields: [...state.fields, field]})),
  setFields: (fields: FormField[]) =>
    set({ fields }),
  removeField: (id: string) =>
    set((state) => ({ fields: state.fields.filter((field) => field.id !== id)})),
}));
