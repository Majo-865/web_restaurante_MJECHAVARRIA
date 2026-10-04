// ==========================================
// CONEXIÓN ENTRE GOOGLE SHEETS Y MENÚ WEB
// ==========================================

const SHEET_ID = '1AYdd56ZDLm-gINBy5hTQAHGpbSxnk6pIuchGgH9geh4';

// Agregamos un timestamp (_t) para evitar que el navegador guarde en caché la respuesta vieja
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&_t=${new Date().getTime()}`;

document.addEventListener('DOMContentLoaded', () => {
    cargarDatosMenu();
});

async function cargarDatosMenu() {
    try {
        const respuesta = await fetch(SHEET_URL);
        const texto = await respuesta.text();
        
        // Extraemos el JSON limpio omitiendo el envoltorio de Google google.visualization.Query.setResponse(...)
        const inicioJson = texto.indexOf('{');
        const finJson = texto.lastIndexOf('}');
        
        if (inicioJson === -1 || finJson === -1) {
            console.error("No se pudo interpretar la respuesta de Google Sheets.");
            return;
        }

        const jsonLimpio = texto.substring(inicioJson, finJson + 1);
        const datos = JSON.parse(jsonLimpio);
        
        const filas = datos.table.rows;
        
        const productosPorCategoria = {
            frias: [],
            calientes: [],
            reposteria: []
        };

        // Recorremos las filas omitiendo los encabezados si los hay
        filas.forEach(fila => {
            if (!fila.c) return;

            // Leemos los valores de las celdas de forma segura
            const categoriaRaw = fila.c[0] ? (fila.c[0].v || fila.c[0].f || '') : '';
            const titulo = fila.c[1] ? (fila.c[1].v || fila.c[1].f || '') : '';
            const precio = fila.c[2] ? (fila.c[2].v || fila.c[2].f || '') : '';
            const descripcion = fila.c[3] ? (fila.c[3].v || fila.c[3].f || '') : '';

            const categoria = String(categoriaRaw).toLowerCase().trim();

            // Si es la fila de títulos de la tabla (ej. "categoria"), la ignoramos
            if (categoria === 'categoria' || categoria === 'categoría') return;

            if (productosPorCategoria[categoria]) {
                productosPorCategoria[categoria].push({
                    titulo: String(titulo),
                    precio: String(precio),
                    descripcion: String(descripcion)
                });
            }
        });

        // Actualizamos cada sección solo si obtuvimos datos
        renderizarCategoria('frias', productosPorCategoria.frias);
        renderizarCategoria('calientes', productosPorCategoria.calientes);
        renderizarCategoria('reposteria', productosPorCategoria.reposteria);

    } catch (error) {
        console.error('Error al cargar el menú desde Google Sheets:', error);
    }
}

function renderizarCategoria(categoriaKey, productos) {
    const contenedor = document.querySelector(`[data-category="${categoriaKey}"]`);
    
    if (!contenedor) return;

    if (productos && productos.length > 0) {
        contenedor.innerHTML = productos.map(item => `
            <div class="menu-item">
                <div class="item-header">
                    <h3 class="item-title">${item.titulo}</h3>
                    <span class="item-price">${item.precio}</span>
                </div>
                <p class="item-desc">${item.descripcion}</p>
            </div>
        `).join('');
    }
}