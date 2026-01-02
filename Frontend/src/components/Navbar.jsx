import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { TbHome, TbSearch, TbMapPin2, TbBubble, TbUserCircle } from "react-icons/tb";

const Navbar = () => {
  useEffect(() => {
    const navbar = document.getElementById("navbar");
    if (navbar) {
      const updateHeight = () => {
        document.documentElement.style.setProperty("--navbar-height", `${navbar.offsetHeight}px`);
      };
      updateHeight();

      // Update on resize/orientation change
      window.addEventListener("resize", updateHeight);
      return () => window.removeEventListener("resize", updateHeight);
    }
  }, []);

  const navItems = [
    { id: "home", label: "Home", icon: <TbHome />, path: "/" },
    { id: "search", label: "Search", icon: <TbSearch />, path: "/search" },
    { id: "map", label: "Map", icon: <TbMapPin2 />, path: "/map" },
    { id: "community", label: "Community", icon: <TbBubble />, path: "/community" },
    { id: "profile", label: "Profile", icon: <TbUserCircle />, path: "/profile" },
  ];

  return (
    <nav
      id="navbar"
      className="fixed bottom-0 left-0 right-0 border-t border-gray-200 shadow-md bg-[var(--white)] font-inter z-50"
    >
      <ul className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <li key={item.id} className="flex flex-col items-center">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center cursor-pointer transition-colors duration-200 ${
                  isActive ? "text-[var(--orange)]" : "text-[var(--black)]"
                }`
              }
            >
              <div className="text-lg">{item.icon}</div>
              <span className="text-[10px] mt-1">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
