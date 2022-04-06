import React from "react";
import { useRouter } from "next/router";
import { Button } from "../components/Common";

const Custom404 = () => {
  const router = useRouter();
  return (
    <div>
      <h1 style={{ margin: "20px 0" }}>404 - Page Not Found</h1>
      <Button
        type="button"
        content="go back"
        look="small-button"
        clickHandler={() => router.back()}
      />
    </div>
  );
};

export default Custom404;
