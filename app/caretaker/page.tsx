// import React from 'react';
// import Image from "next/image";
// import {getServerSession} from "next-auth";
// import {authOptions} from "@/app/api/auth/[...nextauth]/route";
// import {redirect} from "next/navigation";
// import Link  from "next/link";
//
// export default async function Index() {
//
//     const session = await getServerSession(authOptions);
//
//     if(session){
//         return redirect("/home");
//     }
//
//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen text-center relative">
//             <div className="mb-5">
//                 {/* Replace with the actual path to your butterfly logo */}
//                 <Image src="/vlinder_logo_caretaker.png" alt="Vlinder Logo" className="min-w-24 max-w-72 h-auto mx-auto" width={1000}
//                        height={1000}/>
//                 <h1 className="text-4xl font-bold text-gray-800 mt-3">V(L)INDER</h1>
//             </div>
//
//             <div className="flex space-x-4 w-full max-w-md mx-auto mt-5">
//                 <Link href="/sign-in-caretaker" className="flex-1">
//                     <button
//                         className="w-full bg-[#FCA5A5] hover:bg-[#771d1d] text-white py-2 rounded-xl transition duration-300">
//                         LOGIN
//                     </button>
//                 </Link>
//                 <Link href="/registration-caretaker" className="flex-1">
//                     <button
//                         className="w-full bg-[#FCA5A5] hover:bg-[#771d1d] text-white py-2 rounded-xl transition duration-300">
//                         REGISTRATIE
//                     </button>
//                 </Link>
//             </div>
//
//
//         </div>
//     );
// }














