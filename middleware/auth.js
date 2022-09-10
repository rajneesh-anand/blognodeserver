const prisma = require("../lib/prisma");
const jwt = require("jsonwebtoken");

function extractToken(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
}

const verifyToken = async (req, res, next) => {
  const token = await extractToken(req);

  if (!token) {
    console.log(`no token`);
    return res.status(403).json({ error: "Unauthorized access !" });
  }

  try {
    // const result = await prisma.session.findMany({
    //   where: {
    //     sessionToken: token,
    //   },
    // });
    // if (token === result[0].sessionToken) {
    //   return next();
    // } else {
    //   throw new Error();
    // }

    jwt.verify(
      token,
      process.env.SECRET,
      { algorithms: "HS256" },
      function (err, payload) {
        if (err) {
          throw new Error();
        }
        return next();
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(403).json({ access: "Forbidden" });
  }
};

module.exports = verifyToken;
