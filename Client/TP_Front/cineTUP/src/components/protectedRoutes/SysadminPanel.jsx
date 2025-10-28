import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import useFetch from "../../useFetch/useFetch";
import { Table, Button, Form, Container, Alert, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SysadminPanel = () => {
  const { token, role } = useContext(AuthContext);
  const { get, isLoading } = useFetch();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // 🔹 Modales de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // 🔹 Modal de confirmación de cambio de rol
  const [showConfirmRoleModal, setShowConfirmRoleModal] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState({ userId: null, newRole: "" });

  // 🔹 Modal de notificación de resultado
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleModalMessage, setRoleModalMessage] = useState("");
  const [roleModalVariant, setRoleModalVariant] = useState("success");

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

  // 🔹 Intento de cambio de rol: abre modal de confirmación
  const handleRoleChange = (userId, newRole) => {
    setPendingRoleChange({ userId, newRole });
    setShowConfirmRoleModal(true);
  };

  // 🔹 Ejecuta el cambio de rol confirmado
  const confirmRoleChange = async () => {
    const { userId, newRole } = pendingRoleChange;
    setShowConfirmRoleModal(false);

    try {
      const token = localStorage.getItem("cinetup-token");

      const response = await fetch(`http://localhost:3000/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error("Error al cambiar el rol");

      const updatedUser = await response.json();
      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));

      setRoleModalMessage(`Rol de ${updatedUser.name} actualizado correctamente a "${updatedUser.role}"`);
      setRoleModalVariant("success");
      setShowRoleModal(true);
    } catch (error) {
      console.error(error);
      setRoleModalMessage("No se pudo actualizar el rol");
      setRoleModalVariant("danger");
      setShowRoleModal(true);
    }
  };

  // 🔹 Modal de eliminación
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

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
        setShowDeleteModal(false);
        setSelectedUser(null);
      })
      .catch((err) => {
        setError(err.message || "Error al eliminar usuario");
        setShowDeleteModal(false);
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
                <Button variant="danger" size="sm" onClick={() => handleDeleteClick(user)}>
                  🗑️ Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {isLoading && <p className="text-center mt-3">Cargando...</p>}

      {/* 🔹 Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser ? (
            <p>
              ¿Estás seguro de que deseas eliminar al usuario <strong>{selectedUser.name}</strong>? Esta acción no se puede deshacer.
            </p>
          ) : (
            <p>Cargando usuario...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Eliminar definitivamente
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 🔹 Modal de confirmación de cambio de rol */}
      <Modal show={showConfirmRoleModal} onHide={() => setShowConfirmRoleModal(false)} centered backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar cambio de rol</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que deseas cambiar el rol de este usuario a "{pendingRoleChange.newRole}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmRoleModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={confirmRoleChange}>Confirmar</Button>
        </Modal.Footer>
      </Modal>

      {/* 🔹 Modal de notificación */}
      <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{roleModalVariant === "success" ? "Éxito" : "Error"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {roleModalMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowRoleModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SysadminPanel;
