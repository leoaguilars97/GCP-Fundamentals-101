# Proyecto GCP Fundamentals

## MyPicz 

MyPicz es una plataforma en la nube que permite a los usuarios subir sus fotos y organizarlas en colecciones de fotos (álbumes).

## Objetivo

Poner en práctica los conceptos teóricos y ejemplos vistos en clase. Utilizar diferentes servicios de GCP y prepararse para una futura certificación como 
Associate Cloud Engineer. 

## Funcionalidades requeridas

### Usuarios

Los usuarios deben tener la siguiente información: 

```javascript
[
    "name",
    "username", // O correo como ustedes deseen
    "password",
    "biografia", 
    "gravatar" // O un URL a una foto de perfil. Más info: https://en.gravatar.com/
]
```

Las acciones que puede realizar un usuario son: 

* Registrarse
* Iniciar sesión
* Cambiar contraseña (:star: *Funcionalidad extra*)
* Ver la información del perfil **(esta página estará en App Engine, más info abajo)**
* Modificar sus datos  (:star: *Funcionalidad extra*)
* Darse de baja (eliminar cuenta)  (:star: *Funcionalidad extra*)
* Crear un álbum de fotos
* Agregar imágenes sin álbum
* Quitar una imágen de un álbum  (:star: *Funcionalidad extra*)
* Agregar imágenes a un álbum
* Eliminar álbum

### Fotos

Las fotos son imágenes (png o jpeg) que agrega el usuario, estas imagenes estarán guardadas en **Cloud Storage**. Una misma foto puede estar en varios álbumes.

Además de la imagen, una foto tiene una descripción.

```javascript
{
    "url": "URL DE LA FOTO",
    "descripcion": "Breve descripción de la foto"
}
```

Las fotos deben de poder ser marcadas como "Favoritos" (Más info abajo). Las fotos deben de poder ser eliminadas. 

### Colecciones de fotos

Las colecciones de fotos le sirven a los usuarios para agrupar sus fotos.  Un usuario puede crear los álbumes que desee. Los álbumes pueden tener fotos que también estén en otros álbumes. 

Los álbumes tienen un nombre, y un grupo de fotos (siempre deben tener al menos una foto)

```javascript
{
    "name": "Nombre del album",
    "photos": ['url_foto1', 'url_foto2', ...] // Siempre tiene que tener mas de una foto
}
```

Los álbumes deben tener una página donde se puedan visualizar sus fotos, y eliminarlas del álbum si el usuario desea.

### Página de perfil

En esta página se pueden ver los datos del usuario. También se deben ver todas las imagenes del usuario que no están en albums, y una vista miniatura de cada uno de los albums que tiene el usuario. 

## Servicios a utilizar

Utilizarán GCP como proveedor de nube. Los servicios que implementarán son: 

### Google Kubernetes Engine

Este servicio será utilizado para almacenar y orquestar su API. Los endpoints que tengan en esta API quedan a su discreción. 

La única restricción está en utilizar Cloud Functions para una función. *(Ver abajo)*

### Cloud Functions

Se utilizará Cloud Functions para implementar la lógica del siguiente endpoint de la API:

* Obtener el perfil del usuario

Es decir, la llamada a la base de datos que realicen para obtener la información del perfil del usuario, las fotos y álbumes que tiene debe realizarse en Cloud Functions.

### Compute Engine y Network Load Balancer

En este servicio tendrán tres réplicas del frontend de su aplicación. Manejadas por un Network Load Balancer (exactamente como el ejemplo de la clase 5). 

Dejo a su criterio como desplegar la aplicación en las máquinas. (Pueden utilizar PM2, Docker, Nginx, Apache...)

En este frontend tendrán todas las vistas ***excepto la del perfil del usuario***.

### App Engine

En este servicio se subirá el frontend del perfil de usuario. Acá realizarán la petición a Cloud Functions para obtener la información del usuario y desplegar la vista del perfil del usuario.

### Cloud SQL

Utilizarán este servicio para almacenar la información del usuario, de los álbums y de las imágenes. 

Dejo a su discreción la manera de relacionar la información. 

:exclamation: **Una sugerencia:** Hacer una relación de muchos a uno de las fotos (a cada foto asignarle un usuario, y un estado de "favorito"). Hacer una relación de muchos a muchos de fotos a álbumes. 

### Cloud Logs

Las APIs de la app deben de estar conectadas a Stackdriver, y permitirles obtener información acerca de las cosas que realizan. 

### Cloud Big Query
A partir de los logs obtenidos de Stackdriver, deben de enviarlos a un dataset de big query

## Datastudio
A partir de los logs obtenidos en Big Query, deben de crear un dashboard en Datastudio que muestre informacion del performance de la API

### Cloud Storage

Utilizarán este servicio para almacenar las imágenes que sube el cliente. 

### Cloud Monitoring

Utilizarán este servicio para obtener visibilidad de la aplicación que construyeron. 

## Restricciones

* Utilizar GCP
* Realizar al menos 70% del proyecto para calificarse
* **Deben realizar todos los procesos desde la terminal de comandos (con el google sdk)**

Ninguna más, pueden elegir el lenguaje, biblioteca o framework que deseen. 

## Entregables

* Repositorio de Github público 
* Documentación de todos los comandos de GCP que utilizaron *(formato pdf, md, o txt)*
* Cualquier otra documentación que crean importante

## Calificación

Se realizará la calificación del proyecto de manera virtual por medio de Google Meets

## Método de trabajo

En parejas o individual

## Fecha de entrega

Viernes 29 de abril del 2022








