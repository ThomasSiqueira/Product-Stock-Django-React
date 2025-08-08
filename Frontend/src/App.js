
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ProductsPage from './pages/ProductsPage';
import StockEntryPage from './pages/StockEntryPage';
import { UserLogin } from './pages/UserLogin';
import { useStockContext } from './Context/Context';
import ProtectedRoute from './pages/ProtectedRoute';

function App() {
  const { isLoggedIn } = useStockContext();

  return (
    <div className="app-container">
      {isLoggedIn && <Sidebar />}

      <div className="content">
        {isLoggedIn && <Topbar />}

        <Routes>
          {/* Login is always public */}
          <Route path="/login" element={<UserLogin />} />

          {/* Protected routes */}
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/entries"
            element={
              <ProtectedRoute>
                <StockEntryPage />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route
            path="*"
            element={
              isLoggedIn ? (
                <Navigate to="/products" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
