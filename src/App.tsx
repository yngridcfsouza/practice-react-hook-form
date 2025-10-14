import FormPreview from "./pages/FormPreview";

export function App() {
  return (
    <div className="size-[500px] flex justify-center items-center flex-col gap-4 m-auto p-10">
      <h1 className="font-semibold text-2xl">Building Forms</h1>
      <FormPreview />
    </div>
  );
}
