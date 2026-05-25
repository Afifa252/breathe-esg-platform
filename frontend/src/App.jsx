import { useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [stats] = useState({
    total: 23,
    approved: 3,
    rejected: 2,
    locked: 3,
    suspicious: 5,
  });

  const [records, setRecords] = useState([
    {
      id: 1,
      activity_type: "Business Travel",
      quantity: 75,
      suspicious_flag: false,
      review_status: "PENDING",
    },
    {
      id: 2,
      activity_type: "Natural Gas",
      quantity: 12000,
      suspicious_flag: true,
      review_status: "PENDING",
    },
    {
      id: 3,
      activity_type: "Petrol",
      quantity: 920,
      suspicious_flag: false,
      review_status: "PENDING",
    },
    {
      id: 4,
      activity_type: "Diesel",
      quantity: 1800,
      suspicious_flag: false,
      review_status: "PENDING",
    },
    {
      id: 5,
      activity_type: "Electricity",
      quantity: 450,
      suspicious_flag: false,
      review_status: "PENDING",
    },
  ]);

  const [search, setSearch] = useState("");

  const [file, setFile] = useState(null);

  // LOGIN

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin1" && password === "admin123") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials");
    }
  };

  // LOGOUT

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // FILE UPLOAD

  const handleUpload = () => {
    if (!file) {
      alert("Choose CSV file");
      return;
    }

    alert("CSV uploaded successfully");
  };

  // UPDATE STATUS

  const updateStatus = (id, statusValue) => {
    const updated = records.map((record) =>
      record.id === id
        ? { ...record, review_status: statusValue }
        : record
    );

    setRecords(updated);
  };

  // LOGIN SCREEN

  if (!isLoggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#eef2f7",
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            background: "white",
            padding: "50px",
            borderRadius: "20px",
            width: "400px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              marginBottom: "30px",
              fontSize: "50px",
            }}
          >
            ESG Login
          </h1>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button type="submit" style={loginBtn}>
            Login
          </button>
        </form>
      </div>
    );
  }

  // CHART DATA

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

  // DASHBOARD

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
            Upload
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

        {/* CHART */}

        <div
          style={{
            background: "white",
            marginTop: "30px",
            padding: "30px",
            borderRadius: "20px",
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

                    <td style={tdStyle}>
                      {record.review_status}
                    </td>

                    <td style={tdStyle}>
                      <button
                        style={approveBtn}
                        onClick={() =>
                          updateStatus(record.id, "APPROVED")
                        }
                      >
                        Approve
                      </button>

                      <button
                        style={rejectBtn}
                        onClick={() =>
                          updateStatus(record.id, "REJECTED")
                        }
                      >
                        Reject
                      </button>

                      <button
                        style={lockBtn}
                        onClick={() =>
                          updateStatus(record.id, "LOCKED")
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

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "20px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const loginBtn = {
  width: "100%",
  padding: "14px",
  background: "#0f172a",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "16px",
  cursor: "pointer",
};

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