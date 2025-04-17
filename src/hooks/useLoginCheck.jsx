
import { useEffect, useState } from "react";

export default function useLoginCheck(){

    const [loggedIn, setLoggedIn] = useState(false)
    const userType = localStorage.getItem("user_type");
    useEffect(() => {
        const checkLogin = () => {
          const user_id = localStorage.getItem("user_id");
          setLoggedIn(!!user_id);
        };
      
        checkLogin(); // initial check
        window.addEventListener("storage", checkLogin);
      
        return () => window.removeEventListener("storage", checkLogin);
      }, []);

    return  { loggedIn, userType };
}


