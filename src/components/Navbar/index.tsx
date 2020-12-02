import * as React from "react";
import { useRouter } from "next/router";


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
      <Link href="/trade">
        <a>Trade</a>
      </Link>
      <Link href="/price">
        <a>Price</a>
      </Link>
      <Link href="/position">
        <a>Position</a>
      </Link>
    </div>
  );
};

export default Navbar;
