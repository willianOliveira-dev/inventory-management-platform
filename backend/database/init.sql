CREATE DATABASE IF NOT EXISTS control_panel_db;
USE control_panel_db;

CREATE TABLE IF NOT EXISTS users(
	user_id CHAR(36),
    name VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(250) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_user PRIMARY KEY (user_id),
	CONSTRAINT un_email UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS categories(
	category_id CHAR(36),
    user_id CHAR(36) NOT NULL,
    name VARCHAR(120) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_category PRIMARY KEY (category_id),
    CONSTRAINT fk_category_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT un_category_user UNIQUE(user_id, name)
);

CREATE TABLE IF NOT EXISTS items(
	item_id CHAR(36),
    user_id CHAR(36) NOT NULL,
	category_id CHAR(36) NOT NULL,
    name VARCHAR(120) NOT NULL,
    price_cents INT NOT NULL,
    description VARCHAR(500) NOT NULL,
    current_quantity INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT pk_item PRIMARY KEY (item_id),
    CONSTRAINT fk_user_item FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_category_item FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS refresh_tokens (
    token_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    token VARCHAR(255) NOT NULL,
    revoked BOOLEAN DEFAULT false,
    replaced_by CHAR(36) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    revoked_at DATETIME DEFAULT NULL,
    CONSTRAINT pk_token PRIMARY KEY (token_id),
    CONSTRAINT un_token UNIQUE (token),
    CONSTRAINT fk_user_token FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS stock_history(
	history_id CHAR(36),
    item_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    old_price_cents INT NOT NULL,
    new_price_cents INT NOT NULL,
    old_quantity INT NOT NULL,
    new_quantity INT NOT NULL,
    operation VARCHAR(10) CHECK (operation IN ('ADD', 'UPDATE')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_history PRIMARY KEY (history_id),
	CONSTRAINT fk_user_history FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_item_history FOREIGN KEY  (item_id) REFERENCES items(item_id) ON DELETE CASCADE
);

