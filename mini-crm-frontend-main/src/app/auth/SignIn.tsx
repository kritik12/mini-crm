import { SignIn } from "@clerk/clerk-react"

const SignInPage = () => {
  return (
    <section className="flex flex-col items-center justify-center h-dvh">
        <SignIn fallbackRedirectUrl={"/"}/>
    </section>
  )
}

export default SignInPage