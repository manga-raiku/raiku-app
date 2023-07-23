/* eslint-disable camelcase */
import { parseDom } from "./__helpers__/parseDom"

export default function user(html: string) {
  const $ = parseDom(html)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const avatar = $(".image-avatar").attr("src")!
  const email = $("form input[type=email]").val() as string
  const last_name= $("#last_name").val() as string
  const first_name = $("#first_name").val() as string
  const sex: "g" |"b" | null = $("#gender1").attr("checked") !== null ? "b" : $("#gender2").attr("checked") !== null ? "g" : null

  return { avatar, email, last_name, first_name, sex }
}
