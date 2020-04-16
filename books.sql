DROP TABLE IF EXISTS books;

CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500),
    authors VARCHAR(1000),
    isbn VARCHAR(1000),
    image_url VARCHAR(1000),
    summary VARCHAR(5000)
);