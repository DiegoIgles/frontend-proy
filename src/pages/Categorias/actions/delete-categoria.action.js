import cyborgApi from '../../../api/cyborg-api';

export const deleteCategoriaAction = async (id) => {
  await cyborgApi.delete(`/inventario/categorias/${id}`);
};
