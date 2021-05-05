const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  let isError = false;
  let responseData = {};
  let responseCode = 201;

  if (request.payload.name === undefined) {
    responseData = {
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    };
    responseCode = 400;
    isError = true;
  }

  if (request.payload.year === undefined) {
    responseData = {
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi tahun terbit buku!',
    };
    responseCode = 400;
    isError = true;
  }

  if (request.payload.author === undefined) {
    responseData = {
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama penulis buku!',
    };
    responseCode = 400;
    isError = true;
  }

  if (request.payload.publisher === undefined) {
    responseData = {
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama penerbit buku!',
    };
    responseCode = 400;
    isError = true;
  }

  if (pageCount <= 0 || readPage <= 0) {
    responseData = {
      status: 'fail',
      message: 'Gagal menambahkan buku. pageCount dan readPage tidak boleh kurang dari atau sama dengan 0!',
    };
    responseCode = 400;
    isError = true;
  }

  if (readPage > pageCount) {
    responseData = {
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    };
    responseCode = 400;
    isError = true;
  }

  if (!isError) {
    const id = nanoid(16);
    const finished = readPage === pageCount;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      id,
      finished,
      insertedAt,
      updatedAt,
    };

    books.push(newBook);

    const insertStatus = books.filter((book) => book.id === id).length > 0;

    if (insertStatus) {
      responseData = {
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      };
      responseCode = 201;
    } else {
      responseData = {
        status: 'error',
        message: 'Buku gagal ditambahkan',
      };
      responseCode = 500;
    }
  }

  const response = h.response(responseData);
  response.code(responseCode);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let bookResults = books;
  if (name !== undefined) {
    const filterRegex = new RegExp(`${name}`, 'i');
    bookResults = books.filter((book) => filterRegex.test(book.name));
  }

  if (request.query.reading !== undefined) {
    bookResults = books.filter((book) => book.reading === Boolean(reading));
  }

  if (request.query.finished !== undefined) {
    bookResults = books.filter((book) => book.finished === Boolean(finished));
  }

  const response = h.response({
    status: 'success',
    data: {
      books: bookResults.map((bookItem) => ({
        id: bookItem.id,
        name: bookItem.name,
        publisher: bookItem.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((bookItem) => bookItem.id === id)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const updateBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  let isError = false;
  let responseData = {};
  let responseCode = 200;

  if (request.payload.name === undefined) {
    responseData = {
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    };
    responseCode = 400;
    isError = true;
  }

  if (readPage > pageCount) {
    responseData = {
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    };
    responseCode = 400;
    isError = true;
  }

  if (!isError) {
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
      };

      responseData = {
        status: 'success',
        message: 'Buku berhasil diperbarui',
      };
      responseCode = 200;
      isError = false;
    } else {
      responseData = {
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      };
      responseCode = 404;
      isError = true;
    }
  }

  const response = h.response(responseData);
  response.code(responseCode);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
