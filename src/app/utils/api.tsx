import axios from "axios";

export const verifyEmail = async (email: string) => {
  const verifyKey = "f2102c59eb484a6c994283aecabde18d";
  const res = await axios.get(
    `https://emailvalidation.abstractapi.com/v1/?api_key=${verifyKey}&email=zhifungdaryl23n@forward.edu.my`
  );

  return res;
};
