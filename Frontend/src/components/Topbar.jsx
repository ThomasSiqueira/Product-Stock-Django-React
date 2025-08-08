import './Topbar.css';
import { FaUser } from "react-icons/fa";
import { useStockContext } from '../Context/Context';
import { TbLogout } from "react-icons/tb";

function Sidebar() {
    const { setIsLoggedIn, setContext, Context } = useStockContext()

  return (

      <div className='topbar'>
        <FaUser />
        <div className='username-topbar'>   {Context.UserName? Context.UserName.toUpperCase(): "User"}</div>
        <button className='logout-btn' onClick={() => {
          localStorage.removeItem('access');  
          localStorage.removeItem('refresh');
          localStorage.removeItem('username');
          setIsLoggedIn(false);
          setContext(prev => ({
            ...prev,
            UserName: null,
          }));  
          window.location.href = '/login'; // Redirect to login page
        }}><TbLogout/></button>
      </div>

  );
}

export default Sidebar;
