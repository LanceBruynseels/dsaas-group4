// import { createClient } from '@supabase/supabase-js'
// import { cookies } from 'next/headers'
// import { redirect } from 'next/navigation'
//
// const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// )
//
// export async function signInAction(formData: FormData) {
//   const email = formData.get('email') as string
//   const password = formData.get('password') as string
//
//   try {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     })
//
//     if (error) {
//       return {
//         type: 'error' as const,
//         message: error.message,
//       }
//     }
//
//     if (data.session) {
//       // 使用 cookies().set 的正确方式
//       const cookieStore = cookies()
//       await cookieStore.set('session', JSON.stringify(data.session))
//     }
//
//     redirect('/dashboard')
//   } catch (error) {
//     return {
//       type: 'error' as const,
//       message: 'An unexpected error occurred',
//     }
//   }
// }