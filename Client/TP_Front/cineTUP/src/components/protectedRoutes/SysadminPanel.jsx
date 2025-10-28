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

  // 🔹 Campos y errores para nuevo usuario
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("user");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // 🔹 Validaciones idénticas a register
  const validateName = (value) => (!value.trim() ? "El nombre es obligatorio" : "");
  const validateEmail = (value) => {
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(value) ? "" : "Email inválido";
  };
  const validatePassword = (value) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    return regex.test(value)
      ? ""
      : "Contraseña debe tener al menos 1 mayúscula, 1 número y 6 caracteres";
  };

  // 🔹 Función para crear usuario con validaciones
  const handleCreateUser = async (e) => {
    e.preventDefault();

    const nError = validateName(newName);
    const eError = validateEmail(newEmail);
    const pError = validatePassword(newPassword);

    setNameError(nError);
    setEmailError(eError);
    setPasswordError(pError);

    if (nError || eError || pError) return;

    try {
      const token = localStorage.getItem("cine-tup-token");
      const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          role: newRole,
        }),
      });

      if (!res.ok) throw new Error("No se pudo crear el usuario");

      const createdUser = await res.json();

      const updatedUsers = await get("/users", true); // obtiene toda la lista actualizada
      setUsers(updatedUsers);

      // reset campos
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("user");
      setNameError("");
      setEmailError("");
      setPasswordError("");

      // mostrar modal de éxito
      setCreateModalMessage(`Usuario "${createdUser.name}" creado correctamente.`);
      setCreateModalVariant("success");
      setShowCreateModal(true);
    } catch (error) {
      console.error(error);
      setCreateModalMessage(error.message || "No se pudo crear el usuario");
      setCreateModalVariant("danger");
      setShowCreateModal(true);
    }
  };

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
      const token = localStorage.getItem("cine-tup-token");

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

          {/* 🔹 Botón para abrir modal de creación */}
          <div className="d-flex justify-content-end mb-3">
            <Button className='warning' variant="success" onClick={() => setShowCreateModal(true)}>
              Crear nuevo usuario
            </Button>
          </div>

          {/* 🔹 MODALES */}
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

          {/* 🔹 Modal de creación de usuario con validaciones */}
          <Modal
            show={showCreateModal}
            onHide={() => setShowCreateModal(false)}
            centered
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Crear nuevo usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleCreateUser}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    value={newName}
                    isInvalid={!!nameError}
                    onChange={(e) => {
                      setNewName(e.target.value);
                      setNameError(validateName(e.target.value));
                    }}
                  />
                  <Form.Control.Feedback type="invalid">{nameError}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={newEmail}
                    isInvalid={!!emailError}
                    onChange={(e) => {
                      setNewEmail(e.target.value);
                      setEmailError(validateEmail(e.target.value));
                    }}
                  />
                  <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    isInvalid={!!passwordError}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError(validatePassword(e.target.value));
                    }}
                  />
                  <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Rol</Form.Label>
                  <Form.Select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                    <option value="user">Usuario</option>
                    <option value="admin">Admin</option>
                    <option value="sysadmin">Sysadmin</option>
                  </Form.Select>
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button variant="secondary" onClick={() => setShowCreateModal(false)} className="me-2">
                    Cancelar
                  </Button>
                  <Button type="submit" variant="success">
                    Crear usuario
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>

        </Container>
      </div>
    </div>
  );
};

export default SysadminPanel;
