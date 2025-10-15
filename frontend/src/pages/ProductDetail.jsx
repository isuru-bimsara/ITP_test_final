import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaArrowLeft, 
  FaUpload, 
  FaTimes, 
  FaShoppingCart, 
  FaRulerCombined,
  FaPalette,
  FaFileImage,
  FaEdit,
  FaCheckCircle,
  FaInfoCircle
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const colors = ['Black Powerstretch', 'Blue Denim', 'White Cotton', 'Gray Heather', 'Navy Blue', 'Dark Wash', 'Light Wash', 'Distressed'];
const waistSizes = [23, 24, 25, 26, 27, 28, 29, 30];
const inseamSizes = ['PETITE (28")', 'REGULAR (30")', 'LONG (32")'];

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedWaist, setSelectedWaist] = useState(26);
  const [selectedInseam, setSelectedInseam] = useState('REGULAR (30")');
  const [activeTab, setActiveTab] = useState('DESCRIPTION');
  const [customerRequirements, setCustomerRequirements] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [quantity, setQuantity] = useState(100);
  const [quantityInput, setQuantityInput] = useState('100');
  const { user } = useAuth();

  const getWordCount = (text) => text.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/products'}/${id}`);
        console.log('Fetched product:', res.data);
        setProduct(res.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to fetch product.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        <p className="mt-4 text-gray-600 font-semibold">Loading product...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <p className="text-gray-600 font-semibold">Product not found</p>
      </div>
    </div>
  );

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file);
      setUploadedImageUrl(URL.createObjectURL(file));
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleUploadClick = () => document.getElementById('file-upload').click();

  const handlePlaceOrder = async () => {
    try {
      const finalQty = quantityInput === '' ? 100 : Math.max(100, parseInt(quantityInput) || 100);

      const orderPayload = {
        supplier: null,
        items: [
          {
            stockItem: product._id,
            quantity: finalQty,
            unitCost: product.price
          }
        ],
        status: 'Pending',
        notes: '',
        customerOrderDetails: {
          productId: product._id,
          productName: product.name,
          selectedColor,
          selectedWaist,
          selectedInseam,
          customerRequirements,
          sampleDesignImage: uploadedImageUrl || product.img,
          uploadedImageName: uploadedImage ? uploadedImage.name : null,
          customerName: user?.username || 'Guest',
          customerEmail: user?.email || '',
          customerPhone: user?.phone || ''
        }
      };

      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/orders'}`, orderPayload);

      console.log('Order created:', res.data);
      alert('Order Confirmed');
      navigate(`/order-review/${res.data._id}`);
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-600 font-semibold transition-colors group"
          >
            <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Shop
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-blue-600 font-medium transition-colors">
            HOME
          </button>
          <span className="text-gray-400">/</span>
          <button onClick={() => navigate('/shop')} className="text-gray-500 hover:text-blue-600 font-medium transition-colors">
            {product.category.toUpperCase()}
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold">{product.name.toUpperCase()}</span>
        </nav>

        {/* Main Product Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 p-8">
            {/* Left Side - Images */}
            <div className="space-y-6">
              <div className="flex gap-4">
                {/* Thumbnail Column */}
                <div className="flex flex-col gap-3">
                  {[product.img, product.img, product.img].map((img, idx) => (
                    <div key={idx} className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-600 transition-colors cursor-pointer">
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                {/* Main Image */}
                <div className="flex-1">
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-md group">
                    <img src={product.img} alt={product.name} className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
                      {product.discount}% OFF
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg">
                    <FaInfoCircle className="w-4 h-4 text-blue-600" />
                    Model is 5'10" 125lbs wearing size {selectedWaist}W
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Product Info */}
            <div className="space-y-6">
              {/* Product Header */}
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold mb-3">
                  <FaPalette className="w-3 h-3" />
                  {selectedColor}
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-bold text-blue-700">${product.price.toFixed(2)}</span>
                  <span className="text-lg text-gray-400 line-through">
                    ${product.oldPrice.toFixed(2)}
                  </span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Save ${(product.oldPrice - product.price).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Color Selection */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
                  <FaPalette className="w-4 h-4 text-blue-600" />
                  COLOR: {selectedColor}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                        selectedColor === color
                          ? 'bg-blue-600 text-white shadow-md border-2 border-blue-700'
                          : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
                  <FaRulerCombined className="w-4 h-4 text-blue-600" />
                  SELECT A SIZE
                </div>
                
                {/* Waist */}
                <div className="mb-4">
                  <div className="text-xs font-bold text-gray-700 mb-2">WAIST:</div>
                  <div className="flex gap-2 flex-wrap">
                    {waistSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedWaist(size)}
                        className={`w-12 h-12 rounded-lg text-sm font-bold transition-all ${
                          selectedWaist === size
                            ? 'bg-blue-600 text-white shadow-md border-2 border-blue-700'
                            : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inseam */}
                <div>
                  <div className="text-xs font-bold text-gray-700 mb-2">INSEAM:</div>
                  <div className="flex gap-2 flex-wrap">
                    {inseamSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedInseam(size)}
                        className={`px-4 py-3 rounded-lg text-xs font-bold transition-all ${
                          selectedInseam === size
                            ? 'bg-blue-600 text-white shadow-md border-2 border-blue-700'
                            : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <button className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-semibold underline">
                    WHAT IS MY SIZE?
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                  <FaShoppingCart className="w-4 h-4 text-blue-600" />
                  QUANTITY
                </div>
                <input
                  type="number"
                  min={100}
                  value={quantityInput}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === '') {
                      setQuantityInput('');
                      return;
                    }
                    let val = parseInt(raw.replace(/\D/g, '')) || 100;
                    if (val < 100) val = 100;
                    setQuantityInput(String(val));
                    setQuantity(val);
                  }}
                  className="w-32 px-4 py-3 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
                <div className="flex items-center gap-2 mt-2 text-xs text-red-600 font-semibold">
                  <FaInfoCircle className="w-3 h-3" />
                  Minimum quantity is 100
                </div>
              </div>

              {/* Sample Design Upload */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
                  <FaFileImage className="w-4 h-4 text-blue-600" />
                  SAMPLE DESIGN IMAGE
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-white">
                  <div className="relative rounded-lg overflow-hidden mb-4 border border-gray-200">
                    <img
                      src={uploadedImageUrl || product.img}
                      alt="Sample Design"
                      className="w-full h-48 object-cover"
                    />
                    {uploadedImage && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full shadow-lg">
                        <FaCheckCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 text-center mb-4">
                    {uploadedImage ? `✓ Uploaded: ${uploadedImage.name}` : 'Upload your design or use our sample'}
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleUploadClick}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg font-bold text-sm hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                    >
                      <FaUpload className="w-4 h-4" />
                      {uploadedImage ? 'Change Design' : 'Upload Design'}
                    </button>
                    {uploadedImage && (
                      <button
                        onClick={() => {
                          setUploadedImage(null);
                          setUploadedImageUrl('');
                          document.getElementById('file-upload').value = '';
                        }}
                        className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg font-bold text-sm hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
                      >
                        <FaTimes className="w-4 h-4" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Requirements */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
                  <FaEdit className="w-4 h-4 text-blue-600" />
                  CUSTOMER REQUIREMENTS & DETAILS
                </div>
                <textarea
                  value={customerRequirements}
                  onChange={(e) => {
                    const words = e.target.value.trim().split(/\s+/).filter(Boolean);
                    if (words.length <= 250) setCustomerRequirements(e.target.value);
                    else setCustomerRequirements(words.slice(0, 250).join(' '));
                  }}
                  placeholder="Please describe your specific requirements, customization details, or special instructions..."
                  className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-lg text-sm resize-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
                />
                <div className={`text-xs font-semibold mt-2 ${
                  getWordCount(customerRequirements) > 250 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {getWordCount(customerRequirements)} / 250 words
                  {getWordCount(customerRequirements) > 250 && ' (Limit exceeded!)'}
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-5 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FaShoppingCart className="w-5 h-5" />
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;