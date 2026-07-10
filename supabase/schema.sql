begin;

create extension if not exists pgcrypto;

do $$ begin
  create type public.product_gender as enum ('men', 'women', 'unisex');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.product_status as enum ('draft', 'active', 'archived');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.order_status as enum (
  'pending',
  'paid',
  'paid_demo',
  'processing',
  'packed',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
  'refunded_demo'
  );
exception when duplicate_object then null;
end $$;

alter type public.product_gender add value if not exists 'unisex';
alter type public.product_status add value if not exists 'draft';
alter type public.product_status add value if not exists 'active';
alter type public.product_status add value if not exists 'archived';
alter type public.order_status add value if not exists 'paid';
alter type public.order_status add value if not exists 'paid_demo';
alter type public.order_status add value if not exists 'processing';
alter type public.order_status add value if not exists 'packed';
alter type public.order_status add value if not exists 'shipped';
alter type public.order_status add value if not exists 'delivered';
alter type public.order_status add value if not exists 'cancelled';
alter type public.order_status add value if not exists 'refunded';
alter type public.order_status add value if not exists 'refunded_demo';

create table if not exists public.customers (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  phone text,
  default_country text,
  default_city text,
  default_address text,
  default_postal_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.customers add column if not exists full_name text;
alter table public.customers add column if not exists default_country text;
alter table public.customers add column if not exists default_city text;
alter table public.customers add column if not exists default_address text;
alter table public.customers add column if not exists default_postal_code text;

do $$ begin
  if not exists (
    select 1
    from pg_constraint
    where contype = 'f'
    and conrelid = 'public.customers'::regclass
    and confrelid = 'auth.users'::regclass
  ) then
    alter table public.customers
      add constraint customers_id_auth_users_fkey
      foreign key (id) references auth.users(id) on delete cascade
      not valid;
  end if;
end $$;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  slug text not null unique,
  name text not null,
  description text not null default '',
  category text not null,
  gender public.product_gender not null,
  collection_name text not null default 'Spring 2026',
  price integer not null check (price >= 0),
  currency text not null default 'USD' check (currency ~ '^[A-Z]{3}$'),
  status public.product_status not null default 'draft',
  color text,
  material text,
  primary_image text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products add column if not exists collection_name text not null default 'Spring 2026';
alter table public.products add column if not exists currency text not null default 'USD';
alter table public.products add column if not exists status public.product_status not null default 'draft';
alter table public.products add column if not exists material text;
update public.products
set status = case when is_active then 'active'::public.product_status else 'archived'::public.product_status end
where status is null or status = 'draft';

do $$ begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
    and table_name = 'products'
    and column_name = 'materials'
  ) then
    execute 'update public.products set material = coalesce(material, materials) where material is null';
  end if;
end $$;

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  image_url text not null,
  alt text,
  is_public boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (product_id, image_url)
);

alter table public.product_images add column if not exists is_public boolean not null default true;

create table if not exists public.sizes (
  id uuid primary key default gen_random_uuid(),
  label text not null unique,
  sort_order integer not null default 0
);

insert into public.sizes (label, sort_order)
values ('XS', 10), ('S', 20), ('M', 30), ('L', 40), ('XL', 50)
on conflict (label) do nothing;

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  size_id uuid not null references public.sizes(id),
  sku text unique,
  color text,
  material text,
  price_override integer check (price_override is null or price_override >= 0),
  status public.product_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, size_id)
);

create table if not exists public.inventory (
  variant_id uuid primary key references public.product_variants(id) on delete cascade,
  stock integer not null default 0 check (stock >= 0),
  reserved integer not null default 0 check (reserved >= 0),
  updated_at timestamptz not null default now(),
  check (stock >= reserved)
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete cascade,
  session_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (customer_id is not null or session_id is not null)
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  variant_id uuid references public.product_variants(id),
  product_id text references public.products(id) on delete cascade,
  size_label text,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cart_items add column if not exists variant_id uuid references public.product_variants(id);
create unique index if not exists cart_items_cart_variant_unique
  on public.cart_items(cart_id, variant_id)
  where variant_id is not null;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text,
  customer_id uuid references public.customers(id) on delete set null,
  customer_email text,
  customer_name text,
  phone text,
  shipping_country text,
  shipping_city text,
  shipping_address text,
  shipping_postal_code text,
  notes text,
  subtotal integer not null default 0 check (subtotal >= 0),
  shipping_total integer not null default 0 check (shipping_total >= 0),
  total integer not null default 0 check (total >= 0),
  currency text not null default 'USD' check (currency ~ '^[A-Z]{3}$'),
  status public.order_status not null default 'pending',
  idempotency_key text,
  idempotency_payload_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders add column if not exists order_number text;
alter table public.orders add column if not exists customer_email text;
alter table public.orders add column if not exists customer_name text;
alter table public.orders add column if not exists phone text;
alter table public.orders add column if not exists shipping_address text;
alter table public.orders add column if not exists shipping_total integer not null default 0;
alter table public.orders add column if not exists total integer not null default 0;
alter table public.orders add column if not exists currency text not null default 'USD';
alter table public.orders add column if not exists idempotency_key text;
alter table public.orders add column if not exists idempotency_payload_hash text;
alter table public.orders add column if not exists notes text;

do $$ begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
    and table_name = 'orders'
    and column_name = 'email'
  ) then
    execute 'alter table public.orders alter column email drop not null';
  end if;

end $$;

update public.orders
set order_number = 'LS-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))
where order_number is null;

do $$ begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
    and table_name = 'orders'
    and column_name = 'email'
  ) then
    execute 'update public.orders set customer_email = coalesce(customer_email, email) where customer_email is null';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
    and table_name = 'orders'
    and column_name = 'shipping_address_line1'
  ) then
    execute 'update public.orders set shipping_address = coalesce(shipping_address, shipping_address_line1) where shipping_address is null';
  end if;
end $$;

create unique index if not exists orders_order_number_unique on public.orders(order_number);
create unique index if not exists orders_idempotency_key_unique
  on public.orders(idempotency_key)
  where idempotency_key is not null;

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null references public.products(id),
  variant_id uuid references public.product_variants(id),
  product_name_snapshot text,
  product_slug_snapshot text,
  size_snapshot text,
  color_snapshot text,
  material_snapshot text,
  unit_price_snapshot integer check (unit_price_snapshot is null or unit_price_snapshot >= 0),
  currency_snapshot text not null default 'USD',
  quantity integer not null check (quantity > 0),
  line_total_snapshot integer check (line_total_snapshot is null or line_total_snapshot >= 0),
  created_at timestamptz not null default now()
);

alter table public.order_items add column if not exists variant_id uuid references public.product_variants(id);
alter table public.order_items add column if not exists product_name_snapshot text;
alter table public.order_items add column if not exists product_slug_snapshot text;
alter table public.order_items add column if not exists size_snapshot text;
alter table public.order_items add column if not exists color_snapshot text;
alter table public.order_items add column if not exists material_snapshot text;
alter table public.order_items add column if not exists unit_price_snapshot integer;
alter table public.order_items add column if not exists currency_snapshot text not null default 'USD';
alter table public.order_items add column if not exists line_total_snapshot integer;

do $$ begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
    and table_name = 'order_items'
    and column_name = 'product_name'
  ) then
    execute 'alter table public.order_items alter column product_name drop not null';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
    and table_name = 'order_items'
    and column_name = 'unit_price'
  ) then
    execute 'alter table public.order_items alter column unit_price drop not null';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
    and table_name = 'order_items'
    and column_name = 'total'
  ) then
    execute 'alter table public.order_items alter column total drop not null';
  end if;
end $$;

do $$ begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
    and table_name = 'order_items'
    and column_name = 'product_name'
  ) then
    execute '
      update public.order_items
      set
        product_name_snapshot = coalesce(product_name_snapshot, product_name),
        size_snapshot = coalesce(size_snapshot, size_label),
        unit_price_snapshot = coalesce(unit_price_snapshot, unit_price),
        line_total_snapshot = coalesce(line_total_snapshot, total)
    ';
  end if;
end $$;

create index if not exists products_status_sort_idx on public.products(status, sort_order);
create index if not exists products_gender_idx on public.products(gender);
create index if not exists products_slug_idx on public.products(slug);
create index if not exists product_images_product_idx on public.product_images(product_id, sort_order);
create index if not exists product_variants_product_idx on public.product_variants(product_id);
create index if not exists inventory_stock_idx on public.inventory(variant_id, stock);
create index if not exists orders_customer_created_idx on public.orders(customer_id, created_at desc);
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists order_items_order_idx on public.order_items(order_id);

create or replace function public.is_admin(check_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where admin_users.user_id = check_user_id
  );
$$;

create or replace function public.create_order_from_checkout(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_items jsonb := coalesce(p_payload->'items', '[]'::jsonb);
  v_idempotency_key text := nullif(trim(coalesce(p_payload->>'idempotency_key', '')), '');
  v_customer_email text := lower(nullif(trim(coalesce(p_payload->'customer'->>'email', '')), ''));
  v_customer_name text := nullif(trim(coalesce(p_payload->'customer'->>'name', '')), '');
  v_phone text := nullif(trim(coalesce(p_payload->'customer'->>'phone', '')), '');
  v_shipping_country text := nullif(trim(coalesce(p_payload->'shipping'->>'country', '')), '');
  v_shipping_city text := nullif(trim(coalesce(p_payload->'shipping'->>'city', '')), '');
  v_shipping_address text := nullif(trim(coalesce(p_payload->'shipping'->>'address', '')), '');
  v_shipping_postal_code text := nullif(trim(coalesce(p_payload->'shipping'->>'postal_code', '')), '');
  v_notes text := nullif(trim(coalesce(p_payload->>'notes', '')), '');
  v_existing_order public.orders%rowtype;
  v_payload_hash text := md5((p_payload - 'idempotency_key')::text);
  v_line record;
  v_product record;
  v_variant record;
  v_stock integer;
  v_unit_price integer;
  v_subtotal integer := 0;
  v_order_id uuid;
  v_order_number text;
  v_currency text;
  v_updated_count integer;
begin
  if v_idempotency_key is null then
    return jsonb_build_object(
      'ok', false,
      'error', jsonb_build_object(
        'code', 'duplicate_submit',
        'message', 'idempotency_key is required to prevent duplicate submits.'
      )
    );
  end if;

  select *
  into v_existing_order
  from public.orders
  where idempotency_key = v_idempotency_key;

  if found then
    if v_existing_order.idempotency_payload_hash is not null
      and v_existing_order.idempotency_payload_hash <> v_payload_hash then
      return jsonb_build_object(
        'ok', false,
        'error', jsonb_build_object(
          'code', 'idempotency_key_conflict',
          'message', 'This idempotency_key was already used with a different checkout payload.'
        )
      );
    end if;

    return jsonb_build_object(
      'ok', true,
      'duplicate', true,
      'order', jsonb_build_object(
        'id', v_existing_order.id,
        'order_number', v_existing_order.order_number,
        'status', v_existing_order.status,
        'subtotal', v_existing_order.subtotal,
        'total', v_existing_order.total,
        'currency', v_existing_order.currency
      )
    );
  end if;

  if jsonb_typeof(v_items) is distinct from 'array' or jsonb_array_length(v_items) = 0 then
    return jsonb_build_object(
      'ok', false,
      'error', jsonb_build_object('code', 'empty_cart', 'message', 'Cart is empty.')
    );
  end if;

  if exists (
    select 1
    from jsonb_array_elements(v_items) as item(value)
    where coalesce(item.value->>'quantity', '') !~ '^[1-9][0-9]*$'
  ) then
    return jsonb_build_object(
      'ok', false,
      'error', jsonb_build_object('code', 'invalid_quantity', 'message', 'Every item quantity must be a positive integer no greater than 20.')
    );
  end if;

  if exists (
    select 1
    from jsonb_array_elements(v_items) as item(value)
    where (item.value->>'quantity')::integer > 20
  ) then
    return jsonb_build_object(
      'ok', false,
      'error', jsonb_build_object('code', 'invalid_quantity', 'message', 'Every item quantity must be a positive integer no greater than 20.')
    );
  end if;

  if exists (
    select 1
    from jsonb_array_elements(v_items) as item(value)
    where nullif(trim(coalesce(item.value->>'product_id', '')), '') is null
  ) then
    return jsonb_build_object(
      'ok', false,
      'error', jsonb_build_object('code', 'product_not_found', 'message', 'Every item must include product_id.')
    );
  end if;

  if exists (
    select 1
    from jsonb_array_elements(v_items) as item(value)
    where coalesce(item.value->>'variant_id', '') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  ) then
    return jsonb_build_object(
      'ok', false,
      'error', jsonb_build_object('code', 'variant_not_found', 'message', 'Every item must include a valid variant_id.')
    );
  end if;

  for v_line in
    select
      product_id,
      variant_id,
      sum(quantity)::integer as quantity
    from jsonb_to_recordset(v_items) as item(product_id text, variant_id uuid, quantity integer)
    group by product_id, variant_id
  loop
    select
      id,
      slug,
      name,
      status,
      price,
      currency,
      color,
      material
    into v_product
    from public.products
    where id = v_line.product_id;

    if not found then
      return jsonb_build_object(
        'ok', false,
        'error', jsonb_build_object('code', 'product_not_found', 'message', 'Product was not found.', 'product_id', v_line.product_id)
      );
    end if;

    if v_product.status <> 'active' then
      return jsonb_build_object(
        'ok', false,
        'error', jsonb_build_object('code', 'product_inactive', 'message', 'Product is not active.', 'product_id', v_product.id)
      );
    end if;

    select
      product_variants.id,
      product_variants.product_id,
      product_variants.status,
      product_variants.price_override,
      product_variants.color,
      product_variants.material,
      sizes.label as size_label
    into v_variant
    from public.product_variants
    join public.sizes on sizes.id = product_variants.size_id
    where product_variants.id = v_line.variant_id
    and product_variants.product_id = v_line.product_id;

    if not found then
      return jsonb_build_object(
        'ok', false,
        'error', jsonb_build_object('code', 'variant_not_found', 'message', 'Variant was not found.', 'variant_id', v_line.variant_id)
      );
    end if;

    if v_variant.status <> 'active' then
      return jsonb_build_object(
        'ok', false,
        'error', jsonb_build_object('code', 'variant_inactive', 'message', 'Variant is not active.', 'variant_id', v_variant.id)
      );
    end if;

    select stock
    into v_stock
    from public.inventory
    where variant_id = v_line.variant_id
    for update;

    if not found or v_stock < v_line.quantity then
      return jsonb_build_object(
        'ok', false,
        'error', jsonb_build_object(
          'code', 'insufficient_stock',
          'message', 'Insufficient stock for requested item.',
          'product_id', v_line.product_id,
          'variant_id', v_line.variant_id
        )
      );
    end if;

    v_unit_price := coalesce(v_variant.price_override, v_product.price);
    if v_currency is null then
      v_currency := v_product.currency;
    elseif v_currency <> v_product.currency then
      return jsonb_build_object(
        'ok', false,
        'error', jsonb_build_object('code', 'database_error', 'message', 'Checkout cannot mix multiple currencies.')
      );
    end if;

    v_subtotal := v_subtotal + (v_unit_price * v_line.quantity);
  end loop;

  insert into public.orders (
    order_number,
    customer_email,
    customer_name,
    phone,
    shipping_country,
    shipping_city,
    shipping_address,
    shipping_postal_code,
    notes,
    subtotal,
    shipping_total,
    total,
    currency,
    status,
    idempotency_key,
    idempotency_payload_hash
  )
  values (
    'LS-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
    v_customer_email,
    coalesce(v_customer_name, v_customer_email),
    v_phone,
    v_shipping_country,
    v_shipping_city,
    v_shipping_address,
    v_shipping_postal_code,
    v_notes,
    v_subtotal,
    0,
    v_subtotal,
    coalesce(v_currency, 'USD'),
    'pending',
    v_idempotency_key,
    v_payload_hash
  )
  returning id, order_number into v_order_id, v_order_number;

  for v_line in
    select
      product_id,
      variant_id,
      sum(quantity)::integer as quantity
    from jsonb_to_recordset(v_items) as item(product_id text, variant_id uuid, quantity integer)
    group by product_id, variant_id
  loop
    select
      id,
      slug,
      name,
      price,
      currency,
      color,
      material
    into v_product
    from public.products
    where id = v_line.product_id;

    select
      product_variants.id,
      product_variants.price_override,
      product_variants.color,
      product_variants.material,
      sizes.label as size_label
    into v_variant
    from public.product_variants
    join public.sizes on sizes.id = product_variants.size_id
    where product_variants.id = v_line.variant_id
    and product_variants.product_id = v_line.product_id;

    v_unit_price := coalesce(v_variant.price_override, v_product.price);

    insert into public.order_items (
      order_id,
      product_id,
      variant_id,
      product_name_snapshot,
      product_slug_snapshot,
      size_snapshot,
      color_snapshot,
      material_snapshot,
      unit_price_snapshot,
      currency_snapshot,
      quantity,
      line_total_snapshot
    )
    values (
      v_order_id,
      v_product.id,
      v_variant.id,
      v_product.name,
      v_product.slug,
      v_variant.size_label,
      coalesce(v_variant.color, v_product.color),
      coalesce(v_variant.material, v_product.material),
      v_unit_price,
      v_product.currency,
      v_line.quantity,
      v_unit_price * v_line.quantity
    );

    update public.inventory
    set
      stock = stock - v_line.quantity,
      updated_at = now()
    where variant_id = v_line.variant_id
    and stock >= v_line.quantity;

    get diagnostics v_updated_count = row_count;

    if v_updated_count <> 1 then
      raise exception 'Stock decrement failed for variant %', v_line.variant_id;
    end if;
  end loop;

  return jsonb_build_object(
    'ok', true,
    'duplicate', false,
    'order', jsonb_build_object(
      'id', v_order_id,
      'order_number', v_order_number,
      'status', 'pending',
      'subtotal', v_subtotal,
      'total', v_subtotal,
      'currency', coalesce(v_currency, 'USD')
    )
  );
exception
  when unique_violation then
    select *
    into v_existing_order
    from public.orders
    where idempotency_key = v_idempotency_key;

    if found then
      if v_existing_order.idempotency_payload_hash is not null
        and v_existing_order.idempotency_payload_hash <> v_payload_hash then
        return jsonb_build_object(
          'ok', false,
          'error', jsonb_build_object(
            'code', 'idempotency_key_conflict',
            'message', 'This idempotency_key was already used with a different checkout payload.'
          )
        );
      end if;

      return jsonb_build_object(
        'ok', true,
        'duplicate', true,
        'order', jsonb_build_object(
          'id', v_existing_order.id,
          'order_number', v_existing_order.order_number,
          'status', v_existing_order.status,
          'subtotal', v_existing_order.subtotal,
          'total', v_existing_order.total,
          'currency', v_existing_order.currency
        )
      );
    end if;

    return jsonb_build_object(
      'ok', false,
      'error', jsonb_build_object('code', 'duplicate_submit', 'message', 'Duplicate submit could not be resolved safely.')
    );
  when others then
    return jsonb_build_object(
      'ok', false,
      'error', jsonb_build_object('code', 'database_error', 'message', sqlerrm)
    );
end;
$$;

alter table public.customers enable row level security;
alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.sizes enable row level security;
alter table public.product_variants enable row level security;
alter table public.inventory enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists public_read_active_products on public.products;
create policy public_read_active_products on public.products
  for select to anon, authenticated
  using (status = 'active');

drop policy if exists public_read_public_product_images on public.product_images;
create policy public_read_public_product_images on public.product_images
  for select to anon, authenticated
  using (
    is_public = true
    and exists (
      select 1 from public.products
      where products.id = product_images.product_id
      and products.status = 'active'
    )
  );

drop policy if exists public_read_sizes on public.sizes;
create policy public_read_sizes on public.sizes
  for select to anon, authenticated
  using (true);

drop policy if exists public_read_active_variants on public.product_variants;
create policy public_read_active_variants on public.product_variants
  for select to anon, authenticated
  using (
    status = 'active'
    and exists (
      select 1 from public.products
      where products.id = product_variants.product_id
      and products.status = 'active'
    )
  );

drop policy if exists customers_manage_own on public.customers;
create policy customers_manage_own on public.customers
  for all to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

drop policy if exists orders_read_own on public.orders;
create policy orders_read_own on public.orders
  for select to authenticated
  using (customer_id = auth.uid() or public.is_admin());

drop policy if exists order_items_read_own on public.order_items;
create policy order_items_read_own on public.order_items
  for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.customer_id = auth.uid()
    )
  );

drop policy if exists admin_manage_admin_users on public.admin_users;
create policy admin_manage_admin_users on public.admin_users
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists admin_manage_products on public.products;
create policy admin_manage_products on public.products
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists admin_manage_product_images on public.product_images;
create policy admin_manage_product_images on public.product_images
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists admin_manage_sizes on public.sizes;
create policy admin_manage_sizes on public.sizes
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists admin_manage_product_variants on public.product_variants;
create policy admin_manage_product_variants on public.product_variants
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists admin_manage_inventory on public.inventory;
create policy admin_manage_inventory on public.inventory
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists admin_manage_orders on public.orders;
create policy admin_manage_orders on public.orders
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists admin_manage_order_items on public.order_items;
create policy admin_manage_order_items on public.order_items
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

revoke execute on function public.create_order_from_checkout(jsonb) from public;
revoke execute on function public.create_order_from_checkout(jsonb) from anon;
revoke execute on function public.create_order_from_checkout(jsonb) from authenticated;
grant execute on function public.create_order_from_checkout(jsonb) to service_role;

grant usage on schema public to anon, authenticated, service_role;
grant usage on type public.product_gender to anon, authenticated, service_role;
grant usage on type public.product_status to anon, authenticated, service_role;
grant usage on type public.order_status to anon, authenticated, service_role;

grant select on public.products, public.product_images, public.sizes, public.product_variants to anon, authenticated;
grant select, insert, update on public.customers to authenticated;
grant select on public.orders, public.order_items to authenticated;

grant insert, update, delete on
  public.admin_users,
  public.products,
  public.product_images,
  public.sizes,
  public.product_variants,
  public.inventory,
  public.orders,
  public.order_items
to authenticated;

grant all privileges on
  public.customers,
  public.admin_users,
  public.products,
  public.product_images,
  public.sizes,
  public.product_variants,
  public.inventory,
  public.carts,
  public.cart_items,
  public.orders,
  public.order_items
to service_role;

grant all privileges on all tables in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;

alter default privileges in schema public grant all privileges on tables to service_role;
alter default privileges in schema public grant all privileges on sequences to service_role;

commit;
