import { useEffect, useState } from "react";

function App() {
  const [temples, setTemples] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    state: "",
    history: "",
    image: ""
  });

  const styles = {
    container: {
      padding: "20px",
      textAlign: "center",
      background: "linear-gradient(to right, #f8f9fa, #e3f2fd)",
      minHeight: "100vh",
      fontFamily: "Arial"
    },
    title: {
      fontSize: "32px",
      marginBottom: "10px",
      color: "#333"
    },
    input: {
      padding: "10px",
      margin: "5px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      width: "200px"
    }
  };

  // LOAD DATA
  const loadTemples = async () => {
    const res = await fetch("https://india-temple-api.onrender.com/temples");
    const data = await res.json();
    setTemples(data);
  };

  useEffect(() => {
    loadTemples();
  }, []);

  // ADD / UPDATE
  const saveTemple = async () => {
    if (!form.name || !form.state || !form.history) {
      alert("All fields are required!");
      return;
    }

    const payload = {
      ...form,
      image: form.image || "https://via.placeholder.com/300x200?text=No+Image"
    };

    if (editId) {
      await fetch (`https://india-temple-api.onrender.com/temples/${editId}`,{
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      alert("Temple Updated!");
      setEditId(null);
    } else {
      await fetch("https://india-temple-api.onrender.com/temples", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          id: Date.now()
        })
      });
      alert("Temple Added!");
    }

    loadTemples();

    setForm({
      name: "",
      state: "",
      history: "",
      image: ""
    });
  };

  // DELETE
  const deleteTemple = async (id) => {
    await fetch(`https://india-temple-api.onrender.com/temples/${id}`, {
      method: "DELETE"
    });

    loadTemples();
    alert("Temple Deleted!");
  };

  // EDIT
  const editTemple = (temple) => {
    setForm({
      name: temple.name,
      state: temple.state,
      history: temple.history,
      image: temple.image
    });
    setEditId(temple.id);
  };

  // FILTER
  const states = [...new Set(temples.map(t => t.state))];

  const filteredTemples = temples.filter((t) =>
    (selectedState === "" ||
      t.state?.toLowerCase() === selectedState.toLowerCase()) &&
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🛕 India Temple Heritage Portal</h1>

      {/* SEARCH */}
      <input
        style={styles.input}
        type="text"
        placeholder="🔍 Search Temple..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FILTER */}
      <select
        style={styles.input}
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
      >
        <option value="">All States</option>
        {states.map((state, i) => (
          <option key={i} value={state}>{state}</option>
        ))}
      </select>

      {/* FORM */}
      <div style={{ marginTop: "30px" }}>
        <h3>{editId ? "Edit Temple ✏️" : "Add Temple ➕"}</h3>

        <input
          style={styles.input}
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          style={styles.input}
          placeholder="State"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
        />
        <input
          style={styles.input}
          placeholder="History"
          value={form.history}
          onChange={(e) => setForm({ ...form, history: e.target.value })}
        />
        <input
          style={styles.input}
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />

        <button
          onClick={saveTemple}
          style={{
            marginLeft: "10px",
            padding: "10px",
            background: editId ? "orange" : "green",
            color: "white",
            border: "none",
            borderRadius: "6px"
          }}
        >
          {editId ? "Update Temple" : "Add Temple"}
        </button>
      </div>

      {/* CARDS */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: "20px"
      }}>
        {filteredTemples.map((t) => (
          <div
            key={t.id}
            style={{
              width: "280px",
              margin: "15px",
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              padding: "15px",
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-10px)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
            }}
          >
            <img
              src={t.image}
              alt={t.name}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
              }}
              style={{ width: "100%", borderRadius: "8px" }}
            />

            <h2>{t.name}</h2>
            <p><b>State:</b> {t.state}</p>
            <p style={{ fontSize: "14px", color: "#555" }}>{t.history}</p>

     <div style={{ marginTop: "10px" }}>
  <button
    onClick={() => editTemple(t)}
    style={{
      margin: "5px",
      padding: "8px 12px",
      background: "green",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer"
    }}
    onMouseEnter={(e) => e.target.style.opacity = "0.8"}
    onMouseLeave={(e) => e.target.style.opacity = "1"}
  >
    Edit ✏️
  </button>

  <button
    onClick={() => deleteTemple(t.id)}
    style={{
      margin: "5px",
      padding: "8px 12px",
      background: "red",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer"
    }}
    onMouseEnter={(e) => e.target.style.opacity = "0.8"}
    onMouseLeave={(e) => e.target.style.opacity = "1"}
  >
    Delete ❌
  </button>
</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;