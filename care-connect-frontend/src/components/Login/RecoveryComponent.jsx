import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import svgLogo from "../../assets/CareConnectSinFondo.png";
import Swal from "sweetalert2";

export const RecoveryComponent = ({
  setShowRecovery,
  resetPassword,
  confirmResetPassword,
}) => {
  const [currentView, setCurrentView] = useState("email");
  const [loadingRecovery, setLoadingRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPswd, setNewPswd] = useState("");
  const navigate = useNavigate();

  //   Estados para validacion de nueva contraseña
  const [isLongEnough, setIsLongEnough] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);

  const handleRecoveryEmailChange = (e) => {
    e.preventDefault();
    setRecoveryEmail(e.target.value);
  };

  const handleRecoveryCodeChange = (e) => {
    e.preventDefault();
    setRecoveryCode(e.target.value);
  };

  const handleNewPswdChange = (e) => {
    e.preventDefault();
    const password = e.target.value;
    setNewPswd(password);

    setIsLongEnough(password.length > 7);
    setHasNumber(/\d/.test(password));
    setHasUppercase(/[A-Z]/.test(password));
    setHasLowercase(/[a-z]/.test(password));
  };

  const handleRecoverySubmit = (e) => {
    let timerInterval;
    e.preventDefault();
    setLoadingRecovery(true);

    confirmResetPassword(recoveryEmail, recoveryCode, newPswd)
      .then(() => {
        setLoadingRecovery(false);
        Swal.fire({
          icon: "success",
          title: "Contraseña actualizada con éxito",
          html: "Redirigiendo a la página de inicio en <b></b> segundos.",
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
              timer.textContent = Math.ceil(Swal.getTimerLeft() / 1000);
            }, 100);
          },
          willClose: () => {
            clearInterval(timerInterval);
            navigate("/");
          },
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            navigate("/");
          }
        });
      })
      .catch((err) => {
        setLoadingRecovery(false);        
        let errorMessage = "Error al actualizar la contraseña.";

        switch (err.code) {
          case "CodeMismatchException":
            errorMessage =
              "El código de verificación es incorrecto. Inténtalo de nuevo.";
            break;

          case "ExpiredCodeException":
            errorMessage =
              "El código de verificación ha expirado. Solicita uno nuevo.";
            Swal.fire({
              icon: "error",
              title: errorMessage,
              html: "Redirigiendo a la página de inicio en <b></b> segundos.",
              showConfirmButton: false,
              timer: 5000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector("b");
                timerInterval = setInterval(() => {
                  timer.textContent = Math.ceil(Swal.getTimerLeft() / 1000);
                }, 100);
              },
              willClose: () => {
                clearInterval(timerInterval);
                navigate("/");
              },
            }).then((result) => {
              if (result.dismiss === Swal.DismissReason.timer) {
                navigate("/");
              }
            });
            return;
          case "LimitExceededException":
            errorMessage =
              "Has alcanzado el límite de intentos o el código ha expirado. Inténtalo más tarde.";
            Swal.fire({
              icon: "error",
              title: errorMessage,
              html: "Redirigiendo a la página de inicio en <b></b> segundos.",
              showConfirmButton: false,
              timer: 5000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector("b");
                timerInterval = setInterval(() => {
                  timer.textContent = Math.ceil(Swal.getTimerLeft() / 1000);
                }, 100);
              },
              willClose: () => {
                clearInterval(timerInterval);
                navigate("/");
              },
            }).then((result) => {
              if (result.dismiss === Swal.DismissReason.timer) {
                navigate("/");
              }
            });
            return;

          case "UserNotFoundException":
            errorMessage =
              "No se encontró ningún usuario con este correo electrónico.";
            break;

          default:
            errorMessage = "Error desconocido. Inténtalo de nuevo más tarde.";
            break;
        }

        Swal.fire({
          position: "center",
          icon: "error",
          title: errorMessage,
          showConfirmButton: false,
          timer: 5000,
        });
      });
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setLoadingRecovery(true);

    resetPassword(recoveryEmail)
      .then(() => {
        setLoadingRecovery(false);
        setCurrentView("code");
      })
      .catch((err) => {
        setLoadingRecovery(false);
        Swal.fire({
          position: "center",
          icon: "error",
          title:
            "Error al enviar el código de verificación, intente de nuevo más tarde.",
          showConfirmButton: false,
          timer: 5000,
        });
        setTimeout(() => {
        }, 10000);
      });
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    setCurrentView("newPassword");
  };

  const handleBack = () => {
    if (currentView === "code") {
      setCurrentView("email");
    } else if (currentView === "newPassword") {
      setCurrentView("code");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex flex-col items-center h-full pt-20">
        <div className="w-full">
          <img src={svgLogo} className="mx-auto h-40 w-full" alt="Logo"/>
        </div>

        <div className="px-6 max-w-md">
          {currentView === "email" && (
            <>
              <h2 className="w-full text-3xl font-bold mb-3 text-gray-700">
                Recupera tu contraseña
              </h2>
              <p className="text-gray-700 mb-10 text-left px-10">
                Ingresa el correo con el que te registraste para recuperar tu
                contraseña
              </p>
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-12">
                  <label className="block text-gray-700 text-sm font-bold mb-2 text-left">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={recoveryEmail}
                    onChange={handleRecoveryEmailChange}
                    placeholder="debra.holt@example.com"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#283945] bg-transparent"
                  />
                </div>
                <div className="flex justify-center gap-12">
                  <button
                    type="button"
                    className="bg-[#1B243F] hover:bg-[#0058A3] text-white py-2 px-6 rounded focus:outline-none "
                    onClick={() => setShowRecovery(false)}
                  >
                    Regresar
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0058A3] hover:bg-[#1B243F] text-white py-2 px-8 rounded focus:outline-none "
                  >
                    {!loadingRecovery ? "Enviar" : "Cargando"}
                  </button>
                </div>
              </form>
            </>
          )}

          {currentView === "code" && (
            <>
              <h2 className="w-full text-3xl text-center font-bold mb-3 text-gray-700">
                Código de verificación
              </h2>
              <p className="text-gray-700 mb-10 text-center px-10">
                Ingresa el código de verificación que te enviamos a tu correo
              </p>
              <form onSubmit={handleCodeSubmit}>
                <div className="mb-12">
                  <label className="block text-gray-700 text-sm font-bold mb-2 text-left">
                    Código
                  </label>
                  <input
                    id="code"
                    type="number"
                    value={recoveryCode}
                    onChange={handleRecoveryCodeChange}
                    placeholder="Tu código de verificación"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#283945] bg-transparent"
                  />
                </div>
                <div className="flex justify-center gap-12">
                  <button
                    type="button"
                    className="bg-[#283945] hover:bg-[#1B243F] text-white py-2 px-6 rounded focus:outline-none "
                    onClick={handleBack}
                  >
                    Regresar
                  </button>
                  <button
                    type="submit"
                    className="bg-[#283945] hover:bg-[#1B243F] text-white py-2 px-8 rounded focus:outline-none "
                  >
                    Siguiente
                  </button>
                </div>
              </form>
            </>
          )}

          {currentView === "newPassword" && (
            <>
              <h2 className="w-full text-3xl font-bold mb-3 text-center text-gray-700">
                Nueva contraseña
              </h2>
              <p className="text-gray-700 mb-10 text-center px-10">
                Ingresa tu nueva contraseña
              </p>
              <form onSubmit={handleRecoverySubmit}>
                <div className="mb-8">
                  <label className="block text-gray-700 text-sm font-bold mb-2 text-left">
                    Nueva contraseña
                  </label>
                  <input
                    id="newPswd"
                    type="password"
                    value={newPswd}
                    onChange={handleNewPswdChange}
                    placeholder="Tu nueva contraseña"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#283945] bg-transparent"
                  />
                </div>
                <div className="w-full justify-center mb-12">
                  <ul className="space-y-2 text-lg text-left list-none text-gray-500 font-medium">
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
                </div>
                <div className="flex justify-center gap-12">
                  <button
                    type="button"
                    className="bg-[#283945] hover:bg-[#1B243F] text-white py-2 px-6 rounded focus:outline-none "
                    onClick={handleBack}
                  >
                    Regresar
                  </button>
                  <button
                    type="submit"
                    className={`bg-[#283945]  text-white py-2 px-8 rounded focus:outline-none  ${
                      !(
                        newPswd &&
                        isLongEnough &&
                        hasNumber &&
                        hasUppercase &&
                        hasLowercase
                      )
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#283945] hover:bg-[#1B243F]"
                    }`}
                    disabled={
                      !(
                        newPswd &&
                        isLongEnough &&
                        hasNumber &&
                        hasUppercase &&
                        hasLowercase
                      )
                    }
                  >
                    {!loadingRecovery ? "Enviar" : "Cargando"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecoveryComponent;
