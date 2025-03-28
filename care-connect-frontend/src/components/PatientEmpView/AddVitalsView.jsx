import React, { useState } from "react";
import { Close, Save } from "@mui/icons-material";

import { addPatientVitals } from "../../services/empApiEndpoints";
import Swal from "sweetalert2";

export const AddVitalsView = ({
  setAddVitalsView,
  setPatientEmpView,
  showPatients,
  patientId,
}) => {
  const [vitals, setVitals] = useState({
    patient_id: patientId,
    pulso: "",
    frecuencia_respiratoria: "",
    presion_arterial: "",
    temperatura: "",
    oxigenacion: "",
    peso: "",
    estatura: "",
    nivel_glucosa: "",
  });
  const [errors, setErrors] = useState({});
  const [showError, setShowError] = useState(false);

  const addPatientVitalsData = async (vitals) => {
    try {
      await addPatientVitals(vitals);
    } catch (error) {
      console.error(error);
    } finally {
      Swal.fire({
        icon: "success",
        title: "¡Datos de signos vitales añadidos!",
        showConfirmButton: false,
        timer: 2500,
      });
      setAddVitalsView(false);
      setPatientEmpView(showPatients ? false : true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setVitals({
      ...vitals,
      [name]: name === "presion_arterial" ? value : parseFloat(value) || "",
    });

    // Si el usuario llena un campo, quita el error
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación: revisa si hay campos vacíos
    const newErrors = {};
    Object.keys(vitals).forEach((key) => {
      if (!vitals[key]) newErrors[key] = true;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShowError(true);
      setInterval(() => {
        setShowError(false);
        setErrors({});
      }, 5000);
      return;
    }

    setShowError(false);
    console.log(vitals);
    addPatientVitalsData(vitals);
  };

  return (
    <div className="w-[450px] bg-[#d1d5d9] border border-[#d1d5d9] rounded-xl shadow-2xl p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-[#283945] text-center">
        Añadir Signos Vitales
      </h1>

      {showError && (
        <p className="text-red-600 text-center font-medium">
          ⚠️ Favor de rellenar todos los campos.
        </p>
      )}

      <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
        {[
          { placeholder: "Peso (kg)", name: "peso", type: "number" },
          { placeholder: "Estatura (cm)", name: "estatura", type: "number" },
          {
            placeholder: "Presión arterial (mmHg)",
            name: "presion_arterial",
            type: "text",
          },
          {
            placeholder: "Temperatura (°C)",
            name: "temperatura",
            type: "number",
          },
          { placeholder: "Oxigenación", name: "oxigenacion", type: "number" },
          { placeholder: "Pulso (lpm)", name: "pulso", type: "number" },
          {
            placeholder: "Freq. respiratoria (rpm)",
            name: "frecuencia_respiratoria",
            type: "number",
          },
          {
            placeholder: "Nivel de glucosa (mg/dL)",
            name: "nivel_glucosa",
            type: "number",
          },
        ].map((field, index) => (
          <div
            key={index}
            className={`${index === 2 || index === 6 ? "col-span-2" : ""}`}
          >
            <input
              type={field.type || "number"}
              placeholder={field.placeholder}
              name={field.name}
              value={vitals[field.name]}
              onChange={handleChange}
              className={`w-full p-3 border ${
                errors[field.name] ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283945] transition-all`}
            />
          </div>
        ))}

        <div className="col-span-2 flex justify-center gap-6 mt-4">
          <button
            type="button"
            className="flex items-center gap-2 bg-[#f2fbfc] hover:bg-[#e0f7fa] text-[#283945] px-4 py-2 rounded-lg transition-all"
            onClick={() => setAddVitalsView(false)}
          >
            <Close sx={{ color: "#283945" }} /> Cancelar
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 bg-[#283945] hover:bg-[#162027] text-white px-4 py-2 rounded-lg transition-all"
          >
            <Save /> Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVitalsView;
