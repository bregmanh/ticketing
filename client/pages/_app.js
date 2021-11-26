import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/build-client'
import Header from '../components/header'

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  )
}

// the arguments in Custom App components are {Component, ctx:{req, res}, ...and more}
AppComponent.getInitialProps = async appContext => {
  const client = buildClient(appContext.ctx)
  const { data } = await client.get('/api/users/currentuser')

  let pageProps = {}
  // will not be invoked for pages where we dont have getInitialProps
  if (appContext.Component.getInitialProps) {
    //executing the getInitialProps for the nested component
    pageProps = await appContext.Component.getInitialProps(appContext.ctx)
  }

  return {
    pageProps,
    ...data
  }
}

export default AppComponent
