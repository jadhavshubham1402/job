// App.js
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import persistStore from "redux-persist/es/persistStore";
import { PersistGate } from "redux-persist/integration/react";
import ForgotPass from "./component/forgotPass";
import LoginForm from "./component/login";
import OtpVerify from "./component/otpVerify";
import RegisterForm from "./component/register";
import ProtectedRoute from "./protectedRoute";
import store from "./redux/store";
import ApplicationForm from "./component/applicationForm";
import ApplicationStatus from "./component/ApplicationStatus";
import ApplicationList from "./component/applicationList";
import JobField from "./component/jobField";
import AdminPanel from "./component/adminPanel";
import UserDetails from "./component/userDetails";

function App() {
  let persistor = persistStore(store);
  return (
    <div>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginForm />} />
              <Route path="/forgot_pass" element={<ForgotPass />} />
              <Route path="/otp_verify/:id" element={<OtpVerify />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminPanel />}>
                  <Route path="/admin/userDetails" element={<UserDetails />} />
                  <Route
                    path="/admin/applicationList"
                    element={<ApplicationList />}
                  />
                  <Route
                    path="/admin/applicationForm/:id"
                    element={<ApplicationForm />}
                  />
                  <Route
                    path="/admin/applicationForm"
                    element={<ApplicationForm />}
                  />
                  <Route
                    path="/admin/applicationStatus"
                    element={<ApplicationStatus />}
                  />
                  <Route path="/admin/jobField" element={<JobField />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
