import * as React from "react";
import { useRouter } from "next/router";

import NextLink from "next/link";
import "../../styles";
import "./index.css";

function Link({ href, children }) {
  const router = useRouter();

  const active = router.pathname === href;

  return React.cloneElement(children, {
    className: active ? "active" : "",
    href,
  });
}

const Navbar = () => {
  return (
    <div className="Navbar">
      <Link href="/">
        <a>Home</a>
      </Link>
    </div>
  );
};

export default Navbar;
