import SERVICES from "../utils/webservice";
import { message } from "antd";
import { HfInference } from "@huggingface/inference";

const inference = new HfInference(process.env.NEXT_PUBLIC_API_KEY);
export const generateChat = async (payload, signal) => {
  try {
    const response = await SERVICES.post("", payload, signal);

    return response;
  } catch (error) {
    console.log(error, "error");
    // message.error(`${error?.response?.data?.message}`, 2);
    if (error?.response?.data?.errors) {
      error?.response?.data?.errors.map((elem, i) =>
        message.error(elem.message)
      );
    } else if (error?.message) {
      message.error(`${error?.message}`, 2);
    } else {
      message.error(`${error?.response?.data?.message}`, 2);
    }
    return error;
    // throw error.response.data.message;
  }
};

const getChatCompletion = async (input) => {
  const stream = inference.chatCompletionStream({
    model: "meta-llama/Llama-3.2-3B-Instruct",
    messages: [{ role: "user", content: input }],
    max_tokens: 500,
  });

  for await (const chunk of stream) {
    // Safely extract the content
    const content = chunk.choices[0]?.delta?.content || "";
    process.stdout.write(content);
  }
};
