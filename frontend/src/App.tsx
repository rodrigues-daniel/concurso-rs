// concursos-web/src/App.tsx

import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import InicioPage from "./pages/InicioPage";
import BancasPage from "./pages/BancasPage";
import ConcursosPage from "./pages/ConcursosPage";
import AssuntosPage from "./pages/AssuntosPage";
import QuestoesPage from "./pages/QuestoesPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/inicio" replace />} />
        <Route path="inicio" element={<InicioPage />} />
        <Route path="bancas" element={<BancasPage />} />
        <Route path="concursos" element={<ConcursosPage />} />
        <Route path="assuntos" element={<AssuntosPage />} />
        <Route path="questoes" element={<QuestoesPage />} />
      </Route>
    </Routes>
  );
}