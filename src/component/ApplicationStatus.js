import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import ReactPaginate from "react-paginate";
import { formatDate } from "../helper/function";
import {
  getAllApplicationStatus,
  updateOneApplicationStatus,
} from "../service/axiosInstance";
import { errorToast, successToast } from "../toastConfig";
import LoaderComponent from "./loader";
Modal.setAppElement("#root");

const ApplicationStatus = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loader, setLoader] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [id, setId] = useState("");
  const [status, setStatus] = useState("");
  const [reason, setReason] = useState("");

  const closeModal = () => setModalIsOpen(false);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleSubmit = async () => {
    try {
      setLoader(true);
      const data = {
        id,
        status,
        reason,
      };
      const res = await updateOneApplicationStatus(data);
      if (res.status == 200) {
        successToast("update successfully");
        getAllApplication();
        setModalIsOpen(false);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      errorToast(error?.response?.data?.message || error?.message);
    }
  };

  const handleClick = (id, status) => {
    setId(id);
    setStatus(status);
    setModalIsOpen(true);
  };

  const getAllApplication = async () => {
    try {
      setLoader(true);
      const res = await getAllApplicationStatus({ page: currentPage });

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
                    TItle:{" "}
                    <span className="font-semibold text-lg mx-2">
                      {e.title}
                    </span>
                  </div>
                  <div className="font-bold text-xl mb-2">
                    Description:{" "}
                    <span className="font-semibold text-lg mx-2">
                      {e.description}
                    </span>
                  </div>
                  <div className="font-bold text-xl mb-2">
                    Candidate First Name:{" "}
                    <span className="font-semibold text-lg mx-2">
                      {e.firstName}
                    </span>
                  </div>
                  <div className="font-bold text-xl mb-2">
                    Candidate Last Name:{" "}
                    <span className="font-semibold text-lg mx-2">
                      {e.lastName}
                    </span>
                  </div>
                  <div className="font-bold text-xl mb-2">
                    Candidate Mobile No:{" "}
                    <span className="font-semibold text-lg mx-2">
                      {e.mobileNo}
                    </span>
                  </div>
                  <div className="font-bold text-xl mb-2">
                    Candidate current Salary:{" "}
                    <span className="font-semibold text-lg mx-2">
                      {e.currentSalary}
                    </span>
                  </div>

                  <div className="font-bold text-xl mb-2">
                    Candidate Expected Salary:{" "}
                    <span className="font-semibold text-lg mx-2">
                      {e.expectedSalary}
                    </span>
                  </div>
                  <div className="font-bold text-xl mb-2">
                    Candidate Relevancy Score:{" "}
                    <span className="font-semibold text-lg mx-2">
                      {e.relevancyScore}
                    </span>
                  </div>
                  <div className="font-bold text-xl mb-2">
                    Candidate Applied Date:{" "}
                    <span className="font-semibold text-lg mx-2">
                      {formatDate(e.createdAt)}
                    </span>
                  </div>
                  {e.status != "pending" && (
                    <>
                      <div className="font-bold text-xl mb-2">
                        Reason:{" "}
                        <span className="font-semibold text-lg mx-2">
                          {e.reason}
                        </span>
                      </div>
                      <div className="font-bold text-xl mb-2">
                        Status:{" "}
                        <span className="font-semibold text-lg mx-2">
                          {e.status}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {e.status == "pending" && (
                  <div className="px-6 py-4">
                    <button
                      type="submit"
                      onClick={() => {
                        handleClick(e._id, "approved");
                      }}
                      // disabled={isSubmitting}
                      className="linear text-gray-900 bg-blue-400 hover:bg-blue-800 active:bg-blue-900 hover:text-white active:text-white mt-2 w-full rounded-xl  py-[8px] text-lg font-medium"
                    >
                      Approved
                    </button>
                    <button
                      type="submit"
                      onClick={() => {
                        handleClick(e._id, "rejected");
                      }}
                      className="linear text-gray-900 bg-blue-400 hover:bg-blue-800 active:bg-blue-900 hover:text-white active:text-white mt-2 w-full rounded-xl  py-[8px] text-lg font-medium"
                    >
                      Rejected
                    </button>
                  </div>
                )}
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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
          <h2 className="text-xl font-semibold mb-4">
            Reason of {status} Application
          </h2>
          <textarea
            aria-rowspan={2}
            id="reason"
            name="reason"
            placeholder="Enter your reason"
            onChange={(e) => setReason(e.target.value)}
            className="w-full h-24 rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500 resize-none"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Add your submit logic here
                handleSubmit();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ApplicationStatus;
