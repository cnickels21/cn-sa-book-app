DROP TABLE IF EXISTS books;

CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR[500]
    author VARCHAR[1000]
    isbn  VARCHAR[1000]
    image_url : VARCHAR
     
  );