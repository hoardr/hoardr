CREATE TABLE category
(
    id                 SERIAL PRIMARY KEY,
    name               TEXT            NOT NULL,
    parent_id          BIGINT UNSIGNED REFERENCES category (id) ON DELETE RESTRICT,
    created_date       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_date DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE category_event
(
    id           SERIAL PRIMARY KEY,
    category_id  BIGINT UNSIGNED NOT NULL REFERENCES category (id) ON DELETE CASCADE,
    type         TEXT            NOT NULL,
    data         JSON            NOT NULL,
    created_date DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX category_event_category_id_idx (category_id)
);

CREATE TABLE location
(
    id                 SERIAL PRIMARY KEY,
    name               TEXT            NOT NULL,
    parent_id          BIGINT UNSIGNED REFERENCES location (id) ON DELETE RESTRICT,
    created_date       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_date DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE location_event
(
    id           SERIAL PRIMARY KEY,
    location_id  BIGINT UNSIGNED REFERENCES location (id) ON DELETE CASCADE,
    type         TEXT     NOT NULL,
    data         JSON     NOT NULL,
    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX location_event_location_id_idx (location_id)
);

CREATE TABLE item
(
    id                 SERIAL PRIMARY KEY,
    name               TEXT,
    quantity           BIGINT UNSIGNED NOT NULL DEFAULT 1,
    category_id        BIGINT UNSIGNED NOT NULL REFERENCES category (id) ON DELETE CASCADE,
    location_id        BIGINT UNSIGNED NOT NULL REFERENCES location (id) ON DELETE CASCADE,
    created_date       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_date DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX item_category_id_idx (category_id),
    INDEX item_location_id_idx (location_id)
);

CREATE TABLE item_event
(
    id           SERIAL PRIMARY KEY,
    item_id      BIGINT UNSIGNED REFERENCES item (id) ON DELETE CASCADE,
    type         TEXT     NOT NULL,
    data         JSON     NOT NULL,
    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX item_event_item_id_idx (item_id)
);

CREATE TABLE property
(
    id                 SERIAL PRIMARY KEY,
    name               TEXT     NOT NULL,
    type               TEXT     NOT NULL,
    created_date       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE property_event
(
    id           SERIAL PRIMARY KEY,
    property_id  BIGINT UNSIGNED REFERENCES property (id) ON DELETE CASCADE,
    type         TEXT     NOT NULL,
    data         JSON     NOT NULL,
    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX property_event_property_id_idx (property_id)
);

CREATE TABLE item_property_value
(
    id          SERIAL PRIMARY KEY,
    item_id     BIGINT UNSIGNED NOT NULL REFERENCES item (id) ON DELETE CASCADE,
    property_id BIGINT UNSIGNED NOT NULL REFERENCES property (id) ON DELETE CASCADE,
    value       TEXT            NOT NULL,
    UNIQUE item_property_value_unique_idx (item_id, property_id),
    INDEX item_property_value_property_id_idx (property_id)
);

CREATE TABLE category_property
(
    category_id BIGINT UNSIGNED NOT NULL REFERENCES category (id) ON DELETE CASCADE,
    property_id BIGINT UNSIGNED NOT NULL REFERENCES property (id) ON DELETE CASCADE,
    UNIQUE category_property_unique_idx (category_id, property_id),
    INDEX category_property_property_id_idx (property_id)
);
