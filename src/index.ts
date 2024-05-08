import axios from "axios";
import { createReadStream, existsSync } from "fs";
import FormData from "form-data";
import core from "@actions/core";
import github from "@actions/github";
import path from "path";

interface ReturnData {
  status: number;
  text: string;
}

function getBaseUrl(): string {
  const BOT_URL = process.env.BOT_URL;
  if (BOT_URL === undefined) {
    core.setFailed("BOT_URL is not defined");
    console.error("BOT_URL is not defined");
    process.exit(1);
  }
  const BOT_TOKEN = process.env.BOT_TOKEN;
  if (BOT_TOKEN === undefined) {
    core.setFailed("BOT_TOKEN is not defined");
    console.error("BOT_TOKEN is not defined");
    process.exit(1);
  }

  if (BOT_URL.endsWith("/")) {
    return `${BOT_URL}${BOT_TOKEN}`;
  }
  return `${BOT_URL}/${BOT_TOKEN}`;
}

async function postMessage(text: string): Promise<ReturnData> {
  const url = getBaseUrl() + "/json";
  //   console.log(`the sending url is ${url} and the text is ${text}`)
  core.debug(`the sending url is ${url} and the text is ${text}`);
  const data = {
    encrypted: false,
    msg: text,
  };
  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    core.debug(`Response status: ${response.status}`);
    core.debug(`Response text: ${response.data}`);
    return {
      status: response.status,
      text: response.data,
    };
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Error sending message: ${error.message}`);
      console.error(`Error sending message: ${error.message}`);
    }
    process.exit(1);
  }
}

async function postFile(filepath: string): Promise<ReturnData> {
  // if filepath not exists
  if (!existsSync(filepath)) {
    core.setFailed(`File does not exist: ${filepath}`);
  }

  const url = getBaseUrl() + "/file";
  //   console.log(`the sending url is ${url} and the filepath is ${filepath}`)
  const data = new FormData();
  data.append("file", createReadStream(filepath));
  try {
    const response = await axios.post(url, data, {
      headers: {
        ...data.getHeaders(),
      },
    });
    console.log(response.data);
    return {
      status: response.status,
      text: response.data,
    };
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Error sending file: ${error.message}`);
    }
    process.exit(1);
  }
}

async function run() {
  const successMessage = `
  Build of \`${github.context.repo}\` successful!
  Commit: \`${github.context.sha}\`
  Action: [Action Detail](https://github.com/${github.context.repo}/actions/runs/${github.context.runId})
  `;
  if (core.getInput("push_success") === "true") {
    core.info("Sending success message");
    await postMessage(successMessage);
  } else {
    core.warning("No success message to send");
  }
  const text = core.getInput("text");
  if (text !== "" && text !== undefined) {
    core.info("Sending text message");
    await postMessage(text);
  } else {
    core.warning("No text to send");
  }
  const filepaths = core.getInput("files");
  if (filepaths !== "" && filepaths !== undefined) {
    const files = filepaths.split(",");
    for (const file of files) {
      if (file !== "") {
        // get the abs path of the file
        const filepath = path.resolve(file);
        core.info(`Sending file: ${filepath}`);
        await postFile(filepath);
      }
    }
  } else {
    core.warning("No files to send");
  }
}

run();
