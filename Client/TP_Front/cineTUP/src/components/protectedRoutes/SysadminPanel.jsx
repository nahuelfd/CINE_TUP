import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../services/authContext/AuthContext";
import useFetch from "../../useFetch/useFetch";
import { Table, Button, Form, Container, Row, Col, Alert, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SysadminPanel = () => {
  const { token, role } = useContext(AuthContext);
  const { get, post, isLoading } = useFetch();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (role !== "sysadmin") {
      navigate("/"); // Redirige si no es sysadmin
      return;
    }

    get(
      "/users",
      true,
      (data) => setUsers(data),
      (err) => setError(err.message || "Error al cargar usuarios")
    );
  }, [role]);

  const handleRoleChange = async (userId, newRole) => {
  const confirmChange = confirm(`¿Seguro que deseas cambiar el rol del usuario ${userId} a "${newRole}"?`);
  if (!confirmChange) return;

  try {
    const token = localStorage.getItem('token'); // 👈 obtiene el token del login

    const response = await fetch(`http://localhost:3000/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // 👈 token agregado
      },
      body: JSON.stringify({ role: newRole })
    });

    if (!response.ok) {
      throw new Error("Error al cambiar el rol");
    }

    alert("Rol actualizado correctamente");
  } catch (error) {
    console.error(error);
    alert("No se pudo actualizar el rol");
  }
};

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // 🔹 Confirmar eliminación de usuario
  const handleConfirmDelete = () => {
    if (!selectedUser) return;

    fetch(`${import.meta.env.VITE_APP_API_URL}/users/${selectedUser.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Error al eliminar usuario");
        }
        setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
        setShowModal(false);
        setSelectedUser(null);
      })
      .catch((err) => {
        setError(err.message || "Error al eliminar usuario");
        setShowModal(false);
      });
  };

  if (!token) return <Alert variant="danger">No autorizado</Alert>;

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center fw-bold">Panel de Administración de usuarios</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol Actual</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="align-middle">{user.name}</td>
              <td className="align-middle">{user.email}</td>
              <td className="align-middle">
                <Form.Select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  style={{ maxWidth: "200px", display: "inline-block" }}
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Admin</option>
                  <option value="sysadmin">Sysadmin</option>
                </Form.Select>
              </td>
              <td className="text-center align-middle">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteClick(user)}
                >
                  🗑️ Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {isLoading && <p className="text-center mt-3">Cargando...</p>}

      {/* 🔹 Modal de confirmación */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser ? (
            <p>
              ¿Estás seguro de que deseas eliminar al usuario{" "}
              <strong>{selectedUser.name}</strong>? Esta acción no se puede
              deshacer.
            </p>
          ) : (
            <p>Cargando usuario...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Eliminar definitivamente
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};


export default SysadminPanel;