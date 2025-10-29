import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import useFetch from "../../useFetch/useFetch";
import { Table, Button, Form, Container, Alert, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import '../protectedRoutes/Sysadmin.css';
import { jwtDecode } from "jwt-decode";

const SysadminPanel = () => {
  const { token, role } = useContext(AuthContext);
  const { get, isLoading } = useFetch();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const decodedToken = token ? jwtDecode(token) : null;
  const loggedUserId = decodedToken?.id;
   // para los modales

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [deletedModalMessage, setDeletedModalMessage] = useState("");
  const [deletedModalVariant, setDeletedModalVariant] = useState("success");
 
  const [showConfirmRoleModal, setShowConfirmRoleModal] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState({ userId: null, newRole: "" });

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleModalMessage, setRoleModalMessage] = useState("");
  const [roleModalVariant, setRoleModalVariant] = useState("success");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalMessage, setCreateModalMessage] = useState("");
  const [createModalVariant, setCreateModalVariant] = useState("success");

  // para el new user
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  
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

  // validations para crear users
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
          role: "user",
        }),
      });

      if (!res.ok) throw new Error("No se pudo crear el usuario");

      const createdUser = await res.json();

      const updatedUsers = await get("/users", true); // trae toda la lista actualizada
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

  // carga usuario y redirige si no sos sysadmin
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

  // cambio de rol: abre modal de confirmación
  const handleRoleChange = (userId, newRole) => {
    const user = users.find((u) => u.id === userId);
    if (user && user.role === newRole) return; 

    setPendingRoleChange({ userId, newRole });
    setShowConfirmRoleModal(true);
  };

  // Ejecuta el cambio de rol confirmado
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

  // para modal de eliminación
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/users/${selectedUser.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json(); 

      if (!response.ok) {
        throw new Error(data.message || "Error al eliminar usuario");
      }

      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setShowDeleteModal(false);
      setDeletedModalMessage(data.message); 
      setDeletedModalVariant("success");
      setShowDeletedModal(true);
      setSelectedUser(null);
    } catch (err) {
      console.error(err);
      setShowDeleteModal(false);
      setDeletedModalMessage(err.message || "Error al eliminar usuario");
      setDeletedModalVariant("danger");
      setShowDeletedModal(true);
    }
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
                      disabled={user.id === loggedUserId} //  desactivar select si es el mismo usuario logueado
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
                      disabled={user.id === loggedUserId} //  no puede eliminarse a sí mismo
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {isLoading && <p className="text-center mt-3">Cargando...</p>}

          
          <div className="d-flex justify-content-end mb-3">
            <Button className='warning' variant="success" onClick={() => setShowCreateModal(true)}>
              Crear nuevo usuario
            </Button>
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
            show={showDeletedModal}
            onHide={() => setShowDeletedModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>{deletedModalVariant === "success" ? "Usuario eliminado" : "Error"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{deletedModalMessage}</Modal.Body>
            <Modal.Footer>
              <Button
                variant={deletedModalVariant === "success" ? "success" : "danger"}
                onClick={() => setShowDeletedModal(false)}
              >
                Cerrar
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
