import { CURL } from "../../const"

export default async function login(username: string, password: string) {
  const { data, headers } = await post({
    url: `${CURL}/Secure/Login.aspx?returnurl=%2f`,
    data: {
      ctl00$mainContent$login1$LoginCtrl$UserName: username,
      ctl00$mainContent$login1$LoginCtrl$Password: password,
      ctl00$mainContent$login1$LoginCtrl$RememberMe: "on",
      ctl00$mainContent$login1$LoginCtrl$Login: "Đăng nhập",
    },
  })

  // eslint-disable-next-line functional/no-throw-statement
  if (data.includes("Đăng nhập thất bại.")) throw new Error("login_failure")

  return {
    cookie: headers["set-cookie"],
  }
}
