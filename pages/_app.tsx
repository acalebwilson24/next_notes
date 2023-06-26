import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { SessionProvider } from 'next-auth/react'
import { Provider } from 'react-redux'
import { store } from '../redux/configureStore'
import { DefaultSeo } from 'next-seo'

function MyApp({ Component, pageProps: {session, ...pageProps}}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <DefaultSeo titleTemplate="NoteApp | %s" defaultTitle="NoteApp | Notes" />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </SessionProvider>
  )
}

export default MyApp
