// //frontend/src/layouts/HRLayout.jsx
// import React from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from '../components/dashboard/Sidebar';
// import Header from '../components/dashboard/Header';

// const HRLayout = () => {
//   const navLinks = [
//     { name: "Dashboard", path: "/hrmanager/dashboard" },
//     // { name: 'Drivers', path: '/hr/drivers' },
//     // { name: 'Vehicles', path: '/hr/vehicles' },
//     // { name: 'Deliveries', path: '/hr/deliveries' },
//     // { name: 'FAQs', path: '/hr/faqs' },
//     // { name: 'Inquiries', path: '/hr/inquiries' },
//     // { name: 'Contacts', path: '/admin/contacts' },
//   ];

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Sidebar navLinks={navLinks} />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header />
//         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default HRLayout;

import React from "react";
import { Outlet } from "react-router-dom";

export default function HRLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
}