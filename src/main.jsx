import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { SubjectProvider } from "./contexts/SubjectContext.jsx";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import { TeacherProvider } from "./contexts/TeacherContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ModalProvider>
      <TeacherProvider>
        <SubjectProvider>
          <StrictMode>
            <App />
          </StrictMode>
        </SubjectProvider>
      </TeacherProvider>
    </ModalProvider>
  </AuthProvider>
);
