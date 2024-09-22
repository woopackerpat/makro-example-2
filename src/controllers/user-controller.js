const { updateUserSchema } = require("../validators/user");
const {
  createAddressSchema,
  updateAddressSchema,
} = require("../validators/address");
const userService = require("../services/user-service");
const addressService = require("../services/address-service");
const prisma = require("../config/prisma");
const createError = require("../utils/createErrror");

exports.getMe = (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const toUpdateUserData = await updateUserSchema.validateAsync(req.body);

    const updatedUser = await userService.updateUser(
      req.user.id,
      toUpdateUserData
    );

    res.json({ user: updatedUser });
  } catch (err) {
    next(err);
  }
};

exports.getAllAddresses = async (req, res, next) => {
  try {
    const addresses = await addressService.getAllAddressesByUserId(req.user.id);
    res.json({ addresses });
  } catch (err) {
    next(err);
  }
};

exports.createAddress = async (req, res, next) => {
  try {
    const toCreateAddressData = await createAddressSchema.validateAsync(
      req.body
    );

    if (toCreateAddressData.isMain) {
      await addressService.updateAllMainToFalse(req.user.id);
    }

    const newAddress = await prisma.address.create({
      data: { ...toCreateAddressData, user: { connect: { id: req.user.id } } },
    });

    res.json({ address: newAddress });
  } catch (err) {
    next(err);
  }
};

exports.updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;

    if (!addressId) {
      return createError(400, "Address id to be provided");
    }

    const address = await addressService.getAddressById(addressId);

    if (!address) {
      return createError(400, "Address not found");
    }

    const toUpdateAddressSchema = await updateAddressSchema.validateAsync(
      req.body
    );

    if (toUpdateAddressSchema.isMain) {
      await addressService.updateAllMainToFalse(req.user.id);
    }

    const updatedAddress = await prisma.address.update({
      where: {
        id: Number(addressId),
      },
      data: toUpdateAddressSchema,
    });

    res.json({ address: updatedAddress });
  } catch (err) {
    next(err);
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;

    if (!addressId) {
      return createError(400, "Address id to be provided");
    }

    const address = await addressService.getAddressById(addressId);

    if (!address) {
      return createError(400, "Address not found");
    }
    // If the delete id is main address -> has to update a new one
    if (address.isMain) {
      const allAddresses = await addressService.getAllAddressesByUserId(
        req.user.id
      );

      if (allAddresses.length > 0) {
        const toSetMainAddress = allAddresses[0];
        await addressService.updateAddress(toSetMainAddress.id, {
          isMain: true,
        });
      }
    }

    await addressService.deleteAddress(address.id);

    res.json({ message: "Delete address" });
  } catch (err) {
    next(err);
  }
};
