import Image from "next/image";
import { ArrowRightIcon } from "../public/outline"
import Link from "next/link";
import SimytLogo from "./ui/simyt-logo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-between p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        {<SimytLogo />}
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Welcome to Simyt Soacha.</strong> Here you will be able to
            manage and follow up the transit and transport procedures and services
            that you carry out in Soacha.
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-center rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
          <Link
            href="/sign"
            className="flex items-center gap-5 self-center rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Sign up</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Image
            src="/usuario-mesa-trabajo.png"
            width={1000}
            height={760}
            className="hidden md:block"
            alt="image linking the project to its main source"
          />
          <Image
            src="/usuario-mesa-trabajo.png"
            width={560}
            height={620}
            className="block md:hidden"
            alt="image linking the project to its main source"
          />
        </div>
      </div>
    </main>
  );
}
