import React from "react";
import ImagenBanner from "../../assets/img/banner-inicio.png";

const bannerImageStyle = {
  width: "100%",
  height: "auto",
  objectFit: "cover",
  objectPosition: "center",
  display: "block"
};

const buttonWrapperStyle = {
  right: "8%",
  bottom: "14%"
};

const buttonStyle = {
  borderRadius: "25px",
  fontWeight: "bold",
  backgroundColor: "#28a745",
  border: "2px solid white"
};

const BannerInicio = () => {
  return (
    <div className="container-fluid px-4 position-relative">
      <img
        src={ImagenBanner}
        alt="Banner de ServiGo"
        className="rounded-3 shadow-sm"
        style={bannerImageStyle}
      />

      <div className="position-absolute" style={buttonWrapperStyle}>
        <button
          type="button"
          className="btn btn-success btn-lg shadow-sm px-5"
          style={buttonStyle}
        >
          Ver Categorías
        </button>
      </div>
    </div>
  );
};

export default BannerInicio;