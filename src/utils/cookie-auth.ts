import Cookies from "universal-cookie";
export const USER_ID = "user_id";
const cookies = new Cookies();

export class Auth {
  static removeUser() {
    cookies.remove(USER_ID);
    return true;
  }

  static setUser(userId?: number) {
    cookies.set(USER_ID, userId);
    return true;
  }

  static get id() {
    return cookies.get(USER_ID);
  }
}
