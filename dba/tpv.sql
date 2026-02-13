
create schema tpv;

CREATE TABLE tpv.company_user(
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(username)
);

CREATE TABLE tpv.product(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL,
    type VARCHAR(255),
    stock FLOAT NOT NULL DEFAULT 0,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES tpv.company_user(id),
    UNIQUE(name, user_id)
);

CREATE TABLE tpv.supplier(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(255),
    web VARCHAR(255),
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES tpv.company_user(id)
);

CREATE TABLE tpv.purchase(
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    quantity FLOAT NOT NULL,
    price FLOAT NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    supplier_id BIGINT,
    FOREIGN KEY (product_id) REFERENCES tpv.product(id),
    FOREIGN KEY (user_id) REFERENCES tpv.company_user(id),
    FOREIGN KEY (supplier_id) REFERENCES tpv.supplier(id)
);

CREATE TABLE tpv.sale(
    id BIGSERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    credit_card BOOLEAN NOT NULL DEFAULT FALSE,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES tpv.company_user(id)
);

CREATE TABLE tpv.item_sale(
    id BIGSERIAL PRIMARY KEY,
    sale_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity FLOAT NOT NULL,
    price FLOAT NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES tpv.sale(id),
    FOREIGN KEY (product_id) REFERENCES tpv.product(id)
);