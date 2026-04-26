import React from "react";
import ImagenBanner from "../../assets/img/banner-home.png";

const BannerInicio = () => {
    return (
        <div className="container-fluid mt-0 px-4">
          <img
            src={ImagenBanner}
            alt="Banner de ServiGo"
            className="rounded-3 shadow-sm"
            style={{
              width: "100%",
              height: "380px",
              objectFit: "cover",   // Esto es vital para que la imagen se adapte sin deformarse
                objectPosition: "center",
                display: "block"
             
            }}
          />
        </div>
      );


};
export default BannerInicio;