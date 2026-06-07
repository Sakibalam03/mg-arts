import { SVGProps } from 'react'

type SVGIconProps = SVGProps<SVGSVGElement> & { width?: number; height?: number }

export function ChevronDownIcon({ className, ...props }: SVGIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ChevronDownThinIcon({ className, ...props }: SVGIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function DiscordIcon({ className, width = 18, height = 18, ...props }: SVGIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M15.247 3.135A14.44 14.44 0 0 0 11.612 2c-.158.284-.342.668-.469.971a13.37 13.37 0 0 0-4.282 0A10.258 10.258 0 0 0 6.39 2 14.482 14.482 0 0 0 2.75 3.138C.396 6.617-.243 10.01.077 13.353a14.548 14.548 0 0 0 4.456 2.293c.36-.497.68-1.025.955-1.579a9.407 9.407 0 0 1-1.503-.736c.126-.094.249-.192.368-.29 2.895 1.355 6.033 1.355 8.893 0 .12.099.243.196.368.29a9.38 9.38 0 0 1-1.506.737c.275.554.594 1.082.954 1.578a14.502 14.502 0 0 0 4.459-2.29c.365-3.894-.623-7.254-2.273-10.22ZM6.012 11.26c-.924 0-1.683-.864-1.683-1.923 0-1.059.742-1.924 1.683-1.924.94 0 1.698.865 1.682 1.924.002 1.059-.742 1.923-1.682 1.923Zm6.213 0c-.923 0-1.682-.864-1.682-1.923 0-1.059.742-1.924 1.682-1.924.942 0 1.698.865 1.683 1.924 0 1.059-.741 1.923-1.683 1.923Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function GitHubIcon({ className, width = 18, height = 18, ...props }: SVGIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M9 1.5A7.5 7.5 0 0 0 1.5 9c0 3.314 2.15 6.126 5.132 7.12.375.07.513-.163.513-.363 0-.178-.006-.65-.01-1.278-2.087.454-2.527-.896-2.527-.896-.341-.866-.833-1.097-.833-1.097-.68-.465.052-.455.052-.455.753.053 1.149.773 1.149.773.669 1.147 1.755.816 2.183.624.067-.485.261-.816.476-.1.003-1.643-.522-3.093-.832-4.287-1.228-1.194-2.57-1.193-2.57s-1.025-.018-1.025-.018-.755 0-.755.765v.765c0 .42.335.765.748.765.414 0 .75-.344.75-.765V4.5c0-.765.337-.765.75-.765h6c.413 0 .75 0 .75.765v.765c0 .42.335.765.748.765.414 0 .75-.344.75-.765V4.5c0-.765-.337-.765-.75-.765"
        fill="currentColor"
      />
      <path
        d="M9 1.5A7.5 7.5 0 0 0 1.5 9c0 3.314 2.15 6.126 5.132 7.12.375.07.513-.163.513-.363 0-.178-.006-.65-.01-1.278-2.087.454-2.527-.896-2.527-.896-.341-.866-.833-1.097-.833-1.097-.68-.465.052-.455.052-.455.753.053 1.149.773 1.149.773.669 1.147 1.755.816 2.183.624.067-.485.261-.816.475-1.003.003-1.643-.522-3.093-.832-4.287-1.228-1.194-2.57-1.193-2.57s-1.025-.018-1.025-.018-.755 0-.755.765v.765c0 .42.335.765.748.765.414 0 .75-.344.75-.765V4.5c0-.765.337-.765.75-.765h6c.413 0 .75 0 .75.765v.765c0 .42.335.765.748.765.414 0 .75-.344.75-.765V4.5c0-.765-.337-.765-.75-.765"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 1.5A7.5 7.5 0 0 0 1.5 9c0 3.314 2.15 6.126 5.132 7.12.375.07.513-.163.513-.363 0-.178-.006-.65-.01-1.278-2.087.454-2.527-.896-2.527-.896-.341-.866-.833-1.097-.833-1.097-.68-.465.052-.455.052-.455.753.053 1.149.773 1.149.773.669 1.147 1.755.816 2.183.624.067-.485.262-.816.476-1.003-.003-1.643-.522-3.093-.832-4.287-1.228-1.194-2.57-1.193-2.57 0 0-1.025-.018-1.025-.018-.755 0-.755.765v.765c0 .42.335.765.748.765.414 0 .75-.344.75-.765V4.5c0-.765.337-.765.75-.765h6c.413 0 .75 0 .75.765v.765c0 .42.335.765.748.765.414 0 .75-.344.75-.765V4.5c0-.765-.337-.765-.75-.765ZM9 0a9 9 0 1 0 0 18A9 9 0 0 0 9 0Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function ArrowRightIcon({ className, ...props }: SVGIconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ExternalIcon({ className, ...props }: SVGIconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M6 2H2v10h10V8M8 2h4m0 0v4m0-4L6 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function LogoLightIcon({ className, width = 100, height = 28, ...props }: SVGIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M27.5421 0.00778666V28L16.7953 18.4918V27.8154H0V0L27.5421 0.00778666ZM3.3761 24.4393H13.4192V11.0836L24.1661 20.5916V3.38289L3.3761 3.37693V24.4393Z"
        fill="#37C38F"
      />
      <path
        d="M49.9709 23.1236L39.2251 13.6132V22.9371H35.8451V6.20068L46.591 15.7111V6.38716H49.9709V23.1236ZM53.6917 22.9371V6.38716H63.8082V9.72047H57.0716V12.9838H62.4096V16.2472H57.0716V19.6038H63.8082V22.9371H53.6917ZM74.2719 23.1236C69.5866 23.1236 65.8105 19.3474 65.8105 14.6621C65.8105 9.97687 69.5866 6.20068 74.2719 6.20068C78.9572 6.20068 82.7334 9.97687 82.7334 14.6621C82.7334 19.3474 78.9572 23.1236 74.2719 23.1236ZM74.2719 19.8602C77.1623 19.8602 79.3302 17.5293 79.3302 14.6621C79.3302 11.795 77.1623 9.46406 74.2719 9.46406C71.3815 9.46406 69.2137 11.795 69.2137 14.6621C69.2137 17.5293 71.3815 19.8602 74.2719 19.8602ZM99.1601 23.1236L88.4142 13.6132V22.9371H85.0343V6.20068L95.7801 15.7111V6.38716H99.1601V23.1236Z"
        fill="black"
      />
    </svg>
  )
}

export function LogoDarkIcon({ className, width = 100, height = 28, ...props }: SVGIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M27.5421 0.00778666V28L16.7953 18.4918V27.8154H0V0L27.5421 0.00778666ZM3.3761 24.4393H13.4192V11.0836L24.1661 20.5916V3.38289L3.3761 3.37693V24.4393Z"
        fill="#34D59A"
      />
      <path
        d="M49.9709 23.1236L39.2251 13.6132V22.9371H35.8451V6.20068L46.591 15.7111V6.38716H49.9709V23.1236ZM53.6917 22.9371V6.38716H63.8082V9.72047H57.0716V12.9838H62.4096V16.2472H57.0716V19.6038H63.8082V22.9371H53.6917ZM74.2719 23.1236C69.5866 23.1236 65.8105 19.3474 65.8105 14.6621C65.8105 9.97687 69.5866 6.20068 74.2719 6.20068C78.9572 6.20068 82.7334 9.97687 82.7334 14.6621C82.7334 19.3474 78.9572 23.1236 74.2719 23.1236ZM74.2719 19.8602C77.1623 19.8602 79.3302 17.5293 79.3302 14.6621C79.3302 11.795 77.1623 9.46406 74.2719 9.46406C71.3815 9.46406 69.2137 11.795 69.2137 14.6621C69.2137 17.5293 71.3815 19.8602 74.2719 19.8602ZM99.1601 23.1236L88.4142 13.6132V22.9371H85.0343V6.20068L95.7801 15.7111V6.38716H99.1601V23.1236Z"
        fill="white"
      />
    </svg>
  )
}

export function SunIcon({ className, ...props }: SVGIconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.25" />
      <path d="M7 1v1M7 12v1M1 7h1M12 7h1M2.93 2.93l.7.7M10.37 10.37l.7.7M10.37 3.63l-.7.7M3.63 10.37l-.7.7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

export function MoonIcon({ className, ...props }: SVGIconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M12 8.5A5.5 5.5 0 0 1 5.5 2a5.5 5.5 0 1 0 6.5 6.5Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function SystemIcon({ className, ...props }: SVGIconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="1" y="2" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.25" />
      <path d="M4.5 12h5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M7 10v2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}
