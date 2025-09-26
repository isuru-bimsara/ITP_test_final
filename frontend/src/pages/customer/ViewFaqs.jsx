import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/common/Card';

const API_URL = 'http://localhost:5000/api/faqs';

const ViewFaqs = () => {
    const [faqs, setFaqs] = useState([]);
    const [openFaqId, setOpenFaqId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const { data } = await axios.get(API_URL);
                setFaqs(data);
            } catch (error) {
                console.error("Failed to fetch FAQs", error);
            }
        };
        fetchFaqs();
    }, []);

    const toggleFaq = (id) => {
        setOpenFaqId(openFaqId === id ? null : id);
    };

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div 
            className="min-h-screen p-6"
            style={{ backgroundColor: 'var(--color-secondary)' }}
        >
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <div 
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-lg"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h1 
                        className="text-4xl font-bold mb-4"
                        style={{ color: 'var(--color-primary)' }}
                    >
                        Frequently Asked Questions
                    </h1>
                    <p 
                        className="text-lg max-w-2xl mx-auto"
                        style={{ color: 'var(--color-text-secondary)' }}
                    >
                        Find answers to common questions and get the help you need quickly
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-xl mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg 
                                className="h-5 w-5"
                                style={{ color: 'var(--color-text-secondary)' }}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search FAQs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl bg-white backdrop-blur-sm focus:outline-none focus:ring-2 transition-all duration-300 shadow-lg hover:shadow-xl"
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
                                e.target.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                            }}
                        />
                    </div>
                </div>

                {/* FAQ Container */}
                <div 
                    className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden"
                    style={{ border: `1px solid var(--color-border-main)` }}
                >
                    <div 
                        className="px-8 py-6"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">
                                Help Center
                            </h2>
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                <span className="text-white font-semibold">
                                    {filteredFaqs.length} {filteredFaqs.length === 1 ? 'Question' : 'Questions'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        {filteredFaqs.length === 0 ? (
                            <div className="text-center py-16">
                                <svg 
                                    className="w-20 h-20 mx-auto mb-6"
                                    style={{ color: 'var(--color-border-main)' }}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                <h3 
                                    className="text-xl font-semibold mb-2"
                                    style={{ color: 'var(--color-text-secondary)' }}
                                >
                                    {searchTerm ? 'No matching questions found' : 'No FAQs available'}
                                </h3>
                                <p style={{ color: 'var(--color-text-secondary)' }}>
                                    {searchTerm ? 'Try adjusting your search terms' : 'Questions will appear here once they are added'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredFaqs.map((faq, index) => (
                                    <div
                                        key={faq._id}
                                        className="rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
                                        style={{
                                            border: `1px solid var(--color-border-main)`,
                                            animationDelay: `${index * 0.1}s`,
                                            animation: 'fadeInUp 0.5s ease-out forwards'
                                        }}
                                    >
                                        <button
                                            onClick={() => toggleFaq(faq._id)}
                                            className="w-full text-left py-6 px-8 flex justify-between items-center focus:outline-none transition-all duration-300 group"
                                            style={{
                                                color: 'var(--color-text-main)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = 'var(--color-secondary-hover)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            }}
                                            onFocus={(e) => {
                                                e.currentTarget.style.boxShadow = `inset 0 0 0 2px var(--color-primary)`;
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <span 
                                                className="font-semibold text-lg transition-colors duration-300 pr-4"
                                                style={{
                                                    color: openFaqId === faq._id ? 'var(--color-primary)' : 'var(--color-text-main)'
                                                }}
                                            >
                                                {faq.question}
                                            </span>
                                            <div 
                                                className={`w-10 h-10 rounded-full flex items-center justify-center transform transition-all duration-300 ${openFaqId === faq._id ? 'rotate-45' : ''}`}
                                                style={{
                                                    backgroundColor: openFaqId === faq._id ? 'var(--color-primary)' : 'var(--color-secondary)'
                                                }}
                                            >
                                                <svg 
                                                    className={`w-5 h-5 transition-all duration-300`}
                                                    style={{
                                                        color: openFaqId === faq._id ? 'white' : 'var(--color-primary)'
                                                    }}
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                                </svg>
                                            </div>
                                        </button>
                                        
                                        <div className={`overflow-hidden transition-all duration-500 ease-out ${openFaqId === faq._id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <div className="px-8 pb-6 pt-2">
                                                <div 
                                                    className="rounded-xl p-6 border-l-4"
                                                    style={{ 
                                                        backgroundColor: 'var(--color-secondary)',
                                                        borderLeftColor: 'var(--color-primary)'
                                                    }}
                                                >
                                                    <div className="flex items-start">
                                                        <div 
                                                            className="w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0"
                                                            style={{ backgroundColor: 'var(--color-primary)' }}
                                                        >
                                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                            </svg>
                                                        </div>
                                                        <p 
                                                            className="leading-relaxed text-base"
                                                            style={{ color: 'var(--color-text-main)' }}
                                                        >
                                                            {faq.answer}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div 
                        className="px-8 py-6"
                        style={{ 
                            backgroundColor: 'var(--color-secondary)',
                            borderTop: `1px solid var(--color-border-main)`
                        }}
                    >
                        <div className="text-center">
                            <p 
                                className="mb-4"
                                style={{ color: 'var(--color-text-secondary)' }}
                            >
                                Still have questions?
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button 
                                    className="text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                                    style={{ backgroundColor: 'var(--color-primary)' }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = 'var(--color-primary-hover)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = 'var(--color-primary)';
                                    }}
                                >
                                    <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                    </svg>
                                    Contact Support
                                </button>
                                <button 
                                    className="bg-white font-semibold py-3 px-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                                    style={{ 
                                        color: 'var(--color-text-main)',
                                        border: `2px solid var(--color-border-main)`
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = 'var(--color-secondary-hover)';
                                        e.target.style.borderColor = 'var(--color-primary)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = 'white';
                                        e.target.style.borderColor = 'var(--color-border-main)';
                                    }}
                                >
                                    <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                    </svg>
                                    View Documentation
                                </button>
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

export default ViewFaqs;