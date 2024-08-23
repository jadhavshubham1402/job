import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import {
  createOneApplication,
  getOneAppForm,
  updateOneApplication,
} from "../service/axiosInstance";
import { errorToast, successToast } from "../toastConfig";
import LoaderComponent from "./loader";
import { useLocation, useNavigate } from "react-router-dom";

const JobField = () => {
  const [loader, setLoader] = useState(false);
  let location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  const pathParts = location.pathname.split("/");
  const formAction = pathParts[pathParts.length - 1];

  const initialValues = {
    jobCategorie: data?.jobCategorie || "",
    jobType: data?.jobType || "",
    title: data?.title || "",
    companyDetails: data?.companyDetails || "",
    tags: data?.tags || "",
    skills: data?.skills || [""],
    experienceRequired: data?.experienceRequired || "",
    description: data?.description || "",
    salary: data?.salary || "",
    additionalField: data?.additionalField || [],
  };

  const validationSchema = Yup.object().shape({
    jobCategorie: Yup.string().required("Job Categories is required"),
    jobType: Yup.string().required("Job Types is required"),
    title: Yup.string().required("title is required"),
    companyDetails: Yup.string().required("companyDetails is required"),
    tags: Yup.string().required("tags is required"),
    skills: Yup.array().of(Yup.string().required("Skill is required")),
    experienceRequired: Yup.string().required("experienceRequired is required"),
    description: Yup.string().required("description is required"),
    salary: Yup.string().required("salary is required"),
    // additionalField: Yup.string().required("additionalField is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoader(true);

      let res;

      if (formAction == "applicationForm") {
        res = await createOneApplication(values);
      } else {
        values = { ...values, _id: formAction };
        res = await updateOneApplication(values);
      }

      if (res.status == 200) {
        successToast(
          formAction == "applicationForm"
            ? "Application Added successfully"
            : "application updated successfully"
        );
        navigate("/admin/applicationList");
      }
      setLoader(false);
      setSubmitting(false);
    } catch (error) {
      setLoader(false);
      setSubmitting(false);
      errorToast(error?.response?.data?.message || error?.message);
    }
  };

  const getApplicationDetails = async (id) => {
    try {
      setLoader(true);
      const res = await getOneAppForm({ _id: id });

      console.log(res.data.data);
      if ((res.status = 200)) {
        setData(res.data.data);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      errorToast(error?.response?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    if (formAction != "applicationForm") {
      getApplicationDetails(formAction);
    }
  }, [formAction]);

  return (
    <>
      {loader && <LoaderComponent />}
      <div className="my-6 flex flex-col rounded-lg bg-white p-4">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values }) => (
            <Form>
              <div className="flex flex-grow gap-3">
                <div className="w-[100%]">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
                    <div className="mb-3">
                      <label
                        htmlFor="jobCategorie"
                        className="mb-1 block text-lg font-medium text-gray-800"
                      >
                        Job Categorie
                      </label>
                      <Field
                        type="text"
                        id="jobCategorie"
                        name="jobCategorie"
                        placeholder="Enter your jobCategorie"
                        className="h-9 w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                      />
                      <ErrorMessage
                        name="jobCategorie"
                        component="div"
                        className="mt-1 text-lg text-red-600"
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="jobType"
                        className="mb-1 block text-lg font-medium text-gray-800"
                      >
                        Job Type
                      </label>
                      <Field
                        type="text"
                        id="jobType"
                        name="jobType"
                        placeholder="Enter your Job Type"
                        className="h-9 w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                      />
                      <ErrorMessage
                        name="jobType"
                        component="div"
                        className="mt-1 text-lg text-red-600"
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="title"
                        className="mb-1 block text-lg font-medium text-gray-800"
                      >
                        title
                      </label>
                      <Field
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Enter your title"
                        className="h-9 w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                      />
                      <ErrorMessage
                        name="title"
                        component="div"
                        className="mt-1 text-lg text-red-600"
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="companyDetails"
                        className="mb-1 block text-lg font-medium text-gray-800"
                      >
                        company Details
                      </label>
                      <Field
                        type="text"
                        id="companyDetails"
                        name="companyDetails"
                        placeholder="Enter your Company Details"
                        className="h-9 w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                      />
                      <ErrorMessage
                        name="companyDetails"
                        component="div"
                        className="mt-1 text-lg text-red-600"
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="tags"
                        className="mb-1 block text-lg font-medium text-gray-800"
                      >
                        tags
                      </label>
                      <Field
                        type="text"
                        id="tags"
                        name="tags"
                        placeholder="Enter your tags"
                        className="h-9 w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                      />
                      <ErrorMessage
                        name="tags"
                        component="div"
                        className="mt-1 text-lg text-red-600"
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="experienceRequired"
                        className="mb-1 block text-lg font-medium text-gray-800"
                      >
                        Experience Required
                      </label>
                      <Field
                        type="text"
                        id="experienceRequired"
                        name="experienceRequired"
                        placeholder="Enter your Experience Required"
                        className="h-9 w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                      />
                      <ErrorMessage
                        name="experienceRequired"
                        component="div"
                        className="mt-1 text-lg text-red-600"
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="description"
                        className="mb-1 block text-lg font-medium text-gray-800"
                      >
                        description
                      </label>
                      <Field
                        type="text"
                        id="description"
                        name="description"
                        placeholder="Enter your description"
                        className="h-9 w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="mt-1 text-lg text-red-600"
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="salary"
                        className="mb-1 block text-lg font-medium text-gray-800"
                      >
                        Salary (LPA)
                      </label>
                      <Field
                        type="text"
                        id="salary"
                        name="salary"
                        placeholder="Enter your salary"
                        className="h-9 w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                      />
                      <ErrorMessage
                        name="salary"
                        component="div"
                        className="mt-1 text-lg text-red-600"
                      />
                    </div>
                  </div>

                  <label
                    htmlFor="Skills"
                    className="mb-1 block text-lg font-medium text-gray-800"
                  >
                    Skills
                  </label>
                  <FieldArray name="skills">
                    {({ remove, push }) => (
                      <div>
                        {values.skills.map((skill, index) => (
                          <div
                            key={index}
                            className="relative my-1 flex  w-full gap-3 bg-gray-50 py-3 sm:grid-cols-2 lg:grid-cols-2"
                          >
                            <Field
                              name={`skills[${index}]`}
                              placeholder="Enter a skill"
                              className="w-full my-1 rounded-lg placeholder:text-lg border-2 border-gray-200 p-2 hover:border-gray-500 focus:border-gray-500"
                            />
                            <ErrorMessage
                              name={`skills${index}`}
                              component="div"
                              className="mt-1 text-lg text-red-600"
                            />
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="secondary absolute -right-3 -top-3 my-auto h-10 w-10 rounded-md border-2 bg-red-600 text-lg text-white shadow-lg"
                            >
                              X
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push("")}
                          className={`linear text-nowrap rounded-xl px-4 py-2 text-lg font-medium bg-[rgba(43,122,11,5)] text-white`}
                        >
                          Add Skill
                        </button>
                      </div>
                    )}
                  </FieldArray>

                  <div className="my-4 w-full">
                    <div className="my-3 text-2xl font-bold">
                      Additional Field
                    </div>
                    <FieldArray name="additionalField">
                      {({ remove, push }) => (
                        <div>
                          {values.additionalField.length > 0 &&
                            values.additionalField.map(
                              (additionalField, index) => (
                                <div
                                  key={index}
                                  className="relative my-3 flex  w-full gap-3 bg-gray-50 py-3 sm:grid-cols-2 lg:grid-cols-2"
                                >
                                  <div className="mb-5">
                                    <label
                                      htmlFor={`additionalField.${index}.field`}
                                      className="mb-2 block font-medium text-gray-800"
                                    >
                                      Field
                                    </label>
                                    <Field
                                      type="text"
                                      name={`additionalField.${index}.field`}
                                      id={`additionalField.${index}.field`}
                                      placeholder="Enter field"
                                      className="w-full rounded-lg border-2 border-gray-200 p-2 hover:border-gray-500 focus:border-gray-500"
                                    />
                                    <ErrorMessage
                                      name={`additionalField.${index}.field`}
                                      component="div"
                                      className="text-red-600"
                                    />
                                  </div>
                                  <div className="mb-5">
                                    <label
                                      htmlFor={`additionalField.${index}.value`}
                                      className="mb-2 block font-medium text-gray-800"
                                    >
                                      value
                                    </label>
                                    <Field
                                      type="text"
                                      name={`additionalField.${index}.value`}
                                      id={`additionalField.${index}.value`}
                                      placeholder="Enter Value"
                                      className="w-full rounded-lg border-2 border-gray-200 p-2 hover:border-gray-500 focus:border-gray-500"
                                    />
                                    <ErrorMessage
                                      name={`additionalField.${index}.value`}
                                      component="div"
                                      className="text-red-600"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    className="secondary absolute -right-3 -top-3 my-auto h-10 w-10 rounded-md border-2 bg-red-600 text-lg text-white shadow-lg"
                                    onClick={() => remove(index)}
                                  >
                                    X
                                  </button>
                                </div>
                              )
                            )}
                          <button
                            type="button"
                            className={`linear text-nowrap rounded-xl px-4 py-2 text-lg font-medium bg-[rgba(43,122,11,5)] text-white`}
                            onClick={() =>
                              push({
                                field: "",
                                value: "",
                              })
                            }
                          >
                            Add Field
                          </button>
                        </div>
                      )}
                    </FieldArray>
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
