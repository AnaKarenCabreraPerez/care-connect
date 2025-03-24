import React from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import { useState } from "react";
import NewPswdForm from "./NewPswdForm";
import RecoveryComponent from "./RecoveryComponent";
import svgLogo from "../../assets/CareConnectSinFondo.png";
import imgBckg from "../../assets/LoginBckgImg.avif";

const LoginComponent = () => {
  /** ESTADOS PARA MANEJAR LOS INPUTS */
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  });
  /** ESTADOS PARA MANEJAR EL LOADING Y LOS ERRORES */
  const [loading, setLoading] = useState(false);
  const [loginErr, setLoginErr] = useState("");
  const [showRecovery, setShowRecovery] = useState(false);
  /** IMPORTAR NAVEGACION Y FUNCIONES DE AUTENTICACION */
  const navigate = useNavigate();
  const { signIn, resetPassword, newPswdRequired, confirmResetPassword, role } =
    UserAuth();

  /** --------------------------------------------------------------- */
  /** FUNCIONES PARA INICIAR SESION */
  const handleChange = ({ target: { name, value } }) => {
    setUserInput({ ...userInput, [name]: value });
  };

  const translateError = (error) => {
    switch (error.code) {
      case "InvalidParameterException":
        return "Falta un parámetro requerido: Email";
      case "NotAuthorizedException":
        return "Email o contraseña incorrectos.";
      case "UserNotFoundException":
        return "Usuario no encontrado.";
      case "PasswordResetRequiredException":
        return "Es necesario restablecer la contraseña.";
      case "UserNotConfirmedException":
        return "El usuario no ha sido confirmado.";
      default:
        return "Ocurrió un error inesperado. Por favor, inténtelo de nuevo.";
    }
  };

  const handleRecovery = () => {
    setShowRecovery(!showRecovery);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(async () => {
      signIn(userInput.email, userInput.password)
        .then(() => {
          if (role === "familiar") {
            navigate("/fam-dashboard");
          } else if (role === "empleado") {
            navigate("/emp-dashboard");
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoginErr(translateError(err));
          setLoading(false);
          setTimeout(() => {
            setLoginErr("");
          }, 10000);
        });
    }, 500);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <>
      {newPswdRequired.required ? (
        <NewPswdForm email={userInput.email} />
      ) : !showRecovery ? (
        <div>
          <div className="flex h-screen bg-white">
            {/* Image Container para mas tarde */}
            <div className="flex items-center justify-center w-1/2 h-full bg-white border-r">
              <img
                src={imgBckg}
                className="object-cover w-full h-full"
                alt={`${imgBckg} imagen fondo`}
              />
            </div>

            {/* <!-- Form Container --> */}
            <div className="relative flex justify-center w-1/2 pt-20 bg-white">
              <div>
                <div>
                  <img
                    src={svgLogo}
                    className="w-full h-48 mx-auto "
                    alt={`${svgLogo} logo de la marca`}
                  />
                </div>
                <div className="mb-4">
                  {/*  Form Header */}
                  <h2 className="mb-2 text-4xl font-bold text-gray-700">
                    Accede a tu dashboard
                  </h2>
                  <p className="text-center text-gray-500">
                    Captura tus datos para acceder a tu cuenta
                  </p>
                </div>

                {/*  Email Input */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-bold text-left text-gray-700">
                    Email
                  </label>
                  <input
                    className="w-full px-3 py-2 leading-tight border rounded appearance-none focus:outline-none focus:shadow-outline"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="ejemplo@dominio.com"
                    onChange={handleChange}
                    value={userInput.email}
                    onKeyPress={handleKeyPress}
                  />
                </div>

                {/*  Password Input  */}
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-bold text-left text-gray-700">
                    Contraseña
                  </label>
                  <input
                    className="w-full px-3 py-2 mb-3 leading-tight border rounded appearance-none focus:outline-none focus:shadow-outline"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="*******"
                    value={userInput.password}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                  />
                  <div className="flex justify-end">
                    <button
                      className="inline-block text-sm align-baseline text-sky-600 hover:text-sky-900"
                      onClick={handleRecovery}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                </div>

                {/*  Submit Button */}
                <div className="flex flex-col items-center justify-between">
                  <button
                    className="w-full px-4 py-2 font-semibold text-white bg-[#0058A3] rounded hover:bg-[#18558a] focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={handleSubmit}
                  >
                    {loading ? "Cargando..." : "Iniciar sesión"}
                  </button>
                  <div>
                    {loginErr ? (
                      <p className="py-2 font-semibold text-red-600">
                        {loginErr}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <RecoveryComponent
          setShowRecovery={setShowRecovery}
          resetPassword={resetPassword}
          confirmResetPassword={confirmResetPassword}
        />
      )}
    </>
  );
};

export default LoginComponent;
