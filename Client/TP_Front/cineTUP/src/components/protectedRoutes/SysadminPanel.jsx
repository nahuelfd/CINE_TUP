import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import useFetch from "../../useFetch/useFetch";
import { Table, Button, Form, Container, Alert, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import '../protectedRoutes/Sysadmin.css';
import SimpleAlert from "../SimpleAlert";

const SysadminPanel = () => {
  const { token, role } = useContext(AuthContext);
  const { get, isLoading } = useFetch();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [showConfirmRoleModal, setShowConfirmRoleModal] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState({ userId: null, newRole: "" });

  const [alertShow, setAlertShow] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("info");

  const showAlert = (message, variant = "info", duration = 4000) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setAlertShow(true);
    setTimeout(() => setAlertShow(false), duration);
  };

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
        showAlert(err.message || "Error al cargar usuarios", "danger");
      }
    };

    loadUsers();
  }, [role]);


  const handleRoleChange = (userId, newRole) => {
    const user = users.find((u) => u.id === userId);
    if (user && user.role === newRole) return;

    setPendingRoleChange({ userId, newRole });
    setShowConfirmRoleModal(true);
  };

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

      showAlert(`Rol de ${updatedUser.name} actualizado correctamente a "${updatedUser.role}"`, "success");
    } catch (error) {
      console.error(error);
      showAlert("No se pudo actualizar el rol", "danger");
    }
  };

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
          showAlert(errData.message || "Error al eliminar usuario", "danger");
          return;
        }

        setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
        setShowDeleteModal(false);
        setSelectedUser(null);
      })
      .catch((err) => {
        showAlert(err.message || "Error al eliminar usuario", "danger");
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
                  showAlert("Todos los campos son obligatorios.", "danger");
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

                  await response.json();
                  e.target.reset();

                  const updatedUsers = await get("/users", true);
                  setUsers(updatedUsers);


                  showAlert(`Usuario "${name}" creado correctamente.`, "success");

                } catch (error) {
                  console.error(error);
                  showAlert("No se pudo crear el usuario.", "danger");
                  ;
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

        </Container>
      </div>
      <SimpleAlert
        show={alertShow}
        message={alertMessage}
        variant={alertVariant}
        onClose={() => setAlertShow(false)}
        duration={4000}
      />

    </div>
  );


};

export default SysadminPanel;
