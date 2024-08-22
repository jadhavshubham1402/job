import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import LoaderComponent from "./loader";
import { forgotPassword, login } from "../service/axiosInstance";
import { errorToast, successToast } from "../toastConfig";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "../redux/reducer/reducer";

const ForgotPass = () => {
  const { token, user } = useSelector((store) => store.auth);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid Email").required("Email is required"),
  });

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      setLoader(true);
      const res = await forgotPassword(values);

      if (res.status == 200) {
        successToast(res.data.message);
        navigate(`/otp_verify/${values.email}`);
      }
      setLoader(false);
      setSubmitting(false);
    } catch (error) {
      setLoader(false);
      setSubmitting(false);
      errorToast(error?.response?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    if (token && user) {
      navigate("/home");
    }
  }, [token, user]);

  return (
    <>
      {loader && <LoaderComponent />}
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <div className="my-3 text-3xl font-bold text-navy-700">Login</div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className="mb-1 block text-lg font-medium text-gray-800"
                  >
                    Email
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your Email"
                    className="h-9 w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="mt-1 text-lg text-red-600"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="linear hover:bg-[#2B7A0B]-600 active:bg-[#2B7A0B]-700 dark:bg-[#2B7A0B]-400 dark:hover:bg-[#2B7A0B]-300 dark:active:bg-[#2B7A0B]-200 mt-2 w-full rounded-xl bg-[#2B7A0B] py-[8px] text-lg font-medium text-white transition duration-200 dark:text-white"
                >
                  Send OTP
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => navigate("/")}
                  className="linear hover:bg-[#2B7A0B]-600 active:bg-[#2B7A0B]-700 dark:bg-[#2B7A0B]-400 dark:hover:bg-[#2B7A0B]-300 dark:active:bg-[#2B7A0B]-200 mt-2 w-full rounded-xl bg-[#2B7A0B] py-[8px] text-lg font-medium text-white transition duration-200 dark:text-white"
                >
                  Back To login
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default ForgotPass;
