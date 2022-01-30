const express = require("express");
const prisma = require("../lib/prisma");
const auth = require("../middleware/auth");

const router = express.Router();

const APP_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080/api"
    : "https://blognodeserver.herokuapp.com/api";

function paginate(totalItems, currentPage, pageSize, count, url) {
  const totalPages = Math.ceil(totalItems / pageSize);

  // ensure current page isn't out of range
  if (currentPage < 1) {
    currentPage = 1;
  } else if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  // calculate start and end item indexes
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

  // return object with all pager properties required by the view
  return {
    total: totalItems,
    currentPage: +currentPage,
    count,
    lastPage: totalPages,
    firstItem: startIndex,
    lastItem: endIndex,
    perPage: pageSize,
    first_page_url: `${APP_URL}${url}&page=1`,
    last_page_url: `${APP_URL}${url}&page=${totalPages}`,
    next_page_url:
      totalPages > currentPage
        ? `${APP_URL}${url}&page=${Number(currentPage) + 1}`
        : null,
    prev_page_url:
      totalPages > currentPage ? `${APP_URL}${url}&page=${currentPage}` : null,
  };
}

router.get("/", auth, async (req, res) => {
  const { orderBy, sortedBy } = req.query;
  const curPage = req.query.page || 1;
  const perPage = req.query.limit || 25;

  const url = `/products?limit=${perPage}`;
  // console.log(curPage);
  const skipItems =
    curPage == 1 ? 0 : (parseInt(perPage) - 1) * parseInt(curPage);

  const totalItems = await prisma.student.count();

  try {
    const product = await prisma.student.findMany({
      skip: skipItems,
      take: parseInt(perPage),
      orderBy: {
        enrollmentDate: sortedBy,
      },
    });
    // console.log(product.length);
    res.status(200).json({
      msg: "success",
      data: product,
      ...paginate(totalItems, curPage, perPage, product.length, url),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
});

module.exports = router;
