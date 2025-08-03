// Función global para ir a una sección específica
function irASeccion(id) {
    const destino = document.getElementById(id);
    
    if (destino) {
        destino.scrollIntoView({ behavior: 'smooth' });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    // Obtener todas las secciones que queremos resaltar
    const secciones = document.querySelectorAll('.temporada, .contenido-principal, .parrafo');
    
    // Función para resaltar una sección
    function resaltarSeccion(seccion) {
        // Cambiar el fondo de la sección
        seccion.style.backgroundColor = '#FFD700'; // Dorado
        seccion.style.border = '3px solid #FF6B35'; // Borde naranja
        seccion.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.7)'; // Sombra dorada
        seccion.style.transform = 'scale(1.02)'; // Ligeramente más grande
        seccion.style.transition = 'all 0.3s ease'; // Transición suave
    }
    
    // Función para quitar el resaltado
    function quitarResaltado(seccion) {
        // Restaurar estilos originales
        seccion.style.backgroundColor = '';
        seccion.style.border = '';
        seccion.style.boxShadow = '';
        seccion.style.transform = '';
    }
    
    // Agregar eventos a cada sección
    secciones.forEach(function(seccion) {
        
        // Cuando el mouse entra a la sección
        seccion.addEventListener('mouseenter', function() {
            resaltarSeccion(this);
        });
        
        // Cuando el mouse sale de la sección
        seccion.addEventListener('mouseleave', function() {
            quitarResaltado(this);
        });
    });

});
