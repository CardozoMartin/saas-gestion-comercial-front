import { api } from "../config";

interface Box {
  usuarioId: number;
  observaciones: string;
}

export const postOpenBoxFn = async (newBox: Box) => {
  console.log("Data sent to postOpenBoxFn:", newBox);
  try {
    const response = await api.post("/cajas/abrir", newBox);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const closeBoxFn = async (boxId: number, data: any) => {
  try {
    const res = await api.post(`/cajas/${boxId}/cerrar`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getBoxByUserFn = async (userId: number) => {
  try {
    const res = await api.get(`/cajas/usuario/${userId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getBoxDatailByUserFn = async (userId: number) => {
  try {
    const res = await api.get(`/cajas/cajas-abiertas-detalles/${userId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getVerifyOpenBoxByUserFn = async (userId: number) => {
  try {
    const res = await api.get(`/cajas/abierta/${userId}`);
    console.log("Response from getVerifyOpenBoxByUserFn:", res.data);
    return res.data;
  } catch (error) {
    console.log("Error in getVerifyOpenBoxByUserFn:", error);
    throw error;
  }
};
export const getBoxFn = async () => {
  try {
    const res = await api.get("/cajas/");
    return res.data;
  } catch (error) {
    throw error;
  }
};
