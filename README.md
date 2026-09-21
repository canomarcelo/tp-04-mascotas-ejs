# Trabajo práctico 04 - Mascotas en adopción

## Descripción
Crear una aplicación web para consultar mascotas en adopción y agregar temporalmente nuevos registros
mediante un formulario.

## Instalación
Para instalar las dependencias del proyecto:
npm install
npm init -y

## Ejecución
Para iniciar la aplicación:
npm start
Luego abrí en el navegador:
http://localhost:3500

## Rutas principales

- GET /  -> pagina de inicio
- GET /mascotas  -> listado de mascotas
- GET /mascotas/nueva  -> formulario para cargar una nueva mascota
- GET /mascotas/:id  -> detalle de una mascota
- POST /mascotas  -> recibe los datos del formulario y crea una nueva mascota

## Estructura de vistas
El proyecto usa EJS como motor de plantillas. Las vistas se encuentran en la carpeta 'views' y se renderizan con 'res.render()'.

inicio.ejs: pagina principal
mascotas/lista.ejs: listado de mascotas
mascotas/detalle.ejs: detalle individual
mascotas/nueva.ejs: formulario para registrar una mascota
layouts/main.ejs: layout principal compartido por todas las paginas
partials/encabezado.ejs 'y' partials/pie.ejs: header y footer reutilizables

## Recursos estáticos
Los archivos publicos como CSS, imagenes y scripts se sirven con 'express.static()'. Esto permite acceder a recursos desde la carpeta 'public' sin necesidad de rutas complejas.

## Formulario
El formulario para registrar una nueva mascota se envia con:
<form action="/mascotas" method="post">

Se valida que los campos obligatorios esten completos y que la edad sea valida antes de guardar la mascota.

## Persistencia de los datos
Los datos se almacenan en un archivo JSON ubicado en 'datos/mascotas.json'. La lectura y parseo se realizan en 'src/archivos.js'.

- diferencia entre layout, vista y parcial;
Layout: El esqueleto maestro o molde que comparten casi todas las páginas de tu sitio.
Vista: La pagina entera que cambia segun a que ruta entres (ej. detalle.ejs, lista.ejs).
Parcial: un pedacito reutilizable que metes dentro de vistas o layouts (ej. cabecera o pie de pagina ).
- datos enviados a una vista mediante res.render ;
Le pasas un objeto con informacion al motor de plantillas
- función de express.static ;
Le dices que carpeta es publica y Express entrega automaticamente CSS, imagenes, fotos.
- función de express.urlencoded ;
Los datos que viajan desde un <form method="POST"> desordenados los empaqueta ordenadamente en un objeto facil de leer: req.body.nombreDeTuInput.
- recorrido POST, redirección y GET;
 a) Envias los datos del formulario al servidor. El servidor los guarda.
 b) El servidor redirecciona a otra URL para evitar que enviar el POST por accidente.
 c) el navegador pide la nueva direccion con un GET y muestra la donde se vi las lista de mascotas.
