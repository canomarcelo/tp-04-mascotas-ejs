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

  app.get("/mascotas/nueva", (req, res) => {
    res.render("mascotas/nueva", {
      titulo: "Registrar nueva mascota",
    });
  });

  app.post("/mascotas", (req, res) => {
    
    const nombre = req.body.nombre?.trim();
    const especie = req.body.especie?.trim();
    const edad = Number(req.body.edad);
    const descripcion = req.body.descripcion?.trim();
    const estado = req.body.estado?.trim();

    const camposCompletos = nombre && especie && descripcion && estado && req.body.edad !== "" && req.body.edad !== undefined;
    const edadValida = Number.isInteger(edad) && edad >= 0;

    if (!camposCompletos || !edadValida) {
      return res.status(400).render("mascotas/nueva", {
        titulo: "Registrar nueva mascota",
        error: "Todos los campos son obligatorios y la edad debe ser un numero valido mayor o igual a 0.",
        mascota: {
          nombre,
          especie,
          edad: req.body.edad,
          descripcion,
          estado,
        },
      });
    }

    const nuevaMascota = {
      id: mascotas.length === 0 ? 1 : Math.max(...mascotas.map((mascota) => mascota.id)) + 1,
      nombre,
      especie,
      edad,
      descripcion,
      estado,
      imagen: "/img/mascota1.svg",
    };

    mascotas.push(nuevaMascota);
    res.redirect("/mascotas");
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

