import { Request, Response } from "express";
import LLM, { ILLM } from "../models/llm.model";
import logger from "../logger";

/**
 * This function retrieves LLM models and returns them as a JSON response, or returns a 500 error if
 * there was an issue fetching the models.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, URL, and any data sent in the
 * request body.
 * @param {Response} res - `res` stands for response and it is an object that represents the HTTP
 * response that an Express app sends when it receives an HTTP request. It contains methods for sending
 * a response back to the client, such as `status()` and `json()`. In this code snippet, `res` is used
 * @returns This function is returning a list of LLMs (LLM stands for "Legal Entity Identifier Legal
 * Entity Name Mapping") in JSON format. The list is fetched from the database using the `LLM.find()`
 * method and is returned with a 200 status code if successful. If there is an error, a 500 status code
 * is returned along with an error message.
 */
export const getModels = async (req: Request, res: Response) => {
  try {
    const llms = await LLM.find();

    return res.status(200).json(llms);
  } catch (error: any) {
    logger.error(error);
    return res.status(500).json({ message: "Failed to fetch LLMs." });
  }
};

/**
 * This function fetches an LLM model by its ID and returns it as a JSON response, or returns an error
 * message if it fails.
 * @param {Request} req - Request object which contains the HTTP request information such as headers,
 * body, and parameters.
 * @param {Response} res - `res` stands for response and it is an object that represents the HTTP
 * response that an Express app sends when it receives an HTTP request. It contains methods for setting
 * the HTTP status code, headers, and body of the response that will be sent back to the client. In
 * this specific function, `
 * @returns This function returns a JSON response with the LLM model object if it is found in the
 * database, or a 404 error message if it is not found. If there is an error while fetching the LLM, it
 * returns a 500 error message.
 */
export const getModelById = async (req: Request, res: Response) => {
  try {
    const llm = await LLM.findById(req.params.id);
    if (!llm) {
      return res.status(404).json({ message: "LLM not found." });
    }

    return res.status(200).json(llm);
  } catch (error: any) {
    logger.error(error);
    return res.status(500).json({ message: "Failed to fetch LLM." });
  }
};

/**
 * This function creates a new LLM model and saves it to the database, returning a JSON response with
 * the new model's information or an error message if it fails.
 * @param {Request} req - Request object which contains the HTTP request information such as headers,
 * body, and parameters.
 * @param {Response} res - `res` stands for response and it is an object that represents the HTTP
 * response that an Express app sends when it receives an HTTP request. It contains methods for setting
 * the HTTP status code, headers, and sending the response body. In this specific code snippet, `res`
 * is used to send a
 * @returns a JSON response with the newly created LLM object and a status code of 201 if the creation
 * is successful. If there is an error, it returns a JSON response with a message and a status code of
 * 500.
 */
export const createModel = async (req: Request, res: Response) => {
  try {
    const newLLM: ILLM = new LLM({ name: req.body.name });
    await newLLM.save();

    return res.status(201).json(newLLM);
  } catch (error: any) {
    logger.error(error);
    return res.status(500).json({ message: "Failed to create LLM." });
  }
};

/**
 * This function updates an LLM model with the given ID and request body, and returns the updated model
 * or an error message.
 * @param {Request} req - Request object containing information about the incoming HTTP request.
 * @param {Response} res - `res` stands for response and it is an object that represents the HTTP
 * response that an Express app sends when it receives an HTTP request. It contains methods for sending
 * the response back to the client, such as `status()` and `json()`. In this specific function, `res`
 * is used
 * @returns If the LLM is successfully updated, the updated LLM object is returned with a status code
 * of 200. If the LLM is not found, a message indicating that the LLM was not found is returned with a
 * status code of 404. If there is an error during the update process, a message indicating that the
 * update failed is returned with a status code of 500.
 */
export const updateModel = async (req: Request, res: Response) => {
  try {
    const llm = await LLM.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!llm) {
      return res.status(404).json({ message: "LLM not found." });
    }

    return res.status(200).json(llm);
  } catch (error: any) {
    logger.error(error);
    return res.status(500).json({ message: "Failed to update LLM." });
  }
};

/**
 * This function deletes an LLM model by ID and returns a success message or an error message if the
 * deletion fails.
 * @param {Request} req - Request object containing information about the incoming HTTP request.
 * @param {Response} res - `res` is an object representing the HTTP response that will be sent back to
 * the client. It contains methods for setting the status code, headers, and body of the response. In
 * this case, it is used to send a JSON response indicating whether the LLM was successfully deleted or
 * not.
 * @returns This function is returning a JSON response with a message indicating whether the LLM was
 * successfully deleted or not. If the LLM is not found, a 404 status code and a message indicating
 * that the LLM was not found is returned. If there is an error during the deletion process, a 500
 * status code and a message indicating that the deletion failed is returned.
 */
export const deleteModel = async (req: Request, res: Response) => {
  try {
    const llm = await LLM.findByIdAndDelete(req.params.id);
    if (!llm) {
      return res.status(404).json({ message: "LLM not found." });
    }

    return res.status(200).json({ message: "LLM deleted successfully." });
  } catch (error: any) {
    logger.error(error);
    return res.status(500).json({ message: "Failed to delete LLM." });
  }
};
