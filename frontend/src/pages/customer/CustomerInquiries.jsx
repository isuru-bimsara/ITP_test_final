import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { BiSupport } from "react-icons/bi";

const API_URL = 'http://localhost:5000/api/inquiries';

const CustomerInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [reply, setReply] = useState('');
    const { user } = useAuth();

    const fetchInquiries = async () => {
        if (user) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${API_URL}/my-inquiries`, config);
                setInquiries(data);
            } catch (error) {
                console.error("Failed to fetch inquiries", error);
            }
        }
    };
    
    useEffect(() => {
        fetchInquiries();
    }, [user]);

    const handleNewInquiry = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(API_URL, { subject, message }, config);
            setSubject('');
            setMessage('');
            fetchInquiries();
        } catch (error) {
            console.error("Failed to create inquiry", error);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put(`${API_URL}/${selectedInquiry._id}/reply`, { message: reply }, config);
            setSelectedInquiry(data);
            setReply('');
            fetchInquiries();
        } catch (error) {
            console.error("Failed to send reply", error);
        }
    };

    return (
        <div 
            className="min-h-screen p-6"
            style={{ backgroundColor: 'var(--color-secondary)' }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl shadow-lg mb-4">
            <BiSupport  className="text-3xl" />
            <h1 className="text-3xl font-bold">Customer Support</h1>
          </div>
          <p className="text-gray-600 text-lg font-medium">
            Support You Can Trust, Every Single Time
          </p>
        </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - New Inquiry & Inquiry List */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* New Inquiry Form */}
                        <div 
                            className="bg-white rounded-2xl shadow-xl overflow-hidden"
                            style={{ border: `1px solid var(--color-border-main)` }}
                        >
                            <div 
                                className="px-6 py-4"
                                style={{ backgroundColor: 'var(--color-primary)' }}
                            >
                                <h2 className="text-xl font-semibold text-white flex items-center">
                                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                    New Inquiry
                                </h2>
                            </div>
                            <div className="p-6">
                                <form onSubmit={handleNewInquiry} className="space-y-5">
                                    <div>
                                        <label 
                                            className="block text-sm font-semibold mb-2"
                                            style={{ color: 'var(--color-text-main)' }}
                                        >
                                            Subject
                                        </label>
                                        <input 
                                            type="text" 
                                            className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                                            style={{
                                                border: `1px solid var(--color-border-main)`,
                                                backgroundColor: 'var(--color-secondary)',
                                                color: 'var(--color-text-main)'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.backgroundColor = 'white';
                                                e.target.style.borderColor = 'var(--color-primary)';
                                                e.target.style.boxShadow = `0 0 0 2px rgba(26, 115, 232, 0.2)`;
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.backgroundColor = 'var(--color-secondary)';
                                                e.target.style.borderColor = 'var(--color-border-main)';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                            value={subject} 
                                            onChange={e => setSubject(e.target.value)} 
                                            placeholder="Enter inquiry subject..."
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label 
                                            className="block text-sm font-semibold mb-2"
                                            style={{ color: 'var(--color-text-main)' }}
                                        >
                                            Message
                                        </label>
                                        <textarea 
                                            className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 resize-none" 
                                            rows="4"
                                            style={{
                                                border: `1px solid var(--color-border-main)`,
                                                backgroundColor: 'var(--color-secondary)',
                                                color: 'var(--color-text-main)'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.backgroundColor = 'white';
                                                e.target.style.borderColor = 'var(--color-primary)';
                                                e.target.style.boxShadow = `0 0 0 2px rgba(26, 115, 232, 0.2)`;
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.backgroundColor = 'var(--color-secondary)';
                                                e.target.style.borderColor = 'var(--color-border-main)';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                            value={message} 
                                            onChange={e => setMessage(e.target.value)} 
                                            placeholder="Describe your inquiry in detail..."
                                            required
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                                        style={{ backgroundColor: 'var(--color-primary)' }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = 'var(--color-primary-hover)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = 'var(--color-primary)';
                                        }}
                                    >
                                        Submit Inquiry
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Inquiries List */}
                        <div 
                            className="bg-white rounded-2xl shadow-xl overflow-hidden"
                            style={{ border: `1px solid var(--color-border-main)` }}
                        >
                            <div 
                                className="px-6 py-4"
                                style={{ backgroundColor: 'var(--color-text-main)' }}
                            >
                                <h2 className="text-xl font-semibold text-white flex items-center">
                                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                                    </svg>
                                    My Inquiries
                                    <span className="ml-auto bg-white/20 px-2 py-1 rounded-full text-sm">{inquiries.length}</span>
                                </h2>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {inquiries.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <svg 
                                            className="w-16 h-16 mx-auto mb-4"
                                            style={{ color: 'var(--color-border-main)' }}
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                                        </svg>
                                        <p style={{ color: 'var(--color-text-secondary)' }}>No inquiries yet</p>
                                        <p 
                                            className="text-sm"
                                            style={{ color: 'var(--color-text-secondary)' }}
                                        >
                                            Create your first inquiry above
                                        </p>
                                    </div>
                                ) : (
                                    inquiries.map(inq => (
                                        <div 
                                            key={inq._id} 
                                            onClick={() => setSelectedInquiry(inq)} 
                                            className="p-4 cursor-pointer transition-all duration-200"
                                            style={{
                                                borderBottom: `1px solid var(--color-border-main)`,
                                                borderLeft: selectedInquiry?._id === inq._id 
                                                    ? `4px solid var(--color-primary)` 
                                                    : '4px solid transparent',
                                                backgroundColor: selectedInquiry?._id === inq._id 
                                                    ? 'rgba(26, 115, 232, 0.05)' 
                                                    : 'transparent'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (selectedInquiry?._id !== inq._id) {
                                                    e.target.style.backgroundColor = 'var(--color-secondary-hover)';
                                                    e.target.style.borderLeft = `4px solid rgba(26, 115, 232, 0.3)`;
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (selectedInquiry?._id !== inq._id) {
                                                    e.target.style.backgroundColor = 'transparent';
                                                    e.target.style.borderLeft = '4px solid transparent';
                                                }
                                            }}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <p 
                                                    className="font-semibold truncate flex-1 mr-3"
                                                    style={{ color: 'var(--color-text-main)' }}
                                                >
                                                    {inq.subject}
                                                </p>
                                                <span 
                                                    className="px-3 py-1 text-xs font-semibold rounded-full shrink-0"
                                                    style={{
                                                        backgroundColor: inq.isClosed ? 'var(--color-secondary)' : 'rgba(34, 197, 94, 0.1)',
                                                        color: inq.isClosed ? 'var(--color-text-secondary)' : '#059669'
                                                    }}
                                                >
                                                    {inq.isClosed ? 'Closed' : 'Open'}
                                                </span>
                                            </div>
                                            <div 
                                                className="flex items-center text-xs"
                                                style={{ color: 'var(--color-text-secondary)' }}
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                                </svg>
                                                {inq.messages?.length || 0} messages
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Inquiry Details */}
                    <div className="lg:col-span-2">
                        <div 
                            className="bg-white rounded-2xl shadow-xl overflow-hidden h-[calc(100vh-200px)]"
                            style={{ border: `1px solid var(--color-border-main)` }}
                        >
                            <div 
                                className="px-6 py-4"
                                style={{ backgroundColor: 'var(--color-primary)' }}
                            >
                                <h2 className="text-xl font-semibold text-white flex items-center">
                                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    {selectedInquiry ? selectedInquiry.subject : 'Inquiry Details'}
                                </h2>
                            </div>
                            
                            {selectedInquiry ? (
                                <div className="flex flex-col h-[calc(100%-80px)]">
                                    {/* Messages Area */}
                                    <div 
                                        className="flex-1 p-6 overflow-y-auto"
                                        style={{ backgroundColor: 'var(--color-secondary)' }}
                                    >
                                        <div className="space-y-4">
                                            {selectedInquiry.messages?.map((msg, index) => (
                                                <div 
                                                    key={index} 
                                                    className={`flex ${msg.sender.role === 'Customer' ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div 
                                                        className="max-w-lg p-4 rounded-2xl shadow-sm"
                                                        style={{
                                                            backgroundColor: msg.sender.role === 'Customer' 
                                                                ? 'var(--color-primary)' 
                                                                : 'white',
                                                            color: msg.sender.role === 'Customer' 
                                                                ? 'white' 
                                                                : 'var(--color-text-main)',
                                                            border: msg.sender.role === 'Customer' 
                                                                ? 'none' 
                                                                : `1px solid var(--color-border-main)`
                                                        }}
                                                    >
                                                        <div className="flex items-center mb-2">
                                                            <div 
                                                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold mr-3"
                                                                style={{
                                                                    backgroundColor: msg.sender.role === 'Customer' 
                                                                        ? 'rgba(255, 255, 255, 0.2)' 
                                                                        : 'var(--color-secondary)',
                                                                    color: msg.sender.role === 'Customer' 
                                                                        ? 'white' 
                                                                        : 'var(--color-text-secondary)'
                                                                }}
                                                            >
                                                                {msg.sender.username?.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span 
                                                                className="text-sm font-medium"
                                                                style={{
                                                                    color: msg.sender.role === 'Customer' 
                                                                        ? 'rgba(255, 255, 255, 0.9)' 
                                                                        : 'var(--color-text-secondary)'
                                                                }}
                                                            >
                                                                {msg.sender.username}
                                                            </span>
                                                        </div>
                                                        <p className="leading-relaxed">{msg.text}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Reply Form */}
                                    {!selectedInquiry.isClosed && (
                                        <div 
                                            className="p-6"
                                            style={{ 
                                                backgroundColor: 'var(--color-secondary)',
                                                borderTop: `1px solid var(--color-border-main)`
                                            }}
                                        >
                                            <form onSubmit={handleReply} className="space-y-4">
                                                <textarea 
                                                    className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 bg-white resize-none" 
                                                    rows="3"
                                                    style={{
                                                        border: `1px solid var(--color-border-main)`,
                                                        color: 'var(--color-text-main)'
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = 'var(--color-primary)';
                                                        e.target.style.boxShadow = `0 0 0 2px rgba(26, 115, 232, 0.2)`;
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = 'var(--color-border-main)';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                    placeholder="Type your reply..." 
                                                    value={reply} 
                                                    onChange={(e) => setReply(e.target.value)} 
                                                    required
                                                ></textarea>
                                                <div className="flex justify-end">
                                                    <button
                                                        type="submit"
                                                        className="text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center"
                                                        style={{ backgroundColor: 'var(--color-primary)' }}
                                                        onMouseEnter={(e) => {
                                                            e.target.style.backgroundColor = 'var(--color-primary-hover)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.backgroundColor = 'var(--color-primary)';
                                                        }}
                                                    >
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                                        </svg>
                                                        Send Reply
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div 
                                    className="flex flex-col items-center justify-center h-full p-8"
                                    style={{ color: 'var(--color-text-secondary)' }}
                                >
                                    <svg 
                                        className="w-20 h-20 mb-6"
                                        style={{ color: 'var(--color-border-main)' }}
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                    </svg>
                                    <h3 
                                        className="text-xl font-semibold mb-2"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                    >
                                        No Inquiry Selected
                                    </h3>
                                    <p className="text-center">
                                        Select an inquiry from the list to view messages or create a new one to get started.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerInquiries;