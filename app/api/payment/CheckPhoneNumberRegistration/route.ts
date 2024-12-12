// import { createClient } from '@/utils/supabase/server';
// import {NextRequest, NextResponse} from "next/server";
//
// export async function POST(req: NextRequest) {
//     try {
//         const { phone } = await req.json();
//
//         if (!phone) {
//             return NextResponse.json({ error: "Telefoon nummer is vereist." }, { status: 400 });
//         }
//
//         const supabase = await createClient();
//         const { data, error } = await supabase
//             .from('caretakers')
//             .select('phone')
//             .eq('phone', phone)
//             .single();
//
//         if (error && error.code !== 'PGRST116') {
//             // Handle unexpected errors
//             return NextResponse.json({ error: "Er is een fout opgetreden." }, { status: 500 });
//         }
//
//         return NextResponse.json({ available: !data }); // If no data, email is available
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ error: "Serverfout." }, { status: 500 });
//     }
// }
