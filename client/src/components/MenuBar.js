import React, { useContext, useState } from "react";
import { Confirm, Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { AuthContext } from "../auth";

export default function MenuBar() {
  const { user, logout } = useContext(AuthContext);

  const path = window.location.pathname.substr(1);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const [activeItem, setActiveItem] = useState(path ? path : "home");

  const handleItemClick = (e, { name }) => setActiveItem(name);

  const menuBar = user ? (
    <>
      <Menu pointing secondary size="massive" color="yellow">
        <Menu.Item name={user.username} active as={Link} to="/" />

        <Menu.Menu position="right">
          <Menu.Item name="logout" onClick={() => setConfirmOpen(true)} />
        </Menu.Menu>
      </Menu>

      <Confirm
        open={confirmOpen}
        onCancel={() => {
          setConfirmOpen(false);
        }}
        onConfirm={() => {
          logout();
          setActiveItem("home");
          setConfirmOpen(false);
        }}
        content="Are you sure you want to logout ?"
      />
    </>
  ) : (
    <Menu pointing secondary size="massive" color="yellow">
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />

      <Menu.Menu position="right">
        <Menu.Item
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
        <Menu.Item
          name="register"
          active={activeItem === "register"}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
      </Menu.Menu>
    </Menu>
  );

  return menuBar;
}
