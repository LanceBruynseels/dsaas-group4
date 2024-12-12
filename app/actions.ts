"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const displayName = formData.get("displayName")?.toString();
    const accessCode = formData.get("accessCode")?.toString();
    const supabase = await createClient();
    const origin = (await headers()).get("origin");

    if (!email || !password || !accessCode) {
        return encodedRedirect(
            "error",
            "/sign-up-caretaker",
            "Email, password and access code are required",
        );
    }

    // verify access code
    const { data: accessCodeData, error: accessCodeError } = await supabase
        .from('access_codes')
        .select('*')
        .eq('code', accessCode)
        .is('is_used', null)
        .single();

    if (accessCodeError || !accessCodeData) {
        return encodedRedirect(
            "error",
            "/sign-up-caretaker",
            "Invalid or already used access code",
        );
    }

    // update access code status to used
    const { error: updateError } = await supabase
        .from('access_codes')
        .update({ is_used: true })
        .eq('id', accessCodeData.id);

    if (updateError) {
        console.error(updateError);
        return encodedRedirect(
            "error",
            "/sign-up-caretaker",
            "Error updating access code",
        );
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            // emailRedirectTo: `${origin}/auth/callback`,
            data: {
                display_name: displayName,
                role: "caretaker",
                // institution: accessCodeData.institution  // institution msg
            }
        },
    });

    if (error) {
        console.error(error.code + " " + error.message);
        return encodedRedirect(
            "error",
            "/sign-up-caretaker",
            error.message
        );
    } else {
        return encodedRedirect(
            "success",
            "/sign-up-caretaker",
            "Thanks for signing up! Please check your email for a verification link.",
        );
    }
};

export const signInAction = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    // const role;
    const supabase = await createClient();

    // const { error } = await supabase.auth.signInWithPassword({
    //     email,
    //     password,
    // });
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    // console.log("=== Login User Info ===");
    // console.log("Full user object:", user);
    // console.log("User metadata:", user?.user_metadata);
    // console.log("User role:", user?.user_metadata?.role);
    // console.log("User email:", user?.email);
    // console.log("=====================");

    if (error) {
        return encodedRedirect("error", "/sign-in-caretaker", error.message);
    }

    // check role
    const userRole = user?.user_metadata?.role;
    // switch (userRole) {
    //     case "caretaker":
    //         return redirect("/caretaker/home");
    //     case "buyer":
    //         return redirect("/sign-up-caretaker");
    //     default:
    //         console.error("Invalid role:", userRole);
    //         await supabase.auth.signOut();
    //         return encodedRedirect(
    //             "error",
    //             "/sign-in-caretaker",
    //             "Invalid role"
    //         );
    // }

    if (userRole === "buyer") {
        return redirect("/sign-up-caretaker");
    } else {
        return redirect("/caretaker/home");
    }
};

export const forgotPasswordAction = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const supabase = await createClient();
    const origin = (await headers()).get("origin");
    const callbackUrl = formData.get("callbackUrl")?.toString();

    if (!email) {
        return encodedRedirect("error", "/forgot-password", "Email is required");
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
    });

    if (error) {
        console.error(error.message);
        return encodedRedirect(
            "error",
            "/forgot-password",
            "Could not reset password",
        );
    }

    if (callbackUrl) {
        return redirect(callbackUrl);
    }

    return encodedRedirect(
        "success",
        "/forgot-password",
        "Check your email for a link to reset your password.",
    );
};

export const resetPasswordAction = async (formData: FormData) => {
    const supabase = await createClient();

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!password || !confirmPassword) {
        encodedRedirect(
            "error",
            "/protected/reset-password",
            "Password and confirm password are required",
        );
    }

    if (password !== confirmPassword) {
        encodedRedirect(
            "error",
            "/protected/reset-password",
            "Passwords do not match",
        );
    }

    const { error } = await supabase.auth.updateUser({
        password: password,
    });

    if (error) {
        encodedRedirect(
            "error",
            "/protected/reset-password",
            "Password update failed",
        );
    }

    encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/sign-in-caretaker");
};
