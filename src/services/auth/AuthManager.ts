// import authApi from "./authApi";
// import { decodeToken } from "../../utility/JwtUtility";
// import localStorageUtil from "../../utility/localStorageUtil";
// import UserRoles from "../../routes/userRoles.type";
// export class AuthResult {
//   success: boolean;
//   message: string;

//   constructor(success: boolean, message: string) {
//     this.success = success;
//     this.message = message;
//   }
// }

// class AuthManager {
//   public async login(
//     userName: string,
//     password: string,
//     remember: boolean
//   ): Promise<AuthResult> {
//     try {
//       const authResponse = await authApi.login({
//         username: userName,
//         password,
//       });
//       if (authResponse.success && authResponse.value.accesstoken !== null) {
//         const tokenStorage = remember ? localStorage : sessionStorage;
//         // get the role here
//         tokenStorage.setItem("accessToken", authResponse.value.accesstoken);
//         // this.addUserRoles();

//         return new AuthResult(true, "Login success");
//       } else {
//         console.log("errroer");
//         return { success: false, message: "error" };
//         // return new AuthResult(false, authResponse.error.message);
//       }
//     } catch (error) {
//       console.error("Login failed:", error);
//       return new AuthResult(false, "Login failed");
//     }
//   }

//   public isLoggedIn(): boolean {
//     return !!this.getAccessToken();
//     // return true;
//   }

//   // public logout(): void {
//   //   localStorage.removeItem("accessToken");
//   //   localStorage.removeItem("refreshToken");
//   //   localStorage.removeItem("userEmail");

//   //   sessionStorage.removeItem("accessToken");
//   //   sessionStorage.removeItem("refreshToken");
//   //   sessionStorage.removeItem("userAuthRole");
//   //   sessionStorage.removeItem("userEmail");
//   //   localStorage.clear();
//   //   window.location.assign("/login");
//   // }

//   public getAccessToken(): string | null {
//     return (
//       localStorage.getItem("accessToken") ||
//       sessionStorage.getItem("accessToken")
//     );
//   }

//   // public async getAccessToken(): Promise<string | null> {
//   //   return (
//   //     localStorage.getItem("accessToken") ||
//   //     sessionStorage.getItem("accessToken")
//   //   );
//   // }

//   public addUserRoles(): void {
//     const accessToken = localStorageUtil.getLocalStorage("accessToken");
//     if (accessToken) {
//       const userAuthRole = decodeToken(accessToken);
//       // console.log(userAuthRole);
//       localStorageUtil.setLocalStorage("userAuthRole", userAuthRole.role);
//       localStorageUtil.setLocalStorage("userEmail", userAuthRole.email);
//     }
//   }

//   public getUserEmail(): string | null {
//     return (
//       localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail")
//     );
//   }

//   public isUserHasPermission(): boolean {
//     const accessToken = localStorageUtil.getLocalStorage("accessToken");
//     if (accessToken) {
//       const userAuthRole = decodeToken(accessToken);

//       const userRole: any = userAuthRole.role;
//       if (userRole !== undefined || userRole !== "") {
//         return [UserRoles.ADMIN, UserRoles.MANAGER].includes(
//           parseInt(userRole)
//         );
//       } else {
//         return false;
//       }
//     } else {
//       return false;
//     }
//   }

//   public getUserRole(): UserRoles | undefined {
//     const accessToken = localStorageUtil.getLocalStorage("accessToken");
//     if (accessToken) {
//       const userAuthRole = decodeToken(accessToken);
//       const userRole: any = userAuthRole.role;
//       if (userRole !== undefined || userRole !== "") {
//         return UserRoles[
//           UserRoles[parseInt(userRole)] as keyof typeof UserRoles
//         ];
//       } else {
//         return undefined;
//       }
//     } else {
//       return undefined;
//     }
//   }
// }

// const authManager = new AuthManager();
// export default authManager;

// src/services/auth/AuthManager.ts

// const TOKEN_KEY = "accessToken";

// const AuthManager = {
//   getToken(): string | null {
//     return localStorage.getItem(TOKEN_KEY);
//   },

//   setToken(token: string) {
//     localStorage.setItem(TOKEN_KEY, token);
//   },

//   clearToken() {
//     localStorage.removeItem(TOKEN_KEY);
//   },

//   isAuthenticated(): boolean {
//     return !!this.getToken();
//   },
// };

// export default AuthManager;

class AuthManager {
  private static readonly TOKEN_KEY = "accessToken";

  public getToken(): string | null {
    return localStorage.getItem(AuthManager.TOKEN_KEY);
  }

  public setToken(token: string): void {
    localStorage.setItem(AuthManager.TOKEN_KEY, token);
  }

  public clearToken(): void {
    localStorage.removeItem(AuthManager.TOKEN_KEY);
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && token !== undefined && token !== "";
  }

  public checkAndRedirectIfNotAuthenticated(): boolean {
    if (!this.isAuthenticated()) {
      // Redirect to login with hash routing
      window.location.href = "http://localhost:3000/#/login";
      return false;
    }
    return true;
  }
}

const authManager = new AuthManager();
export default authManager;
