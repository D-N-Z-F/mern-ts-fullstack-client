"use client";

import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import {
  BookmarkSquareIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  CursorArrowRippleIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { deleteUser, updateUser, verifyUser } from "../utils/users";
import { UserI } from "@/interfaces_and_types/UserI";
import { toast } from "react-toastify";
import { AuthContext } from "../AuthContextProvider";
import { verifyEmail } from "../utils/api";
import PayPal from "@/components/Paypal";
import { permanentRedirect, useRouter } from "next/navigation";
import { useQueryClient } from "react-query";

export default function UserProfile() {
  const { user, setUser, setToken } = useContext(AuthContext);

  const [editing, setEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<UserI | null>(null);
  const [upload, setUpload] = useState<File | null>(null);

  const [isPaying, setIsPaying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [color, setColor] = useState("");

  const queryClient = useQueryClient();
  const { push } = useRouter();

  const styles = {
    info: "flex w-full h-1/6 border-b border-white flex items-end",
    name: "font-bold mr-2 hidden sm:block",
    buttons:
      "w-2/3 sm:w-1/2 flex justify-center items-center p-2 rounded-md mb-2 text-black transition duration-100 ease-in-out hover:text-black hover:transform hover:scale-90",
    inputs: "p-2 border rounded-md focus:outline-none focus:border-red-500",
    div: "flex flex-col",
    button:
      "w-1/2 h-1/6 p-2 flex justify-center items-center rounded-md bg-gray-900 transition duration-100 ease-in-out lg:hover:bg-gray-700 lg:hover:transform lg:hover:scale-90",
    select:
      "p-2 rounded-md my-2 border focus:outline-none focus:border-red-500",
  };

  const colorRandomizer = () => {
    const colorArr = [
      "bg-gradient-to-r from-sky-500 to-blue-500",
      "bg-gradient-to-r from-blue-500 to-indigo-500",
      "bg-gradient-to-r from-indigo-500 to-purple-500",
      "bg-gradient-to-r from-purple-500 to-pink-500",
      "bg-gradient-to-r from-pink-500 to-rose-500",
      "bg-gradient-to-r from-warm-gray-500 to-amber-500",
      "bg-gradient-to-r from-amber-500 to-orange-500",
      "bg-gradient-to-r from-orange-500 to-red-500",
      "bg-gradient-to-r from-red-500 to-pink-500",
      "bg-gradient-to-r from-pink-500 to-rose-500",
      "bg-gradient-to-r from-amber-400 to-red-500",
      "bg-gradient-to-r from-red-500 to-pink-500",
      "bg-gradient-to-r from-pink-500 to-purple-500",
      "bg-gradient-to-r from-purple-500 to-indigo-500",
      "bg-gradient-to-r from-indigo-500 to-sky-500",
      "bg-gradient-to-r from-cyan-500 to-sky-500",
      "bg-gradient-to-r from-sky-500 to-blue-500",
      "bg-gradient-to-r from-blue-500 to-indigo-500",
      "bg-gradient-to-r from-indigo-500 to-purple-500",
      "bg-gradient-to-r from-purple-500 to-pink-500",
      "bg-gradient-to-r from-emerald-500 to-green-500",
      "bg-gradient-to-r from-green-500 to-teal-500",
      "bg-gradient-to-r from-teal-500 to-cyan-500",
      "bg-gradient-to-r from-cyan-500 to-sky-500",
      "bg-gradient-to-r from-sky-500 to-blue-500",
    ];
    const colorIdx = Math.floor(Math.random() * colorArr.length);

    return colorArr[colorIdx];
  };

  const joinDate = () => {
    if (user) {
      const joinedDate = user.joinedAt.toLocaleString().slice(0, 10);
      const day = joinedDate.slice(8, 10);
      const month = joinedDate.slice(5, 7);
      const year = joinedDate.slice(0, 4);

      return `${day}/${month}/${year}`;
    }
  };

  const triggerEdit = () => {
    setUpdatedUser(user);
    setEditing(true);
  };

  const verifyHandler = async () => {
    const data = await verifyEmail(user?.email as string);

    if (data.data.deliverability !== "DELIVERABLE") {
      toast.error("Verification failed.", {
        position: "bottom-right",
        autoClose: 2000,
        closeOnClick: true,
        theme: "dark",
        pauseOnHover: false,
      });
    } else {
      const update = await verifyUser(user?._id as string);

      if (update.status) {
        toast.error(update.message, {
          position: "bottom-right",
          autoClose: 2000,
          closeOnClick: true,
          theme: "dark",
          pauseOnHover: false,
        });
      } else {
        localStorage.setItem("user", JSON.stringify(update.updatedUser));
        const user = localStorage.getItem("user") as string;
        setUser(JSON.parse(user));
        toast.success("Email has been verified.", {
          position: "bottom-right",
          autoClose: 2000,
          closeOnClick: true,
          theme: "dark",
          pauseOnHover: false,
        });
      }
    }
  };

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) =>
    setUpdatedUser({
      ...updatedUser,
      [e.target.name]: e.target.value,
    } as UserI);

  const onUploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) setUpload(file);
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = await updateUser({
      updatedUser: updatedUser as UserI,
      upload,
    });

    if (data.status) {
      toast.error(data.message, {
        position: "bottom-right",
        autoClose: 2000,
        closeOnClick: true,
        theme: "dark",
        pauseOnHover: false,
      });
    } else {
      localStorage.setItem("user", JSON.stringify(data.updatedUser));
      const user = localStorage.getItem("user") as string;
      setUser(JSON.parse(user));
      toast.success(data.message, {
        position: "bottom-right",
        autoClose: 2000,
        closeOnClick: true,
        theme: "dark",
        pauseOnHover: false,
      });

      setUpload(null);
      setUpdatedUser(null);
      setEditing(false);
    }
  };

  const deleteHandler = async () => {
    const data = await deleteUser(user?._id as string);

    if (data.status) {
      toast.error(data.message, {
        position: "bottom-right",
        autoClose: 2000,
        closeOnClick: true,
        theme: "dark",
        pauseOnHover: false,
      });
    } else {
      queryClient.clear();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
      toast.success(data.message, {
        position: "bottom-right",
        autoClose: 2000,
        closeOnClick: true,
        theme: "dark",
        pauseOnHover: false,
      });
      setTimeout(() => push("/"), 1000);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("user") && !localStorage.getItem("token"))
      permanentRedirect("/login");
    setColor(colorRandomizer());
  }, [user]);

  return (
    <div className="w-3/4 h-full bg-gray-800 flex flex-wrap justify-center items-center p-2 pl-0">
      {user ? (
        <>
          <div className="relative w-full h-full bg-gray-900 rounded-md p-2 flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-full h-1/2 flex items-center justify-end p-5">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/${user.image}`}
                className="w-32 h-32 md:w-52 md:h-52 rounded-full object-cover brightness-50 sm:mr-5 z-20 hidden sm:flex"
                alt="userIcon"
              />
            </div>
            <div className={`w-full h-1/4 ${color} rounded-md`}>
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/${user.image}`}
                className="w-full h-full rounded-md object-cover brightness-50 block sm:hidden"
                alt="userIcon"
              />
            </div>
            <div className="w-full h-3/4 flex flex-wrap p-2 z-10 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
              <div className="sm:w-2/3 sm:h-full flex flex-col">
                <div className="w-full h-full sm:h-2/3 flex flex-wrap justify-end sm:justify-center items-center">
                  <div className={`${styles.info}`}>
                    <h1 className={`${styles.name}`}>NAME: </h1>
                    <h1>{user.name}</h1>
                  </div>
                  <div className={`${styles.info}`}>
                    <h1 className={`${styles.name}`}>USERNAME: </h1>
                    <h1>{user.username}</h1>
                  </div>
                  <div className={`${styles.info}`}>
                    <h1 className={`${styles.name}`}>EMAIL: </h1>{" "}
                    <h1>{user.email}</h1>
                  </div>
                  <div className={`${styles.info}`}>
                    <h1 className={`${styles.name}`}>GENDER: </h1>
                    <h1>{user.gender}</h1>
                  </div>
                  <div className={`${styles.info}`}>
                    <h1 className={`${styles.name}`}>JOINED: </h1>
                    <h1>{joinDate()}</h1>
                  </div>
                </div>
                <div className="w-full h-1/3 py-2">
                  <button
                    onClick={triggerEdit}
                    className="flex p-3 mt-2 bg-zinc-800 rounded-md transition duration-100 ease-in-out hover:transform hover:scale-90"
                  >
                    <PencilSquareIcon className="w-6 h-6" />
                    <h1>Edit Details</h1>
                  </button>
                </div>
              </div>
              <div className="w-full md:w-1/3 md:h-full flex flex-col md:justify-end md:items-end">
                {!user.isVerified ? (
                  <button
                    onClick={verifyHandler}
                    className={`${styles.buttons} bg-emerald-400`}
                  >
                    <CheckCircleIcon className="w-6 h-6" />
                    <h1 className="text-sm sm:text-md lg:text-lg">
                      Verify Email
                    </h1>
                  </button>
                ) : null}
                {!user.isPremium ? (
                  <button
                    onClick={() => {
                      setIsPaying(true);
                    }}
                    className={`${styles.buttons} bg-rose-400`}
                  >
                    <CheckBadgeIcon className="w-6 h-6" />
                    <h1 className="text-sm sm:text-md lg:text-lg">
                      Become Premium
                    </h1>
                  </button>
                ) : null}

                {!user.isAdmin ? (
                  <button
                    onClick={() => setIsDeleting(true)}
                    className={`${styles.buttons} bg-red-400`}
                  >
                    <ExclamationTriangleIcon className="w-6 h-6" />
                    <h1 className="text-sm sm:text-md lg:text-lg">
                      Delete Account
                    </h1>
                  </button>
                ) : null}
              </div>
            </div>
          </div>
          {!editing ? null : (
            <div
              className="absolute top-0 left-0 w-screen h-screen z-20 flex flex-col p-4"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              <div className="w-full h-1/6 flex justify-end">
                <XMarkIcon
                  className="w-16 h-16 md:w-24 md:h-24 cursor-pointer transition duration-100 ease-in-out hover:bg-gray-900 rounded-lg hover:transform hover:scale-90"
                  onClick={() => {
                    setEditing(false);
                  }}
                />
              </div>
              <div className="w-full h-5/6 flex justify-center">
                <div className="sm:w-3/4 md:w-1/2 lg:w-1/3 h-4/5 bg-gray-800 rounded-lg">
                  <form
                    method="POST"
                    encType="multipart/form-data"
                    onSubmit={onSubmitHandler}
                    className="p-2"
                  >
                    <div className={`${styles.div}`}>
                      <label>Name</label>
                      <input
                        className={`${styles.inputs}`}
                        type="text"
                        name="name"
                        onChange={onChangeHandler}
                        value={updatedUser?.name}
                      />
                    </div>
                    <div className={`${styles.div}`}>
                      <label>Username</label>
                      <input
                        className={`${styles.inputs}`}
                        type="text"
                        name="username"
                        onChange={onChangeHandler}
                        value={updatedUser?.username}
                      />
                    </div>
                    <div className={`${styles.div}`}>
                      <label>Email</label>
                      <input
                        className={`${styles.inputs}`}
                        type="email"
                        name="email"
                        onChange={onChangeHandler}
                        value={updatedUser?.email}
                      />
                    </div>
                    <div className={`${styles.div}`}>
                      <label>Profile Picture</label>
                      <input
                        className={`${styles.inputs} w-full`}
                        type="file"
                        name="image"
                        onChange={onUploadHandler}
                      />
                    </div>
                    <div className={`${styles.div}`}>
                      <select
                        name="gender"
                        defaultValue={updatedUser?.gender}
                        onChange={onChangeHandler}
                        className={`${styles.select}`}
                      >
                        <option disabled value="none">
                          Choose Gender
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non-binary">Non-Binary</option>
                        <option value="undisclosed">Prefer Not To Say</option>
                      </select>
                    </div>
                    <button className={`${styles.button}`}>
                      <BookmarkSquareIcon className="w-6 h-6" />
                      <h1 className="text-lg ml-1 hidden sm:block">UPDATE</h1>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
          {!isPaying ? null : (
            <div
              className="absolute top-0 left-0 w-screen h-screen z-20 flex flex-col p-4"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              <div className="w-full h-1/6 flex justify-end">
                <XMarkIcon
                  className="w-16 h-16 md:w-24 md:h-24 cursor-pointer transition duration-100 ease-in-out hover:bg-gray-900 rounded-lg hover:transform hover:scale-90"
                  onClick={() => {
                    setIsPaying(false);
                  }}
                />
              </div>
              <div className="w-full h-5/6 flex justify-center">
                <div className="sm:w-3/4 md:w-1/2 lg:w-1/3 h-4/5 bg-gray-800 rounded-lg p-2 flex flex-col">
                  <div className="w-full h-1/2 flex flex-col justify-center items-center p-4 text-center">
                    <h1>Become a premium member for just $49.99 now!</h1>
                    <small>One-time payment!</small>
                  </div>
                  <PayPal setIsPaying={setIsPaying} />
                </div>
              </div>
            </div>
          )}
          {!isDeleting ? null : (
            <div
              className="absolute top-0 left-0 w-screen h-screen z-20 flex flex-col p-4"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              <div className="w-full h-1/6 flex justify-end">
                <XMarkIcon
                  className="w-16 h-16 md:w-24 md:h-24 cursor-pointer transition duration-100 ease-in-out hover:bg-gray-900 rounded-lg hover:transform hover:scale-90"
                  onClick={() => {
                    setIsDeleting(false);
                  }}
                />
              </div>
              <div className="w-full h-5/6 flex justify-center">
                <div className="sm:w-3/4 md:w-1/2 lg:w-1/3 h-4/5 bg-gray-800 rounded-lg p-2 flex flex-col">
                  <div className="w-full h-full flex flex-col justify-center items-center p-4 text-center">
                    <h1 className="text-lg">
                      Are you sure you want to delete?
                    </h1>
                    <small>This action is irreversible!</small>
                    <button
                      onClick={deleteHandler}
                      className={`${styles.buttons} bg-red-400 mt-8`}
                    >
                      <ExclamationTriangleIcon className="w-6 h-6" />
                      <h1 className="text-sm sm:text-md lg:text-lg hidden sm:block">
                        Delete Account
                      </h1>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full bg-gray-900 rounded-md flex justify-center items-center">
          <div className="animate-bounce">
            <CursorArrowRippleIcon className="w-12 h-12" />
          </div>
        </div>
      )}
    </div>
  );
}
