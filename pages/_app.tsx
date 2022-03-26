import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { SessionProvider } from 'next-auth/react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { RootState, store } from '../redux/configureStore'
import { DefaultSeo } from 'next-seo'
import { useEffect } from 'react'
import { setMobile } from '../redux/slices/mobileSlice'

function MyApp({ Component, pageProps: {session, ...pageProps}}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <DefaultSeo titleTemplate="NoteApp | %s" defaultTitle="NoteApp | Notes" />
        <StyleProvider>
          <div className="dark:text-white">
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </div>
        </StyleProvider>
      </Provider>
    </SessionProvider>
  )
}

const StyleProvider: React.FC = ({ children }) => {
  const darkMode = useSelector((state: RootState) => state.darkMode);
  const dispatch = useDispatch();

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, [])

  function handleResize() {
    dispatch(setMobile(window.innerWidth < 768));
  }
  

  return (
    <div className={darkMode ? "dark" : ""}>
      {children}
    </div>
  )
}

export default MyApp
