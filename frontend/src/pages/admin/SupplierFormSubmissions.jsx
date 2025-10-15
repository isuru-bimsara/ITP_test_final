import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { SupplierSubmissionAPI } from '../supplier/SupplierSubmissionAPI';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  FileText,
  User,
  Calendar,
  Package,
  MessageSquare,
  DollarSign,
  AlertCircle,
  Inbox
} from 'lucide-react';

function SupplierFormSubmissions() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user || user.role !== 'Admin') return;
      try {
        const data = await SupplierSubmissionAPI.getAllSubmissions(user.token);
        setSubmissions(data);
      } catch (err) {
        console.error(err);
        alert('Failed to load submissions');
      }
    };
    fetchSubmissions();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Page Title Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FileText className="w-7 h-7" />
                All Supplier Submissions
              </h2>
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-blue-500 font-semibold text-sm">
                  Total: {submissions.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            {submissions.length === 0 ? (
              <div className="text-center py-16">
                <Inbox className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No submissions found</p>
                <p className="text-gray-400 text-sm mt-1">Submissions will appear here once suppliers submit their forms</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          ID
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Supplier
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Date Received
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          Items
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Comments
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Grand Total
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissions.map(sub => (
                      <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-100 p-1.5 rounded">
                              <FileText className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {sub._id.substring(0, 8)}...
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="bg-purple-100 p-1.5 rounded">
                              <User className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {sub.supplier?.username || 'Unknown'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {sub.dateReceived}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-start gap-2">
                            <Package className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-gray-600">
                              {sub.items.map((i, idx) => (
                                <div key={idx} className="mb-1">
                                  <span className="font-medium text-gray-700">{i.description}</span>
                                  <span className="text-gray-500"> (Qty: {i.qty})</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">
                              {sub.comments || (
                                <span className="text-gray-400 italic">No comments</span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-bold text-green-700">
                              {sub.grandTotal.toFixed(2)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Summary Card */}
        {submissions.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Total Amount</h3>
                  <p className="text-sm text-gray-600">Combined value of all submissions</p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-md">
                    <DollarSign className="w-6 h-6 text-white" />
                    <span className="text-3xl font-bold text-white">
                      {submissions.reduce((sum, sub) => sum + sub.grandTotal, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SupplierFormSubmissions;