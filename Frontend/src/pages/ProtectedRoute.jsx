import { Navigate } from "react-router-dom";
import { useStockContext } from '../Context/Context';

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useStockContext();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
