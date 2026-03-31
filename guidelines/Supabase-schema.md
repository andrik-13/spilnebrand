# Supabase Schema

Use this shape when wiring the real backend:

## `products`

| column | type | notes |
|---|---|---|
| `id` | `uuid` | primary key |
| `slug` | `text` | unique |
| `price` | `integer` | UAH |
| `category` | `text` | `tops`, `bottoms`, `sets` |
| `sizes` | `text[]` | usually `S`, `M` |
| `is_new` | `boolean` | featured on home |
| `is_active` | `boolean` | visible in catalog |
| `images` | `text[]` | public URLs |
| `name_ua` | `text` | localized |
| `name_en` | `text` | localized |
| `description_ua` | `text` | localized |
| `description_en` | `text` | localized |
| `composition_ua` | `text` | localized |
| `composition_en` | `text` | localized |
| `care_ua` | `text` | localized |
| `care_en` | `text` | localized |
| `delivery_ua` | `text` | localized |
| `delivery_en` | `text` | localized |

## Notes

- keep product images public in Supabase Storage
- store full image URLs or generate them server-side
- UI expects only active products
- localized product records map through `src/app/lib/supabase.ts`
