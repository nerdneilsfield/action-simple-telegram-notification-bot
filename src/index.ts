import axios from "axios";
import { createReadStream, existsSync } from "fs";
import FormData from "form-data";
import core from "@actions/core";
import github from "@actions/github";

interface ReturnData {
  status: number;
  text: string;
}

function getBaseUrl(): string {
  const BOT_URL = process.env.BOT_URL;
  if (BOT_URL === undefined) {
    console.error("BOT_URL is not defined");
    process.exit(1);
  }
  const BOT_TOKEN = process.env.BOT_TOKEN;
  if (BOT_TOKEN === undefined) {
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
    console.log(response.data);
    return {
      status: response.status,
      text: response.data,
    };
  } catch (error) {
    console.error(`Error sending message: ${error}`);
    process.exit(1);
  }
}

async function postFile(filepath: string): Promise<ReturnData> {
  // if filepath not exists
  if (!existsSync(filepath)) {
    console.error("File not found");
    throw new Error("File not found");
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
    console.error(`Error sending file: ${error}`);
    process.exit(1);
  }
}

async function run() {
  const successMessage = `
  Build of **${github.context.repo}** successful!
  Commit: ${github.context.sha}
  Action: [Action Detail](https://github.com/${github.context.repo}/actions/runs/${github.context.runId})
  `;
  if (core.getInput("push_success") === "true") {
    await postMessage(successMessage);
  }
  const text = core.getInput("text");
  if (text !== "" && text !== undefined) {
    await postMessage(text);
  }
  const filepaths = core.getInput("files");
  if (filepaths !== "" && filepaths !== undefined) {
    const files = filepaths.split(",");
    for (const file of files) {
      if (file !== "") {
        await postFile(file);
      }
    }
  }
}

run();
