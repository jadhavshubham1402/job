import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import LoaderComponent from "./loader";
import { login } from "../service/axiosInstance";
import { errorToast, successToast } from "../toastConfig";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "../redux/reducer/reducer";

const LoginForm = () => {
  const { token, user } = useSelector((store) => store.auth);
  const [showPass, setShowPass] = useState(false);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid Email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required")
      .matches(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/,
        "Password must contain at least one uppercase letter, one symbol, and one number"
      ),
  });

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      setLoader(true);
      const res = await login(values);
      console.log(res, "res");
      if (res.status == 200) {
        successToast("Login Successfully");
        dispatch(setToken(res.data.token));
        dispatch(setUser(res.data.user));
        navigate("admin");
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
      navigate("/admin");
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
                <div className="mb-3">
                  <label
                    htmlFor="password"
                    className="mb-1 block text-lg font-medium text-gray-800"
                  >
                    Password
                  </label>
                  <div className="flex items-center rounded-lg border-2 border-gray-200 px-2 py-1 hover:border-gray-500 focus:border-gray-500">
                    <Field
                      type={showPass ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Enter your Password"
                      className="h-7 w-full rounded-lg border-none outline-none placeholder:text-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="ml-2 focus:outline-none"
                    >
                      {showPass ? (
                        <FaEyeSlash className="text-gray-400" />
                      ) : (
                        <FaEye className="text-gray-400" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="mt-1 text-lg text-red-600"
                  />
                </div>
                <div>
                  <span
                    className="mx-2 text-[#2B7A0B] flex items-end justify-end cursor-pointer"
                    onClick={() => navigate("forgot_pass")}
                  >
                    Forgot Password ?
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="linear hover:bg-[#2B7A0B]-600 active:bg-[#2B7A0B]-700 dark:bg-[#2B7A0B]-400 dark:hover:bg-[#2B7A0B]-300 dark:active:bg-[#2B7A0B]-200 mt-2 w-full rounded-xl bg-[#2B7A0B] py-[8px] text-lg font-medium text-white transition duration-200 dark:text-white"
                >
                  Login
                </button>
                <div
                  className="mb-3 ml-auto flex cursor-pointer items-center justify-center px-2 text-lg text-gray-700"
                  // onClick={() => navigate("/auth/forgot_password")}
                >
                  Dont have Any Account?{" "}
                  <span
                    className="mx-2 text-[#2B7A0B]"
                    onClick={() => navigate("register")}
                  >
                    Register
                  </span>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
