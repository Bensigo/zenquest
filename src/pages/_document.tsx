// pages/_document.js

import { ColorModeScript } from '@chakra-ui/react'
import { Html, Head, Main, NextScript } from 'next/document'
import theme from "@/utils/theme"
import SEO from '@/shared-ui/SEO'

export default function Document() {
  return (
    <Html lang='en'>
      <Head />
      <SEO
        title="ZenQuest - Become an Achiever and live a limitless life"
        description="Dive into the art of manifestation and manifest a life of abundance, purpose, and fulfillment. ZenQuest guides you through techniques that enable you to a limitless living and shape your reality"
        keywords="mindfulness,personal development,limitless living ,mental well-being, note-taking app, Goal getting, affirmations, mindfulness exercises, Bio-Hacking,personal development, manifestation"
      />
      <body>
        <ColorModeScript initialColorMode={theme.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}