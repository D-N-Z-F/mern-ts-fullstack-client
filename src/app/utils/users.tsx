import axios from "axios";
import {
  UserI,
  RegisterUserI,
  UpdateUserI,
} from "@/interfaces_and_types/UserI";

export const register = async ({ user, upload }: RegisterUserI) => {
  const formData = new FormData();
  formData.append("name", user.name);
  formData.append("username", user.username);
  formData.append("email", user.email);
  formData.append("password", user.password);
  formData.append("gender", user.gender);
  if (upload) formData.append("image", upload);

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
    formData
  );

  return res.data;
};

export const login = async (user: UserI) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
    user
  );
  return res.data;
};

export const getProfile = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
    {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    }
  );
  return res.data;
};

export const updateUser = async ({ updatedUser, upload }: UpdateUserI) => {
  const formData = new FormData();
  formData.append("name", updatedUser.name);
  formData.append("username", updatedUser.username);
  formData.append("email", updatedUser.email);
  formData.append("gender", updatedUser.gender);
  if (upload) formData.append("image", upload);

  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${updatedUser._id}`,
    formData,
    {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    }
  );

  return res.data;
};

export const verifyUser = async (id: string) => {
  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
    null,
    {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    }
  );

  return res.data;
};

export const upgradeUser = async (id: string) => {
  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/premium/${id}`,
    null,
    {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    }
  );

  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
    {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    }
  );

  return res.data;
};
