export const CardContainer = ({ titulo, children, maxwidth = '900px' }) => {
    return (
      <div className="container-fluid px-2 px-md-4">
        <div 
          className="servigo-card shadow-sm p-3 p-md-5 rounded bg-white mx-auto border-0"
          style={{
            maxWidth: maxwidth,
            width: '100%', 
            marginTop: '1.5rem'
          }}
        >
          {titulo && (
            <h2 className="text-center mb-4 text-servigo-title fw-bold fs-3 fs-md-2">
              {titulo}
            </h2>
          )}
          
          {children}
        </div>
      </div>
    );
  };