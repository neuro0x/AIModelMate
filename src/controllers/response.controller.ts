import { Request, Response } from "express";
import ResponseModel, { IResponse } from "../models/response.model";
import logger from "../logger";

/**
 * This function creates a new response and saves it to the database, returning the saved response or
 * an error message.
 * @param {Request} req - Request object, which contains information about the incoming HTTP request
 * such as headers, body, and query parameters.
 * @param {Response} res - `res` is an object representing the HTTP response that will be sent back to
 * the client. It contains methods and properties that allow you to set the status code, headers, and
 * body of the response. In this case, the `createResponse` function is using the `res` object to send
 * @returns a response object with a status code of 201 and the savedResponse object as the JSON
 * payload if the try block is successful. If there is an error, it returns a response object with a
 * status code of 500 and a JSON payload with an error message.
 */
export const createResponse = async (req: Request, res: Response) => {
  try {
    const { input, output } = req.body;
    const newResponse: IResponse = new ResponseModel({
      input,
      output,
      userId: req.body.decoded.id,
    });

    const savedResponse = await newResponse.save();

    return res.status(201).json(savedResponse);
  } catch (error: any) {
    logger.log(error);
    return res.status(500).json({ message: "Error creating response." });
  }
};

/**
 * This function retrieves all responses from a database and returns them as a JSON object in a 200
 * response, or returns a 500 response with an error message if there is an error fetching the
 * responses.
 * @param {Request} req - req is a parameter of type Request, which is an object that represents the
 * HTTP request made to the server. It contains information such as the request method, URL, headers,
 * and body.
 * @param {Response} res - `res` is an object representing the HTTP response that will be sent back to
 * the client. It contains methods for setting the response status, headers, and body. In this case,
 * the `getResponses` function is using the `json` method of the `res` object to send a JSON
 * @returns This code is defining an asynchronous function called `getResponses` that takes in a
 * request object and a response object as parameters. The function tries to fetch all responses from a
 * `ResponseModel` and returns a JSON response with a status code of 200 and the fetched responses if
 * successful. If there is an error, it logs the error and returns a JSON response with a status code
 * of 500 and
 */
export const getResponses = async (req: Request, res: Response) => {
  try {
    const responses = await ResponseModel.find();

    return res.status(200).json(responses);
  } catch (error: any) {
    logger.log(error);
    return res.status(500).json({ message: "Error fetching responses." });
  }
};

/**
 * This function retrieves a response by its ID and returns it as a JSON object, or returns an error
 * message if there is an issue.
 * @param {Request} req - Request object which contains information about the incoming HTTP request
 * such as headers, query parameters, and request body.
 * @param {Response} res - `res` is an object representing the HTTP response that will be sent back to
 * the client. It contains methods and properties that allow the server to send data back to the
 * client, such as `status()` to set the HTTP status code, `json()` to send a JSON response, and `send
 * @returns This function is returning a JSON response with the data of a response object that matches
 * the ID provided in the request parameters. If there is an error, it will return a 500 status code
 * with a message indicating that there was an error fetching the response by ID.
 */
export const getResponseById = async (req: Request, res: Response) => {
  try {
    const response = await ResponseModel.findById(req.params.id);

    return res.status(200).json(response);
  } catch (error: any) {
    logger.log(error);
    return res.status(500).json({ message: "Error fetching response by ID." });
  }
};

/**
 * This function retrieves responses by user ID and sends them as a JSON response, or sends an error
 * message if there is an issue.
 * @param {Request} req - Request object, which contains information about the incoming HTTP request
 * such as headers, query parameters, and request body.
 * @param {Response} res - `res` is an object representing the HTTP response that will be sent back to
 * the client. It contains methods for setting the response status, headers, and body. In this case,
 * the `res` object is used to send a JSON response with an array of response objects fetched from the
 * database.
 */
export const getResponsesByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.body.decoded.id;
    const responses = await ResponseModel.find({ userId });
    res.status(200).json(responses);
  } catch (error: any) {
    logger.log(error);
    res.status(500).json({ message: "Error fetching responses by user ID." });
  }
};

/**
 * This function updates a response in a database and returns the updated response as a JSON object.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, URL, and any data sent in the
 * request body.
 * @param {Response} res - `res` is an object representing the HTTP response that will be sent back to
 * the client. It contains methods for setting the response status, headers, and body. In this specific
 * function, `res` is used to send a JSON response with the updated response object or an error message
 * if the update
 * @returns a JSON response with the updated response object if the update was successful, and a JSON
 * response with an error message if there was an error updating the response.
 */
export const updateResponse = async (req: Request, res: Response) => {
  try {
    const updatedResponse = await ResponseModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.status(200).json(updatedResponse);
  } catch (error: any) {
    logger.log(error);
    return res.status(500).json({ message: "Error updating response." });
  }
};

/**
 * This function deletes a response by its ID and returns a success message or an error message if the
 * deletion fails.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information about the request such as the request method, headers, URL, and any
 * data sent in the request body. In this function, it is used to extract the `id` parameter from the
 * request
 * @param {Response} res - `res` is an object representing the HTTP response that will be sent back to
 * the client. It contains methods and properties that allow the server to send data back to the
 * client, such as `status()` to set the HTTP status code, `json()` to send a JSON response, and `send
 * @returns a JSON response with a message indicating whether the response was successfully deleted or
 * if there was an error. If the response was successfully deleted, the message will be "Response
 * deleted" and the status code will be 200. If there was an error, the message will be "Error updating
 * response" and the status code will be 500.
 */
export const deleteResponse = async (req: Request, res: Response) => {
  try {
    await ResponseModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Response deleted" });
  } catch (error: any) {
    logger.log(error);
    return res.status(500).json({ message: "Error updating response." });
  }
};
