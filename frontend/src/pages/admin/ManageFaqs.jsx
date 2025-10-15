import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { HelpCircle, FileText, Search as SearchIcon, Edit, Trash2 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/faqs';

const ManageFaqs = () => {
    const [faqs, setFaqs] = useState([]);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [editingFaq, setEditingFaq] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth();

    const fetchFaqs = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(API_URL);
            setFaqs(data);
        } catch (error) {
            console.error("Failed to fetch FAQs", error);
            setError("Failed to fetch FAQs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const faqData = { question, answer };

        try {
            if (editingFaq) {
                await axios.put(`${API_URL}/${editingFaq._id}`, faqData, config);
                setSuccess('FAQ updated successfully!');
            } else {
                await axios.post(API_URL, faqData, config);
                setSuccess('FAQ added successfully!');
            }
            resetForm();
            fetchFaqs();
        } catch (error) {
            console.error("Failed to save FAQ", error);
            setError(editingFaq ? "Failed to update FAQ" : "Failed to add FAQ");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (faq) => {
        setEditingFaq(faq);
        setQuestion(faq.question);
        setAnswer(faq.answer);
    };

    const handleDelete = async (id) => {
        console.log("Deleting FAQ ID:", id, "with token:", user?.token, "and role:", user?.role);

        if (window.confirm("Are you sure?")) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`${API_URL}/${id}`, config);
                setSuccess('FAQ deleted successfully!');
                fetchFaqs();
            } catch (error) {
                console.error("Delete error:", error.response?.data || error);
                setError("Failed to delete FAQ");
            }
        }
    };

    const resetForm = () => {
        setQuestion('');
        setAnswer('');
        setEditingFaq(null);
    };

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const styles = {
        primary: '#1a73e8',
        primaryHover: '#1765cc',
        secondary: '#f1f3f4',
        secondaryHover: '#e8eaed',
        borderMain: '#dadce0',
        textMain: '#202124',
        textSecondary: '#5f6368'
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto p-6">
                {/* Page Title Card - Updated to match theme */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <HelpCircle className="w-7 h-7" />
                                FAQ Management
                            </h2>
                            <div className="flex items-center gap-3">
                                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                                    <span className="text-blue-500 font-semibold text-sm">
                                        Total: {faqs.length}
                                    </span>
                                </div>
                                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                                    <span className="text-blue-500 font-semibold text-sm">
                                        Filtered: {filteredFaqs.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p className="text-red-700 font-medium">{error}</p>
                            <button 
                                onClick={() => setError('')}
                                className="ml-auto text-red-500 hover:text-red-700"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p className="text-green-700 font-medium">{success}</p>
                            <button 
                                onClick={() => setSuccess('')}
                                className="ml-auto text-green-500 hover:text-green-700"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-xl border overflow-hidden" style={{ borderColor: styles.borderMain }}>
                            <div 
                                className="px-6 py-5 border-b"
                                style={{ backgroundColor: editingFaq ? '#fff7ed' : styles.secondary, borderColor: styles.borderMain }}
                            >
                                <div className="flex items-center">
                                    <div 
                                        className="w-10 h-10 rounded-xl flex items-center justify-center mr-3"
                                        style={{ backgroundColor: editingFaq ? '#fed7aa' : 'white' }}
                                    >
                                        <svg className="w-5 h-5" style={{ color: editingFaq ? '#f59e0b' : styles.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {editingFaq ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                            )}
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold" style={{ color: styles.textMain }}>
                                        {editingFaq ? "Edit FAQ" : "Add New FAQ"}
                                    </h2>
                                </div>
                            </div>

                            <div className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold mb-3" style={{ color: styles.textMain }}>
                                            Question *
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all duration-200"
                                            style={{ borderColor: styles.borderMain }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = styles.primary;
                                                e.target.style.boxShadow = `0 0 0 2px ${styles.primary}33`;
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = styles.borderMain;
                                                e.target.style.boxShadow = 'none';
                                            }}
                                            value={question}
                                            onChange={(e) => setQuestion(e.target.value)}
                                            placeholder="Enter the frequently asked question..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-3" style={{ color: styles.textMain }}>
                                            Answer *
                                        </label>
                                        <textarea
                                            className="w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 resize-none"
                                            style={{ borderColor: styles.borderMain }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = styles.primary;
                                                e.target.style.boxShadow = `0 0 0 2px ${styles.primary}33`;
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = styles.borderMain;
                                                e.target.style.boxShadow = 'none';
                                            }}
                                            rows="6"
                                            value={answer}
                                            onChange={(e) => setAnswer(e.target.value)}
                                            placeholder="Provide a clear and helpful answer..."
                                            required
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                                            style={{ backgroundColor: editingFaq ? '#f59e0b' : styles.primary }}
                                            onMouseEnter={(e) => {
                                                if (!loading) {
                                                    e.target.style.backgroundColor = editingFaq ? '#d97706' : styles.primaryHover;
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!loading) {
                                                    e.target.style.backgroundColor = editingFaq ? '#f59e0b' : styles.primary;
                                                }
                                            }}
                                        >
                                            {loading ? (
                                                <div className="flex items-center justify-center">
                                                    <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                                                        <path fill="currentColor" className="opacity-75" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        {editingFaq ? (
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                                                        ) : (
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                                        )}
                                                    </svg>
                                                    {editingFaq ? "Update FAQ" : "Add FAQ"}
                                                </div>
                                            )}
                                        </button>
                                        
                                        {editingFaq && (
                                            <button
                                                type="button"
                                                onClick={resetForm}
                                                className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                                                style={{ backgroundColor: styles.secondaryHover, color: styles.textMain }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = styles.borderMain;
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = styles.secondaryHover;
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - FAQ List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-xl border overflow-hidden" style={{ borderColor: styles.borderMain }}>
                            <div 
                                className="px-6 py-5 border-b"
                                style={{ backgroundColor: styles.secondary, borderColor: styles.borderMain }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div 
                                            className="w-10 h-10 rounded-xl flex items-center justify-center mr-3"
                                            style={{ backgroundColor: 'white' }}
                                        >
                                            <svg className="w-5 h-5" style={{ color: styles.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                            </svg>
                                        </div>
                                        <h2 className="text-xl font-bold" style={{ color: styles.textMain }}>
                                            Existing FAQs
                                        </h2>
                                    </div>
                                    <div className="flex items-center">
                                        <span 
                                            className="px-3 py-1 rounded-full text-sm font-medium"
                                            style={{ backgroundColor: 'white', color: styles.primary }}
                                        >
                                            {filteredFaqs.length} FAQs
                                        </span>
                                    </div>
                                </div>

                                {/* Search Bar */}
                                <div className="mt-4">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5" style={{ color: styles.textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search FAQs..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 transition-all duration-200"
                                            style={{ borderColor: styles.borderMain }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = styles.primary;
                                                e.target.style.boxShadow = `0 0 0 2px ${styles.primary}33`;
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = styles.borderMain;
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <svg className="w-8 h-8 animate-spin" style={{ color: styles.primary }} fill="none" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                                            <path fill="currentColor" className="opacity-75" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                ) : filteredFaqs.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div 
                                            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                                            style={{ backgroundColor: styles.secondary }}
                                        >
                                            <svg className="w-8 h-8" style={{ color: styles.textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2" style={{ color: styles.textMain }}>
                                            {searchTerm ? 'No matching FAQs found' : 'No FAQs yet'}
                                        </h3>
                                        <p style={{ color: styles.textSecondary }}>
                                            {searchTerm ? 'Try adjusting your search terms' : 'Create your first FAQ using the form on the left'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredFaqs.map((faq, index) => (
                                            <div
                                                key={faq._id}
                                                className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                                                style={{ 
                                                    borderColor: editingFaq?._id === faq._id ? '#f59e0b' : styles.borderMain,
                                                    backgroundColor: editingFaq?._id === faq._id ? '#fffbeb' : 'white',
                                                    animationDelay: `${index * 0.1}s`,
                                                    animation: 'fadeInUp 0.5s ease-out forwards'
                                                }}
                                            >
                                                <div className="p-6">
                                                    <div className="flex items-start mb-3">
                                                        <div 
                                                            className="w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0"
                                                            style={{ backgroundColor: editingFaq?._id === faq._id ? '#fed7aa' : styles.secondary }}
                                                        >
                                                            <svg className="w-4 h-4" style={{ color: editingFaq?._id === faq._id ? '#f59e0b' : styles.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-semibold mb-2" style={{ color: styles.textMain }}>
                                                                {faq.question}
                                                            </h3>
                                                            <p className="leading-relaxed" style={{ color: styles.textSecondary }}>
                                                                {faq.answer}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex gap-3 pt-4 border-t" style={{ borderColor: styles.borderMain }}>
                                                        <button
                                                            onClick={() => handleEdit(faq)}
                                                            className="flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
                                                            style={{ 
                                                                backgroundColor: editingFaq?._id === faq._id ? '#fed7aa' : '#fff7ed',
                                                                color: '#f59e0b'
                                                            }}
                                                        >
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                            </svg>
                                                            {editingFaq?._id === faq._id ? 'Editing...' : 'Edit'}
                                                        </button>
                                                        
                                                        <button
                                                            onClick={() => handleDelete(faq._id)}
                                                            disabled={loading}
                                                            className="flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                                                            style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}
                                                        >
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                            </svg>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default ManageFaqs;