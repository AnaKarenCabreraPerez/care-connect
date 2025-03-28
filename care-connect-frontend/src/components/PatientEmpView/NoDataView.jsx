import React from "react";
import { useState } from "react";
import AddVitalsView from "./AddVitalsView";

const NoDataView = ({ setPatientEmpView, patientId }) => {
  const [addVitalsView, setAddVitalsView] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
      {addVitalsView ? (
        <AddVitalsView
          setAddVitalsView={setAddVitalsView}
          setPatientEmpView={setPatientEmpView}
          showPatients={true}
          patientId={patientId}
        />
      ) : (
        <div className="w-96 h-48 bg-[#d1d5d9] border-black border-1 rounded-2xl shadow-xl flex flex-col items-center justify-center">
          <h1 className="font-bold text-[#283945] text-xl">
            El paciente no tiene datos registrados
          </h1>
          <div className="w-full flex justify-center gap-4">
            <button
              className="bg-[#f3fbfc] text-[#283945] px-4 py-2 rounded-lg mt-4"
              onClick={() => setPatientEmpView(false)}
            >
              Regresar
            </button>
            <button
              className="bg-[#283945] text-white px-4 py-2 rounded-lg mt-4"
              onClick={() => setAddVitalsView(true)}
            >
              Agregar datos
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoDataView;
