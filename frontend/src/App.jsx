import { useEffect, useState } from "react";
import axios from "axios";
import Login from "./Login";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access")
  );

  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    locked: 0,
    suspicious: 0,
  });

  const [records, setRecords] = useState([]);

  const [file, setFile] = useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (isLoggedIn) {

      fetchDashboard();
    }

  }, [isLoggedIn]);

  const fetchDashboard = async () => {

    try {

      const token = localStorage.getItem("access");

      const statsResponse = await axios.get(
        "http://127.0.0.1:8000/api/dashboard/stats/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const recordsResponse = await axios.get(
        "http://127.0.0.1:8000/api/dashboard/records/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(statsResponse.data);

      setRecords(recordsResponse.data);

    } catch (error) {

      console.log(error);
    }
  };

  const handleUpload = async () => {

    if (!file) {

      alert("Choose CSV file");

      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {

      setLoading(true);

      const token = localStorage.getItem("access");

      await axios.post(
        "http://127.0.0.1:8000/api/ingestion/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLoading(false);

      alert("Upload successful");

      fetchDashboard();

    } catch (error) {

      setLoading(false);

      console.log(error);

      alert("Upload failed");
    }
  };

  const updateStatus = async (id, statusValue) => {

    try {

      const token = localStorage.getItem("access");

      await axios.patch(
        `http://127.0.0.1:8000/api/dashboard/records/${id}/`,
        {
          status: statusValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchDashboard();

    } catch (error) {

      console.log(error);

      alert("Status update failed");
    }
  };

  const handleLogout = () => {

    localStorage.removeItem("access");

    localStorage.removeItem("refresh");

    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {

    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const chartData = [
    {
      name: "Approved",
      value: stats.approved,
    },
    {
      name: "Rejected",
      value: stats.rejected,
    },
    {
      name: "Locked",
      value: stats.locked,
    },
    {
      name: "Suspicious",
      value: stats.suspicious,
    },
  ];

  const COLORS = [
    "#16a34a",
    "#dc2626",
    "#ea580c",
    "#7c3aed",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#eef2f7",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >

        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: "60px",
              fontWeight: "bold",
            }}
          >
            ESG Review Dashboard
          </h1>

          <button
            onClick={handleLogout}
            style={{
              background: "#dc2626",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        {/* UPLOAD */}

        <div
          style={{
            background: "white",
            marginTop: "30px",
            padding: "40px",
            borderRadius: "20px",
            textAlign: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <h2>Upload ESG CSV File</h2>

          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button
            onClick={handleUpload}
            style={{
              marginLeft: "10px",
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "10px 22px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {/* STATS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "20px",
            marginTop: "30px",
          }}
        >

          <StatCard title="Total" value={stats.total} />
          <StatCard title="Approved" value={stats.approved} />
          <StatCard title="Rejected" value={stats.rejected} />
          <StatCard title="Locked" value={stats.locked} />
          <StatCard title="Suspicious" value={stats.suspicious} />

        </div>

        {/* PIE CHART */}

        <div
          style={{
            background: "white",
            marginTop: "30px",
            padding: "30px",
            borderRadius: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            ESG Status Overview
          </h2>

          <div
            style={{
              width: "100%",
              height: "400px",
            }}
          >

            <ResponsiveContainer>

              <PieChart>

                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  dataKey="value"
                  label
                >

                  {chartData.map((entry, index) => (

                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />

                  ))}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* SEARCH */}

        <div
          style={{
            marginTop: "30px",
            marginBottom: "20px",
          }}
        >
          <input
            type="text"
            placeholder="Search activity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
        </div>

        {/* TABLE */}

        <div
          style={{
            background: "white",
            marginTop: "20px",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >

            <thead
              style={{
                background: "#17233c",
                color: "white",
              }}
            >
              <tr>

                <th style={thStyle}>Activity</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Suspicious</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>

              </tr>
            </thead>

            <tbody>

              {records
                .filter((record) =>
                  record.activity_type
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                .map((record) => (

                  <tr key={record.id}>

                    <td style={tdStyle}>
                      {record.activity_type}
                    </td>

                    <td style={tdStyle}>
                      {record.quantity}
                    </td>

                    <td style={tdStyle}>
                      {record.suspicious_flag ? "Yes" : "No"}
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        fontWeight: "bold",
                        color:
                          record.review_status === "APPROVED"
                            ? "green"
                            : record.review_status === "REJECTED"
                            ? "red"
                            : record.review_status === "LOCKED"
                            ? "orange"
                            : "#2563eb",
                      }}
                    >
                      {record.review_status}
                    </td>

                    <td style={tdStyle}>

                      <button
                        style={approveBtn}
                        onClick={() =>
                          updateStatus(
                            record.id,
                            "APPROVED"
                          )
                        }
                      >
                        Approve
                      </button>

                      <button
                        style={rejectBtn}
                        onClick={() =>
                          updateStatus(
                            record.id,
                            "REJECTED"
                          )
                        }
                      >
                        Reject
                      </button>

                      <button
                        style={lockBtn}
                        onClick={() =>
                          updateStatus(
                            record.id,
                            "LOCKED"
                          )
                        }
                      >
                        Lock
                      </button>

                    </td>

                  </tr>
                ))}

            </tbody>

          </table>

        </div>

        {/* FOOTER */}

        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
            color: "#666",
            fontSize: "15px",
          }}
        >
          ESG Carbon Emission Review System
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value }) {

  return (
    <div
      style={{
        background: "white",
        padding: "30px",
        borderRadius: "20px",
        textAlign: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <h2>{title}</h2>

      <p
        style={{
          fontSize: "36px",
          fontWeight: "bold",
        }}
      >
        {value}
      </p>
    </div>
  );
}

const thStyle = {
  padding: "18px",
};

const tdStyle = {
  padding: "18px",
  textAlign: "center",
  borderBottom: "1px solid #e5e7eb",
};

const approveBtn = {
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  marginRight: "6px",
  cursor: "pointer",
};

const rejectBtn = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  marginRight: "6px",
  cursor: "pointer",
};

const lockBtn = {
  background: "#ea580c",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
};

export default App;