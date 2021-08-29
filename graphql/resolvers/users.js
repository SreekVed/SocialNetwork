const bcrypt = require("bcryptjs");
const { UserInputError } = require("apollo-server");

const User = require("../../models/User");
const {
  validateRegisterInput,
  validateLoginInput,
  generateToken,
} = require("../../utils");

module.exports = {
  Mutation: {
    async register(
      _,
      { registerInput: { username, password, confirmPassword, email } }
    ) {
      const { valid, errors } = validateRegisterInput(
        username,
        password,
        confirmPassword,
        email
      );

      if (!valid) throw new UserInputError("Errors", { errors });

      const user = await User.findOne({ username });

      if (user) {
        errors.username = "This username is taken";
        throw new UserInputError("Username is already taken", { errors });
      }

      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        username,
        password,
        email,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },

    async login(_, { username, password }) {
      const { valid, errors } = validateLoginInput(username, password);

      if (!valid) throw new UserInputError("Errors", { errors });

      const user = await User.findOne({ username });

      if (!user) {
        errors.username = "Invalid Username";
        throw new UserInputError("Invalid credentials", { errors });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        errors.password = "Invalid Password";
        throw new UserInputError("Invalid credentials", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
  },
};
