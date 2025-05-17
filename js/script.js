// Espera a que el DOM se cargue completamente antes de ejecutar el script
document.addEventListener("DOMContentLoaded", function() {
  
  // Definición de categorías
  const categorias = [
     "Acciones",
    "Agricultura",
    "Animales",
    "Cantidad",
    "Casa",
    "Comida y Bebida",
    "Conocimiento",
    "Cuerpo Humano",
    "Emociones",
    "Leyes",
    "Lenguaje",
    "Mesoamerica",
    "Milicia",
    "Modernidad",
    "Movimiento",
    "Mundo Fisico",
    "Numeros",
    "Parentesco",
    "Posesion",
    "Relaciones Espaciales",
    "Religion",
    "Ropa y Cuidado Personal",
    "Sociedad",
    "Tiempo"
  ];
  const categoriasTraducciones = {
  "Cantidad": "Traduce a tu lengua",
"Sociedad": "Traduce a tu lengua",
"Lenguaje": "Traduce a tu lengua",
"Leyes": "Traduce a tu lengua",
"Religion": "Traduce a tu lengua",
"Mundo Fisico": "Traduce a tu lenguaa",
"Ropa y Cuidado Personal": "Traduce a tu lengua",
"Conocimiento": "Traduce a tu lengua",
"Milicia": "Traduce a tu lengua",
"Agricultura": "Traduce a tu lengua",
"Emociones": "Traduce a tu lengua",
"Numeros": "Traduce a tu lengua",
"Movimiento": "Traduce a tu lengua",
"Posesion": "Traduce a tu lengua",
"Relaciones Espaciales": "Traduce a tu lengua",
"Cuerpo Humano": "Traduce a tu lengua",
"Mesoamerica": "Traduce a tu lengua",
"Acciones": "Traduce a tu lengua",
"Comida y Bebida": "Traduce a tu lengua",
"Modernidad": "Traduce a tu lengua",
"Tiempo": "Traduce a tu lengua",
"Animales": "Traduce a tu lengua",
"Casa": "Traduce a tu lengua",
"Parentesco": "Traduce a tu lengua"
  };

  // Variables de estado
  let palabras = []; // Almacenará todas las palabras del diccionario
  let palabrasFiltradas = []; // Palabras filtradas por categoría
  let categoriaActual = null; // Categoría seleccionada actualmente
  let idiomaActual = "espanol"; // Idioma seleccionado actualmente (español por defecto)
  let paginaActual = 1; // Página actual para la paginación
  const palabrasPorPagina = 10; // Número de palabras por página
  
  // Definir las rutas base para las imágenes
  const BASE_IMAGE_URL = "img/";
  const PLACEHOLDER_URL = BASE_IMAGE_URL + "placeholder.png";

  // Referencias a elementos del DOM
  const categoriesContainer = document.querySelector('.categories-container');
  const galleryHeader = document.getElementById('gallery-header');
  const galleryContent = document.getElementById('gallery-content');
  const galleryPagination = document.getElementById('gallery-pagination');
  const espanolBtn = document.getElementById('espanol-btn');
  const lenguaBtn = document.getElementById('lengua-btn');
  const categoryPrompt = document.getElementById('category-prompt');

  // Objeto con traducciones de la interfaz en español y lengua
  const traducciones = {
    titulo: {
      espanol: "Diccionario Ilustrado Español-tu lengua",
      lengua: "Traduce a tu lengua"
    },
    idioma: {
      espanol: "Español",
      lengua: "Traduce a tu lengua"
    },
    seleccionaCategoria: {
      espanol: "Selecciona la categoría que quieres explorar:",
      lengua: "Traduce a tu lengua:"
    },
    noHayPalabras: {
      espanol: "No hay palabras en esta categoría.",
      lengua: "Traduce a tu lengua."
    },
     instrucciones: {
      espanol: "Instrucciones:",
      lengua: "Traduce a tu lengua"
    },
    instruccion1: {
      espanol: "1. Selecciona el idioma en el que deseas buscar.",
      lengua: "1. Traduce a tu lengua."
    },
    instruccion2: {
      espanol: "2. Selecciona un eje temático.",
      lengua: "2. Traduce a tu lengua."
    },
    instruccion3: {
      espanol: "3. Puedes moverte entre página presionando los botones numerados por categoria.",
      lengua: "3. Traduce a tu lengua."
    },
  instruccion4: {
      espanol: '4. Si deseas sugerir correcciones u observaciones, puedes mandar un mensaje a <a href="https://www.facebook.com/Ualth.MeintHzz"> @Ualth.MeintHz</a>.',
      lengua: '4. Traduce a tu lengua <a href="https://www.facebook.com/Ualth.MeintHz"> @Ualth.MeintHz</a>.'
    },
    anterior: {
      espanol: "Anterior",
      lengua: "Traduce a tu lengua"
    },
    siguiente: {
      espanol: "Siguiente",
      lengua: "Traduce a tu lengua"
    },
    pagina: {
      espanol: "Página",
      lengua: "Traduce a tu lengua"
    },
    de: {
      espanol: "de",
      lengua: "Traduce a tu lengua"
    },
    footer: {
      espanol: 'Esta es la versión 1.0, un diccionario ilustrado español-lengua organizado por categorías. Es un proyecto libre, replicable sin fines de lucro. Todas las imagenes del diccionario son de uso abierto y gratuito del Banco de imágenes PalabraxPalabra. Laboratorio de Literacidad y Bilingüismo. Facultad de Filosofía. Universidad Autónoma de Querétaro. Traducciones pueden realizarse bajo la licencia <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es" target="_blank" style="color:#3182ce;">CC BY-NC-SA 4.0</a>.',
      lengua: 'Traduce a tu lengua 1.0. Traduce a tu lengua. Traduce a tu lengua. Traduce a tu lengua PalabraxPalabra. Laboratorio de Literacidad y Bilingüismo. Facultad de Filosofía. Universidad Autónoma de Querétaro. Traduce a tu lengua <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es" target="_blank" style="color:#3182ce;">CC BY-NC-SA 4.0</a>.'
    }
  };

  // Función para normalizar texto (eliminar acentos y caracteres especiales)
  function normalizarTexto(texto) {
    if (!texto) return '';
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Elimina acentos
      .toLowerCase();
  }

  // Función para cargar el corpus de palabras
  function cargarPalabras() {
    fetch("data/corpus.json")
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) {
          console.error("El archivo JSON no contiene un array o está vacío:", data);
          return;
        }
        palabras = data;
        console.log("Diccionario cargado:", palabras.length);
        // Inicializa la interfaz
        crearBotonesCategorias();
        actualizarIdiomaInterfaz(idiomaActual);
      })
      .catch(error => {
        console.error("Error al cargar el corpus.json:", error);
        galleryContent.innerHTML = `<p class="error">Error al cargar el diccionario.</p>`;
      });
  }

  // Función para crear los botones de categorías
  function crearBotonesCategorias() {
    categoriesContainer.innerHTML = '';
    categorias.forEach(categoria => {
      const btn = document.createElement('div');
      btn.className = 'category-btn';
      btn.dataset.categoria = categoria; // Guardamos la categoría original como atributo
      btn.textContent = idiomaActual === "espanol" ? categoria : categoriasTraducciones[categoria];
      btn.addEventListener('click', () => seleccionarCategoria(categoria));
      categoriesContainer.appendChild(btn);
    });
  }

  // Función para seleccionar una categoría
  function seleccionarCategoria(categoria) {
    // Actualiza la UI para mostrar la categoría seleccionada
    document.querySelectorAll('.category-btn').forEach(btn => {
      if (btn.dataset.categoria === categoria) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    categoriaActual = categoria;
    paginaActual = 1; // Reinicia la paginación
    
    // Filtra las palabras por la categoría seleccionada
    palabrasFiltradas = palabras.filter(palabra => 
      palabra.categoria && palabra.categoria.toLowerCase() === categoria.toLowerCase()
    );
    
    // Muestra las palabras filtradas
    mostrarPalabras();
  }

  // Función para mostrar las palabras en la galería
  function mostrarPalabras() {
    // Muestra el encabezado de la categoría
    galleryHeader.textContent = idiomaActual === "espanol" ? 
      categoriaActual : 
      categoriasTraducciones[categoriaActual];
    
    // Si no hay palabras en la categoría seleccionada
    if (palabrasFiltradas.length === 0) {
      galleryContent.innerHTML = `<div class="no-words-message">${traducciones.noHayPalabras[idiomaActual]}</div>`;
      galleryPagination.innerHTML = '';
      return;
    }

    // Calcula índices para la paginación
    const inicio = (paginaActual - 1) * palabrasPorPagina;
    const fin = Math.min(inicio + palabrasPorPagina, palabrasFiltradas.length);
    const palabrasPagina = palabrasFiltradas.slice(inicio, fin);
    
    // Limpia el contenedor de la galería
    galleryContent.innerHTML = '';
    
    // Crea una tarjeta para cada palabra
    palabrasPagina.forEach(palabra => {
      const card = document.createElement('div');
      card.className = 'word-card';
      
      // Normaliza el nombre de la imagen (quita acentos)
      const nombreImagen = normalizarTexto(palabra.espanol);
      
      // Crea y configura el contenedor de la imagen
      const imageContainer = document.createElement('div');
      imageContainer.className = 'word-image';
      
      // Crea y configura la imagen
      const img = document.createElement('img');
      img.src = BASE_IMAGE_URL + nombreImagen + '.png';
      img.alt = palabra.espanol;
      
      // Configura el manejo de errores para la imagen
      img.onerror = function() {
        console.log("Error cargando imagen:", this.src);
        this.onerror = null;
        this.src = PLACEHOLDER_URL;
      };
      
      // Agrega la imagen al contenedor
      imageContainer.appendChild(img);
      card.appendChild(imageContainer);
      
      // Crea y configura el contenedor de detalles
      const detailsContainer = document.createElement('div');
      detailsContainer.className = 'word-details';
      
      // Agrega la palabra primaria según el idioma seleccionado
      const primaryWord = document.createElement('div');
      primaryWord.className = 'word-primary';
      primaryWord.textContent = palabra[idiomaActual === "espanol" ? "espanol" : "lengua"];
      detailsContainer.appendChild(primaryWord);
      
      // Agrega la palabra secundaria según el idioma seleccionado
      const secondaryWord = document.createElement('div');
      secondaryWord.className = 'word-secondary';
      
      if (idiomaActual === "espanol") {
        const langLabel = document.createElement('span');
        langLabel.className = 'lang-label';
        langLabel.textContent = 'lengua: ';
        secondaryWord.appendChild(langLabel);
        secondaryWord.appendChild(document.createTextNode(palabra.lengua));
      } else {
        const langLabel = document.createElement('span');
        langLabel.className = 'lang-label';
        langLabel.textContent = 'Español: ';
        secondaryWord.appendChild(langLabel);
        secondaryWord.appendChild(document.createTextNode(palabra.espanol));
      }
      
      detailsContainer.appendChild(secondaryWord);
      card.appendChild(detailsContainer);
      
      // Agrega la tarjeta al contenedor de la galería
      galleryContent.appendChild(card);
    });
    
    // Actualiza la paginación
    actualizarPaginacion();
  }

  // Función para actualizar la paginación
  function actualizarPaginacion() {
    const totalPaginas = Math.ceil(palabrasFiltradas.length / palabrasPorPagina);
    
    if (totalPaginas <= 1) {
      galleryPagination.innerHTML = '';
      return;
    }
    
    let paginacionHtml = '';
    
    // Botón Anterior
    const anteriorDisabled = paginaActual === 1 ? 'disabled' : '';
    paginacionHtml += `<button class="pagination-btn ${anteriorDisabled}" ${anteriorDisabled} data-page="prev">${traducciones.anterior[idiomaActual]}</button>`;
    
    // Páginas numeradas
    const maxPaginasMostradas = 5;
    let startPage = Math.max(1, paginaActual - Math.floor(maxPaginasMostradas / 2));
    let endPage = Math.min(totalPaginas, startPage + maxPaginasMostradas - 1);
    
    if (endPage - startPage + 1 < maxPaginasMostradas) {
      startPage = Math.max(1, endPage - maxPaginasMostradas + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      const active = i === paginaActual ? 'active' : '';
      paginacionHtml += `<button class="pagination-btn ${active}" data-page="${i}">${i}</button>`;
    }
    
    // Botón Siguiente
    const siguienteDisabled = paginaActual === totalPaginas ? 'disabled' : '';
    paginacionHtml += `<button class="pagination-btn ${siguienteDisabled}" ${siguienteDisabled} data-page="next">${traducciones.siguiente[idiomaActual]}</button>`;
    
    galleryPagination.innerHTML = paginacionHtml;
    
    // Agrega event listeners a los botones de paginación
    document.querySelectorAll('.pagination-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        if (this.hasAttribute('disabled')) return;
        
        const page = this.getAttribute('data-page');
        if (page === 'prev') {
          cambiarPagina(paginaActual - 1);
        } else if (page === 'next') {
          cambiarPagina(paginaActual + 1);
        } else {
          cambiarPagina(parseInt(page));
        }
      });
    });
  }

  // Función para cambiar de página
  function cambiarPagina(nuevaPagina) {
    paginaActual = nuevaPagina;
    mostrarPalabras();
    // Desplaza hacia arriba para mostrar las nuevas palabras
    galleryHeader.scrollIntoView({ behavior: 'smooth' });
  }

  // Función para generar un color basado en una palabra
  function generarColorPorPalabra(palabra) {
    let hash = 0;
    for (let i = 0; i < palabra.length; i++) {
      hash = palabra.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Genera colores pastel suaves
    const h = hash % 360;
    return `hsl(${h}, 70%, 85%)`;
  }

  // Función para actualizar el idioma de la interfaz
  function actualizarIdiomaInterfaz(idioma) {
    idiomaActual = idioma;
    // Si hay una categoría seleccionada, actualiza la visualización
    document.querySelectorAll('.category-btn').forEach(btn => {
      const categoriaOriginal = btn.dataset.categoria;
      btn.textContent = idioma === "espanol" ? 
        categoriaOriginal : 
        categoriasTraducciones[categoriaOriginal];
    });
    // Actualiza todos los textos estáticos de la interfaz
    document.getElementById('titulo').textContent = traducciones.titulo[idioma];
    document.getElementById('category-prompt').textContent = traducciones.seleccionaCategoria[idioma];
    document.getElementById('titulo-instrucciones').textContent = traducciones.instrucciones[idioma];
    document.getElementById('instruccion1').textContent = traducciones.instruccion1[idioma];
    document.getElementById('instruccion2').textContent = traducciones.instruccion2[idioma];
    document.getElementById('instruccion3').textContent = traducciones.instruccion3[idioma];
    document.getElementById("instruccion4").innerHTML = traducciones.instruccion4[idioma];
    document.getElementById('footer-info').innerHTML = traducciones.footer[idioma];
    // Actualiza los botones de idioma
    espanolBtn.textContent = traducciones.idioma["espanol"];
    lenguaBtn.textContent = traducciones.idioma["lengua"];
    
    // Quita la clase activa de ambos botones
    espanolBtn.classList.remove('active');
    lenguaBtn.classList.remove('active');
    
    // Añade la clase activa al botón del idioma seleccionado
    if (idioma === "espanol") {
      espanolBtn.classList.add('active');
    } else {
      lenguaBtn.classList.add('active');
    }
    
    // Si hay una categoría seleccionada, actualiza la visualización
    if (categoriaActual) {
      mostrarPalabras();
    }
  }

  // Event listeners para la interacción con el usuario
  espanolBtn.addEventListener('click', function() {
    actualizarIdiomaInterfaz("espanol");
  });

  lenguaBtn.addEventListener('click', function() {
    actualizarIdiomaInterfaz("lengua");
  });

  // Inicializa la carga de palabras
  cargarPalabras();
});