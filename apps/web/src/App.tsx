import { Toaster } from "sonner";
import { OrderManagement } from "./features/order/components/OrderManagement";
import "./index.css";

export function App() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-secondary border-b border-tertiary-border">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-sora font-bold text-primary">SCOS</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <OrderManagement />
      </main>

      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
