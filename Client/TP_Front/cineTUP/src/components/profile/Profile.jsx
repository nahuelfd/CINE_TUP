import { useState } from "react";
import EditProfile from "./EditProfile";
import Tickets from "./Tickets";
import "./Profile.css";

const Profile = () => {
  const [activeView, setActiveView] = useState("tickets");

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Perfil de Usuario</h2>
        <div className="profile-buttons">
          <button
            className={activeView === "tickets" ? "active" : ""}
            onClick={() => setActiveView("tickets")}
          >
            Mis Tickets
          </button>
          <button
            className={activeView === "edit" ? "active" : ""}
            onClick={() => setActiveView("edit")}
          >
            Editar Perfil
          </button>
        </div>
      </div>

      {activeView && (
        <div className="profile-content">
          {activeView === "tickets" && <Tickets />}
          {activeView === "edit" && <EditProfile />}
        </div>
      )}
    </div>
  );
};

export default Profile;