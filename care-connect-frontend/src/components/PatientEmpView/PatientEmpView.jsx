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
import { motion } from "framer-motion";
import Swal from "sweetalert2";

import { fetchPatientLastVitals } from "../../services/empApiEndpoints";
import Loader from "../Loader/Loader";
import NoDataView from "./NoDataView";
import AddVitalsView from "./AddVitalsView";
import LineChart from "../Charts/LineChart";
import { HeaderContext } from "../../context/HeaderContext";

const PatientEmpView = ({ patientId, setPatientEmpView }) => {
  const { setHeaderTitle, setHeaderRoute } = useContext(HeaderContext);
  const [patientData, setPatientData] = useState({});
  const [noDataView, setNoDataView] = useState(false);
  const [addVitalsView, setAddVitalsView] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleBackButton = () => {
    setHeaderTitle("Dashboard empleados");
    setHeaderRoute("Inicio / Pacientes");
    setPatientEmpView(false);
  };

  const fetchPatientData = async (patientId) => {
    try {
      setLoading(true);
      const patientData = await fetchPatientLastVitals(patientId);
      setPatientData(patientData);
      setHeaderTitle(
        `Paciente: ${patientData.paciente.nombre} ${patientData.paciente.apellido}`
      );
      setHeaderRoute(
        patientData.paciente.edad +
          " años" +
          " | " +
          patientData.paciente.estado_salud
      );
    } catch (error) {
      setNoDataView(true);
    } finally {
      setLoading(false);
    }
  };

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
                Paciente:
              </h1>
            </div>
            <div className="w-full">
              <ul className="w-full pl-6">
                <li className="flex gap-2 items-center">
                  <h2 className="font-bold text-[#283945] text-xl truncate">
                    Nombre:
                  </h2>
                  <p>{patientData.paciente.nombre}</p>
                </li>
                <li className="flex gap-2 items-center">
                  <h2 className="font-bold text-[#283945] text-xl truncate">
                    Apellido:
                  </h2>
                  <p>{patientData.paciente.apellido}</p>
                </li>
                <li className="flex gap-2 items-center">
                  <h2 className="font-bold text-[#283945] text-xl truncate">
                    Edad:
                  </h2>
                  <p>{patientData.paciente.edad}</p>
                </li>
                <li className="flex gap-2 items-center">
                  <h2 className="font-bold text-[#283945] text-xl truncate">
                    Peso:
                  </h2>
                  <p>{patientData.peso}</p>
                </li>
                <li className="flex gap-2 items-center">
                  <h2 className="font-bold text-[#283945] text-xl truncate">
                    Estatura:
                  </h2>
                  <p>{patientData.estatura}</p>
                </li>
                <li className="flex gap-2 items-center">
                  <h2 className="font-bold text-[#283945] text-xl truncate">
                    Estado de salud:
                  </h2>
                  <p>{patientData.paciente.estado_salud}</p>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-span-2 flex flex-col gap-1 bg-[#d1d5d9] border-black border-1 rounded-2xl shadow-xl">
            <div className="w-full pt-1 flex justify-center items-center">
              <IconButton
                aria-label="add"
                onClick={() => setAddVitalsView(true)}
              >
                <AddCircleIcon sx={{ color: "#283945" }} />
              </IconButton>
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
            <LineChart />
          </div>
          <div className="row-span-4 col-start-4 row-start-1 flex flex-col gap-1 bg-[#d1d5d9] border-black border-1 rounded-2xl shadow-xl">
            {/** SECCION PARA AGREGAR VITALES Y MOSTRAR LOS MEDICAMENTOS DEL PACIENTE */}
            <div className="w-full h-full p-4 flex flex-col gap-2">
              <div className="w-full flex">
                <h1 className="font-bold sm:text-xl lg:text-2xl text-[#283945]">
                  Medicamentos
                </h1>
              </div>
              <div className="w-full h-[80%] flex flex-col gap-2">
                {patientData.medicamentos &&
                patientData.medicamentos.length > 0 ? (
                  patientData.medicamentos.map((medicamento, index) => (
                    <div
                      key={index}
                      className="w-full p-2 bg-white border border-gray-300 rounded-lg shadow-md"
                    >
                      <h2 className="font-bold text-[#283945] text-lg">
                        {medicamento.nombre}
                      </h2>
                      <p>Dosis: {medicamento.dosis}</p>
                      <p>Última vez administrado: {medicamento.ultima_vez}</p>
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full flex flex-col justify-center items-center gap-2">
                    <ErrorIcon sx={{ color: "#283945", fontSize: 40 }} />
                    <p>No hay medicamentos registrados.</p>
                  </div>
                )}
              </div>
              <div className="w-full flex justify-center mt-4 gap-4">
                <button
                  className="bg-[#283945] text-white font-bold py-2 px-4 rounded"
                  onClick={() => Swal.fire("Funcionalidad en desarrollo")}
                >
                  Editar
                </button>
                <button
                  className="bg-[#283945] text-white font-bold py-2 px-4 rounded"
                  onClick={() => Swal.fire("Funcionalidad en desarrollo")}
                >
                  Añadir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PatientEmpView;
