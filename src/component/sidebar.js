// src/components/Sidebar.js
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Sidebar() {
  const { user } = useSelector((store) => store.auth);

  return (
    <nav className="bg-gray-800 text-white w-64 h-full p-4">
      <ul>
        {user.type != "admin" && (
          <li>
            <Link
              to="/admin/applicationList"
              className="block py-2 px-4 hover:bg-gray-700 rounded"
            >
              Application Submit
            </Link>
          </li>
        )}
        {user.type == "admin" && (
          <>
            <li>
              <Link
                to="/admin/jobField"
                className="block py-2 px-4 hover:bg-gray-700 rounded"
              >
                Job Field
              </Link>
            </li>
            <li>
              <Link
                to="/admin/applicationForm"
                className="block py-2 px-4 hover:bg-gray-700 rounded"
              >
                Application Form
              </Link>
            </li>
            <li>
              <Link
                to="/admin/applicationStatus"
                className="block py-2 px-4 hover:bg-gray-700 rounded"
              >
                Application Status
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Sidebar;
