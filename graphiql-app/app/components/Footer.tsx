import { Link } from "@remix-run/react";
import github from "../../public/github-mark.svg";
import rs from "../../public/rss-logo.svg";

export default function Footer() {
  return (
    <footer className="flex h-16 p-4 sticky top-full text-3xl text-white bg-gradient-to-b from-gray-300 to-black">
      <div className="flex items-center gap-5 w-screen justify-between">
        <div>
          <Link
            className="inline-block hover:scale-105 transition-transform duration-200"
            to="//github.com/binkki/graphiql-app"
            target="_blank"
            rel="noreferrer"
          >
            <img src={github} className="w-10 h-10" alt="GitHub logo" />
          </Link>
        </div>
        <div>
          <p className="inline-block text-base">2024</p>
        </div>
        <div>
          <Link
            className="inline-block hover:scale-105 transition-transform duration-200"
            to="//rs.school/courses/reactjs"
            target="_blank"
            rel="noreferrer"
          >
            <img src={rs} className="w-10 h-10" alt="RS School logo" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
