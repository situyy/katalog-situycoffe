"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";

export async function login(prevState, formData) {
  const data =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
      ? prevState
      : null;

  const email = data ? data.get("email")?.toString().trim() : "";
  const password = data ? data.get("password")?.toString() : "";

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createAdminClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.code === "invalid_credentials" || error.status === 400) {
      return { error: "Email atau password salah. Periksa kembali akun Anda." };
    }
    return { error: error.message || "Gagal masuk. Silakan coba lagi." };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createAdminClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export const masukAdmin = login;
export const loginAdmin = login;
export const keluarAdmin = logout;
export const logoutAdmin = logout;

