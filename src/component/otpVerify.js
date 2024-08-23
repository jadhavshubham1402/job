import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import LoaderComponent from "./loader";
import { login, otpverify } from "../service/axiosInstance";
import { errorToast, successToast } from "../toastConfig";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "../redux/reducer/reducer";

const OtpVerify = () => {
  const { token, user } = useSelector((store) => store.auth);
  const [showPass, setShowPass] = useState(false);
  const [showCnfPass, setCnfShowPass] = useState(false);

  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let location = useLocation();

  const pathParts = location.pathname.split("/");
  const formAction = pathParts[pathParts.length - 1];

  const length = 6;
  const [otp, setOtp] = useState(Array(length).fill(""));

  const initialValues = {
    otp: "",
    password: "",
    cnfPassword: "",
  };

  const validationSchema = Yup.object().shape({
    otp: Yup.string()
      .required("OTP is required")
      .matches(/^[0-9]{6}$/, "OTP must be exactly 6 digits"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required")
      .matches(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/,
        "Password must contain at least one uppercase letter, one symbol, and one number"
      ),
    cnfPassword: Yup.string()
      .min(8, "confirm Password must be at least 8 characters")
      .required("Confirm Password is required")
      .matches(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/,
        "Confirm Password must contain at least one uppercase letter, one symbol, and one number"
      )
      .oneOf([Yup.ref("password")], "Passwords must match"), // Ensure confirmPassword matches password
  });

  const handleChange = (e, index, setFieldValue) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
      if (newOtp.every((num) => num !== "")) {
        const fullOtp = newOtp.join("");
        // Do something with the full OTP, if needed
        setFieldValue("otp", fullOtp);
        console.log("Full OTP:", fullOtp);
      }
    }
  };
  const handleKeyDown = (e, index, setFieldValue) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
    setFieldValue("otp", "");
  };

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      setLoader(true);
      console.log(values, formAction);

      delete values.cnfPassword;

      values = { ...values, email: formAction };

      const res = await otpverify(values);

      if (res.status == 200) {
        successToast(res.data.message);
        navigate("/");
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
          <div className="my-3 text-3xl font-bold text-navy-700">
            OTP Verify
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form>
                <div className="mb-3">
                  <label
                    htmlFor="otp"
                    className="mb-1 block text-lg font-medium text-gray-800"
                  >
                    OTP
                  </label>
                  <div className={`flex w-full justify-evenly mt-2`}>
                    {otp.map((value, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={value}
                        onChange={(e) => handleChange(e, index, setFieldValue)}
                        onKeyDown={(e) =>
                          handleKeyDown(e, index, setFieldValue)
                        }
                        className={`rounded border border-gray-300 text-center text-lg focus:border-blue-500 focus:outline-none w-10 md:w-12 h-12`}
                      />
                    ))}
                  </div>
                </div>
                <ErrorMessage
                  name="otp"
                  component="div"
                  className="mt-1 text-lg text-red-600"
                />
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
                <div className="mb-3">
                  <label
                    htmlFor="cnfPassword"
                    className="mb-1 block text-lg font-medium text-gray-800"
                  >
                    Confirm Password
                  </label>
                  <div className="flex items-center rounded-lg border-2 border-gray-200 px-2 py-1 hover:border-gray-500 focus:border-gray-500">
                    <Field
                      type={showCnfPass ? "text" : "password"}
                      id="cnfPassword"
                      name="cnfPassword"
                      placeholder="Enter your Confirm Password"
                      className="h-7 w-full rounded-lg border-none outline-none placeholder:text-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setCnfShowPass(!showCnfPass)}
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
                    name="cnfPassword"
                    component="div"
                    className="mt-1 text-lg text-red-600"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="linear hover:bg-[#2B7A0B]-600 active:bg-[#2B7A0B]-700 dark:bg-[#2B7A0B]-400 dark:hover:bg-[#2B7A0B]-300 dark:active:bg-[#2B7A0B]-200 mt-2 w-full rounded-xl bg-[#2B7A0B] py-[8px] text-lg font-medium text-white transition duration-200 dark:text-white"
                >
                  Submit
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

export default OtpVerify;
