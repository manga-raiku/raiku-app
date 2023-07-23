import { parseDom } from "./__helpers__/parseDom"
import { parsePath } from "./__helpers__/parsePath"

export default function user(html: string) {
  const $ = parseDom(html)
  
  const avatar = $(".image-avatar").attr("src")!
  const email = $("form input[type=email]").val()
  const last_name= $("#last_name").val()
  const first_name = $("#first_name").val()
  const sex: "g" |"b" | null = $("#gender1").attr("checked") !== null ? "b" : $("#gender2").attr("checked") !== null ? "g" : null
  
  return { avatar, email, last_name, first_name, sex }
}
