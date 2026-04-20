import cyborgApi from '../../../api/cyborg-api';

export const getMarcaModelosAction    = async ()    => { const { data } = await cyborgApi.get('/inventario/marca-modelos');          return data; };
export const createMarcaModeloAction  = async (dto) => { const { data } = await cyborgApi.post('/inventario/marca-modelos', dto);     return data; };
export const deleteMarcaModeloAction  = async (id)  => { const { data } = await cyborgApi.delete(`/inventario/marca-modelos/${id}`); return data; };
