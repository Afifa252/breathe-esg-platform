import { useEffect, useState } from "react";
import axios from "axios";
import Login from "./Login";

function App() {
  const token = localStorage.getItem("access");

  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL:
      "https://breathe-esg-backend-2.onrender.com/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchRecords = async () => {
    try {
      const response = await api.get("/records/");
      setRecords(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get(
        "/dashboard/stats/"
      );
      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadData = async () => {
    setLoading(true);

    await Promise.all([
      fetchRecords(),
      fetchStats(),
    ]);

    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (!token) {
    return (
      <Login
        onLogin={() =>
          window.location.reload()
        }
      />
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        padding: "40px",
      }}
    >
      <button
        onClick={logout}
        style={{
          float: "right",
          padding: "10px 20px",
          background: "#dc2626",
          color: "white",
          border: "none",
          borderRadius: "8px",
        }}
      >
        Logout
      </button>

      <h1
        style={{
          textAlign: "center",
          fontSize: "52px",
          color: "#0f172a",
        }}
      >
        ESG Review Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
          gap: "20px",
          marginTop: "40px",
          marginBottom: "40px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total</h3>
          <p>{stats.total_records}</p>
        </div>

        <div style={cardStyle}>
          <h3>Approved</h3>
          <p>{stats.approved_records}</p>
        </div>

        <div style={cardStyle}>
          <h3>Rejected</h3>
          <p>{stats.rejected_records}</p>
        </div>

        <div style={cardStyle}>
          <h3>Locked</h3>
          <p>{stats.locked_records}</p>
        </div>

        <div style={cardStyle}>
          <h3>Suspicious</h3>
          <p>{stats.suspicious_records}</p>
        </div>
      </div>

      <table
        style={{
          width: "100%",
          background: "white",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#1e293b",
              color: "white",
            }}
          >
            <th style={thStyle}>Activity</th>
            <th style={thStyle}>Quantity</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan="3"
                style={tdStyle}
              >
                Loading...
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr key={record.id}>
                <td style={tdStyle}>
                  {record.activity_type}
                </td>

                <td style={tdStyle}>
                  {record.quantity}
                </td>

                <td style={tdStyle}>
                  {record.review_status}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "16px",
  textAlign: "center",
};

const thStyle = {
  padding: "18px",
};

const tdStyle = {
  padding: "18px",
  borderBottom: "1px solid #ddd",
};

export default App;