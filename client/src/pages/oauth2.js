import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function OAuth2() {
  const [code, setCode] = useState("");
  let [searchParams] = useSearchParams();
  useEffect(() => {
    setCode(searchParams);
    fetch("http://localhost:4010/api/auth/token", {
      method: "POST",
      body: JSON.stringify({
        code: "4/0AX4XfWiCxOa6MQtx8jzptYeBz-v_ZldcJBM1Mghx1H1p59of6c3i6Yh933mOWstm88cVHg",
        scope: `https://www.googleapis.com/auth/adwords`,
      }),
      headers: { "Content-Type": "application/json" },
    });
  }, [code]);
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
