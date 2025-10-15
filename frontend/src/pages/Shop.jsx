import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  FaStar, 
  FaStarHalfAlt, 
  FaRegStar, 
  FaSearch,
  FaShoppingBag,
  FaTags,
  FaFilter,
  FaDollarSign,
  FaUser,
  FaCalendar,
  FaTimes,
  FaShoppingCart
} from 'react-icons/fa';
import { useAuth } from "../hooks/useAuth";

const categories = ['Trousers', 'Skirts', 'Blouse', 'Dresses', 'Shirts', 'Jackets', 'Sweaters', 'Shorts', 'Jeans'];
// product details
function Shop() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [priceMax, setPriceMax] = useState(500);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [search, setSearch] = useState(() => {
    const params = new URLSearchParams(location.search);
    return (params.get('search') || '').toLowerCase();
  });
  const [showAd, setShowAd] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);

  const API_URL = "http://localhost:5000/api/products";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(API_URL);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const filteredItems = useMemo(() => {
    const term = search.trim();
    return products.filter(p => {
      const matchesPrice = p.price <= priceMax;
      const matchesSearch = term ? (p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term)) : true;
      const matchesCategory = selectedCategory === 'All Categories' ? true : p.category === selectedCategory;
      return matchesPrice && matchesSearch && matchesCategory;
    });
  }, [products, priceMax, search, selectedCategory]);

  const customerMap = useMemo(() => {
    if (!customers.length) return {};
    return customers.reduce((acc, customer) => {
        acc[customer._id] = customer.username;
        return acc;
    }, {});
  }, [customers]);

  const goToProductDetail = (item) => navigate(`/product/${item._id}`);

  const showProductPopup = (item) => setSelectedProduct(item);
  const closeProductPopup = () => setSelectedProduct(null);

  const handlePopupClick = (e) => {
    if (e.target === e.currentTarget) {
      closeProductPopup();
    }
  };

  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return total / reviews.length;
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
    return stars;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!user?.token) {
          console.warn("No token found. User might not be logged in.");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const customerUsers = response.data.filter(
          (u) => u.role === "Customer"
        );

        console.log("✅ Customer users fetched:", customerUsers);
        setCustomers(customerUsers);
      } catch (error) {
        console.error("❌ Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Announcement Banner */}
      {showAd && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 text-center relative">
          <div className="flex items-center justify-center gap-2">
            <FaTags className="w-4 h-4" />
            <span className="font-semibold text-sm">
              Summer Sale! Get up to 50% off on selected items. Limited time only!
            </span>
          </div>
          <button
            onClick={() => setShowAd(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        {/* Search Bar */}
        <div className="flex justify-end mb-6">
          <div className="relative w-64">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
              placeholder="Search products..."
              className="w-full py-2.5 pl-10 pr-4 rounded-lg border-2 border-gray-300 text-sm font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white shadow-sm"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6 mb-8">
          {/* Sidebar */}
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 h-fit">
            {/* User Welcome */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
              
             
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <div className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                <FaDollarSign className="w-4 h-4 text-blue-600" />
                Price Range
              </div>
              <input 
                type="range" 
                min="0" 
                max="500" 
                value={priceMax} 
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>$0</span>
                <span className="font-semibold text-blue-600">Up to ${priceMax}</span>
              </div>
            </div>

            {/* Categories */}
            <div>
              <div className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                <FaFilter className="w-4 h-4 text-blue-600" />
                Categories
              </div>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 text-sm bg-white cursor-pointer outline-none appearance-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-700"
                >
                  <option value="All Categories">All Categories</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  ▼
                </div>
              </div>
            </div>
          </div>

          {/* Banner */}
          <div className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-12 relative overflow-hidden shadow-lg">
            <div className="absolute top-8 right-12 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
            <div className="absolute bottom-8 left-12 w-12 h-12 bg-white bg-opacity-10 rounded-full"></div>
            
            <div className="relative z-10 text-center text-blue-500">
              <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                <FaTags className="w-3 h-3" />
                NEW ARRIVAL COLLECTION
              </div>
              <h2 className="text-4xl font-bold mb-3">The Latest Trends</h2>
              <p className="text-lg mb-6 text-blue-50">
                Discover our premium collection of stylish garments.
              </p>
              <button className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <FaShoppingBag className="w-4 h-4" />
                Shop Now
              </button>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            <FaShoppingCart className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">New Trend Style</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredItems.slice(0, 12).map((p) => {
              const avgRating = getAverageRating(p.reviews);
              const reviewCount = p.reviews?.length || 0;

              return (
                <div 
                  key={p._id} 
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-200"
                  onClick={() => showProductPopup(p)}
                >
                  <div className="relative overflow-hidden">
                    {p.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-lg font-bold text-sm z-10 shadow-md">
                        {p.discount}% OFF
                      </div>
                    )}
                    <img 
                      src={p.img} 
                      alt={p.name} 
                      className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-4">
                    <div className="font-semibold text-gray-900 mb-1 truncate">{p.name}</div>
                    <div className="text-gray-500 text-xs mb-3">{p.sku}</div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-gray-400 line-through text-sm">${p.oldPrice?.toFixed(2)}</span>
                      <span className="text-blue-700 font-bold text-lg">${p.price?.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {renderStars(avgRating)}
                      </div>
                      <span className="text-blue-700 font-semibold text-sm">{avgRating.toFixed(1)}</span>
                      <span className="text-gray-500 text-xs">({reviewCount})</span>
                    </div>

                    <button 
                      onClick={(e) => { e.stopPropagation(); goToProductDetail(p); }}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={handlePopupClick}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 rounded-t-xl flex justify-between items-center z-10">
              <h2 className="text-white text-2xl font-bold flex items-center gap-2">
                <FaShoppingBag className="w-6 h-6" />
                Product Details
              </h2>
              <button 
                onClick={closeProductPopup}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              {/* Product Info Section */}
              <div className="flex gap-8 mb-10 flex-wrap">
                {/* Product Image */}
                <div className="flex-1 min-w-[300px] relative">
                  {selectedProduct.discount > 0 && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm z-10 shadow-lg">
                      {selectedProduct.discount}% OFF
                    </div>
                  )}
                  <img 
                    src={selectedProduct.img} 
                    alt={selectedProduct.name}
                    className="w-full h-96 object-cover rounded-xl shadow-lg border border-gray-200"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-[300px]">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl h-full border border-gray-200">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h3>
                    <div className="text-gray-500 text-sm mb-4 flex items-center gap-2">
                      <FaTags className="w-3 h-3" />
                      SKU: {selectedProduct.sku}
                    </div>
                    
                    {/* Category Badge */}
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold mb-6">
                      <FaFilter className="w-3 h-3" />
                      {selectedProduct.category}
                    </div>

                    {/* Price Section */}
                    <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-gray-400 line-through text-xl">${selectedProduct.oldPrice?.toFixed(2)}</span>
                        <span className="text-blue-700 font-bold text-4xl">${selectedProduct.price?.toFixed(2)}</span>
                      </div>
                      <div className="text-green-600 text-sm font-semibold">
                        You save: ${(selectedProduct.oldPrice - selectedProduct.price).toFixed(2)}
                      </div>
                    </div>

                    {/* Rating Summary */}
                    <div className="bg-white p-4 rounded-lg mb-6 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {renderStars(getAverageRating(selectedProduct.reviews))}
                        </div>
                        <span className="text-blue-700 font-bold text-lg">
                          {getAverageRating(selectedProduct.reviews).toFixed(1)}
                        </span>
                      </div>
                      <div className="text-gray-600 text-sm">
                        Based on {selectedProduct.reviews?.length || 0} review{selectedProduct.reviews?.length !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); goToProductDetail(selectedProduct); }}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      View Full Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="border-t-2 border-gray-200 pt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaStar className="w-6 h-6 text-yellow-400" />
                  Customer Reviews
                </h3>

                {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {selectedProduct.reviews.map((review) => (
                      <div key={review._id} className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                        {/* Review Header */}
                        <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <FaUser className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 font-semibold uppercase">Customer</div>
                              <div className="text-sm text-gray-900 font-semibold">
                                {customerMap[review.customer] || review.customer}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-blue-700 font-bold">{review.rating}.0</span>
                          </div>
                        </div>

                        {/* Review Comment */}
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="text-gray-700 mb-3 leading-relaxed">
                            "{review.comment}"
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FaCalendar className="w-3 h-3" />
                            {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                    <FaStar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <div className="text-gray-600 font-semibold mb-1">No reviews yet</div>
                    <div className="text-gray-500 text-sm">Be the first to review this product!</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
//export shop
export default Shop;