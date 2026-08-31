import cyborgApi from '../../../api/cyborg-api';

export const getMarcaModelosAction    = async ()    => { const { data } = await cyborgApi.get('/inventario/marca-modelos');          return data; };
export const createMarcaModeloAction  = async (dto) => { const { data } = await cyborgApi.post('/inventario/marca-modelos', dto);     return data; };
export const deleteMarcaModeloAction  = async (id)  => { const { data } = await cyborgApi.delete(`/inventario/marca-modelos/${id}`); return data; };

// Reutiliza o crea marca, modelo y la combinación en una sola transacción del
// backend. Se manda marcaId cuando el usuario eligió una existente y
// marcaNombre cuando escribió una nueva; ídem para el modelo. Devuelve siempre
// la combinación —aunque ya existiera— más un `creado` que dice qué se dio de
// alta de verdad, para poder avisarlo en pantalla.
export const resolverMarcaModeloAction = async (dto) => {
  const { data } = await cyborgApi.post('/inventario/marca-modelos/resolver', dto);
  return data;
};
