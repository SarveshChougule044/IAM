import { Outlet } from "react-router-dom";

const AuthOnlyLayout = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};

export default AuthOnlyLayout;