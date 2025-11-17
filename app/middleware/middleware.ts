import { getProfile } from "~/lib/api/auth";


export default defineNuxtRouteMiddleware(async (to) => {
  console.log("🔒 Middleware dipanggil untuk route:", to.path);
  
  const profile = await getProfile();
  console.log("📋 Profile result:", profile);

  // 🔥 Tidak ada token → redirect ke login (user belum pernah login)
  if (profile?.noToken) {
    console.log("❌ Tidak ada token, redirect ke login");
    return navigateTo("/auth/login");  
  }

  // 🔥 Token ada tapi tidak valid/expired → redirect ke login
  if (profile?.expired) {
    console.log("⚠️ Token expired, redirect ke login");
    return navigateTo("/auth/login");
  }

  console.log("✅ Auth check passed");
  return true;
});


export async function middlewareRoleCheck(allowedRoles: string[] = []) {
  const profile = await getProfile();

  // 🔥 Tidak ada token → redirect ke login
  if (profile?.noToken) {
    return navigateTo("/auth/login");
  }

  // 🔥 Token ada tapi tidak valid/expired → redirect ke login
  if (profile?.expired) {
    return navigateTo("/auth/login");
  }

  const role = profile?.data?.role?.nama_role;

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return navigateTo("/403"); // Forbidden
  }

  return true;
}



// Fungsi baru untuk mendapatkan peran, agar lebih bersih di komponen
export async function getUserRole() {
    try {
        const profile = await getProfile();
        return profile?.data?.role?.nama_role || 'guest'; // Default ke 'guest' jika gagal
    } catch (error) {
        console.error('Failed to fetch user role:', error);
        return 'guest';
    }
}