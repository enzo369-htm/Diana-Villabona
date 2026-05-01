import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./layout/SiteLayout";
import { HomePage } from "./pages/HomePage";
import { PiezasPage } from "./pages/PiezasPage";
import { PiezaDetailPage } from "./pages/PiezaDetailPage";
import { BitacoraPage } from "./pages/BitacoraPage";
import { BitacoraPostPage } from "./pages/BitacoraPostPage";
import { TalleresPage } from "./pages/TalleresPage";
import { SobreMiPage } from "./pages/SobreMiPage";
import { AdminPage } from "./pages/AdminPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="piezas" element={<PiezasPage />} />
          <Route path="piezas/:id" element={<PiezaDetailPage />} />
          <Route path="bitacora" element={<BitacoraPage />} />
          <Route path="bitacora/:id" element={<BitacoraPostPage />} />
          <Route path="talleres" element={<TalleresPage />} />
          <Route path="sobre-mi" element={<SobreMiPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
