import { useEffect, useState } from 'react';
import './ProductsPage.css';
import AddProduct from '../components/AddProduct';
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegPlusSquare } from "react-icons/fa";
import AddMovement from '../components/AddMoviment';
import DeleteProduct from '../components/DeleteProduct';


function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const [searchField, setSearchField] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');

  const [showPopUp, setShowPopUp] = useState(false);
  const [showPopUpMovement, setShowPopUpMovement] = useState(false);
  const [showPopUpDelete, setShowPopUpDelete] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [productCode, setProductCode] = useState(null);

  const fetchData = async (searchQuery) => {

    const access = localStorage.getItem('access');
    const refresh = localStorage.getItem('refresh');
    let query = searchQuery ? `?${searchQuery}` : '';
    try {
      let res = await fetch(`http://127.0.0.1:8000/api/products/${query}`, {
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
          res = await fetch(`http://127.0.0.1:8000/api/products/${query}`, {
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
      setProducts(json);

    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setShowPopUp(true);
    setEditingProduct(product);
  };
  const handleDelete = (product) => {
    setShowPopUpDelete(true);
    setDeletingProduct(product);
  };
  const handleMovement = (code) => {
    setProductCode(code);
    setShowPopUpMovement(true);
    
    
  };

  useEffect(() => {
    fetchData(searchQuery);
  }, []);



  if (error) return <div>Error: {error}</div>;

  return (
    <div className="products-page">
      <h1>Products</h1>
      <div className='top-table-content'>
        <button className="new-product-btn" onClick={() => setShowPopUp(true)}>
          + New Product
        </button>
        <div className="search-bar">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="item_code">Code</option>
            <option value="category">Category</option>
          </select>

          <input
            type="text"
            placeholder={`Search by ${searchField}`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              fetchData(`${searchField}=${e.target.value}`)
            }}
          />
          <button onClick={() => fetchData(`${searchField}=${searchQuery}`)}>Search</button>
        </div>
      </div>



      {products.length ?
        <div className="products-table-wrapper">

          <table className="products-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Code</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Last Update</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.description}</td>
                  <td>{p.category}</td>
                  <td>{p.item_code}</td>
                  <td>{p.quantity}</td>
                  <td>R$ {p.price}</td>
                  <td>{new Date(p.last_update).toLocaleString()}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(p)}><FaEdit /></button>
                    <button className="delete-btn" onClick={() => handleDelete(p.id)}><MdDeleteOutline /></button>
                    <button className="entry-btn" onClick={() => handleMovement(p.item_code)}><FaRegPlusSquare /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div> : <div className='no-results-msg'>"No results found"</div>}

      <AddProduct
        isOpen={showPopUp}
        onClose={() => {
          setShowPopUp(false);
          setEditingProduct(null);
        }}
        onProductAdded={() => fetchData()}
        product={editingProduct}
      />
      <AddMovement
        isOpen={showPopUpMovement}
        onClose={() => {
          setShowPopUpMovement(false);
        }}
        onoMovementAdded={() => fetchData()}
        code={productCode}
      />
      <DeleteProduct
        isOpen={showPopUpDelete}
        onClose={() => {
          setShowPopUpDelete(false);
          fetchData(`${searchField}=${searchQuery}`)
        }}

        id={deletingProduct}
      />
    </div>
  );
}

export default ProductsPage;
