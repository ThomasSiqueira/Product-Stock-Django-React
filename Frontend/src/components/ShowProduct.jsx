import { useState, useEffect } from 'react';
import './ShowProduct.css';

function ShowProduct({ isOpen, onClose, code }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    item_code: '',
    quantity: 0,
    price: '',
  });

  const fetchData = async (searchQuery) => {
    const access = localStorage.getItem('access');  
    const refresh = localStorage.getItem('refresh');
    let query = searchQuery ? `${searchQuery}` : '';
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
      let data = json[0];
      setFormData({
        name: data.name || '',
        description: data.description || '',
        category: data.category || '',
        item_code: data.item_code || '' ,
        quantity: data.quantity || 0,
        price: data.price || '' ,
        last_update: data.last_update || '' ,
      });
    } catch (err) {
      console.error(err);
      alert('Error fetching product data');

    }
  };
  useEffect(() => {
    if (code) {
      fetchData(code);
    }
  }, [code]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{'Product data'}</h2>
        <div className='item-details'>
          <p name="name"   ><b>Name: </b>{formData.name}</ p>
          <p name="description" ><b>Description: </b>{formData.description}</ p>
          <p name="category" ><b>Category: </b>{formData.category}</ p>
          <p name="item_code" ><b>Code:</b> {formData.item_code}</ p>
          <p name="quantity"  ><b>Quantity: </b>{formData.quantity} units</ p>
          <p name="price"  ><b>Price: $</b>{formData.price}</ p>
          <p  ><b>Last movement date: </b>{new Date(formData.last_update).toLocaleString()}</ p>
          <div className="modal-buttons-show-product ">
            <button type="button" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowProduct;
