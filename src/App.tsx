import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Layout, PublicLayout } from "./components/layout/Layout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Home } from "./pages/Home";
import { MedicalGuide } from "./pages/MedicalGuide";
import { Authorizations } from "./pages/Authorizations";
import { Financial } from "./pages/Financeiro";
import { Comercial } from "./pages/Comercial";
import { PasswordRecovery } from "./pages/PasswordRecovery";
import NotFound from "./pages/NotFound";
import { Beneficios } from "./pages/Beneficios";
import { MedicinaPreventiva } from "./pages/MedicinaPreventiva";
import { SOS } from "./pages/Sos";
import { Ortopedico } from "./pages/ortopedico";
import { ANS } from "./pages/ANS";
import { Utilizacao } from "./pages/utilizacao";
import { DadosContrato } from "./pages/DadosContrato";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Login />} />
              <Route path="login" element={<Login />} />
              <Route path="cadastro" element={<Register />} />
            </Route>

            {/* Protected Routes */}
            <Route path="/Home" element={<Layout />}>
              <Route index element={<Home />} />
            </Route>

            <Route path="/guia-medico" element={<Layout />}>
              <Route index element={<MedicalGuide />} />
            </Route>

            <Route path="/autorizacoes" element={<Layout />}>
              <Route index element={<Authorizations />} />
            </Route>

            <Route path="/financeiro" element={<Layout />}>
              <Route index element={<Financial />} />
            </Route>

            <Route path="/comercial" element={<Layout />}>
              <Route index element={<Comercial />} />
            </Route>

            <Route path="/recuperar-senha" element={<PublicLayout />}>
              <Route index element={<PasswordRecovery />} />
            </Route>

            <Route path="/beneficios" element={<Layout />}>
              <Route index element={<Beneficios />} />
            </Route>

            <Route path="/medicina-preventiva" element={<Layout />}>
              <Route index element={<MedicinaPreventiva />} />
            </Route>

            <Route path="/contratar-sos" element={<Layout />}>
              <Route index element={<SOS />} />
            </Route>

            <Route path="/ortopedico" element={<Layout />}>
              <Route index element={<Ortopedico />} />
            </Route>

            <Route path="/ANS" element={<Layout />}>
              <Route index element={<ANS />} />
            </Route>

            <Route path="/utilizacao" element={<Layout />}>
              <Route index element={<Utilizacao />} />
            </Route>

            <Route path="/contrato" element={<Layout />}>
              <Route index element={<DadosContrato />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
