import SERVICES from "../utils/webservice";
import { message } from "antd";
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
