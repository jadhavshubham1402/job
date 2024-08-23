import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import {
  createJobFields,
  getJobField,
  updateJobfields,
} from "../service/axiosInstance";
import { errorToast, successToast } from "../toastConfig";
import LoaderComponent from "./loader";

const JobField = () => {
  const [data, setData] = useState(null);
  const [loader, setLoader] = useState(false);
  const initialValues = {
    jobCategories: "",
    jobTypes: "",
  };

  const validationSchema = Yup.object().shape({
    jobCategories: Yup.string().required("Job Categories is required"),
    jobTypes: Yup.string().required("Job Types is required"),
  });

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      setLoader(true);
      let res;

      if (!data) {
        res = await createJobFields(values);
      } else {
        const data1 = {
          id: data._id,
          jobCategories: [...data.jobCategories, ...[values.jobCategories]],
          jobTypes: [...data.jobTypes, ...[values.jobTypes]],
        };
        res = await updateJobfields(data1);
      }

      if (res.status == 200) {
        successToast(res.data.message);
        getAllJobField();
      }
      setLoader(false);
      setSubmitting(false);
    } catch (error) {
      setLoader(false);
      setSubmitting(false);
      errorToast(error?.response?.data?.message || error?.message);
    }
  };

  const getAllJobField = async () => {
    try {
      setLoader(true);
      const res = await getJobField();

      console.log(res.data.data[0]);
      if ((res.status = 200)) {
        setData(res.data.data[0]);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      errorToast(error?.response?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    getAllJobField();
  }, []);

  return (
    <>
      {loader && <LoaderComponent />}
      <div className="my-6 flex flex-col rounded-lg bg-white p-4">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="flex flex-grow gap-3">
                <div className="w-[100%]">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
                    <div className="mb-3">
                      <div className="border-black rounded-sm box-border w-full h-full">
                        {data &&
                          data.jobCategories.map((e) => {
                            return <p className="text-black text-lg">{e}</p>;
                          })}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="jobCategories"
                        className="mb-1 block text-lg font-medium text-gray-800"
                      >
                        Job Categories
                      </label>
                      <Field
                        type="text"
                        id="jobCategories"
                        name="jobCategories"
                        placeholder="Enter your jobCategories"
                        className="h-9 w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                      />
                      <ErrorMessage
                        name="jobCategories"
                        component="div"
                        className="mt-1 text-lg text-red-600"
                      />
                    </div>
                    <div className="mb-3">
                      <div className="border-black rounded-sm box-border w-full h-full">
                        {data &&
                          data.jobTypes.map((e) => {
                            return <p className="text-black text-lg">{e}</p>;
                          })}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="jobTypes"
                        className="mb-1 block text-lg font-medium text-gray-800"
                      >
                        Job Type
                      </label>
                      <Field
                        type="text"
                        id="jobTypes"
                        name="jobTypes"
                        placeholder="Enter your Job Type"
                        className="h-9 w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                      />
                      <ErrorMessage
                        name="jobTypes"
                        component="div"
                        className="mt-1 text-lg text-red-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end w-full">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="linear hover:bg-[#2B7A0B]-600 active:bg-[#2B7A0B]-700 dark:bg-[#2B7A0B]-400 dark:hover:bg-[#2B7A0B]-300 dark:active:bg-[#2B7A0B]-200 mt-2 w-[30%] rounded-xl bg-[#2B7A0B] py-[8px] text-lg font-medium text-white transition duration-200 dark:text-white"
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default JobField;
