import { useState, useEffect } from 'react';
import './AddProduct.css';

function AddMovement({ isOpen, onClose, code }) {
  const [formData, setFormData] = useState({
    item_code: code,
    movement_type: '',
    quantity: 0,
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const access = localStorage.getItem('access');
    const refresh = localStorage.getItem('refresh');

    const url = 'http://127.0.0.1:8000/api/stock/';
    const method = 'POST';

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

      if (!res.ok) {
        let data = await res.json();
        if (data.non_field_errors) {
          alert(data.non_field_errors[0]);
        } else {
          const allErrors = Object.values(data).flat().join("\n");
          alert("Error:\n" + allErrors);
        }
      }
      else
      if (res.status === 201) {
        alert('Movement added successfully');
        onClose();
      }
    } catch (err) {
      console.error(err);    }
  };

  useEffect(() => {
    if (code) { }
    setFormData(prev => ({
      ...prev,
      item_code: code || '',
    }
    ))
  }, [code]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2> 'New stock movement'</h2>
        <form onSubmit={handleSubmit}>
          <input name="item_code" placeholder="Code" value={formData.item_code} onChange={handleChange} readOnly />
          <input name="quantity" type="number" placeholder="quantity" value={formData.price} onChange={handleChange} />
          <div className='radio-buttons'>
            <input name="movement_type" type="radio" value="IN" onChange={handleChange} /> Inbound
          </div>
          <div className='radio-buttons'>
            <input name="movement_type" type="radio" value="OUT" onChange={handleChange} /> Outbound
          </div>

          <input name="note" placeholder="note" value={formData.note} onChange={handleChange} />
          <div className="modal-buttons">
            <button type="submit">Salvar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMovement;
