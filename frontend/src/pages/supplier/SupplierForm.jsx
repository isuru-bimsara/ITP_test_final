import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { SupplierSubmissionAPI } from './SupplierSubmissionAPI';
import { 
  ArrowLeft,
  Package,
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  FileText,
  Plus,
  Trash2,
  Edit,
  Lock,
  CheckCircle,
  XCircle,
  DollarSign,
  AlertCircle
} from 'lucide-react';

const INGREDIENTS = [
  { key: 'wools', label: 'Wools' },
  { key: 'clothes', label: 'Clothes' },
  { key: 'renda', label: 'Renda' },
  { key: 'other', label: 'Other' },
];

const initialItem = { itemNo: '', description: '', qty: '', unitPrice: '', total: '' };

function SupplierForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    supplierName: user?.username || '',
    supplierId: user?._id || '',
    nic: '',
    email: user?.email || '',
    phone: '',
    dateReceived: '',
    items: [],
    comments: '',
    selectedIngredients: [],
    otherIngredient: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({ email: '', nic: '', phone: '', items: '' });
  const [mySubmissions, setMySubmissions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const validateEmail = (value) => /^[^\s@]+@gmail\.com$/.test(value.toLowerCase());
  const validateNIC = (value) => /^\d{9}[VvXx]$/.test(value) || /^\d{12}$/.test(value);
  const validatePhone = (value) => /^\d{10}$/.test(value);
  const grandTotal = form.items.reduce((sum, it) => sum + (parseFloat(it.total) || 0), 0);

  const handleIngredientChange = (key, checked) => {
    let selected = [...form.selectedIngredients];
    if (checked) {
      if (!selected.includes(key)) selected.push(key);
      if (key !== 'other') {
        const exists = form.items.some(i => i.description === INGREDIENTS.find(x => x.key === key).label);
        if (!exists) {
          const itemNumber = form.items.length + 1;
          setForm(f => ({
            ...f,
            selectedIngredients: selected,
            items: [...f.items, { ...initialItem, itemNo: itemNumber.toString(), description: INGREDIENTS.find(x => x.key === key).label }]
          }));
          return;
        }
      }
    } else {
      selected = selected.filter(k => k !== key);
      if (key !== 'other') {
        setForm(f => ({
          ...f,
          selectedIngredients: selected,
          items: f.items.filter(i => i.description !== INGREDIENTS.find(x => x.key === key).label)
        }));
        return;
      }
    }
    setForm(f => ({ ...f, selectedIngredients: selected }));
  };

  const handleOtherIngredient = (e) => {
    const value = e.target.value;
    setForm(f => {
      let items = [...f.items];
      items = items.filter(i => i.description !== f.otherIngredient);
      if (value) {
        const itemNumber = items.length + 1;
        items.push({ ...initialItem, itemNo: itemNumber.toString(), description: value });
      }
      return { ...f, otherIngredient: value, items };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'email') setErrors(prev => ({ ...prev, email: validateEmail(value) ? '' : 'Invalid Gmail address' }));
    if (name === 'nic') setErrors(prev => ({ ...prev, nic: validateNIC(value) ? '' : 'NIC invalid' }));
    if (name === 'phone') setErrors(prev => ({ ...prev, phone: validatePhone(value) ? '' : 'Phone invalid' }));
  };

  const handleItemChange = (idx, e) => {
    let { name, value } = e.target;
    if (name === 'qty') value = value.replace(/[^\d]/g, '');
    if (name === 'unitPrice') value = value.replace(/[^\d.]/g, '');
    const items = form.items.map((item, i) => {
      if (i !== idx) return item;
      const updated = { ...item, [name]: value };
      if (name === 'qty' || name === 'unitPrice') {
        const qtyNum = parseFloat(updated.qty);
        const unitNum = parseFloat(updated.unitPrice);
        updated.total = !isNaN(qtyNum) && !isNaN(unitNum) ? (qtyNum * unitNum).toFixed(2) : '';
      }
      return updated;
    });
    setForm(f => ({ ...f, items }));
  };

  const addItem = () => {
    const itemNumber = form.items.length + 1;
    setForm(f => ({ ...f, items: [...f.items, { ...initialItem, itemNo: itemNumber.toString() }] }));
  };

  const removeItem = (idx) => {
    const itemToRemove = form.items[idx];
    const updatedItems = form.items.filter((_, i) => i !== idx);
    let updatedSelected = [...form.selectedIngredients];
    const ingredientKey = INGREDIENTS.find(i => i.label === itemToRemove.description)?.key;
    if (ingredientKey) updatedSelected = updatedSelected.filter(k => k !== ingredientKey);
    setForm(f => ({
      ...f,
      items: updatedItems,
      selectedIngredients: updatedSelected,
      otherIngredient: itemToRemove.description === f.otherIngredient ? '' : f.otherIngredient
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailOk = validateEmail(form.email);
    const nicOk = validateNIC(form.nic);
    const phoneOk = validatePhone(form.phone);
    const itemsOk = form.items.length > 0 && form.items.every(it => it.qty && it.unitPrice);

    setErrors({
      email: emailOk ? '' : 'Invalid Gmail',
      nic: nicOk ? '' : 'Invalid NIC',
      phone: phoneOk ? '' : 'Invalid phone',
      items: itemsOk ? '' : 'All items require qty and price'
    });

    if (!emailOk || !nicOk || !phoneOk || !itemsOk) return;

    const payload = {
      supplierName: form.supplierName,
      supplierId: user._id,
      nic: form.nic,
      email: form.email,
      phone: form.phone,
      dateReceived: form.dateReceived,
      selectedIngredients: form.selectedIngredients,
      otherIngredient: form.otherIngredient,
      items: form.items,
      comments: form.comments,
      grandTotal: Number(grandTotal.toFixed(2))
    };

    try {
      if (editingId) {
        await SupplierSubmissionAPI.update(editingId, payload, user.token);
        setEditingId(null);
      } else {
        await SupplierSubmissionAPI.create(payload, user.token);
      }
      const updated = await SupplierSubmissionAPI.getMySubmissions(user.token);
      setMySubmissions(updated);
      setSubmitted(true);
      setForm(f => ({ ...f, nic: '', phone: '', dateReceived: '', items: [], comments: '', selectedIngredients: [], otherIngredient: '' }));
    } catch (err) {
      console.error(err);
      alert('Failed to submit. Try again.');
    }
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user) return;
      try {
        const data = await SupplierSubmissionAPI.getMySubmissions(user.token);
        setMySubmissions(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubmissions();
  }, [user]);

  const handleEdit = (sub) => {
    const createdAt = new Date(sub.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
    if (diffDays > 7) {
      alert('Cannot edit submission after 7 days');
      return;
    }
    setEditingId(sub._id);
    setForm({
      supplierName: sub.supplierName,
      supplierId: sub.supplierId,
      nic: sub.nic,
      email: sub.email,
      phone: sub.phone,
      dateReceived: sub.dateReceived,
      selectedIngredients: sub.selectedIngredients,
      otherIngredient: sub.otherIngredient,
      items: sub.items,
      comments: sub.comments
    });
  };

  const handleDelete = async (sub) => {
    const createdAt = new Date(sub.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
    if (diffDays > 7) {
      alert('Cannot delete submission after 7 days');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    try {
      await SupplierSubmissionAPI.delete(sub._id, user.token);
      const updated = await SupplierSubmissionAPI.getMySubmissions(user.token);
      setMySubmissions(updated);
    } catch (err) {
      console.error(err);
      alert('Failed to delete submission');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')} 
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Page Title */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Package className="w-7 h-7" />
              Supply Ingredients
            </h2>
          </div>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-green-700 font-medium">Submission successful!</span>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Ingredient Checkboxes */}
              <div>
                <label className="block text-gray-700 font-semibold mb-3 text-sm flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Select Ingredients
                </label>
                <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {INGREDIENTS.map(ing => (
                    <div key={ing.key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        checked={form.selectedIngredients.includes(ing.key)}
                        onChange={e => handleIngredientChange(ing.key, e.target.checked)}
                      />
                      <label className="text-gray-700 font-medium">{ing.label}</label>
                      {ing.key === 'other' && form.selectedIngredients.includes('other') && (
                        <input
                          type="text"
                          placeholder="Specify ingredient"
                          value={form.otherIngredient}
                          onChange={handleOtherIngredient}
                          className="ml-2 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Supplier Information */}
              <div>
                <label className="block text-gray-700 font-semibold mb-3 text-sm flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Supplier Information
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                      </div>
                      <input 
                        name="nic" 
                        placeholder="NIC" 
                        value={form.nic} 
                        onChange={handleChange} 
                        required 
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                      />
                    </div>
                    {errors.nic && (
                      <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.nic}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="w-5 h-5 text-gray-400" />
                      </div>
                      <input 
                        name="phone" 
                        placeholder="Phone" 
                        value={form.phone} 
                        onChange={handleChange} 
                        required 
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                      />
                    </div>
                    {errors.phone && (
                      <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.phone}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="w-5 h-5 text-gray-400" />
                      </div>
                      <input 
                        type="date" 
                        name="dateReceived" 
                        value={form.dateReceived} 
                        onChange={handleChange} 
                        required 
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-gray-700 font-semibold text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Items
                  </label>
                  <button 
                    type="button" 
                    onClick={addItem} 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-sm hover:shadow-md font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">#</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Unit Price</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {form.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.itemNo}</td>
                          <td className="px-4 py-3">
                            <input 
                              name="description" 
                              value={item.description} 
                              onChange={e => handleItemChange(idx, e)} 
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm" 
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              name="qty" 
                              type="number" 
                              value={item.qty} 
                              onChange={e => handleItemChange(idx, e)} 
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm" 
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              name="unitPrice" 
                              type="number" 
                              value={item.unitPrice} 
                              onChange={e => handleItemChange(idx, e)} 
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm" 
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                            ${item.total || '0.00'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <button 
                              type="button" 
                              onClick={() => removeItem(idx)} 
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-sm hover:shadow-md text-sm font-medium"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {errors.items && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.items}
                  </div>
                )}
              </div>

              {/* Grand Total */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Grand Total
                  </span>
                  <span className="text-2xl font-bold text-blue-700">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Comments
                </label>
                <textarea 
                  name="comments" 
                  placeholder="Add any additional comments..." 
                  value={form.comments} 
                  onChange={handleChange} 
                  rows="4"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" 
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                {editingId ? 'Update Submission' : 'Submit'}
              </button>
            </form>
          </div>
        </div>

        {/* My Submissions */}
        {mySubmissions.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-6 h-6" />
                My Submissions
              </h3>
            </div>
            
            <div className="p-6">
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Items</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Comments</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mySubmissions.map(sub => {
                      const createdAt = new Date(sub.createdAt);
                      const now = new Date();
                      const diffDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
                      const canEditDelete = diffDays <= 7;

                      return (
                        <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {sub._id.substring(0, 8)}...
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {sub.dateReceived}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {sub.items.map(i => `${i.description} (${i.qty})`).join(', ')}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {sub.comments || '-'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <div className="flex justify-center gap-2">
                              {canEditDelete ? (
                                <>
                                  <button 
                                    onClick={() => handleEdit(sub)} 
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-sm hover:shadow-md text-sm font-medium"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(sub)} 
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-sm hover:shadow-md text-sm font-medium"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete
                                  </button>
                                </>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                                  <Lock className="w-3.5 h-3.5" />
                                  Locked
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SupplierForm;