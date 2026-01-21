export interface Product {
    codigo: string;
    nombre: string;
    descripcion: string;
    categoriaId: number;
    precioCosto: number;
    precioVenta: number;
    unidadMedidaId: number;
    fraccionable: boolean;
    stockMinimo: number;
    cantidadInicial: number;
}

export interface ProductUpdate extends Product {
    id: number;
}

interface ProductoDTO{
    id: number;
    codigo: string;
    nombre: string;
    precioVenta: number;
    stockActual: number;
    categoriaNombre?: string;
}