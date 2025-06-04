// src/pages/admin/AdminSeguimientos.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSeguimientoTable from "../../components/AdminSeguimientoTable";
import FollowUpModal from "../../components/FollowUpModal";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import observador from "../../assets/logoobservadornegro.png";

const AdminSeguimientos = () => {
  const [seguimientos, setSeguimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [selectedObsId, setSelectedObsId] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchSeguimientos = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/seguimientos");
      setSeguimientos(data);
    } catch {
      toast.error("Error al obtener seguimientos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeguimientos();
  }, []);

  const openFollowUpModal = (obsId) => {
    setSelectedObsId(obsId);
    setShowFollowUp(true);
  };

  const handleFollowUpUpdated = async () => {
    // Después de añadir seguimiento, recargar todos
    await fetchSeguimientos();
  };

  const filtered = seguimientos.filter(
    (s) =>
      s.estudiante.toLowerCase().includes(search.toLowerCase()) ||
      s.tipo.toLowerCase().includes(search.toLowerCase()) ||
      s.comentario.toLowerCase().includes(search.toLowerCase()) ||
      s.quien.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Cargando seguimientos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Cabecera */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mb-6 flex items-center">
        <img src={observador} alt="Observador Logo" className="h-10 mr-4" />
        <h1 className="text-2xl font-bold text-gray-800">
          Gestión de Seguimientos
        </h1>
      </div>

      {/* Tabla y buscador */}
      <AdminSeguimientoTable
        seguimientos={paginated}
        onAddFollowUp={openFollowUpModal}
        searchTerm={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Modal para agregar seguimiento */}
      {showFollowUp && selectedObsId && (
        <FollowUpModal
          observationId={selectedObsId}
          onClose={() => setShowFollowUp(false)}
          onUpdated={handleFollowUpUpdated}
        />
      )}
    </div>
  );
};

export default AdminSeguimientos;
