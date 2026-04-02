create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null check (category in ('tops', 'bottoms', 'sets')),
  price integer not null check (price >= 0),
  sizes text[] not null default array['S', 'M'],
  colors text[] not null default array['black'],
  is_new boolean not null default false,
  is_active boolean not null default true,
  name_ua text not null,
  name_en text not null,
  description_ua text not null,
  description_en text not null,
  composition_ua text,
  composition_en text,
  care_ua text,
  care_en text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category);
create index if not exists products_is_active_idx on public.products(is_active);
create index if not exists products_is_new_idx on public.products(is_new);
create index if not exists product_images_product_id_idx on public.product_images(product_id);
create unique index if not exists product_images_product_position_idx on public.product_images(product_id, position);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

alter table public.products enable row level security;
alter table public.product_images enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
using (is_active = true);

drop policy if exists "Public can read product images" on public.product_images;
create policy "Public can read product images"
on public.product_images
for select
using (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
      and products.is_active = true
  )
);

insert into public.products (
  slug,
  category,
  price,
  sizes,
  colors,
  is_new,
  is_active,
  name_ua,
  name_en,
  description_ua,
  description_en,
  composition_ua,
  composition_en,
  care_ua,
  care_en
)
values
  (
    'drift-trousers',
    'bottoms',
    2000,
    array['S', 'M'],
    array['black', 'beige'],
    true,
    true,
    'Штани Drift',
    'Drift trousers',
    'Мʼякі прямі штани з вільною посадкою, які працюють як окрема річ і як база для спокійного повсякденного образу.',
    'Soft straight-leg trousers designed to work both as a standalone piece and as the base of a calm everyday uniform.',
    'Трикотаж на основі бавовни з мʼякою щільною фактурою.',
    'Substantial cotton-based knit with a soft, smooth hand feel.',
    'Прати навиворіт при 30°C на делікатному режимі. Сушити природним способом, не пересушувати.',
    'Wash inside out at 30°C on a delicate cycle. Air dry and avoid overdrying.'
  ),
  (
    'flow-zip-set',
    'sets',
    4000,
    array['S', 'M'],
    array['beige', 'black', 'gray'],
    true,
    true,
    'Костюм Flow Zip',
    'Flow Zip set',
    'Комплект на блискавці для днів, коли хочеться виглядати зібрано без жорсткого стилінгу.',
    'A zip-front set for days when you want to look put together without overstyling.',
    'Щільний бавовняний трикотаж із мʼякою внутрішньою поверхнею.',
    'Dense cotton knit with a soft inner surface.',
    'Прати при 30°C, застібнувши блискавку. Сушити горизонтально або на плічках, прасувати з вивороту.',
    'Wash at 30°C with the zip closed. Dry flat or on a hanger and iron inside out.'
  ),
  (
    'ease-tee',
    'tops',
    700,
    array['S', 'M'],
    array['white', 'black'],
    true,
    true,
    'Футболка Ease',
    'Ease tee',
    'Вільна футболка з мʼякою лінією плеча та спокійною посадкою. Добре працює як перший шар у комплекті й як окрема базова річ для щоденних образів.',
    'A relaxed T-shirt with a soft shoulder line and an easy fit. It works well as a first layer inside a set and as a standalone essential for everyday looks.',
    'Мʼякий щільний трикотаж на основі бавовни.',
    'Soft, substantial cotton-based jersey.',
    'Прати при 30°C у делікатному режимі. Сушити природним способом, прасувати з вивороту.',
    'Wash at 30°C on a delicate cycle. Air dry and iron inside out.'
  )
on conflict (slug) do nothing;

insert into public.product_images (product_id, url, position)
select
  products.id,
  seed.url,
  seed.position
from public.products
join (
  values
    ('drift-trousers', '/catalog/trousers/black-editorial.webp', 0),
    ('drift-trousers', '/catalog/trousers/beige-front.webp', 1),
    ('drift-trousers', '/catalog/trousers/beige-detail.webp', 2),
    ('drift-trousers', '/catalog/trousers/black-detail.webp', 3),
    ('flow-zip-set', '/catalog/zip-set/beige-main.webp', 0),
    ('flow-zip-set', '/catalog/zip-set/black-main.webp', 1),
    ('flow-zip-set', '/catalog/zip-set/beige-back.webp', 2),
    ('flow-zip-set', '/catalog/zip-set/beige-lifestyle.webp', 3),
    ('flow-zip-set', '/catalog/zip-set/black-detail.webp', 4),
    ('flow-zip-set', '/catalog/zip-set/graphite-detail.webp', 5),
    ('ease-tee', '/catalog/tee/white-main.webp', 0),
    ('ease-tee', '/catalog/tee/black-main.webp', 1),
    ('ease-tee', '/catalog/tee/white-detail.webp', 2),
    ('ease-tee', '/catalog/tee/black-back.webp', 3)
) as seed(slug, url, position)
  on seed.slug = products.slug
on conflict (product_id, position) do nothing;
