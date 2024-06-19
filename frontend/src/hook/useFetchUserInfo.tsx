import { useState, useEffect } from "react";
import { API_URL } from "../apis/config";
import { getCurrentFirebaseEmail } from "../firebase";

interface UserInfo {
  firstName: string;
  lastName: string;
  username: string;
  userType: "group" | "admin" | "client";
  groupId: number;
  adminId: number;
  clientId: number;
  teamName: string;
  projectPreferences?: number[];
}

export const useFetchUserInfo = (isLoggedin: boolean) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const firebaseEmail = getCurrentFirebaseEmail();
        if (!firebaseEmail) throw new Error("Firebase email not found.");

        const response = await fetch(`${API_URL}/users/${firebaseEmail}`);
        if (!response.ok) throw new Error("Network response was not ok.");

        const userData = await response.json();
        if (userData.groupId !== undefined) {
          setUserInfo({ ...userData, userType: "group" });
        } else if (userData.adminId !== undefined) {
          setUserInfo({ ...userData, userType: "admin" });
        } else if (userData.clientId !== undefined) {
          setUserInfo({ ...userData, userType: "client" });
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    if (isLoggedin) {
      fetchUserInfo();
    }
  }, [isLoggedin]);

  return { userInfo, loading };
};
