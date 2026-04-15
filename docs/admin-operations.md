# Admin Operations (ERP Pre-Integration)

## Bulk Product Import Contract

Required CSV columns:

- `product_id`
- `variant_id`
- `sku`
- `category_level3_id`
- `material`
- `style`
- `usage_area`
- `stock`
- `country_code`
- `currency`
- `b2c_price`
- `b2b_price`
- `min_order_b2b`

## Country Rule Management

Each country entry is managed with:

- `currency`
- `delivery_days`
- `return_window_days`
- `logistics_type`

The same model powers both storefront rendering and checkout behavior.

## Manual Export / Import Flow

1. Export current stock/pricing snapshot.
2. Update in spreadsheet by buying team.
3. Validate required columns and value ranges.
4. Import updated file.
5. Keep import logs for rollback checks.

## Operational Notes

- B2C checkout uses direct pricing by country.
- B2B quote flow uses same cart items with account-specific pricing.
- ERP integration is intentionally deferred to phase 2; this document acts as bridge governance.

