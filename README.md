# Product Stock (Django + React)

A **full-stack inventory management application** built with a Django REST Framework backend and a React frontend.
It allows to track products, manage stock movements (inbound/outbound), and maintain up-to-date inventory records through a clean and responsive web interface.

This project demonstrates:

A secure, token-based **authentication system** using JWT

A well-structured **REST API** built with Django REST Framework

A modular **React frontend** with reusable components and protected routes

Integration between backend and frontend for seamless real-time data handling

Example datasets for testing


## Content

- **Backend**: product CRUD operations
- **Frontend**: react-based user interface to view and manage stock
- Seamless communication via **REST API**

## Tech Stack

- **Backend**: Django, Django REST Framework
- **Frontend**: React 

## Getting Started

### Prerequisites

- **Python 3.13**  
- **Node.js + npm** 
- **Git**

### Backend Setup

```bash
git clone https://github.com/ThomasSiqueira/Product-Stock-Django-React.git
cd Product-Stock-Django-React/Backend
python -m venv venv
venv\Scripts\activate (on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup

Open a new terminal, then:

```bash
cd Product-Stock-Django-React/Frontend
npm install
npm start
```

---

## Running the App

- Django server should run on: `http://127.0.0.1:8000/`
- React frontend should run on: `http://localhost:3000/`
- The frontend fetches data from the backend REST API endpoints.

### Database
- There is a database in the project with:
```
superuser
 User: admin
 Pass: adminpass
```

- if you want to make a new database just delete 'db.sqlite3' and remake the migrations.
```bash
python manage.py makemigrations
python manage.py migrate
```

- You can reimport the generic item on the csv files via:

```bash
python manage.py import_products product_list_exemple.csv
python manage.py import_movements stock_movement_example.csv
```

## Testing with Unittest

This project includes unit tests for both the Product API endpointS and the StockMovement model.  
These tests ensure that the Django REST Framework backend behaves correctly and enforces the necessary rules for inventory management.

### Test Files
- `stock/tests.py`

### Tools & Frameworks
- **unittest** – Python’s built-in testing framework (via Django’s `TestCase` & DRF’s `APITestCase`)
- **Django TestCase** – Resets the database for each test run
- **Django REST Framework APITestCase** – Provides an API client for endpoint testing


### Tests Details

#### **1. ProductAPITest**
Covers the **CRUD API operations** for products:
1. **Setup**
   - Creates a test user and authenticates via JWT.
   - Creates an initial product for testing.
2. **`test_create_product`** – Verifies that a product can be created via POST request, and that all fields are saved correctly in the database.
3. **`test_get_product_list`** – Ensures the GET `/api/products/` endpoint returns a list of products.
4. **`test_update_product`** – Tests that a product’s quantity can be updated with a PATCH request.
5. **`test_delete_product`** – Confirms that a product can be deleted via DELETE request.

---

#### **2. StockMovementTests**
Validates the **business logic** of the `StockMovement` model:
1. **`test_in_movement_quantity`** – Adding an **IN** movement increases the product quantity.
2. **`test_out_movement_quantity`** – Adding an **OUT** movement decreases the product quantity.
3. **`test_out_movement_insufficient_stock`** – Ensures that removing more items than are in stock raises a `ValidationError`.
4. **`test_movement_fails_product_does_not_exist`** – Ensures that creating a stock movement for a non-existent product raises a `ValidationError`.

#### **3. StockMovementAPITest**
Covers the Stock Movement via REST API endpoints 

1. **`test_create_in_movement`** – Adding an **IN** movement via API increases the product quantity.  
2. **`test_create_out_movement`** – Adding an **OUT** movement via API decreases the product quantity.  
3. **`test_create_out_movement_insufficient_stock`** – Ensures that attempting to remove more items than are in stock returns a `400 BAD REQUEST` with the message `"Not enough stock"`, and leaves the quantity unchanged.  


### Running the Tests
From the backend folder, run:


```bash
python manage.py test
```

## Selenium Test
This project also includes **end-to-end (E2E) tests** written with Python’s `unittest` framework and **Selenium WebDriver**.  
These tests simulate real user interactions in the browser to verify that the frontend (React) and backend (Django REST API) work together correctly.

### Test Files
- `tests/test_e2e.py`

### Tools & Frameworks
- **unittest** – Python's built-in testing framework (test structure & assertions)
- **Selenium WebDriver** – Automates browser actions for real-world testing
- **Google Chrome** (with ChromeDriver) – Runs the tests in Chrome



### Tests details

#### **1. Test Product Flow**
Covers the full product lifecycle:
1. **Login** as an admin user.  
2. **Add a product** through the UI and verify it appears in the products table.  
3. **Edit the product** name and check the change is visible.  
4. **Add a stock movement** (inbound) for that product.  
5. **Delete the product** and ensure it is removed from the table.

#### **2. Test Stock Movement Flow**
Validates stock management rules:
1. **Login** as an admin user.  
2. **Create a new product** for stock tests.  
3. **Add an inbound stock movement** and verify success.  
4. **Attempt to remove more stock than available** and check that an error alert  
   (`"Not enough stock to perform this movement."`) is shown.  
5. **Delete an existing stock movement** from the entries page.  
6. **Delete the product** to clean up after the test.



---

### Running the E2E Tests
Make sure both the backend and frontend are running locally and from the root directory **Product-Stock-Django-React** run:

```bash
pip install selenium
python test_e2e.py
```


## Project Structure

```
Product-Stock-Django-React/
├── Backend/                      # Django backend
│   ├── backend_stock_control/     # Django project settings
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   │
│   ├── stock/                     # Main stock management app
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py              # Product & StockMovement models
│   │   ├── serializers.py         # DRF serializers
│   │   ├── tests.py               # Unit tests
│   │   ├── urls.py                 # API routes
│   │   └── views.py               # API view logic
│   │
│   ├── manage.py                    # Django command-line tool
│   └── requirements.txt             # Python dependencies
│
├── Frontend/                       # React frontend
│   ├── public/                      # Static public assets
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── AddMoviment.jsx
│   │   │   ├── AddProduct.jsx / .css
│   │   │   ├── DeleteMoviment.jsx
│   │   │   ├── DeleteProduct.jsx
│   │   │   ├── LoadingSpinner.jsx / .css
│   │   │   ├── ShowProduct.jsx / .css
│   │   │   ├── Sidebar.jsx / .css
│   │   │   ├── Topbar.jsx / .css
│   │   ├── Context/
│   │   │   └── Context.jsx
│   │   ├── pages/                   # Page-level components
│   │   │   ├── ProductsPage.jsx / .css
│   │   │   ├── StockEntryPage.jsx
│   │   │   ├── UserLogin.jsx / .css
│   │   │   └── ProtectedRoute.jsx
│   │   ├── App.js / App.css
│   │   ├── index.js / index.css
│   │   ├── App.test.js
│   │   ├── reportWebVitals.js
│   │   └── setupTests.js
│   ├── package.json                 # Node dependencies
│   └── package-lock.json
│
├── tests/
│   └── test_e2e.py                  # Selenium end-to-end tests
│
└── README.md
```



## License

This project is [MIT](https://opensource.org/licenses/MIT) licensed.


## Author
**Thomas Siqueira**  
- GitHub: [@ThomasSiqueira](https://github.com/ThomasSiqueira)  
- Email: thomassiqueirapereira@gmail.com