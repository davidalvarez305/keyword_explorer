import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function OAuth2() {
  const [code, setCode] = useState();
  let [searchParams] = useSearchParams();
  useEffect(() => {
    setCode(searchParams);
    fetch("http://localhost:4010/api/auth/request", {
      method: "POST",
      body: JSON.stringify({
        code,
      }),
      headers: { "Content-Type": "application/json" },
    });
  }, []);
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p style={{ fontSize: 32, fontFamily: "Georgia" }}>{"...Loading"}</p>
    </div>
  );
}
