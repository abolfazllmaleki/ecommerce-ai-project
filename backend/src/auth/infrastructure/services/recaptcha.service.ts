import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

export class RecaptchaService {

  constructor(
    private readonly http:HttpService
  ){}

  async verify(token:string){

    const secret = process.env.RECAPTCHA_SECRET

    const res = await firstValueFrom(
      this.http.post(
        "https://www.google.com/recaptcha/api/siteverify",
        null,
        {
          params:{
            secret,
            response:token
          }
        }
      )
    )

    return res.data.success
  }

}
