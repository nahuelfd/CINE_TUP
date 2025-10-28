import { useState, useEffect } from "react";
import "./EditProfile.css";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [originalData, setOriginalData] = useState({ name: "", email: "" });
  const [messages, setMessages] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("cine-tup-token");

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setMessages(["No autenticado"]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) {
          setMessages([data.message || "Error al cargar perfil"]);
        } else {
          setFormData({
            name: data.name || "",
            email: data.email || "",
            password: "",
          });
          setOriginalData({
            name: data.name || "",
            email: data.email || "",
          });
        }
      } catch (err) {
        console.error(err);
        setMessages(["Error de conexión al servidor"]);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages([]);

    const hasChanges =
      formData.name !== originalData.name ||
      formData.email !== originalData.email ||
      (formData.password && formData.password.trim() !== "");

    if (!hasChanges) {
      setMessages(["No hubo cambios para guardar"]);
      return;
    }

    setSaving(true);

    try {
      const body = { name: formData.name, email: formData.email };
      if (formData.password && formData.password.trim() !== "") {
        body.password = formData.password;
      }

      const res = await fetch("http://localhost:3000/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.samePassword) {
          setMessages([data.message || "La nueva contraseña no puede ser igual a la anterior"]);
        } else if (data.message?.includes(". ")) {

          setMessages(data.message.split(". ").filter(Boolean).map((m) => m.trim()));
        } else {
          setMessages([data.message || "Error al actualizar el perfil"]);
        }
      } else {
        setMessages(["Perfil actualizado correctamente"]);
        setFormData({ ...formData, password: "" });
        setOriginalData({ name: formData.name, email: formData.email });
      }
    } catch (err) {
      console.error(err);
      setMessages(["Error de conexión al servidor"]);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="loading">Cargando...</p>;

  return (
    <div className="edit-profile-container">
      <h2 className="edit-profile-title">Editar Perfil</h2>

      {messages.map((msg, i) => (
        <p
          key={i}
          className={`edit-profile-message ${msg.includes("correctamente") ? "success" : "error"}`}
        >
          {msg}
        </p>
      ))}

      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <label className="edit-profile-label">Nombre:</label>
        <input
          type="text"
          name="name"
          className="edit-profile-input"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label className="edit-profile-label">Email:</label>
        <input
          type="email"
          name="email"
          className="edit-profile-input"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label className="edit-profile-label">Contraseña (Opcional):</label>
        <input
          type="password"
          name="password"
          className="edit-profile-input"
          placeholder="Contraseña (si querés cambiarla)"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit" disabled={saving}>
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;