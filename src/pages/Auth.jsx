import { Link } from "react-router-dom";

export default function Auth() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Column - Brand/Visual side */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#5b3df5] p-12 text-white lg:flex">
        {/* Decorative background shapes */}
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#3ddba7] opacity-90 blur-sm" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#ff5fa2] opacity-90 blur-sm" />
        <div className="absolute bottom-32 right-24 h-24 w-24 rotate-12 rounded-3xl bg-[#ffa23a] opacity-90 blur-sm" />

        {/* Logo */}
        <div className="relative z-10">
          <h1 className="text-2xl font-black tracking-widest uppercase">Qalm Tek</h1>
        </div>

        {/* Hero Text & Features */}
        <div className="relative z-10 mb-12">
          <h2 className="mb-8 text-5xl font-extrabold leading-[1.1] tracking-tight">
            Talk to someone <br /> who gets it.
          </h2>
          <ul className="space-y-4 text-lg font-medium">
            <li className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#5b3df5]">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </span>
              Therapists verified by our team
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#5b3df5]">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </span>
              A private journal that is only yours
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#5b3df5]">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </span>
              Book a session in a few taps
            </li>
          </ul>
        </div>
      </div>

      {/* Right Column - Form side */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-24">
        {/* Top Header */}
        <div className="absolute right-8 top-8 flex items-center gap-4 text-sm text-gray-500 lg:right-12 lg:top-12">
          <span>New here?</span>
          <Link
            to="/auth/register"
            className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-900 transition hover:bg-gray-50"
          >
            Create account
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md">
          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
              Welcome back.
            </h2>
            <p className="mt-2 text-gray-500">
              Log in to pick up where you left off.
            </p>
          </div>

          <form className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-900" htmlFor="email">
                Email or username
              </label>
              <input
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#5b3df5] focus:outline-none focus:ring-1 focus:ring-[#5b3df5]"
                id="email"
                type="text"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-900" htmlFor="password">
                  Password
                </label>
                <Link to="#" className="text-sm font-semibold text-[#5b3df5] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#5b3df5] focus:outline-none focus:ring-1 focus:ring-[#5b3df5]"
                  id="password"
                  type="password"
                  placeholder="Your password"
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-600 hover:text-gray-900">
                  Show
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="mt-2 w-full rounded-xl bg-[#5b3df5] px-4 py-3.5 text-center font-bold text-white transition hover:bg-[#4a2ee0] focus:outline-none focus:ring-4 focus:ring-[#5b3df5]/30"
              type="submit"
            >
              Log in
            </button>
          </form>

          {/* Therapist Callout */}
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#f0ebff] p-4 text-sm">
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-[#5b3df5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p className="text-gray-700">
              <strong className="font-semibold text-gray-900">Are you a therapist?</strong> Log in with the same account, then set up your professional profile.
            </p>
          </div>

          {/* Footer Terms */}
          <p className="mt-8 text-center text-xs text-gray-500">
            By logging in you agree to our{" "}
            <Link to="/terms" className="font-semibold text-gray-700 underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="font-semibold text-gray-700 underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}