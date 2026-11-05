# El Zorzal: página de pedidos

Tienda de El Zorzal: el cliente elige sus productos y envía el pedido armado por WhatsApp.
Es una página estática (HTML, CSS y JavaScript), sin servidor ni base de datos, así que se puede hostear gratis en GitHub Pages.

## Cómo publicarla en GitHub (paso a paso)

1. Descomprimí el `.zip` en tu computadora.
2. Entrá a [github.com](https://github.com) e iniciá sesión. Tocá **New** (nuevo repositorio), poné un nombre (por ejemplo `elzorzal`), dejalo **Public** y tocá **Create repository**.
3. En el repositorio nuevo tocá **uploading an existing file** (o **Add file → Upload files**).
4. Arrastrá **todo el contenido** de la carpeta descomprimida: `index.html`, `README.md` y la carpeta `assets` completa. Tiene que quedar `index.html` en la raíz, no dentro de otra carpeta.
5. Abajo tocá **Commit changes**.
6. Andá a **Settings → Pages**. En **Build and deployment**, en *Source* elegí **Deploy from a branch**; en *Branch* elegí **main** y la carpeta **/ (root)**; tocá **Save**.
7. Esperá uno o dos minutos y recargá esa misma pantalla: arriba aparece la dirección de tu página, con esta forma: `https://TU-USUARIO.github.io/elzorzal/`.

## Cómo cambiar la carta

Todo se edita en `assets/js/catalog.js`: nombres, descripciones, orden, si se vende por unidad o por docena, el número de WhatsApp y el usuario de Instagram. Adentro del archivo hay un comentario que explica cada campo.

En GitHub: abrí el archivo, tocá el lápiz (**Edit this file**), cambiá lo que necesites y tocá **Commit changes**. La página se actualiza sola en uno o dos minutos.

- **Ocultar un producto sin borrarlo:** poné `hidden: true`.
- **Agregar un producto:** copiá un bloque entre llaves `{ ... }`, pegalo a continuación y cambiá los datos (el `id` tiene que ser distinto en cada producto).
- **Cambiar o agregar una foto:** subí la imagen a `assets/img/products/` (Add file → Upload files) y poné su ruta en el campo `img` del producto. Para que cargue rápido, conviene que pese menos de 200 KB y tenga proporción 4:3 (por ejemplo, 720 × 540 px).

Los fideos al huevo todavía no tienen foto: mientras tanto se muestra un dibujo.

## Vista previa al compartir el link (opcional)

Cuando ya tengas la dirección final, abrí `index.html`, buscá la línea `og:image` y reemplazá `TU-USUARIO` y `TU-REPO` por tu usuario de GitHub y el nombre del repositorio. Así, al compartir el link por WhatsApp o redes, aparece la imagen del logo.

## Probarla en tu computadora

Hacé doble clic en `index.html`: funciona sin instalar nada. Los tipos de letra (Google Fonts) se cargan desde internet.

## Contenido

- `index.html`: estructura y textos de la página.
- `assets/css/styles.css`: colores y diseño (los colores están al principio, como variables).
- `assets/js/catalog.js`: carta y datos de contacto.
- `assets/js/app.js`: carrito y armado del mensaje de WhatsApp.
- `assets/img/`: logo, íconos, imagen para compartir y fotos de productos.
