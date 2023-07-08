import User from "../Modal/UserSchema.js";

export const cokiesOptions = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};

// export const createToken = (_id) => {
//   JWT
// }

export const singUp = async (req, res) => {
  const { name, email, password, phone = null } = req.body;

  if (!name) throw Error("Name is required");
  if (!email) throw Error("email is required");
  if (!password) throw Error("password is required");

  //check if the user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw Error("User already exists");
  }

  try {
    const user = await User.create({
      name,
      email,
      password,
      phone,
    });
    const token = user.getJWTtoken();

    // res.cookies("token", token, cokiesOptions);
    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
