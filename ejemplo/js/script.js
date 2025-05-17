// Espera a que el DOM se cargue completamente antes de ejecutar el script
document.addEventListener("DOMContentLoaded", function() {

  // Inicializa un array vacío para almacenar los datos del diccionario
  let diccionario = [];

  // Realiza una petición fetch para cargar el archivo JSON con el corpus lingüístico
  fetch("data/corpus.json")
    .then(response => {
      // Verifica si la respuesta HTTP es correcta
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json(); // Convierte la respuesta a formato JSON
    })
    .then(data => {
      // Verifica que los datos sean un array no vacío
      if (!Array.isArray(data) || data.length === 0) {
        console.error("El archivo JSON no contiene un array o está vacío:", data);
        return;
      }
      // Asigna los datos al diccionario
      diccionario = data;
      console.log("Diccionario cargado:", diccionario.length);
      // Establece el idioma predeterminado como español
      cambiarIdioma("espanol");
    })
    .catch(error => {
      // Maneja errores en la carga del archivo
      console.error("Error al cargar el corpus.json:", error);
      resultsDiv.innerHTML = `<p class="error">Error al cargar el diccionario.</p>`;
    });

  // Objeto con traducciones de la interfaz en español y zapoteco
  const traducciones = {
    titulo: {
      espanol: "Diccionario Español-Zapoteco ",
      zapoteco: "Guiats diidx Dishtiil-Ditsa "
    },
    buscarEspanol: {
      espanol: "Buscar en Español",
      zapoteco: "Guiliu Dishtiil"
    },
    buscarZapoteco: {
      espanol: "Buscar en Zapoteco",
      zapoteco: "Guiliu Ditsa"
    },
    buscar: {
      espanol: "Buscar",
      zapoteco: "Kiliu"
    },
    instrucciones: {
      espanol: "Instrucciones:",
      zapoteco: "Shini gakna"
    },
    instruccion1: {
      espanol: "1. Selecciona el idioma en el que deseas buscar.",
      zapoteco: "1. Bcua loa shi diidx kiliu diidx ni rcadsu."
    },
    instruccion2: {
      espanol: "2. Escribe la palabra en el campo de búsqueda.",
      zapoteco: "2. Bcua diidx ni rcadsu gakbæu rikloani rcaa diidx."
    },
    instruccion3: {
      espanol: "3. Haz clic en \"Buscar\" o presiona Enter.",
      zapoteco: "3. Bkitsna loa \"Kiliu\" y bkitsnasa Enter."
    },
  instruccion4: {
      espanol: '4. Si deseas sugerir correcciones u observaciones, puedes mandar un mensaje a <a href="https://www.facebook.com/Ualth.MeintHzz"> @Ualth.MeintHz</a>.',
      zapoteco: '4. Bal rsobu eitsikti rcaa diidx ni bdxælu, sak lakdanu shini rsobu rcani lo <a href="https://www.facebook.com/Ualth.MeintHz"> @Ualth.MeintHz</a>.'
    },
    placeholderBusqueda: {
      espanol: "Escribe una palabra en español...",
      zapoteco: "Ræ cuau diidx ni rcadsu kiliu..."
    },
    resultadosTexto: {
      espanol: "Los resultados de la búsqueda aparecerán aquí.",
      zapoteco: "Ræ rica diidx ni kiliu."
    },
    traduccionEtiqueta: {
      espanol: "Zapoteco:",
      zapoteco: "Dishtiil:"
    },
    noResultados: {
      espanol: "No se encontraron resultados para tu búsqueda.",
      zapoteco: "Eit ndxælu diidx ni bcuauga."
    },
    ingresaPalabra: {
      espanol: "Por favor, ingresa una palabra para buscar.",
      zapoteco: "Rcasda ni cuau tuib diidx par kiliu."
    },
    caracteresEspeciales: {
      espanol: "Letras del zapoteco:",
      zapoteco: "Lætr ditsaa:"
    },
    footer: {
      espanol: 'Esta es la versión 0.1. cuenta con 2400 palabras en español y zapoteco sin definiciones. Es un proyecto libre, replicable sin fines de lucro. Traducciones pueden realizarse bajo la licencia <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es">CC BY-NC-SA 4.0 </a>.',
      zapoteco: 'Bersioin 0.1. Caa 2400 diidx ditsa ni dishtiil riedxdru ca shisaloaga cat toana. Ligaa nak ndæ, sak guniuna par shtidxu naksi touna. Bal chadidxuna napni ni gakni pur liceins <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es">CC BY-NC-SA 4.0 </a>.'
    }
  };

  // Variables de control de la interfaz
  let buscarEnEspanol = true; // Por defecto se busca en español
  let lenguajeActual = "espanol"; // Idioma actual de la interfaz
  
  // Referencias a elementos del DOM
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const resultsDiv = document.getElementById('results');
  const espanolBtn = document.getElementById('espanol-btn');
  const zapotecoBtn = document.getElementById('zapoteco-btn');
  const resultadosTexto = document.getElementById('resultados-texto');

  // Función para crear botones de caracteres especiales del zapoteco
  function crearBotonesEspeciales() {
    let specialCharsContainer = document.getElementById('special-chars-container');
    if (!specialCharsContainer) {
      // Crea un contenedor para los botones si no existe
      specialCharsContainer = document.createElement('div');
      specialCharsContainer.id = 'special-chars-container';
      specialCharsContainer.className = 'special-chars-container';

      // Agrega título para la sección de caracteres especiales
      const titulo = document.createElement('div');
      titulo.className = 'special-chars-title';
      titulo.id = 'special-chars-title';
      specialCharsContainer.appendChild(titulo);

      // Crea un contenedor para los botones
      const buttonsDiv = document.createElement('div');
      buttonsDiv.className = 'special-chars-buttons';

      // Botón para el carácter "æ"
      const btnAe = document.createElement('button');
      btnAe.type = 'button';
      btnAe.textContent = 'æ';
      btnAe.addEventListener('click', function() {
        insertAtCursor(searchInput, 'æ');
      });

      // Botón para el apóstrofe
      const btnApostrofe = document.createElement('button');
      btnApostrofe.type = 'button';
      btnApostrofe.textContent = '\'';
      btnApostrofe.addEventListener('click', function() {
        insertAtCursor(searchInput, '\'');
      });

      // Añade los botones al contenedor
      buttonsDiv.appendChild(btnAe);
      buttonsDiv.appendChild(btnApostrofe);
      specialCharsContainer.appendChild(buttonsDiv);

      // Inserta el contenedor de caracteres especiales después del campo de búsqueda
      const searchBox = document.querySelector('.search-box');
      searchBox.parentNode.insertBefore(specialCharsContainer, searchBox.nextSibling);
    }
    // Actualiza la visibilidad de los botones según el idioma seleccionado
    actualizarVisibilidadBotones();
  }

  // Función para mostrar u ocultar los botones de caracteres especiales
  function actualizarVisibilidadBotones() {
    const specialCharsContainer = document.getElementById('special-chars-container');
    if (specialCharsContainer) {
      // Muestra los botones solo cuando se busca en zapoteco
      specialCharsContainer.style.display = buscarEnEspanol ? 'none' : 'block';
      document.getElementById('special-chars-title').textContent = traducciones.caracteresEspeciales[lenguajeActual];
    }
  }

  // Función para cambiar el idioma de la interfaz
  function cambiarIdioma(idioma) {
    lenguajeActual = idioma;

    // Actualiza todos los textos de la interfaz según el idioma seleccionado
    document.getElementById('titulo').textContent = traducciones.titulo[idioma];
    espanolBtn.textContent = traducciones.buscarEspanol[idioma];
    zapotecoBtn.textContent = traducciones.buscarZapoteco[idioma];
    searchBtn.textContent = traducciones.buscar[idioma];
    resultadosTexto.textContent = traducciones.resultadosTexto[idioma];
    searchInput.placeholder = traducciones.placeholderBusqueda[idioma];

    document.getElementById('titulo-instrucciones').textContent = traducciones.instrucciones[idioma];
    document.getElementById('instruccion1').textContent = traducciones.instruccion1[idioma];
    document.getElementById('instruccion2').textContent = traducciones.instruccion2[idioma];
    document.getElementById('instruccion3').textContent = traducciones.instruccion3[idioma];
    document.getElementById("instruccion4").innerHTML = traducciones.instruccion4[idioma];
    document.getElementById('footer-info').innerHTML = traducciones.footer[idioma];

    // Actualiza la visibilidad de los botones de caracteres especiales
    actualizarVisibilidadBotones();
  }

  // Función principal de búsqueda
  function buscarPalabra() {
    // Obtiene el término de búsqueda, lo normaliza y convierte a minúsculas
    const terminoBusqueda = searchInput.value.trim().toLowerCase();

    // Verifica si el campo de búsqueda está vacío
    if (terminoBusqueda === '') {
      resultsDiv.innerHTML = `<p>${traducciones.ingresaPalabra[lenguajeActual]}</p>`;
      return;
    }

    // Arrays para almacenar resultados
    let resultados = [];
    let coincidenciasExactas = []; // Palabras que coinciden exactamente
    let coincidenciasParciales = []; // Palabras que contienen el término de búsqueda

    // Busca en español o zapoteco según la configuración actual
    if (buscarEnEspanol) {
      diccionario.forEach(item => {
        if (item.espanol.toLowerCase() === terminoBusqueda) {
          coincidenciasExactas.push(item);
        } else if (item.espanol.toLowerCase().includes(terminoBusqueda)) {
          coincidenciasParciales.push(item);
        }
      });
    } else {
      diccionario.forEach(item => {
        if (item.zapoteco.toLowerCase() === terminoBusqueda) {
          coincidenciasExactas.push(item);
        } else if (item.zapoteco.toLowerCase().includes(terminoBusqueda)) {
          coincidenciasParciales.push(item);
        }
      });
    }

    // Combina resultados (primero las coincidencias exactas)
    resultados = [...coincidenciasExactas, ...coincidenciasParciales];
    mostrarResultados(resultados, coincidenciasExactas.length);
  }

  // Función para mostrar los resultados de la búsqueda
  function mostrarResultados(resultados, numExactos) {
    // Muestra mensaje si no hay resultados
    if (resultados.length === 0) {
      resultsDiv.innerHTML = `<p class="no-results">${traducciones.noResultados[lenguajeActual]}</p>`;
      return;
    }

    let html = '';

    // Genera el HTML para cada resultado
    resultados.forEach((item, index) => {
      const esCoincidenciaExacta = index < numExactos;
      const palabraActual = buscarEnEspanol ? item.espanol : item.zapoteco;
      const traduccionActual = buscarEnEspanol ? item.zapoteco : item.espanol;
      const tipoActual = item.tipo?.[lenguajeActual] || '';
      const definicionActual = item.definicion?.[lenguajeActual] || '';

      // Crea la estructura HTML para el resultado actual
      html += `
        <div class="word-item ${esCoincidenciaExacta ? 'exact-match' : ''}">
          <div class="word">${palabraActual}</div>
          <div class="type">${tipoActual}</div>
          <div class="translation"><strong>${traducciones.traduccionEtiqueta[lenguajeActual]}</strong> ${traduccionActual}</div>
          <div class="definition">${definicionActual}</div>
        </div>
      `;
    });

    // Actualiza el contenido del div de resultados
    resultsDiv.innerHTML = html;
  }

  // Función para insertar texto en la posición actual del cursor en un campo de entrada
  function insertAtCursor(input, textToInsert) {
    if (input.selectionStart !== undefined) {
      // Obtiene la posición actual del cursor
      const startPos = input.selectionStart;
      const endPos = input.selectionEnd;
      // Divide el texto actual y combina con el texto a insertar
      const textBefore = input.value.substring(0, startPos);
      const textAfter = input.value.substring(endPos);
      input.value = textBefore + textToInsert + textAfter;
      // Coloca el cursor después del texto insertado
      input.selectionStart = input.selectionEnd = startPos + textToInsert.length;
    } else {
      // Fallback para navegadores antiguos
      input.value += textToInsert;
    }
    // Enfoca el campo de entrada
    input.focus();
  }

  // Event listeners para la interacción con el usuario

  // Listener para el botón de búsqueda
  searchBtn.addEventListener('click', buscarPalabra);
  
  // Listener para detectar cuando el usuario presiona Enter en el campo de búsqueda
  searchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      buscarPalabra();
    }
  });

  // Listener para el botón de búsqueda en español
  espanolBtn.addEventListener('click', function() {
    buscarEnEspanol = true;
    cambiarIdioma("espanol");
  });

  // Listener para el botón de búsqueda en zapoteco
  zapotecoBtn.addEventListener('click', function() {
    buscarEnEspanol = false;
    cambiarIdioma("zapoteco");
  });

  // Atajos de teclado para insertar caracteres especiales del zapoteco
  searchInput.addEventListener('keydown', function(event) {
    if (!buscarEnEspanol) {
      if (event.key === 'f' || event.key === 'F') {
        event.preventDefault();
        insertAtCursor(searchInput, 'æ');
      } else if (event.key === 'j' || event.key === 'J') {
        event.preventDefault();
        insertAtCursor(searchInput, '\'');
      }
    }
  });

  // Inicializa los botones de caracteres especiales
  crearBotonesEspeciales();
});