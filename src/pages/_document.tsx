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
        title="ZenQuest - Your personal growth journey begins here. "
        description="Set goals and embrace daily quests with meditation, affirmations, and AI support. Your journey to personal growth starts now."
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