import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const baseUrl = import.meta.env.VITE_APP_API_URL;
console.log("Base URL usada por useFetch:", baseUrl);

const useFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { token: contextToken } = useContext(AuthContext);
  const token = contextToken || localStorage.getItem("cine-tup-token");

  const call = async (url, method = "GET", isPrivate = false, body = null) => {
    setIsLoading(true);
    try {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(isPrivate && token ? { Authorization: `Bearer ${token}` } : {}),
      };

      console.log("useFetch -> request", {
        url: baseUrl + url,
        method,
        isPrivate,
        headers,
        body,
      });

      const res = await fetch(baseUrl + url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }

      if (!res.ok) {
        console.error("useFetch -> error:", res.status, data);
        throw new Error(data?.message || `Error ${res.status}`);
      }

      console.log("useFetch -> response OK:", data);
      return data;
    } catch (err) {
      console.error("useFetch -> catch:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const get = (url, isPrivate = false) => call(url, "GET", isPrivate);
  const post = (url, isPrivate = false, body = null) => call(url, "POST", isPrivate, body);
  const put = (url, isPrivate = false, body = null) => call(url, "PUT", isPrivate, body);
  const del = (url, isPrivate = false) => call(url, "DELETE", isPrivate);

  return { get, post, put, del, isLoading };
};

export default useFetch;
