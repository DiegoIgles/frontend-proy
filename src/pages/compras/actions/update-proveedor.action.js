import cyborgApi from '../../../api/cyborg-api';

export const updateProveedorAction = async (id, dto) => {
  const { data } = await cyborgApi.patch(`/compras/proveedores/${id}`, dto);
  return data;
};
