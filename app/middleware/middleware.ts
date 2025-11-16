import { getProfile } from "~/lib/api/auth";


export default defineNuxtRouteMiddleware(async () => {
  const profile = await getProfile();

  // 🔥 Tidak ada token → redirect ke 404 (user belum pernah login)
  if (profile?.noToken) {
    return navigateTo("/404");  
  }

  // 🔥 Token ada tapi tidak valid/expired → redirect ke login
  if (profile?.expired) {
    return navigateTo("/auth/login");
  }

  return true;
});


export async function middlewareRoleCheck(allowedRoles: string[] = []) {
  const profile = await getProfile();

  // 🔥 Tidak ada token → redirect ke 404
  if (profile?.noToken) {
    return navigateTo("/404");
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