import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";

import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "placeholder-client-id";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Toaster position="top-right" />
      <AppRoutes />
    </GoogleOAuthProvider>
  );
}

export default App;