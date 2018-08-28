CREATE TABLE locations(
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    library VARCHAR(255) NOT NULL,
    message VARCHAR (255),
    loc_type VARCHAR(255) NOT NULL,
    last_updated TIMESTAMP DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE maps(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    last_updated TIMESTAMP DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE static_mappings(
    id INT AUTO_INCREMENT PRIMARY KEY,
    loc_info VARCHAR(255),
    shelf_range INT,
    side VARCHAR(255),
    svg_id INT,
    location_id INT,
    map_id INT,
    last_updated TIMESTAMP DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(location_id) REFERENCES locations(id),
    FOREIGN KEY(map_id) REFERENCES maps(id),
    FOREIGN KEY(svg_id) REFERENCES svgs(id)
    ON DELETE CASCADE
);

CREATE TABLE dynamic_mappings(
    id INT AUTO_INCREMENT PRIMARY KEY,
    start_range VARCHAR(255) NOT NULL,
    end_range VARCHAR(255) NOT NULL,
    shelf_range INT NOT NULL,
    shelf_range_side VARCHAR(255),
    loc_info VARCHAR(255) NOT NULL,
    svg_id INT,
    location_id INT,
    map_id INT,
    last_updated TIMESTAMP DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(location_id) REFERENCES locations(id),
    FOREIGN KEY(map_id) REFERENCES maps(id),
    FOREIGN KEY(svg_id) REFERENCES svgs(id)
    ON DELETE CASCADE
);

CREATE TABLE svgs(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    x_coord INT NOT NULL,
    y_coord INT NOT NULL,
    last_updated TIMESTAMP DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    net_id VARCHAR(15) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
);