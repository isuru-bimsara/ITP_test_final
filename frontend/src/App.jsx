// // frontend/src/App.jsx
// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import MainLayout from "./layouts/MainLayout";
// import AdminLayout from "./layouts/AdminLayout";
// import CustomerLayout from "./layouts/CustomerLayout";
// import HomePage from "./pages/HomePage";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import ContactPage from "./pages/ContactPage";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import ManageDeliveries from "./pages/admin/ManageDeliveries";
// import ManageDrivers from "./pages/admin/ManageDrivers";
// import ManageVehicles from "./pages/admin/ManageVehicles";
// import ManageFaqs from "./pages/admin/ManageFaqs";
// import AdminInquiries from "./pages/admin/AdminInquiries";
// import CustomerDashboard from "./pages/customer/CustomerDashboard";
// import MyOrders from "./pages/customer/MyOrders";
// import MyReviews from "./pages/customer/MyReviews";
// import ViewFaqs from "./pages/customer/ViewFaqs";
// import CustomerInquiries from "./pages/customer/CustomerInquiries";
// import { useAuth } from "./hooks/useAuth";
// import ContactUs from "./pages/customer/Contactus";
// import ManageContacts from "./pages/admin/ManageContacts";

// //hr manager
// import HRdashboard from "./pages/hrmanager/HRdashboard";
// import HRLayout from "./layouts/HRLayout";

// //finance manager
// import FinanceDashboard from "./pages/financialmanager/Financialdashboard";
// import FinanceLayout from "./layouts/Financelayout";

// function App() {
//   const { user } = useAuth();

//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/" element={<MainLayout />}>
//         <Route index element={<HomePage />} />
//         <Route path="login" element={<LoginPage />} />
//         <Route path="register" element={<RegisterPage />} />
//         <Route path="contact" element={<ContactPage />} />
//       </Route>

//       {/* Admin Routes */}
//       <Route
//         path="/admin"
//         element={
//           user?.role === "Admin" ? <AdminLayout /> : <Navigate to="/login" />
//         }
//       >
//         <Route index element={<Navigate to="dashboard" />} />
//         <Route path="dashboard" element={<AdminDashboard />} />
//         <Route path="deliveries" element={<ManageDeliveries />} />
//         <Route path="drivers" element={<ManageDrivers />} />
//         <Route path="vehicles" element={<ManageVehicles />} />
//         <Route path="faqs" element={<ManageFaqs />} />
//         <Route path="inquiries" element={<AdminInquiries />} />
//         <Route path="contacts" element={<ManageContacts />} />
//       </Route>

//       {/* Customer Routes */}
//       <Route
//         path="/customer"
//         element={
//           user?.role === "Customer" ? (
//             <CustomerLayout />
//           ) : (
//             <Navigate to="/login" />
//           )
//         }
//       >
//         <Route index element={<Navigate to="dashboard" />} />
//         <Route path="dashboard" element={<CustomerDashboard />} />
//         <Route path="orders" element={<MyOrders />} />
//         <Route path="reviews" element={<MyReviews />} />
//         <Route path="faqs" element={<ViewFaqs />} />
//         <Route path="inquiries" element={<CustomerInquiries />} />
//         <Route path="contactus" element={<ContactUs />} />
//       </Route>

//       {/* hr Routes */}
//       <Route
//         path="/hrmanager"
//         element={
//           user?.role === "hrmanager" ? <HRLayout /> : <Navigate to="/login" />
//         }
//       >
//         <Route index element={<Navigate to="dashboard" />} />
//         <Route path="dashboard" element={<HRdashboard />} />
//         {/* <Route path="orders" element={<MyOrders />} />
//         <Route path="reviews" element={<MyReviews />} />
//         <Route path="faqs" element={<ViewFaqs />} />
//         <Route path="inquiries" element={<CustomerInquiries />} />
//         <Route path="contactus" element={<ContactUs />} /> */}
//       </Route>

//       {/* finance Routes */}
//       <Route
//         path="/financialmanager"
//         element={
//           user?.role === "financialmanager" ? (
//             <FinanceLayout />
//           ) : (
//             <Navigate to="/login" />
//           )
//         }
//       >
//         <Route index element={<Navigate to="dashboard" />} />
//         <Route path="dashboard" element={<FinanceDashboard />} />
//         {/* <Route path="orders" element={<MyOrders />} />
//         <Route path="reviews" element={<MyReviews />} />
//         <Route path="faqs" element={<ViewFaqs />} />
//         <Route path="inquiries" element={<CustomerInquiries />} />
//         <Route path="contactus" element={<ContactUs />} /> */}
//       </Route>
//     </Routes>
//   );
// }

// export default App;


// frontend/src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ContactPage from "./pages/ContactPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageDeliveries from "./pages/admin/ManageDeliveries";
import ManageDrivers from "./pages/admin/ManageDrivers";
import ManageVehicles from "./pages/admin/ManageVehicles";
import ManageFaqs from "./pages/admin/ManageFaqs";
import AdminInquiries from "./pages/admin/AdminInquiries";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import MyOrders from "./pages/customer/MyOrders";
import MyReviews from "./pages/customer/MyReviews";
import ViewFaqs from "./pages/customer/ViewFaqs";
import CustomerInquiries from "./pages/customer/CustomerInquiries";
import { useAuth } from "./hooks/useAuth";
import ContactUs from "./pages/customer/Contactus";
import ManageContacts from "./pages/admin/ManageContacts";

// hr manager
import HRdashboard from "./pages/hrmanager/HRdashboard";
import HRLayout from "./layouts/HRLayout";
import AddEmployee from "./pages/hrmanager/AddEmployee";
import DisplayEmployees from "./pages/hrmanager/DisplayEmployees";
import GenerateReport from "./pages/hrmanager/GenerateReport";
import UpdateEmployee from "./pages/hrmanager/UpdateEmployee";

// finance manager
import FinanceDashboard from "./pages/financialmanager/Financialdashboard";
import FinanceLayout from "./layouts/Financelayout";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={user?.role === "Admin" ? <AdminLayout /> : <Navigate to="/login" />}
      >
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="deliveries" element={<ManageDeliveries />} />
        <Route path="drivers" element={<ManageDrivers />} />
        <Route path="vehicles" element={<ManageVehicles />} />
        <Route path="faqs" element={<ManageFaqs />} />
        <Route path="inquiries" element={<AdminInquiries />} />
        <Route path="contacts" element={<ManageContacts />} />
      </Route>

      {/* Customer Routes */}
      <Route
        path="/customer"
        element={user?.role === "Customer" ? <CustomerLayout /> : <Navigate to="/login" />}
      >
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="orders" element={<MyOrders />} />
        <Route path="reviews" element={<MyReviews />} />
        <Route path="faqs" element={<ViewFaqs />} />
        <Route path="inquiries" element={<CustomerInquiries />} />
        <Route path="contactus" element={<ContactUs />} />
      </Route>

      {/* HR Manager Routes */}
      <Route
        path="/hrmanager"
        element={user?.role === "hrmanager" ? <HRLayout /> : <Navigate to="/login" />}
      >
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<HRdashboard />} />
        <Route path="add-employee" element={<AddEmployee />} />
        <Route path="our-employees" element={<DisplayEmployees />} />
        <Route path="GenerateReport" element={<GenerateReport />} />
        <Route path="employee/update/:id" element={<UpdateEmployee />} />
      </Route>

      {/* Finance Manager Routes */}
      <Route
        path="/financialmanager"
        element={
          user?.role === "financialmanager" ? <FinanceLayout /> : <Navigate to="/login" />
        }
      >
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<FinanceDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;