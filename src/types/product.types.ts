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