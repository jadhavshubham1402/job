import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import * as Yup from "yup";
import { filterObject } from "../helper/function";
import { createResume } from "../service/axiosInstance";
import { errorToast, successToast } from "../toastConfig";
import LoaderComponent from "./loader";
import { useNavigate } from "react-router-dom";

const UserDetails = () => {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const initialValues = {
    firstName: "",
    lastName: "",
    mobileNo: "",
    skills: [""],
    experience: "",
    currentSalary: "",
    expectedSalary: "",
    file: null,
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    mobileNo: Yup.string().required("Mobile No is required"),
    skills: Yup.array().of(Yup.string().required("Skill is required")),
    experience: Yup.string().required("experience is required"),
    currentSalary: Yup.string().required("Current Salary is required"),
    expectedSalary: Yup.string().required("Expected salary is required"),
    file: Yup.mixed()
      .required("file is required")
      .test(
        "fileType",
        "Only PDF, DOC, DOCX, or TXT files are allowed",
        (value) => {
          return (
            value &&
            [
              "application/pdf",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "text/plain",
            ].includes(value.type)
          );
        }
      ),
  });

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      setLoader(true);

      const formData = new FormData();

      const filteredValues = filterObject(values);

      Object.entries(filteredValues).forEach(([key, value]) =>
        formData.append(key, value)
      );

      const res = await createResume(formData);
      if (res.status == 200) {
        successToast("user data added successfully");
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

  const FileInput = ({ field, form: { setFieldValue } }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (acceptedFiles) => {
        setFieldValue(field.name, acceptedFiles[0]);
      },
      accept: ".pdf,.doc,.docx,.txt",
      multiple: false,
    });

    return (
      <div
        {...getRootProps({
          className:
            "dropzone border-2 border-gray-300 border-dashed rounded-md p-4 text-center cursor-pointer",
        })}
      >
        <input {...getInputProps()} />
        {field.value ? (
          <p className="text-sm text-gray-600">
            File selected: {field.value.name}
          </p>
        ) : isDragActive ? (
          <p className="text-sm text-gray-600">Drop the file here ...</p>
        ) : (
          <p className="text-sm text-gray-600">
            Drag 'n' drop file here, or click to select file
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      {loader && <LoaderComponent />}
      <div className="my-6 flex flex-col rounded-lg bg-white p-4">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting, values }) => (
            <Form>
              <div className="flex flex-grow gap-3">
                <div className="w-[100%]">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
                    <div className="mb-3">
                      <label
                        htmlFor="email"
                        className="mb-1 block text-lg font-medium text-gray-800"
                      >
                        Upload resume here
                      </label>
                      <Field name="file" component={FileInput} />
                      <ErrorMessage
                        name="file"
                        component="div"
                        className="mt-1 text-lg text-red-600"
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="firstName"
                        className="mb-1 block text-lg font-medium text-gray-800"
                      >
                        First Name
                      </label>
                      <Field
                        type="text"
                        id="firstName"
                        name="firstName"
                        placeholder="Enter your firstName"
                        className="h-9 w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="mt-1 text-lg text-red-600"
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="lastName"
                        className="mb-1 block text-lg font-medium text-gray-800"
                      >
                        Last Name
                      </label>
                      <Field
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder="Enter your Last Name"
                        className="h-9 w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="mt-1 text-lg text-red-600"
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="mobileNo"
                        className="mb-1 block text-lg font-medium text-gray-800"
                      >
                        Mobile No
                      </label>
                      <Field
                        type="text"
                        id="mobileNo"
                        name="mobileNo"
                        placeholder="Enter your Mobile No"
                        className="h-9 w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                      />
                      <ErrorMessage
                        name="mobileNo"
                        component="div"
                        className="mt-1 text-lg text-red-600"
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="experience"
                        className="mb-1 block text-lg font-medium text-gray-800"
                      >
                        Experience(Years)
                      </label>
                      <Field
                        type="text"
                        id="experience"
                        name="experience"
                        placeholder="Enter your Experience"
                        className="h-9 w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                      />
                      <ErrorMessage
                        name="experience"
                        component="div"
                        className="mt-1 text-lg text-red-600"
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="currentSalary"
                        className="mb-1 block text-lg font-medium text-gray-800"
                      >
                        Current Salary(LPA)
                      </label>
                      <Field
                        type="text"
                        id="currentSalary"
                        name="currentSalary"
                        placeholder="Enter your Current Salary"
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
                        htmlFor="expectedSalary"
                        className="mb-1 block text-lg font-medium text-gray-800"
                      >
                        Expected Salary(LPA)
                      </label>
                      <Field
                        type="text"
                        id="expectedSalary"
                        name="expectedSalary"
                        placeholder="Enter your Expected Salary"
                        className="h-9 w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                      />
                      <ErrorMessage
                        name="expectedSalary"
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

export default UserDetails;
