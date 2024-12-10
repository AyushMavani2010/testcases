import { Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const PublicRoute = ({ element, ...rest }: any) => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;

  // If the user has a valid token, redirect them to the dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, render the given element
  return element;
};

export default PublicRoute;