// 'use client';
//
// import { SessionProvider } from "next-auth/react";
// import { ThemeProvider } from "next-themes";
//
//
// // export default function App({
// //                                 Component,
// //                                 pageProps: { session, ...pageProps },
// //                             }) {
// //     return (
// //         <SessionProvider session={session}>
// //             {Component.auth ? (
// //                 <Auth>
// //                     <Component {...pageProps} />
// //                 </Auth>
// //             ) : (
// //                 <Component {...pageProps} />
// //             )}
// //         </SessionProvider>
// //     )
// // }
// export default function Providers({ children }: { children: React.ReactNode }) {
//     return (
//         <SessionProvider>
//             <ThemeProvider
//                 attribute="class"
//                 defaultTheme="system"
//                 enableSystem
//                 disableTransitionOnChange
//             >
//                 {children}
//             </ThemeProvider>
//         </SessionProvider>
//     );
// }