grant usage on schema public to anon, authenticated, service_role;

grant usage on type public.product_gender to anon, authenticated, service_role;
grant usage on type public.product_status to anon, authenticated, service_role;
grant usage on type public.order_status to anon, authenticated, service_role;

grant select on public.products to anon, authenticated;
grant select on public.product_images to anon, authenticated;
grant select on public.sizes to anon, authenticated;
grant select on public.product_variants to anon, authenticated;

grant select, insert, update on public.customers to authenticated;
grant select on public.orders to authenticated;
grant select on public.order_items to authenticated;

grant insert, update, delete on public.admin_users to authenticated;
grant insert, update, delete on public.products to authenticated;
grant insert, update, delete on public.product_images to authenticated;
grant insert, update, delete on public.sizes to authenticated;
grant insert, update, delete on public.product_variants to authenticated;
grant insert, update, delete on public.inventory to authenticated;
grant insert, update, delete on public.orders to authenticated;
grant insert, update, delete on public.order_items to authenticated;

grant all privileges on public.customers to service_role;
grant all privileges on public.admin_users to service_role;
grant all privileges on public.products to service_role;
grant all privileges on public.product_images to service_role;
grant all privileges on public.sizes to service_role;
grant all privileges on public.product_variants to service_role;
grant all privileges on public.inventory to service_role;
grant all privileges on public.carts to service_role;
grant all privileges on public.cart_items to service_role;
grant all privileges on public.orders to service_role;
grant all privileges on public.order_items to service_role;

revoke execute on function public.create_order_from_checkout(jsonb) from public;
revoke execute on function public.create_order_from_checkout(jsonb) from anon;
revoke execute on function public.create_order_from_checkout(jsonb) from authenticated;
grant execute on function public.create_order_from_checkout(jsonb) to service_role;

grant all privileges on all tables in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;

alter default privileges in schema public grant all privileges on tables to service_role;
alter default privileges in schema public grant all privileges on sequences to service_role;
