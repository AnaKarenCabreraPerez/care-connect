import React, { useState } from "react";
import { SidebarData } from "./SidebarData";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import Button from "@mui/material/Button";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Logo from "../../assets/CareConnectSinFondo.png";
import SmallLogo from "../../assets/CareConnectSinFondo.png";

const Sidebar = (props) => {
  const { logout, showTitles } = props;
  const [selected, setSelected] = useState();

  const handleItemClick = (index) => {
    setSelected(index);
  };
  return (
    <motion.div className="flex flex-col w-full h-full bg-[#dbdada]">
      {/* logo */}
      <div className="px-1 pt-7 h-[15%]">
        <img
          src={showTitles ? Logo : SmallLogo}
          alt="logo"
          className="object-contain w-full h-full max-h-16"
        />
      </div>

      <div className="flex flex-col justify-center gap-8 h-full pt-4">
        {SidebarData.map((item, index) => {
          return (
            <div className="h-full" key={index}>
              <NavLink
                to={`${item.route}`}
                className="flex items-center justify-center gap-4 px-4 py-2 rounded-lg hover:scale-105 transition-all"
                key={index}
                onClick={() => handleItemClick(index)}
              >
                {typeof item.icon === "string" ? (
                  <img
                    src={selected === index ? item.icon : item.iconAlt}
                    alt={item.heading}
                    height={28}
                    width={28}
                  />
                ) : (
                  <item.icon sx={{ color: "#383838" }} />
                )}
                {showTitles ? <span className="text-[#383838]">{item.heading}</span> : ""}
              </NavLink>
            </div>
          );
        })}
      </div>
      <div
        className="flex items-center justify-center h-[15%] mt-auto"
        title="Cerrar sesión"
      >
        <Button
          className="hover:scale-105"
          onClick={logout}
          variant="text"
          tite="Cerrar sesión"
          sx={{
            paddingBottom: "20px", // Reduce el padding inferior
            color: "#ffffff",
            textTransform: "none",
            textAlign: "center",
            display: "flex", // Asegura que el contenido se alinee bien
            justifyContent: "center",
          }}
        >
          {showTitles ? (
            <>
              <ExitToAppIcon sx={{ color: "#383838" }}/>
              <h3 className="hidden xl:block ml-1 xl:text-sm md:text-xs xs:text-xs text-[#383838]">
                CERRAR SESIÓN
              </h3>
            </>
          ) : (
            <ExitToAppIcon sx={{ color: "#383838" }} />
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
