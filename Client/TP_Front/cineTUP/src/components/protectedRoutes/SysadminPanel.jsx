import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import useFetch from "../../useFetch/useFetch";
import { Table, Button, Form, Container, Alert, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import '../protectedRoutes/Sysadmin.css';

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
  // 🔹 Modal de confirmación al crear usuario
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalMessage, setCreateModalMessage] = useState("");
  const [createModalVariant, setCreateModalVariant] = useState("success");


  // 🔹 Recuperar usuarios al cargar
  useEffect(() => {
    if (role !== "sysadmin") {
      navigate("/");
      return;
    }

    const loadUsers = async () => {
      try {
        const data = await get("/users", true);
        setUsers(data);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
        setError(err.message || "Error al cargar usuarios");
      }
    };

    loadUsers();
  }, [role]);

  // ✅ 🔹 FUNCION QUE FALTABA: Manejar cambio de rol (abre modal de confirmación)
  const handleRoleChange = (userId, newRole) => {
    const user = users.find((u) => u.id === userId);
    if (user && user.role === newRole) return; // Si no cambió, no hace nada

    setPendingRoleChange({ userId, newRole });
    setShowConfirmRoleModal(true);
  };

  // 🔹 Ejecuta el cambio de rol confirmado
  const confirmRoleChange = async () => {
    const { userId, newRole } = pendingRoleChange;
    setShowConfirmRoleModal(false);

    try {
      const token = localStorage.getItem("cine-tup-token"); // corregido nombre

      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/users/${userId}/role`, {
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
    <div className="sysadmin-wrapper">
      <div className="sysadmin-container">
        <Container className="mt-4">
          <h2 className="mb-4 text-center fw-bold sysadmin-title">
            Panel de Administración de usuarios
          </h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Table striped bordered hover responsive className="shadow-sm sysadmin-table">
            <thead>
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
                      className="sysadmin-btn-delete"
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

          {/* 🔹 FORMULARIO PARA CREAR NUEVO USUARIO */}
          <div className="mt-5 p-4 rounded shadow-sm sysadmin-create-form">
            <h4 className="mb-3 text-center fw-semibold">Crear nuevo usuario</h4>

            <Form
              onSubmit={async (e) => {
                e.preventDefault();
                const name = e.target.name.value.trim();
                const email = e.target.email.value.trim();
                const password = e.target.password.value.trim();
                const role = e.target.role.value;

                if (!name || !email || !password) {
                  setCreateModalMessage("Todos los campos son obligatorios.");
                  setCreateModalVariant("danger");
                  setShowCreateModal(true);
                  return;
                }

                try {
                  const token = localStorage.getItem("cine-tup-token");

                  const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/users/register`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name, email, password, role }),
                  });

                  if (!response.ok) throw new Error("Error al crear usuario");

                  await response.json(); // ignoramos el retorno
                  e.target.reset();

                  // 🔹 recarga la lista actualizada desde el backend
                  const updatedUsers = await get("/users", true);
                  setUsers(updatedUsers);


                  setCreateModalMessage(`Usuario "${name}" creado correctamente.`);
                  setCreateModalVariant("success");
                  setShowCreateModal(true);
                } catch (error) {
                  console.error(error);
                  setCreateModalMessage("No se pudo crear el usuario.");
                  setCreateModalVariant("danger");
                  setShowCreateModal(true);
                }
              }}
            >
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" name="name" placeholder="Nombre del usuario" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" placeholder="usuario@ejemplo.com" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type="password" name="password" placeholder="********" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Rol</Form.Label>
                <Form.Select name="role" defaultValue="user">
                  <option value="user">Usuario</option>
                  <option value="admin">Admin</option>
                  <option value="sysadmin">Sysadmin</option>
                </Form.Select>
              </Form.Group>

              <div className="text-center">
                <Button variant="success" type="submit">
                  Crear usuario
                </Button>
              </div>
            </Form>
          </div>



          {/* ... tus modales siguen exactamente igual */}
          {/** No se toca nada debajo */}
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

          <Modal
            show={showConfirmRoleModal}
            onHide={() => setShowConfirmRoleModal(false)}
            centered
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirmar cambio de rol</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              ¿Seguro que deseas cambiar el rol de este usuario a "{pendingRoleChange.newRole}"?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowConfirmRoleModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={confirmRoleChange}>
                Confirmar
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>
                {roleModalVariant === "success" ? "Cambio realizado con éxito" : "Error"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>{roleModalMessage}</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={() => setShowRoleModal(false)}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>

          {/* 🔹 Modal de confirmación de creación de usuario */}
          <Modal
            show={showCreateModal}
            onHide={() => setShowCreateModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                {createModalVariant === "success" ? "Usuario creado" : "Error"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>{createModalMessage}</Modal.Body>
            <Modal.Footer>
              <Button
                variant={createModalVariant === "success" ? "success" : "danger"}
                onClick={() => setShowCreateModal(false)}
              >
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>

        </Container>
      </div>
    </div>
  );


};

export default SysadminPanel;
