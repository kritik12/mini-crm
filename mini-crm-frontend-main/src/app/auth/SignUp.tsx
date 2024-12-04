import { SignUp } from "@clerk/clerk-react"

const SignUpPage = () => {
  return (
    <section className="flex flex-col items-center justify-center h-dvh">
        <SignUp fallbackRedirectUrl={"/"}/>
    </section>
  )
}

export default SignUpPage