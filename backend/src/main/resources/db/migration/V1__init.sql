CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(12,2) NOT NULL
);

CREATE TABLE raw_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  stock_quantity NUMERIC(14,3) NOT NULL
);

CREATE TABLE product_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  raw_material_id UUID NOT NULL REFERENCES raw_materials(id),
  required_quantity NUMERIC(14,3) NOT NULL,
  CONSTRAINT uq_product_material UNIQUE (product_id, raw_material_id)
);
