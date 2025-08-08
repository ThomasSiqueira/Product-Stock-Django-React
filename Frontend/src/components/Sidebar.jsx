
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div>
        <div className="sidebar">
          <h2>Stock Control</h2>
          <nav>
            <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>
              Products
            </NavLink>
            <NavLink to="/entries" className={({ isActive }) => isActive ? 'active' : ''}>
              Stock Flow
            </NavLink>
          </nav>
        </div>


      
    </div>

  );
}

export default Sidebar;
