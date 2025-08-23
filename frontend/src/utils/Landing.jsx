// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const Landing = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Redirect after 3 seconds
//     const timer = setTimeout(() => {
//       navigate("/home", {replace: true} );
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [navigate]);

//   return (
//     <div className="flex items-center justify-center h-screen dark:text-white">
//       <h1 className="text-6xl font-bold tracking-widest animate-bounce">
//         LUXORA
//       </h1>
//     </div>
//   );
// }

// export default Landing

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Spline from '@splinetool/react-spline';

const Landing = () => {
    const navigate = useNavigate();

  useEffect(() => {
    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate("/home", {replace: true} );
    }, 7000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="bg-black h-screen w-screen">
        <Spline scene="https://prod.spline.design/D8PdnjVUhgt2GhVI/scene.splinecode" />
    </div>
  );
}

export default Landing

