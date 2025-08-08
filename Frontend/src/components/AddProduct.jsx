import { useState, useEffect } from 'react';
import './AddProduct.css';

function AddProduct({ isOpen, onClose, onProductAdded, product }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    item_code: '',
    quantity: 0,
    price: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        item_code: product.item_code || '',
        quantity: product.quantity || 0,
        price: product.price || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: '',
        item_code: '',
        quantity: 0,
        price: '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const access = localStorage.getItem('access');
    const refresh = localStorage.getItem('refresh');
    const url = product
      ? `http://127.0.0.1:8000/api/products/${product.id}/`
      : 'http://127.0.0.1:8000/api/products/';
    const method = product ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access}`,
        },
        body: JSON.stringify(formData),
      });

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
          res = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access}`,
            },
            body: JSON.stringify(formData),
          });
        } else {
          throw new Error('Token refresh failed');
        }
      }

      if (!res.ok) throw new Error('Failed to save product');

      const savedProduct = await res.json();
      onProductAdded(savedProduct);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar produto');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{product ? 'Editar Produto' : 'Novo Produto'}</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
          <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
          <input name="item_code" placeholder="Code" value={formData.item_code} onChange={handleChange} />
          <input name="price" type="number" step="0.01" placeholder="Price" value={formData.price} onChange={handleChange} />
          <div className="modal-buttons">
            <button type="submit">Salvar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
