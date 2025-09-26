// // frontend/src/pages/Home.js
// import React from "react";
// import { Link } from "react-router-dom";
// import Navbar from "../components/routes/Navbar";
// import Footer from "../components/routes/Footer";

// export default function Home() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <Navbar />
//       <h1 className="text-4xl font-bold text-blue-600 mb-4">
//         Welcome to My MERN Project
//       </h1>
//       <p className="text-lg text-gray-700 mb-6">
//         This is the homepage of your MERN application.
//       </p>

//       <div className="space-x-4">
//         <Link
//           to="/register"
//           className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
//         >
//           Register
//         </Link>
//         <Link
//           to="/login"
//           className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
//         >
//           Login
//         </Link>
//         <Link
//           to="/profile"
//           className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600"
//         >
//           Profile
//         </Link>
//       </div>
//     </div>
//   );
// }

import React from "react";
// import Navbar from "../components/routes/Navbar";
// import Footer from "../components/routes/Footer";
// Option B: import images from src/assets (bundler will hash and optimize)
import heroImg from "../assets/header.jpg";
import factoryImg from "../assets/banner.jpg";

export default function Home() {
  return (
    <main className="bg-white">
   
      {/* =====================================
         Part 1: Hero
      ====================================== */}
      <section
        className="relative"
        style={{
          backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24 lg:py-28">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
                Premium <span className="text-blue-600">Garments</span>
                <br />
                For Your Business
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Discover our exceptional quality garment manufacturing services
                tailored to meet your business needs with precision and care.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#get-started"
                  className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                >
                  Get Started
                  <svg
                    className="ml-2 h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </a>

                <a
                  href="#demo"
                  className="inline-flex items-center rounded-xl border border-blue-300 px-6 py-3 text-base font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                >
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-blue-400">
                    <svg
                      className="h-3.5 w-3.5 text-blue-600"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7L8 5z" />
                    </svg>
                  </span>
                  Watch Demo
                </a>
              </div>

              <div className="mt-14 grid max-w-xl grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                    500+
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    Happy Clients
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                    20+
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    Years Experience
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                    100%
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    Quality Assured
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-6 left-6 z-10 rounded-xl bg-white px-4 py-2 shadow-md ring-1 ring-slate-200">
                <span className="flex items-center text-sm font-semibold text-slate-700">
                  <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                  Quality Certified
                </span>
              </div>

              <div className="rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-200">
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={heroImg}
                    alt="Modern garment manufacturing"
                    className="h-[360px] w-full object-cover sm:h-[420px] lg:h-[460px]"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="absolute -bottom-4 right-6 z-10 rounded-xl bg-blue-600 px-5 py-3 text-white shadow-lg">
                <div className="text-sm font-semibold">Custom Orders</div>
                <div className="text-xs text-blue-100">Fast Turnaround</div>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white/60 to-transparent"></div>
      </section>

      {/* =====================================
         Part 2: Why Choose Us
      ====================================== */}
      <section className="relative bg-white" id="services">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20 lg:py-24">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Why Choose Us
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Exceptional Garment Manufacturing
            </h2>
            <div className="mx-auto mt-4 h-1 w-24 rounded bg-blue-600" />
          </div>

          <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-8 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-start">
                <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                  <svg
                    className="h-7 w-7 text-blue-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M12 2l9 5-9 5-9-5 9-5z" />
                    <path d="M21 12l-9 5-9-5" />
                    <path d="M12 22V12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Premium Quality Products
                  </h3>
                  <p className="mt-3 text-slate-600">
                    Our garments undergo rigorous quality checks to ensure they
                    meet the highest industry standards.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-8 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-start">
                <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                  <svg
                    className="h-7 w-7 text-blue-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="9" cy="8" r="4" />
                    <path d="M17 11a4 4 0 1 0-3-7" />
                    <path d="M2 22c0-5 7-6 7-6s7 1 7 6" />
                    <path d="M22 22c0-3-3-4-3-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Expert Team
                  </h3>
                  <p className="mt-3 text-slate-600">
                    Our experienced team combines craftsmanship with modern
                    manufacturing technologies.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-8 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-start">
                <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                  <svg
                    className="h-7 w-7 text-blue-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M3 17l6-6 4 4 7-7" />
                    <path d="M14 8h7v7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Fast Production
                  </h3>
                  <p className="mt-3 text-slate-600">
                    Efficient production processes ensure quick turnaround times
                    without compromising quality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
         Part 3: New Seasonal Collection (Hero Variant)
      ====================================== */}
      <section className="relative bg-white" id="collection">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div
              className="relative rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12"
              style={{
                backgroundImage:
                  "radial-gradient(#e2e8f0 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            >
              <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-100">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2l2.09 6.26L20 9l-5 3.64L16.18 20 12 16.9 7.82 20 9 12.64 4 9l5.91-.74L12 2z" />
                </svg>
                New Seasonal Collection
              </span>

              <h2 className="mt-1 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl md:text-6xl">
                Premium Quality <span className="text-blue-600">Garments</span>{" "}
                For Your Business
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Explore our new collection of high-quality fabrics and garments
                designed to meet the highest industry standards. Manufactured
                with precision and care for your unique business needs.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#collection-items"
                  className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                >
                  Explore Collection
                  <svg
                    className="ml-2 h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </a>

                <a
                  href="#samples"
                  className="inline-flex items-center rounded-xl border border-blue-300 px-6 py-3 text-base font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                >
                  Request Samples
                </a>
              </div>

              <div className="mt-12 grid max-w-2xl grid-cols-3 gap-6">
                <div className="text-center sm:text-left">
                  <div className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                    20+
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    Years Experience
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                    150+
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    Product Types
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                    98%
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    Customer Satisfaction
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-200">
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={factoryImg}
                    alt="Garment factory production line"
                    className="h-[380px] w-full object-cover sm:h-[460px] lg:h-[540px]"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="pointer-events-none absolute -inset-y-6 -right-6 hidden w-10 rounded-2xl bg-gradient-to-l from-slate-100 to-transparent lg:block" />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
         Part 4: Full-width Stats Ribbon
      ====================================== */}
      <section className="bg-blue-600">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-14 lg:py-16">
          <div className="grid grid-cols-2 gap-y-10 text-center text-white sm:grid-cols-4">
            <div>
              <div className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                20+
              </div>
              <div className="mt-2 text-sm text-white/90">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                500+
              </div>
              <div className="mt-2 text-sm text-white/90">Happy Clients</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                10,000+
              </div>
              <div className="mt-2 text-sm text-white/90">
                Products Delivered
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                50+
              </div>
              <div className="mt-2 text-sm text-white/90">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

     
    </main>
  );
}
