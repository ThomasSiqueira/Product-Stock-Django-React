import './AddProduct.css';

function DeleteMovement({ isOpen, onClose, id }) {

  const handleSubmit = async (e) => {
    e.preventDefault();
    const access = localStorage.getItem('access');
    const refresh = localStorage.getItem('refresh');

    const url = `http://127.0.0.1:8000/api/stock/${id}/`;
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

      if (!res.ok) {
        let data = await res.json();
        if (data.non_field_errors) {
          alert(data.non_field_errors[0]);
        } else {
          const allErrors = Object.values(data).flat().join("\n");
          alert("Error:\n" + allErrors);
        }
      }
      else{
        alert('Movement deleted successfully');
        onClose();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2> Delete stock movement?</h2>
        <form onSubmit={handleSubmit}>
          <p>Are you sure you want to DELETE this stock movement? <br />This data CAN NOT be recovered</p>
          <div className="modal-buttons">
            <button className='delete-button' type="submit">Delete</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeleteMovement;
