import cyborgApi from '../../../api/cyborg-api';

export const getModelosAction      = async ()       => { const { data } = await cyborgApi.get('/inventario/modelos');             return data; };
export const createModeloAction    = async (dto)    => { const { data } = await cyborgApi.post('/inventario/modelos', dto);        return data; };
export const updateModeloAction    = async (id,dto) => { const { data } = await cyborgApi.patch(`/inventario/modelos/${id}`,dto);  return data; };
export const deleteModeloAction    = async (id)     => { const { data } = await cyborgApi.delete(`/inventario/modelos/${id}`);     return data; };
