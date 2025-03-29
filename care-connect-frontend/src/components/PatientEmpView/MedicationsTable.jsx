import React from "react";

export const MedicationsTable = ({ medicationsData }) => {
  return (
    <div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="text-left px-4 py-2 border border-gray-300">Medicamento</th>
            <th className="text-left px-4 py-2 border border-gray-300">Dosis</th>
            <th className="text-left px-4 py-2 border border-gray-300">Última toma</th>
          </tr>
        </thead>
        <tbody>
          {medicationsData.map((medication, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-4 py-2 border border-gray-300">{medication.medicamento}</td>
              <td className="px-4 py-2 border border-gray-300">{medication.dosis}</td>
              <td className="px-4 py-2 border border-gray-300">
                {new Date(medication.ultima_toma).toLocaleString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicationsTable;