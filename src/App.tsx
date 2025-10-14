import FormPreview from "./pages/FormPreview";
import { FormBuilder } from "./components/FormBuilder";

export function App() {
  return (
    <div className="max-w-5xl m-auto p-6">
      <h1 className="font-semibold text-2xl mb-4">Building Forms</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <FormBuilder />
        <FormPreview />
      </div>
    </div>
  );
}
