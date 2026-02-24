'use client'
import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ShoppingBag, Menu, X } from 'lucide-react'

interface NavbarProps {
  cartCount?: number
}

export default function Navbar({ cartCount = 0 }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const { scrollYProgress } = useScroll()
  const progressBar = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  const navLinks = [
    { name: 'Shows', href: '#shows' },
    { name: 'Merch', href: '#merch' },
    { name: 'Book Us', href: '#booking' }
  ]

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['shows', 'merch', 'booking']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetBottom = offsetTop + element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const targetId = href.replace('#', '')
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 z-50"
        style={{ scaleX: progressBar, originX: 0 }}
      />

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-40 mt-0.5"
      >
        <div className="mx-4 mt-4">
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <h1 className="text-xl font-black tracking-tight text-stone-100 uppercase">
                  REVOLOVERS
                </h1>
                <div className="h-0.5 bg-gradient-to-r from-amber-600 to-transparent w-full mt-1" />
              </motion.div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {navLinks.map((link) => (
                  <motion.button
                    key={link.name}
                    onClick={() => scrollToSection(link.href)}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    className={`text-sm font-semibold uppercase tracking-wide transition-colors duration-200 relative ${
                      activeSection === link.href.replace('#', '')
                        ? 'text-amber-500'
                        : 'text-stone-300 hover:text-stone-100'
                    }`}
                  >
                    {link.name}
                    {activeSection === link.href.replace('#', '') && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -bottom-2 left-0 right-0 h-0.5 bg-amber-500"
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Cart and Mobile Menu */}
              <div className="flex items-center space-x-4">
                {/* Cart Icon */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-2 text-stone-300 hover:text-amber-500 transition-colors"
                >
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-amber-600 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </motion.span>
                  )}
                </motion.button>

                {/* Mobile Menu Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 text-stone-300 hover:text-stone-100 transition-colors"
                >
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.button>
              </div>
            </div>

            {/* Mobile Menu */}
            <motion.div
              initial={false}
              animate={{
                height: isMenuOpen ? 'auto' : 0,
                opacity: isMenuOpen ? 1 : 0
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 border-t border-white/10 mt-4">
                <div className="flex flex-col space-y-4">
                  {navLinks.map((link, index) => (
                    <motion.button
                      key={link.name}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{
                        x: isMenuOpen ? 0 : -20,
                        opacity: isMenuOpen ? 1 : 0
                      }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => scrollToSection(link.href)}
                      className={`text-left text-lg font-semibold uppercase tracking-wide transition-colors duration-200 ${
                        activeSection === link.href.replace('#', '')
                          ? 'text-amber-500'
                          : 'text-stone-300 hover:text-stone-100'
                      }`}
                    >
                      {link.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.nav>
    </>
  )
}