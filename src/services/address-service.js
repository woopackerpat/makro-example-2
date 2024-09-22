const prisma = require("../config/prisma");

exports.getAllAddressesByUserId = (userId) => {
  return prisma.address.findMany({
    where: {
      userId,
    },
  });
};

exports.getAddressById = (addressId) => {
  return prisma.address.findFirst({
    where: {
      id: Number(addressId),
    },
  });
};

exports.updateAddress = (addressId, data) => {
  return prisma.address.update({
    where: {
      id: addressId,
    },
    data,
  });
};

exports.deleteAddress = (addressId) => {
  return prisma.address.delete({
    where: {
      id: addressId,
    },
  });
};

exports.updateAllMainToFalse = (userId) => {
  return prisma.address.updateMany({
    where: {
      userId: userId,
    },
    data: {
      isMain: false,
    },
  });
};
