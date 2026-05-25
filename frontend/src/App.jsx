import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // TOKEN
  const token =
    localStorage.getItem("access") ||
    localStorage.getItem("token") ||
    "";

  // API
  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  // FETCH RECORDS
  const fetchRecords = async () => {
    try {
      const response = await api.get("/records/");

      if (Array.isArray(response.data)) {
        setRecords(response.data);
      } else if (response.data.results) {
        setRecords(response.data.results);
      } else {
        setRecords([]);
      }
    } catch (error) {
      console.error("Error fetching records");
      setRecords([]);
    }
  };

  // FETCH STATS
  const fetchStats = async () => {
    try {
      const response = await api.get("/dashboard/stats/");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats");
    }
  };

  // LOAD DATA
  const loadData = async () => {
    setLoading(true);

    await Promise.all([
      fetchRecords(),
      fetchStats(),
    ]);

    setLoading(false);
  };

  // APPROVE
  const approveRecord = async (id) => {
    try {
      await api.post(`/records/${id}/approve/`);
      await loadData();
    } catch (error) {
      console.error("Approve failed");
    }
  };

  // REJECT
  const rejectRecord = async (id) => {
    try {
      await api.post(`/records/${id}/reject/`);
      await loadData();
    } catch (error) {
      console.error("Reject failed");
    }
  };

  // LOCK
  const lockRecord = async (id) => {
    try {
      await api.post(`/records/${id}/lock/`);
      await loadData();
    } catch (error) {
      console.error("Lock failed");
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    loadData();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        {/* TITLE */}
        <h1
          style={{
            textAlign: "center",
            marginBottom: "40px",
            color: "#0f172a",
            fontSize: "52px",
            fontWeight: "bold",
          }}
        >
          ESG Review Dashboard
        </h1>

        {/* STATS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div style={cardStyle}>
            <h3>Total</h3>
            <p>{stats.total_records || 0}</p>
          </div>

          <div style={cardStyle}>
            <h3>Approved</h3>
            <p>{stats.approved_records || 0}</p>
          </div>

          <div style={cardStyle}>
            <h3>Rejected</h3>
            <p>{stats.rejected_records || 0}</p>
          </div>

          <div style={cardStyle}>
            <h3>Locked</h3>
            <p>{stats.locked_records || 0}</p>
          </div>

          <div style={cardStyle}>
            <h3>Suspicious</h3>
            <p>{stats.suspicious_records || 0}</p>
          </div>
        </div>

        {/* TABLE */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#1e293b",
                  color: "white",
                }}
              >
                <th style={thStyle}>Activity</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Suspicious</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    Loading...
                  </td>
                </tr>
              ) : records.length > 0 ? (
                records.map((record) => (
                  <tr key={record.id}>
                    <td style={tdStyle}>
                      {record.activity_type || "N/A"}
                    </td>

                    <td style={tdStyle}>
                      {record.quantity || 0}
                    </td>

                    <td style={tdStyle}>
                      {record.suspicious_flag ? "Yes" : "No"}
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          fontWeight: "bold",
                          color:
                            record.review_status === "APPROVED"
                              ? "#16a34a"
                              : record.review_status === "REJECTED"
                              ? "#dc2626"
                              : record.review_status === "LOCKED"
                              ? "#ea580c"
                              : "#334155",
                        }}
                      >
                        {record.review_status}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      {/* APPROVE */}
                      <button
                        onClick={() => approveRecord(record.id)}
                        disabled={
                          record.review_status === "APPROVED"
                        }
                        style={{
                          ...approveBtn,
                          backgroundColor:
                            record.review_status === "APPROVED"
                              ? "#9ca3af"
                              : "#16a34a",
                          cursor:
                            record.review_status === "APPROVED"
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        Approve
                      </button>

                      {/* REJECT */}
                      <button
                        onClick={() => rejectRecord(record.id)}
                        disabled={
                          record.review_status === "REJECTED"
                        }
                        style={{
                          ...rejectBtn,
                          backgroundColor:
                            record.review_status === "REJECTED"
                              ? "#9ca3af"
                              : "#dc2626",
                          cursor:
                            record.review_status === "REJECTED"
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        Reject
                      </button>

                      {/* LOCK */}
                      <button
                        onClick={() => lockRecord(record.id)}
                        disabled={
                          record.review_status === "LOCKED"
                        }
                        style={{
                          ...lockBtn,
                          backgroundColor:
                            record.review_status === "LOCKED"
                              ? "#9ca3af"
                              : "#ea580c",
                          cursor:
                            record.review_status === "LOCKED"
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        Lock
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "gray",
                    }}
                  >
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// STYLES

const cardStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "16px",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const thStyle = {
  padding: "18px",
  textAlign: "left",
  fontSize: "16px",
};

const tdStyle = {
  padding: "18px",
  borderBottom: "1px solid #e2e8f0",
};

const approveBtn = {
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  marginRight: "6px",
  fontWeight: "600",
};

const rejectBtn = {
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  marginRight: "6px",
  fontWeight: "600",
};

const lockBtn = {
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  fontWeight: "600",
};

export default App;