
import type { SVGProps } from 'react';

export function CampusGuardLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 11.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
      <path d="M12 14v-1.5" />
      <path d="M12 22v-7.5" />
    </svg>
  );
}

export function EcoWatchLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10.1 2.2c.9-.5 2-.5 2.9 0l6.1 3.5c.9.5 1.4 1.4 1.4 2.4v7c0 1-.5 1.9-1.4 2.4l-6.1 3.5c-.9.5-2 .5-2.9 0l-6.1-3.5c-.9-.5-1.4-1.4-1.4-2.4v-7c0-1 .5-1.9 1.4-2.4l6.1-3.5z" />
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M12 22v-4" />
      <path d="M12 6V2" />
      <path d="m15 9 3-1.5" />
      <path d="m9 9-3-1.5" />
      <path d="m15 15 3 1.5" />
      <path d="m9 15-3 1.5" />
    </svg>
  );
}
