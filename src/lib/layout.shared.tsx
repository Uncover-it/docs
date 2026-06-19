import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import icon from "@/../public/logo.svg";
import Image from "next/image";

export function baseOptions(): BaseLayoutProps {
  return {
    githubUrl: "https://github.com/Uncover-it/docs",
    nav: {
      title: (
        <span className="inline-flex text-[0.9375rem] items-center gap-1.5 font-medium me-auto">
          <Image
            src={icon}
            alt="Uncover it"
            width={22}
            height={22}
            className="dark:invert"
          />
          Documentation
        </span>
      ),
    },
  };
}
