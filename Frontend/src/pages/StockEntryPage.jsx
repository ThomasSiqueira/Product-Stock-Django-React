import { useEffect, useState } from 'react';
import './ProductsPage.css';
import { MdDeleteOutline } from "react-icons/md";
import { RiFileInfoLine } from "react-icons/ri";
import ShowProduct from '../components/ShowProduct';
import DeleteMovement from '../components/DeleteMoviment';

function StockEntryPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchField, setSearchField] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');

  const [showPopUp, setShowPopUp] = useState(false);
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [itemCode, setItemCode] = useState('');
  const [itemCodeDelete, setItemCodeDelete] = useState('');

  const fetchData = async (searchQuery) => {
    const access = localStorage.getItem('access');
    const refresh = localStorage.getItem('refresh');
    let query = searchQuery ? `${searchQuery}` : '';
    try {
      let res = await fetch(`http://127.0.0.1:8000/api/stock/${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access}`,
        },
      });

      // If access denied try refreshing token
      if (res.status === 401 && refresh) {
        const refreshRes = await fetch('http://127.0.0.1:8000/api/auth/refresh/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh }),
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          localStorage.setItem('access', data.access);

          // Retry original request with new access token
          res = await fetch(`http://127.0.0.1:8000/api/stock/${query}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.access}`,
            },
          });
        } else {
          throw new Error('Token refresh failed');
        }
      }

      if (!res.ok) {
        throw new Error('Failed to fetch products: ' + res.status);
      }

      const json = await res.json();
      console.log(json);
      setProducts(json);

    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData(searchQuery);
  }, []);



  if (error) return <div>Error: {error}</div>;

  return (
    <div className="products-page">
      <h1>Stock Movements</h1>
      <div className='top-table-content'>
        <div className="search-bar">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            <option value="item_code">Code</option>
          </select>

          <input
            type="text"
            placeholder={`Search by code`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              fetchData(`?item_code=${e.target.value}`)
            }}
          />
          <button onClick={() => fetchData(`?item_code=${searchQuery}`)}>Search</button>
        </div>
      </div>



      {products.length ?
        <div className="products-table-wrapper">

          <table className="products-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.item_code}</td>
                  <td>{p.quantity}</td>
                  <td>{new Date(p.movement_date).toLocaleString()}</td>
                  <td>
                    <button className="edit-btn" onClick={() => {
                      setItemCode(`?item_code=${p.item_code}`);
                      setShowPopUp(true)
                    }}><RiFileInfoLine /></button>
                    <button className="delete-btn" onClick={() => {
                      setItemCodeDelete(p.id);
                      setDeletePopUp(true)
                    }}><MdDeleteOutline /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div> : <div className='no-results-msg'>"No results found"</div>}
      <ShowProduct
        isOpen={showPopUp}
        onClose={() => setShowPopUp(false)}
        code={itemCode}
      />
      <DeleteMovement
        isOpen={deletePopUp}
        onClose={() => {
          setDeletePopUp(false)
          fetchData(searchQuery);
        }}
        id={itemCodeDelete}
      />
    </div>
  );
}


export default StockEntryPage;
