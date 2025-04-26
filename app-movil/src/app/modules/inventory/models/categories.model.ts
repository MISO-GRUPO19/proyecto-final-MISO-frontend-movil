export const CATEGORY_IMAGES = {
    "Frutas y Verduras": "assets/categories/frutas-verduras.jpeg",
    "Carnes y Pescados": "assets/categories/carnes-pescados.jpg",
    "Lácteos y Huevos": "assets/categories/lacteos-huevos.jpg",
    "Panadería y Repostería": "assets/categories/panaderia.jpg",
    "Despensa": "assets/categories/despensa.jpg",
    "Bebidas": "assets/categories/bebidas.jpg",
    "Snacks y Dulces": "assets/categories/snacks.jpg",
    "Condimentos y Especias": "assets/categories/condimentos.jpg",
    "Productos de Limpieza": "assets/categories/limpieza.jpg",
    "Productos para Bebés": "assets/categories/bebes.jpg"
} as const;

export type AllowedCategory = keyof typeof CATEGORY_IMAGES;

export const ALLOWED_CATEGORIES = Object.keys(CATEGORY_IMAGES) as AllowedCategory[];
