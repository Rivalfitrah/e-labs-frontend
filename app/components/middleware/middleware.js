import { getProfile } from "~/lib/api/auth";

export async function middlewareAuth(){
    try{
        const profile = await getProfile();
        console.log('Middleware fetched profile:', profile);
        return profile;
    }catch(error){
        console.error('Middleware auth error:', error);
        throw error;
    }
}
export async function middlewareRoleCheck(allowedRoles = []) {
    try {
        const profile = await getProfile();
        console.log('Middleware role check profile:', profile);

        // Extract user's role from profile.data.role.nama_role
        const userRole = profile?.data?.role?.nama_role;

        console.log('User role:', userRole);
        // If allowedRoles is empty, allow all roles
        if (allowedRoles.length === 0) {
            return true;
        }

        // Check if user's role is in allowedRoles
        if (allowedRoles.includes(userRole)) {
            return true;
        } else {
            throw new Error('Access denied: insufficient role');
        }
    } catch (error) {
        console.error('Middleware role check error:', error);
        throw error;
    }
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