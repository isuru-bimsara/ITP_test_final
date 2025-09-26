import React from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const ContactPage = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-2 text-text-main">Contact Us</h1>
                    <p className="text-gray-600 mb-8">We'd love to hear from you! Please fill out the form below.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Send a Message</h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
                                <input className="w-full p-2 border rounded" type="text" id="name" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                                <input className="w-full p-2 border rounded" type="email" id="email" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="message">Message</label>
                                <textarea className="w-full p-2 border rounded" id="message" rows="5" required></textarea>
                            </div>
                            <Button type="submit">Submit</Button>
                        </form>
                    </div>
                    <div>
                         <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                         <p className="text-gray-700 mb-2"><span className="font-bold">Address:</span> 123 Delivery Lane, Service City, 45678</p>
                         <p className="text-gray-700 mb-2"><span className="font-bold">Phone:</span> (123) 456-7890</p>
                         <p className="text-gray-700 mb-2"><span className="font-bold">Email:</span> support@deliveryapp.com</p>
                         <div className="mt-6">
                            <h3 className="text-xl font-bold mb-2">Hours of Operation</h3>
                            <p className="text-gray-700">Monday - Friday: 9:00 AM - 6:00 PM</p>
                            <p className="text-gray-700">Saturday: 10:00 AM - 4:00 PM</p>
                            <p className="text-gray-700">Sunday: Closed</p>
                         </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ContactPage;
