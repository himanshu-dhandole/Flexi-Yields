// import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";
// import DefaultLayout from "@/layouts/default";

// export default function ErrorPage() {
//     return (
//         <DefaultLayout>
       
//          <div className="relative w-full h-screen overflow-hidden">
//       {/* Gradient Background */}
//       <AnimatedGradientBackground />

//       <div className="relative z-10 flex flex-col items-center justify-start h-full px-4 pt-32 text-center">
      
//           <p className="mt-4 text-lg text-gray-300 md:text-xl max-w-lg">
//             A customizable animated radial gradient background with a subtle
//             breathing effect.
//           </p>
//       </div>
//     </div>
//         </DefaultLayout>
//     );
// }
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";
import DefaultLayout from "@/layouts/default";
import { Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function ErrorPage() {
    const handleGoHome = () => {
        window.location.href = "/";
    };

    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <DefaultLayout>
            <div className="relative w-full h-screen overflow-hidden">
                {/* Gradient Background */}
                <AnimatedGradientBackground />

                <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
                    

                    {/* Minimal Text */}
                    <h1 className="text-6xl md:text-7xl font-light text-white mb-3">
                        404
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-200 font-light mb-12">
                        Oops! The page you're looking for doesn't exist.
                    </p>

                    {/* Minimal Buttons */}
                    <div className="flex gap-4">
                       

                        <Link
                            to="/"
                            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-all duration-200 border border-white/20"
                        >
                            <Home className="w-4 h-4" />
                            <span className="font-light">Home</span>
                        </Link>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}