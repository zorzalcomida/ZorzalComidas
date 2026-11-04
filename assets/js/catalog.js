/* =====================================================================
   CATÁLOGO DE EL ZORZAL
   Este es el único archivo que necesitás tocar para cambiar la carta.

   Datos de contacto
   - whatsapp:      número con código de país, sin "+" ni espacios (Argentina: 549 + característica + número)
   - whatsappShow:  cómo se muestra el número en la página
   - instagram:     usuario de Instagram, sin "@". Dejalo vacío ('') para ocultar el link.

   Cada producto
   - id:     nombre interno, sin espacios y único (no se muestra)
   - name:   nombre que ve el cliente
   - desc:   descripción corta
   - cat:    categoría: 'pastas', 'donas', 'pizzetas' u 'otros'
   - units:  cómo se vende: ['unidad','docena'], ['unidad'] o ['docena']
   - img:    foto, dentro de assets/img/products/ (si no tiene foto, se muestra un dibujo)
   - alt:    texto que describe la foto (accesibilidad)
   - hidden: true para ocultarlo sin borrarlo

   El orden de la lista es el orden en que aparecen en la tienda.
   ===================================================================== */
window.ZORZAL = {
  whatsapp: '5492474670460',
  whatsappShow: '2474-670460',
  instagram: 'elzorzal_elaboracion',

  products: [
    {
      id: 'p-sorr-jqr',
      name: 'Sorrentinos de jamón, queso y ricota',
      desc: 'Pasta rellena de jamón, queso y ricota, elaborada a mano.',
      cat: 'pastas', units: ['unidad', 'docena'],
      img: 'assets/img/products/sorrentinos.jpg',
      alt: 'Sorrentinos caseros sobre una mesa enharinada',
      hidden: false
    },
    {
      id: 'p-sorr-verd',
      name: 'Sorrentinos de verdura',
      desc: 'Pasta rellena de verdura, elaborada a mano.',
      cat: 'pastas', units: ['unidad', 'docena'],
      img: 'assets/img/products/sorrentinos.jpg',
      alt: 'Sorrentinos caseros sobre una mesa enharinada',
      hidden: false
    },
    {
      id: 'p-cane-vr',
      name: 'Canelones de verdura y ricota',
      desc: 'Canelones rellenos de verdura y ricota.',
      cat: 'pastas', units: ['unidad', 'docena'],
      img: 'assets/img/products/canelones.jpg',
      alt: 'Canelones caseros recién hechos',
      hidden: false
    },
    {
      id: 'p-fideos',
      name: 'Fideos al huevo',
      desc: 'Fideos al huevo de elaboración artesanal.',
      cat: 'pastas', units: ['unidad', 'docena'],
      img: '',   /* todavía sin foto: cuando la tengas, subila a assets/img/products/ y poné acá su ruta */
      alt: '',
      hidden: false
    },
    {
      id: 'p-donas-d',
      name: 'Donas dulces',
      desc: 'Donas artesanales dulces, para cualquier momento del día.',
      cat: 'donas', units: ['unidad', 'docena'],
      img: 'assets/img/products/donas-dulces.jpg',
      alt: 'Donas dulces con crema, frutillas y durazno',
      hidden: false
    },
    {
      id: 'p-donas-s',
      name: 'Donas saladas',
      desc: 'Donas artesanales saladas, ideales para compartir.',
      cat: 'donas', units: ['unidad', 'docena'],
      img: 'assets/img/products/donas-saladas.jpg',
      alt: 'Donas saladas con jamón y queso',
      hidden: false
    },
    {
      id: 'p-pizz-solas',
      name: 'Pizzetas solas',
      desc: 'Pizzetas artesanales listas para disfrutar.',
      cat: 'pizzetas', units: ['unidad', 'docena'],
      img: 'assets/img/products/pizzetas-solas.jpg',
      alt: 'Pizzetas doradas con salsa y orégano',
      hidden: false
    },
    {
      id: 'p-pizz-hornear',
      name: 'Pizzetas listas para hornear',
      desc: 'Prepizzas para hornear en casa.',
      cat: 'pizzetas', units: ['unidad', 'docena'],
      img: 'assets/img/products/pizzetas-hornear.jpg',
      alt: 'Pizzetas crudas con jamón, queso y orégano, listas para hornear',
      hidden: false
    }
  ]
};
