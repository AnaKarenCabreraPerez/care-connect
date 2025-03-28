import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
  Modal,
  Box,
  Typography,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import BarChartIcon from "@mui/icons-material/BarChart";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import {
  fetchPatients,
  addPatient,
  editPatient,
  deletePatient,
} from "../../services/empApiEndpoints";
import PatientEmpView from "../PatientEmpView/PatientEmpView";
import { HeaderContext } from "../../context/HeaderContext";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#d1d5da",
    color: "#283945",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: "center",
  },
}));

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};

const EmpDashboard = () => {
  const { setHeaderTitle, setHeaderRoute } = useContext(HeaderContext);
  const [patientEmpView, setPatientEmpView] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [patientData, setPatientData] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    estado_salud: "Estable",
    ultimaTomaSignos: new Date(),
  });

  const handleOpenModal = (patient = null) => {
    setEditingPatient(patient);
    setPatientData(
      patient
        ? { ...patient }
        : { nombre: "", apellido: "", edad: "", estado_salud: "Estable" }
    );
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleChange = (e) => {
    setPatientData({ ...patientData, [e.target.name]: e.target.value });
  };

  const fetchPatientsData = async () => {
    try {
      const patientsData = await fetchPatients();
      setPatients(patientsData);
      setAllPatients(patientsData);
    } catch (error) {
      console.error("Error fetching patients", error);
    }
  };

  const handleSavePatient = async () => {
    try {
      if (editingPatient) {
        handleCloseModal();
        const result = await Swal.fire({
          title: "¿Editar este paciente?",
          text: "¿Estás seguro?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d1d5d9",
          cancelButtonColor: "#1e3b55",
          confirmButtonText: "Cancelar",
          cancelButtonText: "Sí, guardar",
        });

        if (!result.isConfirmed) {
          await editPatient(patientData, editingPatient.id);
        } else {
          return;
        }
      } else {
        await addPatient(patientData);
      }
      const patientsData = await fetchPatients();
      setPatients(patientsData);
    } catch (error) {
      console.error("Error saving patient", error);
    } finally {
      setPatientData({
        nombre: "",
        apellido: "",
        edad: "",
        estado_salud: "Estable",
      });
      handleCloseModal();
    }
  };

  const handleDeletePatient = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1e3b55",
      cancelButtonColor: "#d33",
      confirmButtonText: "Cancelar",
      cancelButtonText: "Si, eliminar",
    }).then(async (result) => {
      if (!result.isConfirmed) {
        Swal.fire("Eliminado", "El paciente ha sido eliminado.", "success");
        await deletePatient(id);
        const patientsData = await fetchPatients();
        setPatients(patientsData);
      }
    });
  };

  const handleViewPatient = (id) => {
    setPatientId(id);
    setPatientEmpView(true);
  };

  useEffect(() => {
    setHeaderTitle("Dashboard empleados");
    setHeaderRoute("Inicio / Pacientes");
    fetchPatientsData();
  }, []);

  useEffect(() => {
    if (search === "") {
      setPatients(allPatients);
    } else {
      const filteredPatients = allPatients.filter(
        (patient) =>
          patient.nombre.toLowerCase().includes(search.toLowerCase()) ||
          patient.apellido.toLowerCase().includes(search.toLowerCase())
      );
      setPatients(filteredPatients);
    }
  }, [search, allPatients]);

  return (
    <div className="flex flex-col w-full h-full gap-3 px-4 py-6 bg-transparent">
      {patientEmpView ? (
        <PatientEmpView
          patientId={patientId}
          setPatientEmpView={setPatientEmpView}
        />
      ) : (
        <>
          <div className="flex items-center justify-between w-full h-[10%] rounded-2xl p-4 bg-[#d1d5da]">
            <TextField
              label="Buscar paciente"
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-2/3 bg-white rounded-md"
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1e3b55",
                color: "#fff",
                fontWeight: "bold",
              }}
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => handleOpenModal()}
            >
              Añadir
            </Button>
          </div>

          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Nombre</StyledTableCell>
                  <StyledTableCell>Apellido</StyledTableCell>
                  <StyledTableCell>Edad</StyledTableCell>
                  <StyledTableCell>Estado de Salud</StyledTableCell>
                  <StyledTableCell>Acciones</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <StyledTableCell>{patient.nombre}</StyledTableCell>
                    <StyledTableCell>{patient.apellido}</StyledTableCell>
                    <StyledTableCell>{patient.edad}</StyledTableCell>
                    <StyledTableCell>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {patient.estado_salud}{" "}
                        <BarChartIcon
                          sx={{
                            color:
                              patient.estado_salud === "Crítico"
                                ? "#ff4e4e"
                                : patient.estado_salud === "Recuperación"
                                ? "#f5b249"
                                : "#55c595",
                            marginLeft: 1,
                          }}
                        />
                      </div>
                    </StyledTableCell>
                    <StyledTableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleViewPatient(patient.id)}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenModal(patient)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleDeletePatient(patient.id)}
                        sx={{ ":hover": { color: "red" } }}
                      >
                        <Delete />
                      </IconButton>
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Modal open={openModal} onClose={handleCloseModal}>
            <Box sx={modalStyle}>
              <Typography variant="h6" component="h2" mb={2}>
                {editingPatient ? "Editar Paciente" : "Agregar Paciente"}
              </Typography>
              <TextField
                fullWidth
                margin="dense"
                label="Nombre"
                name="nombre"
                value={patientData.nombre || ""}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Apellido"
                name="apellido"
                value={patientData.apellido || ""}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Edad"
                name="edad"
                type="number"
                value={patientData.edad || ""}
                onChange={handleChange}
              />
              <TextField
                select
                fullWidth
                margin="dense"
                label="Estado"
                name="estado_salud"
                value={patientData.estado_salud || "Estable"}
                onChange={handleChange}
              >
                <MenuItem value="Estable">Estable</MenuItem>
                <MenuItem value="Crítico">Crítico</MenuItem>
                <MenuItem value="Recuperación">Recuperación</MenuItem>
              </TextField>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2, backgroundColor: "#1e3b55" }}
                onClick={handleSavePatient}
              >
                {editingPatient ? "Actualizar" : "Guardar"}
              </Button>
            </Box>
          </Modal>
        </>
      )}
    </div>
  );
};

export default EmpDashboard;
