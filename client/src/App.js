import MainLayout from "./components/layout/MainLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chat/:selfChatId" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
