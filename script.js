/**
 * PUNTO 7: Documentación
 * Proyecto: Swiss Business Explorer (PWA)
 * Aprendiz: Aylin
 * API: TheNewsAPI (thenewsapi.com)
 * Descripción: Aplicación que utiliza 6 variantes de endpoints para filtrar 
 * noticias del sector económico en Suiza (locale: ch).
 */

const API_KEY = 'DbidcJkqkvTac8Nw3YOEs4abpY6TpCH4P5NP64Hx';

async function consultarAPI() {
    // PUNTO 2: Entrada de datos - Captura de valores de la interfaz
    const endpointValue = document.getElementById('endpointSelect').value;
    const fecha = document.getElementById('fechaInput').value;
    const contenedor = document.getElementById('resultados');

    // PUNTO 6: Manejo de errores - Feedback visual de carga
    contenedor.innerHTML = "<h3 style='color: #696568;'>⌛ Consultando servidores suizos...</h3>";

    // PUNTO 3: Realización de peticiones
    // Separamos el endpoint base (top/all) de los parámetros adicionales usando split
    const partes = endpointValue.split('&');
    const endpointBase = partes[0]; 
    
    // Construcción dinámica de la URL (locale=ch para Suiza)
    let url = `https://api.thenewsapi.com/v1/news/${endpointBase}?api_token=${API_KEY}&locale=ch&categories=business`;

    // Si el value del select contiene un '&', añadimos esa segunda parte como parámetro
    if (partes.length > 1) {
        url += `&${partes[1]}`;
    }

    // PUNTO 2: Parámetro dinámico de fecha
    if (fecha) {
        url += `&published_on=${fecha}`;
    }

    // Registro en consola para depuración (Punto 7)
    console.log("Petición enviada a: ", url);

    try {
        const response = await fetch(url);
        
        // PUNTO 6: Manejo de errores de respuesta de servidor (401, 404, 429)
        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo obtener la información.`);
        }

        const data = await response.json();

        // Validación de existencia de datos
        if (!data.data || data.data.length === 0) {
            contenedor.innerHTML = `
                <div class="error-msg">
                    No se encontraron noticias con estos filtros. 
                    Intenta cambiar la categoría o la fecha.
                </div>`;
            return;
        }

        // PUNTO 4: Procesamiento de la respuesta JSON
        contenedor.innerHTML = ""; // Limpiar mensaje de espera
        
        data.data.forEach(noticia => {
            // PUNTO 5: Presentación de resultados (HTML dinámico)
            const card = document.createElement('div');
            card.className = 'card';
            
            // Punto 4: Inclusión de imágenes con respaldo (fallback) si fallan
            card.innerHTML = `
                <img src="${noticia.image_url || 'https://via.placeholder.com/200x130?text=Swiss+News'}" 
                     alt="Noticia" 
                     onerror="this.src='https://via.placeholder.com/200x130?text=Sin+Imagen'">
                <div class="info">
                    <h3 style="margin:0; color:#222020;">${noticia.title}</h3>
                    <p style="font-size:0.9em; color:#444;">${noticia.snippet || 'Sin resumen disponible.'}</p>
                    <small><b>Fuente:</b> ${noticia.source.toUpperCase()} |  ${noticia.published_at.split('T')[0]}</small><br><br>
                    <a href="${noticia.url}" target="_blank" style="color:#696568; font-weight:bold; text-decoration:none;">
                        Leer noticia completa →
                    </a>
                </div>
            `;
            contenedor.appendChild(card);
        });

    } catch (error) {
        // PUNTO 6: Gestión de errores de conexión o excepciones
        contenedor.innerHTML = `
            <div class="error-msg">
                <b>⚠️ Error de Conexión:</b><br>
                ${error.message}<br>
                Posibles causas: API Key agotada o falta de internet.
            </div>`;
    }
}