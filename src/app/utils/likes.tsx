import axios from "axios";

export const getLiked = async () => {
  const res = await axios.get("http://localhost:8000/likes/", {
    headers: {
      "x-auth-token": localStorage.getItem("token"),
    },
  });

  return res.data;
};

export const likeUnlike = async (id: string) => {
  const res = await axios.post(`http://localhost:8000/likes/${id}`, null, {
    headers: {
      "x-auth-token": localStorage.getItem("token"),
    },
  });

  return res.data;
};
