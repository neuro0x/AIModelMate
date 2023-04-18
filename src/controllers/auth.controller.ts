import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import logger from "../logger";

/**
 * This function handles user login by validating the user's credentials and returning a JWT token and
 * user information.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, URL, and request body.
 * @param {Response} res - The `res` parameter is the response object that is sent back to the client
 * after the login function is executed. It contains information such as the HTTP status code, response
 * headers, and response body. The response body typically contains data that is sent back to the
 * client, such as a JSON object with
 * @returns The `validate` function is returning a JSON response with a status code of 200, a message
 * of "Access granted", and an object containing the decoded user information and token from the
 * request body.
 */
export const validate = async (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Access granted",
    user: req.body.decoded,
    token: req.body.token,
  });
};

/**
 * This function handles user login by checking if the user exists, comparing the provided password
 * with the stored hashed password, creating and signing a JWT, and returning the token and user
 * information.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, URL, and request body.
 * @param {Response} res - `res` is the response object that is sent back to the client after the login
 * function is executed. It contains information such as the HTTP status code, response headers, and
 * response body. The response body typically contains data that is sent back to the client, such as a
 * JSON object with a token
 * @returns This function returns a JSON response containing a JWT token and user object if the login
 * is successful. If there is an error, it returns a JSON response with a message indicating that the
 * login failed.
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist." });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Create and sign the JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "", {
      expiresIn: "1d",
    });

    user = await User.findById(user._id).select("-password");

    return res.json({ token, user });
  } catch (error: any) {
    logger.error(error);
    return res.status(500).json({ message: "Login failed." });
  }
};

/**
 * This function registers a new user by checking if the user already exists, hashing the password,
 * creating a new user, and signing a JWT.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information about the request such as the request method, headers, URL, and
 * request body.
 * @param {Response} res - `res` is the response object that is sent back to the client after
 * processing a request. It contains information such as the status code, headers, and response body.
 * In this specific function, `res` is used to send a response back to the client with a status code
 * and a JSON object
 * @returns This function returns a JSON response with a token and user object if the registration is
 * successful, or a JSON response with an error message if the registration fails.
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser: IUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Create and sign the JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || "", {
      expiresIn: "1d",
    });

    user = await User.findById(newUser._id).select("-password");

    return res.status(201).json({ token, user });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: "Registration failed." });
  }
};

/**
 * This function updates the email of a user in a database and returns a success or error message.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information about the request, such as the request method, headers, URL, and
 * body. In this case, the `req` object is being used to extract the `email` property from the request
 * @param {Response} res - `res` stands for response and it is an object that represents the HTTP
 * response that an Express app sends when it receives an HTTP request. It contains methods and
 * properties that allow the app to send data back to the client, such as status codes, headers, and
 * the response body. In this specific
 * @returns a JSON response with a message indicating whether the email update was successful or not.
 * If the email was updated successfully, the response will have a status code of 200 and a message of
 * "Email updated successfully." If the email update failed, the response will have a status code of
 * 500 and a message of "Email update failed."
 */
export const changeEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    console.log("req:", req);
    const user = await User.findById(req.body.decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.email = email;
    await user.save();

    return res.status(200).json({ message: "Email updated successfully." });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: "Email update failed." });
  }
};

/**
 * This function changes the password of a user by verifying their current password and hashing their
 * new password.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, URL, and request body.
 * @param {Response} res - `res` is the response object that is used to send a response back to the
 * client making the request. It contains methods such as `status` to set the HTTP status code, `json`
 * to send a JSON response, and `send` to send a plain text response.
 * @returns a JSON response with a message indicating whether the password update was successful or
 * not. If the update was successful, the response will have a status code of 200 and a message of
 * "Password updated successfully." If the update failed, the response will have a status code of 500
 * and a message of "Password update failed."
 */
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.body.decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: "Password update failed." });
  }
};
