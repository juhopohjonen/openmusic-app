import HCaptcha from "@hcaptcha/react-hcaptcha"
import { HCAPTCHA_SITEKEY } from "../constants"
import { RefObject, SetStateAction } from "react"

const Captcha = ({ setToken, captchaRef }: { setToken: React.Dispatch<SetStateAction<string>>, captchaRef: RefObject<HCaptcha> }) => {

    const executeCaptcha = () => {
        captchaRef?.current?.execute();
    }

    const captchaCompleted = (token: string, eKey: string) => {
        console.log(token, eKey)
        setToken(token)
    }


    return (
        <HCaptcha
            sitekey={HCAPTCHA_SITEKEY}
            ref={captchaRef}
            onLoad={executeCaptcha}
            onVerify={captchaCompleted}
            theme='dark'
        />
        
    )
}   

export default Captcha