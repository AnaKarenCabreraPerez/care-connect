import React, { useEffect, useState, useContext } from "react";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AirIcon from "@mui/icons-material/Air";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import SpaIcon from "@mui/icons-material/Spa";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import ErrorIcon from "@mui/icons-material/Error";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Modal, Box } from "@mui/material";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

import {
  fetchPatientLastVitals,
  fetchPatientChartData,
  addMedication,
  updateMedicationDose,
  updateMedication,
  deleteMedication,
} from "../../services/empApiEndpoints";
import Loader from "../Loader/Loader";
import NoDataView from "./NoDataView";
import AddVitalsView from "./AddVitalsView";
import LineChart from "../Charts/LineChart";
import { HeaderContext } from "../../context/HeaderContext";

const PatientEmpView = ({ patientId, setPatientEmpView }) => {
  const { setHeaderTitle, setHeaderRoute } = useContext(HeaderContext);
  const [patientData, setPatientData] = useState({});
  const [patientChartData, setPatientChartData] = useState({});
  const [noDataView, setNoDataView] = useState(false);
  const [addVitalsView, setAddVitalsView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const handleBackButton = () => {
    setHeaderTitle("Dashboard empleados");
    setHeaderRoute("Inicio / Pacientes");
    setPatientEmpView(false);
  };

  const fetchPatientData = async (patientId) => {
    try {
      setLoading(true);
      const patientData = await fetchPatientLastVitals(patientId);
      const chartData = await fetchPatientChartData(patientId);
      setPatientChartData(chartData);
      setPatientData(patientData);
      setHeaderTitle(
        `Paciente: ${patientData.paciente.nombre} ${patientData.paciente.apellido}`
      );
      setHeaderRoute(
        patientData.paciente.edad +
          " años" +
          " | " +
          patientData.peso +
          " kg" +
          " | " +
          patientData.estatura +
          `${patientData.estatura < 100 ? " m" : " cm"}` +
          " | " +
          patientData.paciente.estado_salud
      );
    } catch (error) {
      setNoDataView(true);
    } finally {
      setLoading(false);
    }
  };

  /**------------- Meds functions ---------------- */
  const handleAddMedication = async () => {
    const { value: formValues, isConfirmed } = await Swal.fire({
      title: "Añadir Medicamento",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Nombre del medicamento">
        <input id="swal-input2" class="swal2-input" placeholder="Dosis (ej: 500mg)">
        <input id="swal-input3" class="swal2-input" type="number" placeholder="Frecuencia (horas)">
      `,
      showCancelButton: true,
      confirmButtonText: "Agregar",
      cancelButtonText: "Cancelar",
      buttonsStyling: false,
      didRender: () => {
        const confirmBtn = Swal.getConfirmButton();
        const cancelBtn = Swal.getCancelButton();
        [confirmBtn, cancelBtn].forEach((btn) => {
          btn.style.backgroundColor = "#283945";
          btn.style.color = "white";
          btn.style.border = "none";
          btn.style.borderRadius = "5px";
          btn.style.padding = "8px 16px";
          btn.style.margin = "0 4px";
          btn.style.fontWeight = "600";
          btn.style.fontSize = "14px";
          btn.style.cursor = "pointer";
        });
      },
      focusConfirm: false,
      preConfirm: () => {
        const medicamento = document.getElementById("swal-input1").value.trim();
        const dosis = document.getElementById("swal-input2").value.trim();
        const frecuencia = document.getElementById("swal-input3").value.trim();

        if (!medicamento || !dosis || !frecuencia) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return false;
        }

        if (isNaN(Number(frecuencia)) || Number(frecuencia) <= 0) {
          Swal.showValidationMessage(
            "La frecuencia debe ser un número mayor a 0"
          );
          return false;
        }

        return {
          medicamento,
          dosis,
          frecuencia: Number(frecuencia),
        };
      },
    });

    if (isConfirmed && formValues) {
      try {
        setLoading(true);
        await addMedication(formValues, patientId);
        Swal.fire({
          icon: "success",
          title: "Medicamento añadido!",
          confirmButtonText: "Aceptar",
        });
        fetchPatientData(patientId);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo añadir el medicamento.",
          confirmButtonText: "Aceptar",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateMed = async (medId) => {
    try {
      setLoading(true);
      await updateMedicationDose(medId);
      Swal.fire({
        icon: "success",
        title: "Medicamento actualizado",
        text: "La dosis del medicamento ha sido actualizada.",
        confirmButtonText: "Aceptar",
      });
      fetchPatientData(patientId);
    } catch (error) {
      setNoDataView(true);
    } finally {
      setLoading(false);
    }
  };
  const handleEditMed = async (med) => {
    handleCloseModal();

    const { value: formValues, isConfirmed } = await Swal.fire({
      title: "Editar Medicamento",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Medicamento" value="${med.medicamento}">
        <input id="swal-input2" class="swal2-input" placeholder="Dosis" value="${med.dosis}">
        <input id="swal-input3" class="swal2-input" type="number" placeholder="Frecuencia (horas)" value="${med.frecuencia}">
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      buttonsStyling: false,
      didRender: () => {
        const confirmBtn = Swal.getConfirmButton();
        const cancelBtn = Swal.getCancelButton();

        [confirmBtn, cancelBtn].forEach((btn) => {
          btn.style.backgroundColor = "#283945";
          btn.style.color = "white";
          btn.style.border = "none";
          btn.style.borderRadius = "5px";
          btn.style.padding = "8px 16px";
          btn.style.margin = "0 4px";
          btn.style.fontWeight = "600";
          btn.style.fontSize = "14px";
          btn.style.cursor = "pointer";
        });
      },
      focusConfirm: false,
      preConfirm: () => {
        const medicamento = document.getElementById("swal-input1").value.trim();
        const dosis = document.getElementById("swal-input2").value.trim();
        const frecuencia = document.getElementById("swal-input3").value.trim();

        if (!medicamento || !dosis || !frecuencia) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return false;
        }

        if (isNaN(Number(frecuencia)) || Number(frecuencia) <= 0) {
          Swal.showValidationMessage(
            "La frecuencia debe ser un número mayor a 0"
          );
          return false;
        }

        return {
          ...med,
          medicamento,
          dosis,
          frecuencia: Number(frecuencia),
        };
      },
    });

    if (isConfirmed && formValues) {
      try {
        await updateMedication(formValues, med.id);
        Swal.fire({
          icon: "success",
          title: "Medicamento actualizado",
          text: "El medicamento ha sido actualizado.",
          confirmButtonText: "Aceptar",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar el medicamento.",
          confirmButtonText: "Aceptar",
        });
      } finally {
        fetchPatientData(patientId);
      }
    } else {
      handleOpenModal();
    }
  };
  const handleDeleteMed = async (med) => {
    handleCloseModal();
    const result = await Swal.fire({
      title: `¿Eliminar ${med.medicamento}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await deleteMedication(med.id);
        Swal.fire(
          "Eliminado",
          "El medicamento fue eliminado correctamente",
          "success"
        );
        fetchPatientData(patientId);
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el medicamento", "error");
      } finally {
        setLoading(false);
      }
    }
  };
  /**------------------------------------------- */

  useEffect(() => {
    if (!patientData || Object.keys(patientData).length === 0) {
      fetchPatientData(patientId);
    } else {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    if (!addVitalsView) {
      fetchPatientData(patientId);
    }
  }, [addVitalsView]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {noDataView ? (
        <NoDataView
          setPatientEmpView={setPatientEmpView}
          patientId={patientId}
        />
      ) : addVitalsView ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
          {/* TODO: Responsive para iPad */}
          <AddVitalsView
            setAddVitalsView={setAddVitalsView}
            setPatientEmpView={setPatientEmpView}
            showPatients={false}
            patientId={patientId}
          />
        </div>
      ) : (
        <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-2">
          <div className="row-span-2 flex flex-col gap-1 bg-[#d1d5d9] border-black border-1 rounded-2xl shadow-xl">
            <div className="w-full p-4 pb-0 flex items-center">
              {/* Botón para regresar */}
              <IconButton onClick={() => handleBackButton()}>
                <ArrowBackIosIcon />
              </IconButton>
              <h1 className="font-bold sm:text-xl lg:text-2xl text-[#283945]">
                Acciones
              </h1>
            </div>
            <div className="w-full flex justify-center items-center p-4 gap-2">
              <div
                className="flex w-[50%] flex-col items-center justify-center text-center bg-[#283945] text-white rounded-2xl p-4 shadow-xl hover:cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => setAddVitalsView(true)}
              >
                <IconButton>
                  <AddCircleIcon sx={{ fontSize: 40, color: "#FFFFFF" }} />
                </IconButton>
                <p className="font-bold text-[#FFFFFF]">Añadir Vitales</p>
              </div>
              <div
                className="flex w-[50%] flex-col items-center justify-center text-center bg-[#283945] text-white rounded-2xl p-4 shadow-xl hover:cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => Swal.fire("Notificación enviada al familiar")}
              >
                {/* TODO: Notificación al familiar */}
                <IconButton>
                  <ErrorIcon sx={{ fontSize: 40, color: "#FFFFFF" }} />
                </IconButton>
                <p className="font-bold text-[#FFFFFF]">Notificar Familiar</p>
              </div>
            </div>
          </div>
          <div className="col-span-2 flex flex-col gap-1 bg-[#d1d5d9] border-black border-1 rounded-2xl shadow-xl">
            <div className="w-full pt-1 flex justify-center items-center">
              <h1 className="font-bold sm:text-xl lg:text-2xl text-[#283945]">
                Vitales
              </h1>
            </div>
            <div className="w-full grid grid-cols-3 gap-2 px-4">
              <div className="col-span-1 flex flex-col items-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <FavoriteIcon sx={{ color: "#283945" }} />
                </motion.div>
                <h2 className="font-bold text-[#283945] text-xl">Pulso</h2>
                <p>{patientData.pulso} bpm</p>
              </div>
              <div className="col-span-1 flex flex-col items-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <AirIcon sx={{ color: "#283945" }} />
                </motion.div>
                <h2 className="font-bold text-[#283945] text-xl">
                  Oxigenación
                </h2>
                <p>{patientData.oxigenacion} SpO2</p>
              </div>
              <div className="col-span-1 flex flex-col items-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <DeviceThermostatIcon sx={{ color: "#283945" }} />
                </motion.div>
                <h2 className="font-bold text-[#283945] text-xl">
                  Temperatura
                </h2>
                <p>{patientData.temperatura} °C</p>
              </div>
            </div>
          </div>
          <div className="col-span-2 col-start-2 row-start-2 flex flex-col justify-center gap-1 bg-[#d1d5d9] border-black border-1 rounded-2xl shadow-xl">
            <div className="w-full grid grid-cols-3 gap-2 px-4">
              <div className="col-span-1 flex flex-col items-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <SpaIcon sx={{ color: "#283945" }} />
                </motion.div>
                <h2 className="font-bold text-[#283945] text-xl">
                  Freq. Respiratoria
                </h2>
                <p>{patientData.frecuencia_respiratoria} RR</p>
              </div>
              <div className="col-span-1 flex flex-col items-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <BloodtypeIcon sx={{ color: "#283945" }} />
                </motion.div>
                <h2 className="font-bold text-[#283945] text-xl">
                  Presión arterial
                </h2>
                <p>{patientData.presion_arterial} mm Hg</p>
              </div>
              <div className="col-span-1 flex flex-col items-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <VaccinesIcon sx={{ color: "#283945" }} />
                </motion.div>
                <h2 className="font-bold text-[#283945] text-xl">
                  Nivel glucosa
                </h2>
                <p>{patientData.nivel_glucosa} mmol/L</p>
              </div>
            </div>
          </div>
          <div className="col-span-3 row-span-2 col-start-1 row-start-3 flex flex-col justify-center pl-2 gap-1 bg-[#d1d5d9] border-black border-1 rounded-2xl shadow-xl">
            <LineChart patientChartData={patientChartData}/>
          </div>
          <div className="row-span-4 col-start-4 row-start-1 flex flex-col gap-1 bg-[#d1d5d9] border-black border-1 rounded-2xl shadow-xl">
            {/* Sección de medicamentos */}
            <div className="w-full h-full p-4 flex flex-col gap-4">
              <h1 className="font-bold sm:text-xl lg:text-2xl text-[#283945]">
                Medicamentos
                <IconButton onClick={handleAddMedication}>
                  <AddCircleIcon sx={{ color: "#283945" }} />
                </IconButton>
              </h1>

              {patientData.medicamentos.length > 0 ? (
                <div className="flex flex-col gap-2 overflow-y-scroll pr-2 rounded-lg">
                  {patientData.medicamentos.map((medicamento, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-3 shadow-sm flex flex-col gap-1 text-sm"
                    >
                      <div className="flex justify-between items-center">
                        <p>
                          <span className="font-semibold text-[#283945]">
                            Med:
                          </span>{" "}
                          {medicamento.medicamento}
                        </p>
                        <p>
                          <span className="font-semibold text-[#283945]">
                            Dosis:
                          </span>{" "}
                          {medicamento.dosis}
                        </p>
                      </div>
                      <p>
                        <span className="font-semibold text-[#283945]">
                          Freq:
                        </span>{" "}
                        cada {medicamento.frecuencia} hrs
                      </p>
                      <p>
                        <span className="font-semibold text-[#283945]">
                          Sig. Toma:
                        </span>{" "}
                        {new Date(medicamento.siguiente_toma).toLocaleString()}
                      </p>
                      {medicamento.atrasado && (
                        <p className="text-red-600 font-semibold">
                          ¡Toma atrasada!
                        </p>
                      )}
                      <button
                        className="bg-[#283945] text-white text-xs font-semibold py-1 px-2 rounded self-end mt-1"
                        onClick={() => handleUpdateMed(medicamento.id)}
                      >
                        Actualizar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full flex flex-col justify-center items-center gap-2">
                  <ErrorIcon sx={{ color: "#283945", fontSize: 40 }} />
                  <p>No hay medicamentos registrados.</p>
                </div>
              )}

              <div className="w-full flex justify-center mt-4">
                <button
                  className="bg-[#283945] text-white font-bold py-2 px-4 rounded"
                  onClick={handleOpenModal}
                >
                  Ver todos los medicamentos
                </button>
              </div>
            </div>

            {/* MODAL PARA TODOS LOS MEDICAMENTOS */}
            <Modal open={open} onClose={handleCloseModal}>
              <Box className="bg-white p-6 rounded-xl shadow-lg w-11/12 md:w-2/3 lg:w-1/2 mx-auto mt-24 max-h-[80vh] overflow-auto">
                <h2 className="text-2xl font-bold text-[#283945] mb-4">
                  Todos los medicamentos
                </h2>
                {patientData.medicamentos?.length > 0 ? (
                  <div className="space-y-4">
                    {patientData.medicamentos.map((med) => (
                      <div
                        key={med.id}
                        className="border border-gray-300 p-3 rounded-lg shadow-sm flex flex-col gap-2"
                      >
                        <div>
                          <p>
                            <strong>Medicamento:</strong> {med.medicamento}
                          </p>
                          <p>
                            <strong>Dosis:</strong> {med.dosis}
                          </p>
                          <p>
                            <strong>Frecuencia:</strong> cada {med.frecuencia}{" "}
                            horas
                          </p>
                          <p>
                            <strong>Ultima toma:</strong>{" "}
                            {new Date(med.ultima_toma).toLocaleString()}
                          </p>
                          <p>
                            <strong>Siguiente toma:</strong>{" "}
                            {new Date(med.siguiente_toma).toLocaleString()}
                          </p>
                          {med.atrasado && (
                            <p className="text-red-600 font-semibold">
                              ¡Toma atrasada!
                            </p>
                          )}
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                            onClick={() => handleEditMed(med)}
                          >
                            Editar
                          </button>
                          <button
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                            onClick={() => handleDeleteMed(med)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No hay medicamentos registrados.</p>
                )}
              </Box>
            </Modal>
          </div>
        </div>
      )}
    </>
  );
};

export default PatientEmpView;
