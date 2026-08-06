import { resolvePrecioVenta } from "./CreateNotaVenta";

describe("resolvePrecioVenta", () => {
  const productos = [
    { productoId: "p1", precioActual: 280 },
    { productoId: "p2", precioActual: 3.5 },
    { productoId: "p3", nombre: "Sin precio registrado" },
  ];

  test("returns precioActual when the product is found (spec scenario 1)", () => {
    expect(resolvePrecioVenta(productos, "p1")).toBe(280);
  });

  test("returns a decimal precioActual for a different product", () => {
    expect(resolvePrecioVenta(productos, "p2")).toBe(3.5);
  });

  test("returns empty string for an unknown product id", () => {
    expect(resolvePrecioVenta(productos, "id-inexistente")).toBe("");
  });

  test("returns empty string for an empty product id", () => {
    expect(resolvePrecioVenta(productos, "")).toBe("");
  });

  test("returns empty string, never 0, when the product has no precioActual (spec scenario 2)", () => {
    expect(resolvePrecioVenta(productos, "p3")).toBe("");
  });
});
