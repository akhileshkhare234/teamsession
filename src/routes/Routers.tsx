import { Suspense } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminLayouts from "../layouts/AdminLayout";
import LandingLayout from "../layouts/LandingLayout";
import DefaultLayout from "../layouts/DefaultLayout";
import Login from "../pages/Login";
import PrivateRoute from "../layouts/PrivateRoute";
import SignUp from "pages/signup/singup";
import Dashboard from "pages/dashboard/Dashboard";
import EmployeesList from "pages/Employees/EmployeesList";
import Home from "pages/Home";
import About from "pages/About";
import Contact from "pages/Contact";
import FAQ from "pages/FAQ";
import React from "react";

import Expenditure from "pages/expenditure/Expenditure";
import CatagoryList from "pages/expenditure/expenditurecatagoryType/CatagoryList";
import ListOfEmails from "pages/emails/ListOfEmails";
import AdvancesPayments from "pages/advance/Advance";
import AdvancePaymentConfig from "pages/advancePaymentConfig/AdvancePaymentConfig";

export default function Routers() {
  // onForegroundMessage((payload: any) => {
  //   showToast(payload.notification.title, "info");
  // });
  return (
    <Suspense fallback={<h1>loading</h1>}>
      <Router
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }}
      >
        <Routes>
          {/* Landing Pages */}
          <Route element={<LandingLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
          </Route>

          {/* Auth Pages (without navigation) */}
          <Route element={<DefaultLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          {/* Admin Pages */}
          <Route path="/admin" element={<PrivateRoute Layout={AdminLayouts} />}>
            <Route path="dashboard" element={<Dashboard />} />

            <Route
              path="employees"
              element={<EmployeesList></EmployeesList>}
            ></Route>
            <Route path="catagory" element={<CatagoryList></CatagoryList>} />
            <Route
              path="expenditure"
              element={<Expenditure></Expenditure>}
            ></Route>
            <Route path="emails" element={<ListOfEmails></ListOfEmails>} />
            <Route path="advancepayment" element={<AdvancesPayments />} />
            <Route path="paymentConfig" element={<AdvancePaymentConfig></AdvancePaymentConfig>} />
          </Route>

          <Route path="/*" element={<Navigate to="/" replace={true} />} />
        </Routes>
      </Router>
    </Suspense>
  );
}
