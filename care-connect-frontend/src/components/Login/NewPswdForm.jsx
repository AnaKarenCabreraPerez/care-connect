import React, { useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import logo from "../../assets/CareConnectSinFondo.png";

function NewPswdForm({ email }) {
  const { newPswd } = UserAuth();
  const [newPassword, setNewPassword] = useState("");
  const [isLongEnough, setIsLongEnough] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [error, setError] = useState(false);

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);

    setIsLongEnough(password.length > 7);
    setHasNumber(/\d/.test(password));
    setHasUppercase(/[A-Z]/.test(password));
    setHasLowercase(/[a-z]/.test(password));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isLongEnough && hasNumber && hasUppercase && hasLowercase) {
      newPswd(newPassword, email)
        .then(() => {
          alert("Contraseña restablecida con éxito");
          window.location.reload();
        })
        .catch((err) => {
          setError(true);
        });
    } else {
      alert("La contraseña no cumple con todos los requisitos");
    }
  };

  return (
    <div className="flex flex-col items-center h-screen pt-20 bg-white">
      <div className="relative h-full">
        <div className="w-full flex justify-center items-center">
          <img src={logo} alt="logo" className="h-36 w-full"/>
        </div>
        <h2 className="text-5xl font-bold text-center text-gray-700 ">
          Ingresa tu nueva contraseña
        </h2>
        <form onSubmit={handleSubmit} className="py-6 px-12">
          <div className="">
            <p
              htmlFor="password"
              className="text-md font-semibold text-left text-gray-700 pl-3"
            >
              Nueva Contraseña
            </p>
            <input
              type="password"
              id="password"
              name="password"
              className="block bg-gray-100 w-full p-3 mt-3 ml-3 border border-gray-400 rounded-md focus:outline-none focus:shadow-outline sm:text-sm"
              placeholder="Contraseña"
              value={newPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <ul className="p-8 mx-2 space-y-2 text-lg text-left list-none text-gray-500 font-medium">
            <li
              className={`flex items-center ${
                isLongEnough ? "text-green-500" : ""
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full mr-2 ${
                  isLongEnough ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <div>Contiene más de 7 caracteres</div>
            </li>
            <li
              className={`flex items-center ${
                hasNumber ? "text-green-500" : ""
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full mr-2 ${
                  hasNumber ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <div>Contiene al menos un caracter numérico (0-9)</div>
            </li>
            <li
              className={`flex items-center ${
                hasUppercase ? "text-green-500" : ""
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full mr-2 ${
                  hasUppercase ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <div>Contiene una mayúscula</div>
            </li>
            <li
              className={`flex items-center ${
                hasLowercase ? "text-green-500" : ""
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full mr-2 ${
                  hasLowercase ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <div>Contiene una minúscula</div>
            </li>
          </ul>
          <button
            type="submit"
            className={`flex justify-center w-full px-4 py-2 text-md font-medium cursor-pointer text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:shadow-outline ${
              !(
                newPassword &&
                isLongEnough &&
                hasNumber &&
                hasUppercase &&
                hasLowercase
              )
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#0058A3] hover:bg-[#2F394F]"
            }`}
            disabled={
              !(
                newPassword &&
                isLongEnough &&
                hasNumber &&
                hasUppercase &&
                hasLowercase
              )
            }
          >
            Restablecer Contraseña
          </button>
        </form>
        {error && (
          <p className="text-red-500 text-center mt-4 font-bold">
            Hubo un error al restablecer la contraseña, inténtalo de nuevo más tarde.
          </p>
        )}
      </div>
    </div>
  );
}

export default NewPswdForm;
