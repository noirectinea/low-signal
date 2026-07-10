begin;

insert into public.sizes (label, sort_order)
values ('XS', 10), ('S', 20), ('M', 30), ('L', 40), ('XL', 50)
on conflict (label) do update set sort_order = excluded.sort_order;

insert into public.products (
  id,
  slug,
  name,
  description,
  category,
  gender,
  collection_name,
  price,
  currency,
  status,
  color,
  material,
  primary_image,
  is_active,
  sort_order
)
values
  (
    'test-active-jacket',
    'test-active-jacket',
    'Test Active Jacket',
    'Backend test active product.',
    'Outerwear',
    'men',
    'Backend Test',
    180,
    'USD',
    'active',
    'Washed Black',
    'Cotton canvas',
    '/images/low-signal/products/product-01.jpg',
    true,
    9001
  ),
  (
    'test-active-pant',
    'test-active-pant',
    'Test Active Pant',
    'Backend test second active product.',
    'Trousers',
    'men',
    'Backend Test',
    140,
    'USD',
    'active',
    'Black',
    'Cotton twill',
    '/images/low-signal/selected-collection/trousers.jpg',
    true,
    9002
  ),
  (
    'test-inactive-product',
    'test-inactive-product',
    'Test Inactive Product',
    'Backend test inactive product.',
    'Outerwear',
    'men',
    'Backend Test',
    220,
    'USD',
    'archived',
    'Charcoal',
    'Wool blend',
    '/images/low-signal/products/product-10.jpg',
    false,
    9003
  )
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  category = excluded.category,
  gender = excluded.gender,
  collection_name = excluded.collection_name,
  price = excluded.price,
  currency = excluded.currency,
  status = excluded.status,
  color = excluded.color,
  material = excluded.material,
  primary_image = excluded.primary_image,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;

insert into public.product_images (product_id, image_url, alt, is_public, sort_order)
values
  ('test-active-jacket', '/images/low-signal/products/product-01.jpg', 'Test Active Jacket', true, 0),
  ('test-active-pant', '/images/low-signal/selected-collection/trousers.jpg', 'Test Active Pant', true, 0),
  ('test-inactive-product', '/images/low-signal/products/product-10.jpg', 'Test Inactive Product', true, 0)
on conflict (product_id, image_url) do update set
  alt = excluded.alt,
  is_public = excluded.is_public,
  sort_order = excluded.sort_order;

insert into public.product_variants (
  id,
  product_id,
  size_id,
  sku,
  color,
  material,
  price_override,
  status
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'test-active-jacket',
    (select id from public.sizes where label = 'M'),
    'TEST-JACKET-M',
    'Washed Black',
    'Cotton canvas',
    null,
    'active'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'test-active-jacket',
    (select id from public.sizes where label = 'L'),
    'TEST-JACKET-L',
    'Washed Black',
    'Cotton canvas',
    null,
    'active'
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'test-active-pant',
    (select id from public.sizes where label = 'M'),
    'TEST-PANT-M',
    'Black',
    'Cotton twill',
    null,
    'active'
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    'test-inactive-product',
    (select id from public.sizes where label = 'M'),
    'TEST-INACTIVE-PRODUCT-M',
    'Charcoal',
    'Wool blend',
    null,
    'active'
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    'test-active-pant',
    (select id from public.sizes where label = 'L'),
    'TEST-PANT-L-INACTIVE',
    'Black',
    'Cotton twill',
    null,
    'archived'
  ),
  (
    '66666666-6666-4666-8666-666666666666',
    'test-active-pant',
    (select id from public.sizes where label = 'S'),
    'TEST-PANT-S-LOW',
    'Black',
    'Cotton twill',
    null,
    'active'
  )
on conflict (id) do update set
  product_id = excluded.product_id,
  size_id = excluded.size_id,
  sku = excluded.sku,
  color = excluded.color,
  material = excluded.material,
  price_override = excluded.price_override,
  status = excluded.status;

insert into public.inventory (variant_id, stock, reserved)
values
  ('11111111-1111-4111-8111-111111111111', 10, 0),
  ('22222222-2222-4222-8222-222222222222', 8, 0),
  ('33333333-3333-4333-8333-333333333333', 7, 0),
  ('44444444-4444-4444-8444-444444444444', 5, 0),
  ('55555555-5555-4555-8555-555555555555', 5, 0),
  ('66666666-6666-4666-8666-666666666666', 1, 0)
on conflict (variant_id) do update set
  stock = excluded.stock,
  reserved = excluded.reserved,
  updated_at = now();

commit;
