import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/products');
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Check if the user is logged in
  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    console.log("Token in isLoggedIn check:", token);  // Log token for debugging
    return !!token;  // Return true if token exists, false otherwise
  };

  // Handle search functionality
  const handleSearch = (e) => {
    if (!isLoggedIn()) {
      alert('You must log in to search for products.');
      navigate('/login');
      return;
    }
    setSearch(e.target.value);
  };

  // Handle Buy Now functionality
  const handleBuyNow = async (productId) => {
    if (!isLoggedIn()) {
      alert('You must log in to place an order.');
      navigate('/login');
      return;
    }

    const quantity = prompt('Enter the quantity:');
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      alert('Invalid quantity');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/orders/place',
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Order placed successfully');
      navigate('/order-invoice', { state: { order: response.data.order } });
    } catch (err) {
      console.error('Error placing order:', err);
      alert('You must be logged in to place order');
      navigate('/login');
    }
  };

  // Filter products based on search input
  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="products-container">
      <h2>Products</h2>
      <input
        className="search"
        type="text"
        placeholder="Search Products"
        value={search}
        onChange={handleSearch}  // Attach search handler
        disabled={!isLoggedIn()}  // Disable search input if user is not logged in
      />
      <ul>
        {filteredProducts.length === 0 ? (
          <p>No products found</p>
        ) : (
          filteredProducts.map((product) => (
            <li key={product._id}>
              <td>{product.productName}</td>
              <td>{product.description}</td>
              <td>${product.price}</td>
              <td>{product.status}</td>
              <button
                onClick={() => handleBuyNow(product._id)}
                disabled={!isLoggedIn() || product.quantity === 0} // Disable "Buy Now" if user is not logged in or product is out of stock
              >
                {product.quantity > 0 ? 'Buy Now' : 'Out of Stock'}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ProductsPage;
