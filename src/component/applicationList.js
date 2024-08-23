import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import {
  createApplicationStatus,
  getApplication,
  login,
} from "../service/axiosInstance";
import { errorToast, successToast } from "../toastConfig";
import LoaderComponent from "./loader";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ApplicationList = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loader, setLoader] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const handleSubmit = async (id) => {
    try {
      setLoader(true);
      const res = await createApplicationStatus({ applicationId: id });
      if (res.status == 200) {
        successToast("Applied Successfully");
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      errorToast(error?.response?.data?.message || error?.message);
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const getAllApplication = async () => {
    try {
      setLoader(true);
      const res = await getApplication({ page: currentPage });

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
    getAllApplication();
  }, []);

  return (
    <>
      {loader && <LoaderComponent />}
      <div className="flex flex-wrap w-full gap-4 justify-start bg-gray-100 p-4">
        {data &&
          data.map((e, index) => {
            return (
              <div
                className="w-[30%] rounded overflow-hidden shadow-lg"
                key={index}
              >
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">
                    Title:{" "}
                    <span className="font-semibold text-lg mx-2">
                      {e.title}
                    </span>
                  </div>
                  <div className="font-bold text-xl mb-2">
                    Company Details:{" "}
                    <span className="font-semibold text-lg mx-2">
                      {e.companyDetails}
                    </span>
                  </div>
                  <div className="font-bold text-xl mb-2">
                    Tags:{" "}
                    <span className="font-semibold text-lg mx-2">{e.tags}</span>
                  </div>
                  <div className="font-bold text-xl mb-2">
                    Skills:{" "}
                    {e.skills.map((e) => {
                      return (
                        <span className="font-semibold text-lg mx-2">{e},</span>
                      );
                    })}
                  </div>
                  <div className="font-bold text-xl mb-2">
                    Experience Required:{" "}
                    <span className="font-semibold text-lg mx-2">
                      {e.experienceRequired}
                    </span>
                  </div>
                  <div className="font-bold text-xl mb-2">
                    Description:{" "}
                    <span className="font-semibold text-lg mx-2">
                      {e.description}
                    </span>
                  </div>
                  <div className="font-bold text-xl mb-2">
                    salary:{" "}
                    <span className="font-semibold text-lg mx-2">
                      {e.salary}
                    </span>
                  </div>
                </div>
                <div className="px-6 py-4">
                  {user.type == "admin" ? (
                    <button
                      type="submit"
                      onClick={() =>
                        navigate(`/admin/applicationForm/${e._id}`)
                      }
                      // disabled={isSubmitting}
                      className="linear text-gray-900 bg-blue-400 hover:bg-blue-800 active:bg-blue-900 hover:text-white active:text-white mt-2 w-full rounded-xl  py-[8px] text-lg font-medium"
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      type="submit"
                      onClick={() => handleSubmit(e._id)}
                      // disabled={isSubmitting}
                      className="linear text-gray-900 bg-blue-400 hover:bg-blue-800 active:bg-blue-900 hover:text-white active:text-white mt-2 w-full rounded-xl  py-[8px] text-lg font-medium"
                    >
                      Apply
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>
      <ReactPaginate
        className="item-center flex justify-end gap-2 pt-3 text-lg drop-shadow-sm"
        previousLabel={
          <p className="px-2 py-0.5 border rounded-sm border-white-300 bg-white text-[#000000] flex item-center justify-center hover:bg-blue-800 hover:text-white min-w-8">
            Prev
          </p>
        }
        nextLabel={
          <p className="px-2 py-0.5 border rounded-sm border-white-300 bg-white text-[#000000] flex item-center justify-center hover:bg-blue-800 hover:text-white min-w-8">
            Next
          </p>
        }
        breakLabel="..."
        breakClassName="break-me"
        pageCount={Math.ceil(data.length / 10)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName="pagination"
        activeClassName={"custom-active"}
        pageClassName={
          "rounded-sm custom-page flex item-center justify-center hover:bg-blue-800 hover:text-white"
        }
        pageLinkClassName={
          "px-2 py-0.5 rounded-sm min-w-8 flex items-center justify-center hover:bg-blue-800 hover:text-white"
        }
        onPageActive={(data) => (
          <p className="px-2 py-0.5 rounded-sm min-w-8 flex items-center justify-center hover:bg-blue-800 hover:text-white">
            {data.page + 1} {/* Assuming page indexes start from 0 */}
          </p>
        )}
      />
    </>
  );
};

export default ApplicationList;
