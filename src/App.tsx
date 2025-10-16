import { useState } from "react";
import { FormBuilder } from "./components/FormBuilder";
import { Button } from "./components/ui/Button";
import FormPreview from "./pages/FormPreview";
import { Toaster } from "sonner";

export function App() {
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className={`max-w-5xl m-auto mt-10 p-6 space-y-4 ${isVisible ? "w-full" : "w-[500px]"}`}>
      <h1 className="font-semibold text-2xl mb-4">Building Forms</h1>
      <div className={`space-y-6 ${isVisible ? "grid md:grid-cols-2 gap-6" : "flex flex-col"}`}>
        <FormBuilder />

        {isVisible && <FormPreview />}
      </div>
      <div className="flex items-center justify-center">
        <Button
          onClick={handleClick}
          className={`w-full ${isVisible ? "bg-red-700 hover:bg-red-800 text-white max-w-[500px]" : "bg-blue-500"}`}
        >
          {isVisible ? "Fechar Formulário" : "Visualizar Formulário"}
        </Button>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
