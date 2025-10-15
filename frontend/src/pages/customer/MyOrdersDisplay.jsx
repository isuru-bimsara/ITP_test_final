import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  FaClipboardList,
  FaUser,
  FaBoxOpen,
  FaArrowLeft,
  FaSearch,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaBoxes,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaDollarSign,
  FaTags,
} from "react-icons/fa";

function MyOrdersDisplay() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [allOrders, setAllOrders] = useState([]);
  const [allProducts, setAllProducts] = useState({});
  const [orderSearch, setOrderSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🎯 Fetch all user orders
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders");
        const orders = res.data;

        // Only show current user's orders
        const userOrders = orders.filter(
          (o) =>
            o.customerOrderDetails?.customerEmail?.toLowerCase() ===
            user.email.toLowerCase()
        );
        setAllOrders(userOrders);

        // Fetch product details for each order
        const productPromises = userOrders.map(async (order) => {
          const productId =
            order.customerOrderDetails?.productId || order.product?._id;
          if (productId) {
            try {
              const productRes = await axios.get(
                `http://localhost:5000/api/products/${productId}`
              );
              return { orderId: order._id, product: productRes.data };
            } catch {
              return { orderId: order._id, product: null };
            }
          }
          return { orderId: order._id, product: null };
        });

        const productsData = await Promise.all(productPromises);
        const productsMap = {};
        productsData.forEach(({ orderId, product }) => {
          productsMap[orderId] = product;
        });
        setAllProducts(productsMap);
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // 🎨 Status Styling
  const getStatusStyle = (status) => {
    const styles = {
      confirmed: {
        className: "bg-gradient-to-r from-green-500 to-green-600",
        bgLight: "bg-green-50",
        textColor: "text-green-700",
        borderColor: "border-green-300",
        icon: <FaCheckCircle />,
      },
      pending: {
        className: "bg-gradient-to-r from-amber-500 to-orange-600",
        bgLight: "bg-amber-50",
        textColor: "text-amber-700",
        borderColor: "border-amber-300",
        icon: <FaClock />,
      },
      rejected: {
        className: "bg-gradient-to-r from-red-500 to-red-600",
        bgLight: "bg-red-50",
        textColor: "text-red-700",
        borderColor: "border-red-300",
        icon: <FaTimesCircle />,
      },
    };
    return styles[status.toLowerCase()] || styles.pending;
  };

  // 🌀 Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-12 rounded-xl shadow-lg text-center border border-gray-200">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-semibold">Loading orders...</p>
        </div>
      </div>
    );
  }

  // ⚠️ Error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-12 rounded-xl shadow-lg text-center max-w-md border border-red-200">
          <FaExclamationTriangle className="text-6xl text-red-500 mb-4 mx-auto" />
          <p className="text-red-600 text-xl font-bold mb-2">Error</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // 📦 No orders
  if (allOrders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-12 rounded-xl shadow-lg text-center border border-gray-200">
          <FaBoxes className="text-6xl text-blue-600 mb-4 mx-auto" />
          <p className="text-gray-600 text-lg font-semibold">You haven't placed any orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate("/shop")}
            className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-600 font-semibold transition-colors group"
          >
            <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Shop
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl shadow-lg mb-4">
            <FaBoxes className="text-3xl" />
            <h1 className="text-3xl font-bold">My Orders</h1>
          </div>
          <p className="text-gray-600 text-lg font-medium">
            Track and view all your past and current orders
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders by product name or status..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="w-full py-3 pl-12 pr-4 rounded-lg border-2 border-gray-300 text-sm font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {allOrders
            .filter(
              (o) =>
                o.customerOrderDetails?.productName
                  ?.toLowerCase()
                  .includes(orderSearch.toLowerCase()) ||
                o.status?.toLowerCase().includes(orderSearch.toLowerCase())
            )
            .map((o) => {
              const orderStatusStyle = getStatusStyle(o.status);
              const orderProduct = allProducts[o._id];
              return (
                <div
                  key={o._id}
                  className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-start gap-6 flex-wrap">
                    <div className="flex items-center gap-5 flex-1">
                      {orderProduct && (
                        <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 shadow-md">
                          <img
                            src={orderProduct.img}
                            alt={orderProduct.name}
                            className="w-24 h-24 object-cover"
                          />
                          {orderProduct.discount > 0 && (
                            <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
                              {orderProduct.discount}% OFF
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-lg font-bold text-gray-900 mb-2">
                          {orderProduct?.name ||
                            o.customerOrderDetails?.productName ||
                            "Product"}
                        </p>
                        <p className="text-sm text-gray-600 font-medium mb-1">
                          Order #{o._id}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <FaCalendarAlt className="w-3 h-3" />
                          {new Date(o.orderedAt).toLocaleString()}
                        </div>
                        {orderProduct && (
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-bold text-blue-700">
                              ${orderProduct.price?.toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-600 font-mono">
                              SKU: {orderProduct.sku}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status & Action */}
                    <div className="flex flex-col items-end gap-3">
                      <div
                        className={`${orderStatusStyle.className} px-4 py-2 rounded-lg text-white text-xs font-bold uppercase flex items-center gap-2 shadow-md`}
                      >
                        {orderStatusStyle.icon}
                        {o.status}
                      </div>
                      <button
                        onClick={() => navigate(`/order-details/${o._id}`)}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-300 text-sm shadow-md hover:shadow-lg"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default MyOrdersDisplay;