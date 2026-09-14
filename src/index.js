const express = require("express"); 
const path = require("node:path"); 

const { leerJson } = require("./archivos");

const expressLayouts = require("express-ejs-layouts");

const port = 3500;

const rutaDatos = path.join(__dirname, "..", "datos", "mascotas.json");

async function main() {
  
  const mascotas = await leerJson(rutaDatos); 

  const app = express(); 

app.set("view engine", "ejs"); // Indica que las vistas utilizaran el motor de plantillas ejs
app.set("views", path.join(__dirname, "..", "views")); // Indica donde se encuentran las vistas de la aplicacion
app.use(expressLayouts); // activa el soporte de layouts compartidos
app.set("layout", "layouts/main"); // define el layouts utilizado por defecto
app.use(express.static(path.join(__dirname, "..", "public"))); // expone los arhivos estaticos
app.use(express.urlencoded({ extended: false }));// permite recibir datos enviado por el formulario html

 app.get("/", (req, res) => {
    res.render("inicio", {titulo: "Patitas Centro de Adopción de Mascotas"});
  });

  app.get("/mascotas",(req,res) => {
    
    res.render("mascotas/lista", {
      titulo: "Mascotas para Adopcion",
      mascotas,
    });
  });

// Ruta para ver el detalle de una mascota por ID
app.get("/mascotas/:id", (req, res) => {
  const id = Number(req.params.id);
  const mascota = mascotas.find((item) => item.id === id);

  if (!mascota) {
    return res.status(404).render("no-encontrado", {
      titulo: "Mascota no encontrada",
      mensaje: "La mascota con el ID solicitado no existe en nuestro listado.",
    });
  }

  // Si existe, renderiza la vista de detalle pasándole el objeto encontrado
  res.render("mascotas/detalle", {
    titulo: `Detalle de ${mascota.nombre}`,
    mascota,
  });
});
  

 
  app.get("/api/mascotas", (req, res) => {
    res.json(mascotas); 
  });

  app.listen(port, () => {
    console.log(`Aplicacion Disponible en http://localhost:${port}`);
  });
}

main().catch((error) => {
  console.error("No se pudo iniciar la aplicación:", error);
  process.exitCode = 1;
});

