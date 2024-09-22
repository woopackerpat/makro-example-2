const prisma = require("../config/prisma");

exports.getUserById = (userId) => {
  return prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
};

exports.getUserByEmail = (email) => {
  return prisma.user.findFirst({
    where: {
      email,
    },
  });
};

exports.createUser = (data) => {
  return prisma.user.create({
    data,
  });
};

exports.updateUser = (userId, data) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data,
  });
};
