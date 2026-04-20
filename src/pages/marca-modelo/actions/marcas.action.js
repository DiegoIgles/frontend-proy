import cyborgApi from '../../../api/cyborg-api';

export const getMarcasAction       = async ()       => { const { data } = await cyborgApi.get('/inventario/marcas');            return data; };
export const getMarcaAction        = async (id)     => { const { data } = await cyborgApi.get(`/inventario/marcas/${id}`);      return data; };
export const createMarcaAction     = async (dto)    => { const { data } = await cyborgApi.post('/inventario/marcas', dto);       return data; };
export const updateMarcaAction     = async (id,dto) => { const { data } = await cyborgApi.patch(`/inventario/marcas/${id}`,dto); return data; };
export const deleteMarcaAction     = async (id)     => { const { data } = await cyborgApi.delete(`/inventario/marcas/${id}`);    return data; };
