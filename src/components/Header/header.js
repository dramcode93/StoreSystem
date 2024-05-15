import { useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import "../../App.css"
function Header() {
  const [show, setshow] = useState(true)
  const mode = () => {
    setshow(!show)
    if (window.localStorage.getItem("mode") === "light") {
      document.body.classList.add('light');
      window.localStorage.setItem("mode", "dark")
      console.log(localStorage.getItem('mode'))
    }
    else if (window.localStorage.getItem("mode") === "dark") {
      document.body.classList.remove('light');
      window.localStorage.setItem("mode", "light")
      console.log(localStorage.getItem('mode'))
    }
  }

  if (window.localStorage.getItem("mode")) {
    document.body.classList = localStorage.getItem("mode");
  }
  else {
    window.localStorage.setItem("mode", "dark")
  }

  return (
    <>
      <header className="flex z-50">
        <div id="icon"  onClick={mode}>
          {window.localStorage.getItem("mode") === "light" ? <FaMoon 
           className="relative bg-transparent rounded-full p-1  
                    text-gray-500  dark:hover:text-white focus:outline-none
                    hover:text-slate-500 w-fit"  size={32}/> : <FaSun
                     className="relative bg-transparent rounded-full p-1  
                     text-gray-500  dark:hover:text-white focus:outline-none
                    hover:text-slate-500 w-fit"  size={32}/>}
        </div>
      </header>
    </>
  );
}

export default Header;
