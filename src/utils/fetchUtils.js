/**
 * Realiza una petición fetch con un timeout y un segundo backend de respaldo.
 * @param {string} endpoint - El path de la API (ej: "17.14")
 * @param {number} timeoutMs - Tiempo de espera antes de intentar con el segundo backend (default 5000ms)
 * @returns {Promise<Response>} - La respuesta del fetch exitoso.
 */
export const fetchWithFallback = async (endpoint, timeoutMs = 5000) => {
    const url1 = `${import.meta.env.VITE_BACKEND_URL1}/${endpoint}`;
    const url2 = `${import.meta.env.VITE_BACKEND_URL2 || import.meta.env.VITE_BACKEND_URL}/${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        console.log(`Intentando Backend 1: ${url1}`);
        const response = await fetch(url1, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Backend 1 respondió con error: ${response.status}`);
        }
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        
        // Si fue un aborto (timeout) o un error de red, intentamos con el backend 2
        console.warn(`Backend 1 falló o tardó demasiado (${error.name}). Intentando Backend 2: ${url2}`);
        
        try {
            const response2 = await fetch(url2);
            if (!response2.ok) {
                throw new Error(`Backend 2 también falló: ${response2.status}`);
            }
            return response2;
        } catch (error2) {
            console.error("Ambos backends fallaron:", error2);
            throw error2;
        }
    }
};
