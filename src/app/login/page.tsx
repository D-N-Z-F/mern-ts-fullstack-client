"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { AuthContext } from "@/app/AuthContextProvider";
import { toast } from "react-toastify";
import { UserI } from "@/interfaces_and_types/UserI";
import { login, register } from "@/app/utils/users";
import { GoogleLogin } from "@react-oauth/google";
import {
  ArrowRightEndOnRectangleIcon,
  CursorArrowRippleIcon,
  FingerPrintIcon,
  UserIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

export default function LoginRegister() {
  const styles = {
    tabs: "w-1/2 h-full flex justify-center items-center transition duration-100 ease-in-out",
    inputs: "p-2 border rounded-md focus:outline-none focus:border-red-500",
    input: "w-full p-2 border focus:outline-none focus:border-red-500",
    div: "flex flex-col",
    buttons:
      "text-white w-1/3 h-full p-2 flex justify-center items-center rounded-md transition duration-100 ease-in-out lg:hover:brightness-75 lg:hover:transform lg:hover:scale-90",
    select:
      "p-2 rounded-md my-2 border focus:outline-none focus:border-red-500",
  };
  const { setUser, setToken } = useContext(AuthContext);
  const [loginDetails, setloginDetails] = useState({});
  const [registerDetails, setRegisterDetails] = useState({});
  const [upload, setUpload] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("login");
  const { push } = useRouter();

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    if (activeTab === "login")
      setloginDetails({ ...loginDetails, [e.target.name]: e.target.value });
    else if (activeTab === "register")
      setRegisterDetails({
        ...registerDetails,
        [e.target.name]: e.target.value,
      });
  };

  const onUploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) setUpload(file);
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let data;

    if (activeTab === "login") {
      data = await login(loginDetails as UserI);
    } else if (activeTab === "register") {
      data = await register({ user: registerDetails as UserI, upload });
    }

    if (data.status) {
      toast.error(data.message, {
        position: "bottom-right",
        autoClose: 2000,
        closeOnClick: true,
        theme: "dark",
        pauseOnHover: false,
      });
    } else {
      if (activeTab === "login") {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        console.log(data);
        console.log("Login");
        push("/");
      } else {
        const formElement = e.target as HTMLFormElement;
        formElement.reset();
        setActiveTab("login");
      }

      toast.success(data.message, {
        position: "bottom-right",
        autoClose: 2000,
        closeOnClick: true,
        theme: "dark",
        pauseOnHover: false,
      });
    }
  };

  const activeTabHandler = (state: string) => setActiveTab(state);

  return (
    <div className="w-3/4 h-full bg-gray-800 flex flex-col justify-center items-center pr-2">
      <div className="flex pb-3">
        <h1 className="text-3xl mr-1">Breathythm</h1>
        <CursorArrowRippleIcon className="w-10 h-10" />
      </div>
      <div className="w-full sm:w-2/3 lg:w-1/2 h-5/6 bg-gray-900 p-2 rounded-md">
        <div className="w-full h-1/5 flex justify-center items-center">
          <button
            className={`${styles.tabs} ${
              activeTab === "login" ? "bg-gray-700" : "hover:bg-gray-800"
            } rounded-tl-md rounded-bl-md`}
            onClick={() => activeTabHandler("login")}
          >
            <UserIcon className="w-6 h-6" />
            <h1 className="text-sm sm:text-2xl ml-1">Log In</h1>
          </button>
          <button
            className={`${styles.tabs} ${
              activeTab === "register" ? "bg-gray-700" : "hover:bg-gray-800"
            } rounded-tr-md rounded-br-md`}
            onClick={() => activeTabHandler("register")}
          >
            <UserPlusIcon className="w-6 h-6" />
            <h1 className="text-sm sm:text-2xl ml-1">Register</h1>
          </button>
        </div>
        {activeTab === "login" ? (
          <div>
            <form method="POST" onSubmit={onSubmitHandler} className="p-2">
              <div className={`${styles.div}`}>
                <label>Email</label>
                <input
                  className={`${styles.inputs}`}
                  type="email"
                  name="email"
                  placeholder="Email..."
                  onChange={onChangeHandler}
                />
              </div>
              <div className={`${styles.div}`}>
                <label>Password</label>
                <input
                  className={`${styles.inputs}`}
                  type="password"
                  name="password"
                  placeholder="Password..."
                  onChange={onChangeHandler}
                />
              </div>
              <button
                className={`${styles.buttons} mt-2`}
                style={{ backgroundColor: "#fb503b" }}
              >
                <ArrowRightEndOnRectangleIcon className="w-6 h-6" />
                <h1 className="text-lg hidden sm:block">LOGIN</h1>
              </button>
            </form>
          </div>
        ) : (
          <div>
            <form
              method="POST"
              encType="multipart/form-data"
              onSubmit={onSubmitHandler}
              className="p-2"
            >
              <div className="flex w-full">
                <div className={`${styles.div} w-full`}>
                  <label>Name</label>
                  <input
                    className={`${styles.input} rounded-tl-md rounded-bl-md`}
                    type="text"
                    name="name"
                    placeholder="Name..."
                    onChange={onChangeHandler}
                  />
                </div>
                <div className={`${styles.div} w-full`}>
                  <label>Username</label>
                  <input
                    className={`${styles.input} rounded-tr-md rounded-br-md`}
                    type="text"
                    name="username"
                    placeholder="Username..."
                    onChange={onChangeHandler}
                  />
                </div>
              </div>
              <div className={`${styles.div}`}>
                <label>Email</label>
                <input
                  className={`${styles.inputs}`}
                  type="email"
                  name="email"
                  placeholder="Email..."
                  onChange={onChangeHandler}
                />
              </div>
              <div className={`${styles.div}`}>
                <label>Password</label>
                <input
                  className={`${styles.inputs}`}
                  type="password"
                  name="password"
                  placeholder="Password..."
                  onChange={onChangeHandler}
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
                  defaultValue="none"
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

              <div className="w-full flex items-center">
                <button
                  className={`${styles.buttons} mr-2`}
                  style={{ backgroundColor: "#fb503b" }}
                >
                  <FingerPrintIcon className="w-6 h-6" />
                  <h1 className="text-sm md:text-lg hidden sm:block">
                    REGISTER
                  </h1>
                </button>
                <button type="button">
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      console.log(credentialResponse);
                    }}
                    onError={() => {
                      console.log("Login Failed");
                    }}
                    type="icon"
                    theme="filled_black"
                    login_uri="https://mern-ts-fullstack-server.onrender.com/login"
                  />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
