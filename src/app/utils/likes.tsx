import axios from "axios";

export const getLiked = async () => {
  const res = await axios.get(
    `https://mern-ts-fullstack-server.onrender.com/likes/`,
    {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    }
  );

  return res.data;
};

export const likeUnlike = async (id: string) => {
  const res = await axios.post(
    `https://mern-ts-fullstack-server.onrender.com/likes/${id}`,
    null,
    {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    }
  );

  return res.data;
};
