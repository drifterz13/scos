import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { Navbar } from "./components/Navbar";
import { OrderManagement } from "./features/order/components/OrderManagement";
import { WarehouseManagement } from "./features/warehouse/components/WarehouseManagement";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-white">
          <Navbar />

          <main className="max-w-6xl mx-auto px-6 py-8">
            <Routes>
              <Route path="/" element={<OrderManagement />} />
              <Route path="/warehouses" element={<WarehouseManagement />} />
            </Routes>
          </main>

          <Toaster position="top-right" richColors />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
