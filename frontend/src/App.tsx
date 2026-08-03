import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster theme="dark" position="bottom-right" richColors />
    </BrowserRouter>
  );
}

export default App;
