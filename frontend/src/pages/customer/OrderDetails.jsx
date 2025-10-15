import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
  FaShoppingCart,
  FaTags,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaDollarSign,
} from "react-icons/fa";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [orderDetails, setOrderDetails] = useState(null);
  const [product, setProduct] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderSearch, setOrderSearch] = useState("");
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [allProducts, setAllProducts] = useState({});

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders");
        const orders = res.data;

        const userOrders = orders.filter(
          (o) =>
            o.customerOrderDetails?.customerEmail?.toLowerCase() ===
            user.email.toLowerCase()
        );
        setAllOrders(userOrders);

        const productPromises = userOrders.map(async (order) => {
          const productId =
            order.customerOrderDetails?.productId || order.product?._id;
          if (productId) {
            try {
              const productRes = await axios.get(
                `http://localhost:5000/api/products/${productId}`
              );
              return { orderId: order._id, product: productRes.data };
            } catch (err) {
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

        const currentOrder = userOrders.find((o) => o._id === id);
        if (!currentOrder) {
          setError("Order not found for this user");
          return;
        }

        setOrderDetails(currentOrder);
        const productId =
          currentOrder.customerOrderDetails?.productId ||
          currentOrder.product?._id;

        if (productId) {
          const productRes = await axios.get(
            `http://localhost:5000/api/products/${productId}`
          );
          setProduct(productRes.data);
        }
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [id, user]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-12 rounded-xl shadow-lg text-center border border-gray-200">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-semibold">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Error State
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

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-12 rounded-xl shadow-lg text-center border border-gray-200">
          <FaBoxes className="text-6xl text-blue-600 mb-4 mx-auto" />
          <p className="text-gray-600 text-lg font-semibold">No order details found.</p>
        </div>
      </div>
    );
  }

  const { customerOrderDetails } = orderDetails;

  // Status Styling
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

  const statusStyle = getStatusStyle(orderDetails.status);

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
            <FaClipboardList className="text-3xl" />
            <h1 className="text-3xl font-bold">Order Details</h1>
          </div>
          <p className="text-gray-600 text-lg font-medium">
            Track your order and view complete information
          </p>
        </div>

        {/* Main Order Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
            <FaClipboardList className="text-blue-600 text-3xl" />
            Order Information
          </h2>

          {/* Order Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-600 font-bold mb-2">
                <FaIdCard className="w-3 h-3" />
                ORDER ID
              </div>
              <p className="text-sm text-gray-900 font-bold font-mono break-all">
                {orderDetails._id}
              </p>
            </div>

            <div className={`${statusStyle.className} p-5 rounded-xl shadow-md`}>
              <div className="flex items-center gap-2 text-xs text-white/90 font-bold mb-2">
                {statusStyle.icon}
                STATUS
              </div>
              <p className="text-xl text-white font-bold uppercase">
                {orderDetails.status}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 text-xs text-blue-700 font-bold mb-2">
                <FaCalendarAlt className="w-3 h-3" />
                ORDERED AT
              </div>
              <p className="text-sm text-blue-900 font-bold">
                {new Date(orderDetails.orderedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl mb-8 border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-3">
              <FaUser className="text-blue-600 text-2xl" />
              Customer Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-600 font-bold mb-2">
                  <FaUser className="w-3 h-3 text-blue-600" />
                  NAME
                </div>
                <p className="text-sm text-gray-900 font-semibold">
                  {customerOrderDetails?.customerName}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-600 font-bold mb-2">
                  <FaEnvelope className="w-3 h-3 text-blue-600" />
                  EMAIL
                </div>
                <p className="text-sm text-gray-900 font-semibold break-all">
                  {customerOrderDetails?.customerEmail}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-600 font-bold mb-2">
                  <FaPhone className="w-3 h-3 text-blue-600" />
                  PHONE
                </div>
                <p className="text-sm text-gray-900 font-semibold">
                  {customerOrderDetails?.customerPhone}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-600 font-bold mb-2">
                  <FaIdCard className="w-3 h-3 text-blue-600" />
                  USER ID
                </div>
                <p className="text-xs text-gray-900 font-semibold font-mono break-all">
                  {orderDetails._id}
                </p>
              </div>
            </div>
          </div>

          {/* Product Section */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <h3 className="text-xl font-bold mb-5 text-gray-900 flex items-center gap-3">
              <FaBoxOpen className="text-blue-600 text-2xl" />
              Product Ordered
            </h3>
            {product ? (
              <div className="flex items-center gap-6 flex-wrap">
                <div className="relative rounded-xl overflow-hidden border-2 border-white shadow-lg">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-32 h-32 object-cover"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      {product.discount}% OFF
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-gray-900 mb-3">{product.name}</p>
                  <div className="flex gap-6 flex-wrap">
                    <div className="bg-white px-4 py-2 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 text-xs text-gray-600 font-bold mb-1">
                        <FaDollarSign className="w-3 h-3 text-blue-600" />
                        PRICE
                      </div>
                      <p className="text-2xl font-bold text-blue-700">
                        ${product.price?.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 text-xs text-gray-600 font-bold mb-1">
                        <FaTags className="w-3 h-3 text-blue-600" />
                        SKU
                      </div>
                      <p className="text-lg font-bold text-gray-900 font-mono">
                        {product.sku}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 font-semibold">Product details not found.</p>
            )}
          </div>
        </div>

        {/* View All Orders Button */}
        {allOrders.length > 1 && !showAllOrders && (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowAllOrders(true)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FaBoxes className="text-2xl" />
              View All My Orders ({allOrders.length})
            </button>
          </div>
        )}

        {/* All Orders Section */}
        {allOrders.length > 1 && showAllOrders && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <FaBoxes className="text-blue-600 text-3xl" />
                My Other Orders ({allOrders.length})
              </h2>
              <button
                onClick={() => setShowAllOrders(false)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all duration-300"
              >
                Hide Orders
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search orders by product name or status..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full py-3 pl-12 pr-4 rounded-lg border-2 border-gray-300 text-sm font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
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
                      className={`bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl ${
                        o._id === id
                          ? "border-2 border-blue-600"
                          : "border border-gray-200"
                      } hover:shadow-lg transition-all duration-300`}
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
                          {o._id !== id ? (
                            <button
                              onClick={() => navigate(`/order-details/${o._id}`)}
                              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-300 text-sm shadow-md hover:shadow-lg"
                            >
                              View Details
                            </button>
                          ) : (
                            <span className="px-6 py-2 bg-green-100 text-green-700 font-semibold rounded-lg text-sm border border-green-300">
                              Currently Viewing
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderDetails;
