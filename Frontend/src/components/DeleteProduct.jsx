import './AddProduct.css';

function DeleteProduct({ isOpen, onClose, id }) {


  const handleSubmit = async (e) => {
    e.preventDefault();
    const access = localStorage.getItem('access');
    const refresh = localStorage.getItem('refresh');

    const url = `http://127.0.0.1:8000/api/products/${id}/`;
    const method = 'DELETE';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access}`,
        },

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

          });
        } else {
          throw new Error('Token refresh failed');
        }
      }

      if (!res.ok) throw new Error('Failed to save Product');

      const deletedProduct = await res.status;
      if (deletedProduct === 204) {
        alert('Product deleted successfully');
        onClose();
      }
      else {
        alert('Failed to delete Product');
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar produto');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2> Delete Product?</h2>
        <form onSubmit={handleSubmit}>
          <p>Are you sure you want to DELETE this Product? <br />This data CAN NOT be recovered</p>
          <div className="modal-buttons">
            <button className='delete-button' type="submit">Delete</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeleteProduct;
