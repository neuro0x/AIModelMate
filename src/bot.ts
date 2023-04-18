import { exec, spawn } from "child_process";
import { promisify } from "util";
import fs from "fs";
import os from "os";
import axios from "axios";
import ProgressBar from "progress";
import logger from "./logger";

/**
 * The Bot class is a TypeScript implementation of a chatbot that uses a pre-trained GPT model to
 * generate responses to user prompts.
 */
export class Bot {
  private bot: ReturnType<typeof spawn> | null = null;
  private model: string;
  private decoderConfig: Record<string, any>;
  private executablePath: string;
  private modelPath: string;

  /**
   * This is a constructor function that initializes properties for a chatbot model.
   * @param [model=gpt4all-lora-quantized] - The name of the GPT-2 model to be used for generating
   * text. The default value is "gpt4all-lora-quantized".
   * @param decoderConfig - `decoderConfig` is an optional parameter that is a record of key-value
   * pairs. It can be used to pass additional configuration options to the decoder. The type of the
   * values can be any data type.
   */
  constructor(
    model = "gpt4all-lora-quantized",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decoderConfig: Record<string, any> = {}
  ) {
    this.model = model;
    this.decoderConfig = decoderConfig;

    // allowed models:
    //   M1 Mac/OSX: cd chat;./gpt4all-lora-quantized-OSX-m1
    //   Linux: cd chat;./gpt4all-lora-quantized-linux-x86
    //   Windows (PowerShell): cd chat;./gpt4all-lora-quantized-win64.exe
    //   Intel Mac/OSX: cd chat;./gpt4all-lora-quantized-OSX-intel

    if (
      "gpt4all-lora-quantized" !== model &&
      "gpt4all-lora-unfiltered-quantized" !== model
    ) {
      throw new Error(`Model ${model} is not supported. Current models supported are: 
                gpt4all-lora-quantized
                gpt4all-lora-unfiltered-quantized`);
    }

    this.executablePath = `./executables/builtBot`;
    this.modelPath = `./models/${model}.bin`;
  }

  /**
   * This function initializes a bot by downloading necessary files if they do not already exist.
   */
  async init(): Promise<void> {
    const downloadPromises: Promise<void>[] = [];

    if (!fs.existsSync(this.executablePath)) {
      downloadPromises.push(this.downloadExecutable());
    }

    if (!fs.existsSync(this.modelPath)) {
      downloadPromises.push(this.downloadModel());
    }

    await Promise.all(downloadPromises);
    logger.info("Bot initialized.");
  }

  /**
   * This function opens a bot and waits for it to be ready.
   */
  public async open(): Promise<void> {
    if (this.bot !== null) {
      this.close();
    }

    const spawnArgs = [this.executablePath, "--model", this.modelPath];

    for (const [key, value] of Object.entries(this.decoderConfig)) {
      spawnArgs.push(`--${key}`, value.toString());
    }

    this.bot = spawn(spawnArgs[0], spawnArgs.slice(1), {
      stdio: ["pipe", "pipe", "ignore"],
    });

    // wait for the bot to be ready
    await new Promise((resolve) => {
      logger.info("Bot open.");
      this.bot?.stdout?.on("data", (data) => {
        if (data.toString().includes(">")) {
          resolve(true);
        }
      });
    });
  }

  /**
   * This function closes the bot and logs a message indicating that it has been closed.
   */
  public close(): void {
    if (this.bot?.stdout) {
      this.bot.kill();
      this.bot = null;
      logger.info("Bot closed.");
    }
  }

  /**
   * This function downloads an executable file based on the user's operating system and sets the
   * appropriate permissions.
   */
  private async downloadExecutable(): Promise<void> {
    let upstream: string;
    const platform = os.platform();

    if (platform === "darwin") {
      // check for M1 Mac
      const { stdout } = await promisify(exec)("uname -m");
      if (stdout.trim() === "arm64") {
        upstream =
          "https://github.com/nomic-ai/gpt4all/blob/main/chat/gpt4all-lora-quantized-OSX-m1?raw=true";
      } else {
        upstream =
          "https://github.com/nomic-ai/gpt4all/blob/main/chat/gpt4all-lora-quantized-OSX-intel?raw=true";
      }
    } else if (platform === "linux") {
      upstream =
        "https://github.com/nomic-ai/gpt4all/blob/main/chat/gpt4all-lora-quantized-linux-x86?raw=true";
    } else if (platform === "win32") {
      upstream =
        "https://github.com/nomic-ai/gpt4all/blob/main/chat/gpt4all-lora-quantized-win64.exe?raw=true";
    } else {
      throw new Error(
        `Your platform is not supported: ${platform}. Current binaries supported are for OSX (ARM and Intel), Linux and Windows.`
      );
    }

    await this.downloadFile(upstream, this.executablePath);

    await fs.chmod(this.executablePath, 0o755, (err) => {
      if (err) {
        throw err;
      }
    });

    logger.info(`File downloaded successfully to ${this.executablePath}`);
  }

  /**
   * This function downloads a binary file from a specified URL and saves it to a specified path.
   */
  private async downloadModel(): Promise<void> {
    const modelUrl = `https://the-eye.eu/public/AI/models/nomic-ai/gpt4all/${this.model}.bin`;

    await this.downloadFile(modelUrl, this.modelPath);

    logger.info(`File downloaded successfully to ${this.modelPath}`);
  }

  /**
   * This function downloads a file from a given URL and saves it to a specified destination while
   * displaying a progress bar.
   * @param {string} url - The URL of the file to be downloaded.
   * @param {string} destination - The destination parameter is a string that represents the path and
   * filename where the downloaded file will be saved.
   * @returns A Promise that resolves with void (i.e., nothing).
   */
  private async downloadFile(url: string, destination: string): Promise<void> {
    const { data, headers } = await axios.get(url, { responseType: "stream" });
    const totalSize = parseInt(headers["content-length"], 10);
    const progressBar = new ProgressBar("[:bar] :percent :etas", {
      complete: "=",
      incomplete: " ",
      width: 20,
      total: totalSize,
    });

    await fs.mkdir("./executables", { recursive: true }, (err) => {
      if (err) {
        logger.error(err);
        throw err;
      }
    });

    await fs.mkdir("./models", { recursive: true }, (err) => {
      if (err) {
        logger.error(err);
        throw err;
      }
    });

    const writer = fs.createWriteStream(destination);

    data.on("data", (chunk: Buffer) => {
      progressBar.tick(chunk.length);
    });

    data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  }

  /**
   * This function prompts the user for input and returns a promise that resolves with the user's
   * input.
   * @param {string} prompt - The prompt parameter is a string that represents the message or question
   * that the bot will display to the user, prompting them to provide input.
   * @returns A Promise that resolves to a string.
   */
  public prompt(prompt: string): Promise<string> {
    if (!this.bot?.stdin || !this.bot?.stdout) {
      throw new Error("Bot is not initialized.");
    }

    this.bot.stdin.write(prompt.trim() + "\n");

    return new Promise((resolve, reject) => {
      let response = "";
      let timeoutId: NodeJS.Timeout;

      /**
       * The function waits for data on stdout and updates a response variable until it receives a ">"
       * character or a timeout is reached.
       * @param {Buffer} data - A buffer containing the data received on stdout.
       */
      const onStdoutData = (data: Buffer) => {
        const text = data.toString();
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        if (text.includes(">")) {
          // logger.info('Response starts with >, end of message - Resolving...'); // Debug log: Indicate that the response ends with "\\f"
          terminateAndResolve(response); // Remove the trailing "\f" delimiter
        } else {
          // timeoutId = setTimeout(() => {
          //   // logger.info('Timeout reached - Resolving...'); // Debug log: Indicate that the timeout has been reached
          //   terminateAndResolve(response);
          // }, 10000); // Set a timeout of 4000ms to wait for more data
        }
        logger.debug(`Received text: ${text}`); // Debug log: Show the received text
        response += text;
        logger.debug(`Updated response: ${JSON.stringify(response)}`); // Debug log: Show the updated response
      };

      /**
       * This function removes event listeners for stdout data and error, and rejects with an error if
       * the bot is not initialized.
       * @param {Error} err - Error - this is the error object that is passed to the function when an
       * error event is emitted by the stdout stream. It contains information about the error that
       * occurred.
       */
      const onStdoutError = (err: Error) => {
        if (!this.bot?.stdout) {
          throw new Error("Bot is not initialized.");
        }

        this.bot.stdout.removeListener("data", onStdoutData);
        this.bot.stdout.removeListener("error", onStdoutError);
        reject(err);
      };

      /**
       * This function terminates a bot's stdout and resolves a final response.
       * @param {string} finalResponse - finalResponse is a string parameter that represents the final
       * response that will be resolved by the function.
       */
      const terminateAndResolve = (finalResponse: string) => {
        if (!this.bot?.stdout) {
          throw new Error("Bot is not initialized.");
        }

        this.bot.stdout.removeListener("data", onStdoutData);
        this.bot.stdout.removeListener("error", onStdoutError);
        // check for > at the end and remove it
        if (finalResponse.endsWith(">")) {
          finalResponse = finalResponse.slice(0, -1);
        }

        resolve(finalResponse.trim());
      };

      if (!this.bot?.stdout) {
        throw new Error("Bot is not initialized.");
      }

      this.bot.stdout.on("data", onStdoutData);
      this.bot.stdout.on("error", onStdoutError);
    });
  }
}
