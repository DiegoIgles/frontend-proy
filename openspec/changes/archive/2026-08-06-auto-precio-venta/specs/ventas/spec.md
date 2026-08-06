# ventas Specification

## Purpose

Covers the create-sale-note flow (`src/pages/ventas/CreateNotaVenta.jsx`). When the user selects a product in a detail line, the sale price field is auto-filled with that product's latest price so it does not have to be typed on every sale. The price comes from the product list already loaded from `GET /inventario/productos`, where the backend exposes `precioActual` (a number) as the latest `precio` row by max `fecha` (fixture: `src/pages/inventario/interfaces/listar-productos.response.json`).

## Requirements

### Requirement: Auto-fill sale price on product selection

When the user selects a product in a sale-note detail line, the system MUST auto-fill the `precioVenta` field with the selected product's `precioActual`.

The auto-fill MUST fire only when the selected product changes; re-selecting the SAME product MUST also overwrite the current value. The system MUST NOT make new API calls — the value MUST come from the product list already loaded from `GET /inventario/productos`. After auto-fill, the field MUST remain editable so the user can override the price per line, and a manual override SHALL persist until the product selection changes again. When the selected product has no registered price (no `precioActual`), the field MUST stay empty and MUST be typeable by the user; the system MUST NOT set the value to 0 (the DTO requires a positive number).

#### Scenario: Priced product fills the sale price field

- GIVEN the create-sale-note flow is open with the product list already loaded (`precioActual` as a number per product)
- WHEN the user selects a product that has a registered price in a detail line
- THEN the `precioVenta` field shows that product's `precioActual`
- AND no additional API call is made

#### Scenario: Product without a registered price leaves the field empty

- GIVEN the user selects a product with no registered price (no `precioActual`)
- WHEN the product selection changes
- THEN the `precioVenta` field stays empty
- AND the user can type a positive value manually

#### Scenario: Manual override persists until the product changes

- GIVEN a product was selected and `precioVenta` was auto-filled
- WHEN the user edits `precioVenta` manually (discount or override)
- THEN the typed value remains in the field while the same product stays selected

#### Scenario: Re-selecting the same product overwrites the price

- GIVEN a detail line has a product selected with a manually edited `precioVenta`
- WHEN the user re-selects the SAME product in that line
- THEN the `precioVenta` field is overwritten with the product's latest `precioActual`

#### Scenario: Changing quantity does not reset the price

- GIVEN a detail line has a product selected with an auto-filled or overridden `precioVenta`
- WHEN the user changes the line's quantity
- THEN the `precioVenta` value stays unchanged