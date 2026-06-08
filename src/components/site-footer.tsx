import { cn } from '@/lib/utils'
import { getFooter } from '@/lib/cms'
import Container from './neon/container'
import NeonLink from './neon/link'
import Logo from './neon/logo'
import { FooterThemeSelect } from './footer-theme-select'
import MgArts3D from './mg-arts-3d'

export default async function SiteFooter() {
  const { tagline, copyrightName, columns } = await getFooter()

  return (
    <footer className="dark relative z-30 mt-auto overflow-hidden border-t border-gray-new-20 bg-black-pure">
      <Container className="flex justify-between gap-x-10 pt-12 pb-6 max-sm:flex-col max-sm:gap-y-8 max-sm:pt-8 max-sm:pb-4" size={1920}>
        <div className="flex flex-col items-start lg:w-full">
          <div className="mb-auto lg:mb-11 max-sm:mb-6">
            <Logo className="sm:h-6 sm:w-auto" width={102} height={28} />
            <span
              className={cn(
                'mt-3.5 block text-[13px] leading-none tracking-extra-tight whitespace-nowrap',
                'text-gray-new-40 dark:text-gray-new-60',
                'xl:mt-3'
              )}
            >
              {tagline}
            </span>
          </div>

          <FooterThemeSelect className="mb-8 lg:mb-6" />

          {/* copyright — desktop only */}
          <div className="flex flex-col items-start justify-between gap-y-5 lg:w-full lg:flex-row max-sm:hidden">
            <div
              className={cn(
                'flex max-w-2xl flex-col gap-y-2 text-[13px] leading-none tracking-extra-tight text-gray-new-40',
                'dark:text-gray-new-60'
              )}
            >
              <p>© {copyrightName} {new Date().getFullYear()}. All rights reserved.</p>
              <p className="flex flex-wrap gap-x-3 gap-y-1">
                <NeonLink className="hover:text-gray-new-20 dark:hover:text-gray-new-80" to="/privacy">
                  Privacy Policy
                </NeonLink>
                <NeonLink className="hover:text-gray-new-20 dark:hover:text-gray-new-80" to="/terms">
                  Terms of Use
                </NeonLink>
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-fit gap-x-[88px] xl:gap-x-6 max-sm:grid max-sm:w-full max-sm:grid-cols-3 max-sm:gap-x-4">
          {columns.map(({ heading, items }, index) => (
            <div className="grid content-start gap-y-7 max-sm:gap-y-4" key={index}>
              <span className="text-[10px] leading-none text-gray-new-10 uppercase dark:text-white">
                {heading}
              </span>
              <ul className="flex flex-col gap-y-5 max-sm:gap-y-3">
                {items.map(({ link, text }, itemIndex) => {
                  const isExternal = link.startsWith('http')
                  return (
                    <li key={itemIndex} className="-my-px flex min-w-[148px] py-px max-sm:min-w-0">
                      <NeonLink
                        className={cn(
                          '-my-px flex cursor-pointer items-center rounded-sm py-px whitespace-nowrap',
                          'text-[15px] leading-none tracking-extra-tight text-gray-new-40',
                          'transition-colors duration-200 hover:text-black-pure',
                          'dark:text-gray-new-60 dark:hover:text-white',
                          'max-sm:text-[13px] max-sm:whitespace-normal'
                        )}
                        to={link}
                        isExternal={isExternal}
                      >
                        {text}
                      </NeonLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* copyright — mobile only, sits at the bottom of the stacked column */}
        <div className={cn(
          'hidden max-sm:flex flex-col gap-y-2 text-[13px] leading-none tracking-extra-tight text-gray-new-40',
          'dark:text-gray-new-60'
        )}>
          <p>© {copyrightName} {new Date().getFullYear()}. All rights reserved.</p>
          <p className="flex flex-wrap gap-x-3 gap-y-1">
            <NeonLink className="hover:text-gray-new-20 dark:hover:text-gray-new-80" to="/privacy">
              Privacy Policy
            </NeonLink>
            <NeonLink className="hover:text-gray-new-20 dark:hover:text-gray-new-80" to="/terms">
              Terms of Use
            </NeonLink>
          </p>
        </div>
      </Container>
      <MgArts3D />
    </footer>
  )
}
