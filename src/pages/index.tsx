import Head from 'next/head'
import Clock from 'react-live-clock'
import {
  getFirestore,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  limitToLast,
  orderBy
} from 'firebase/firestore'
import { getAuth, signInWithPopup, OAuthProvider, User, signOut } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import app from '../../firebase/clientApp'
import moment from 'moment'
import 'bootswatch/dist/flatly/bootstrap.min.css'
import { useState } from 'react'
import LogButton from '@/LogButton'
import BrandLogo from '@/BrandLogo'

const provider = new OAuthProvider('microsoft.com')
provider.setCustomParameters({
  tenant: '6374841c-9434-4eb2-8af0-e2620e50858f'
})
const auth = getAuth(app)
const db = getFirestore(app)
export default function Home() {
  const [user, loading, error] = useAuthState(auth)
  const [hasCurrentLog, setCurrentLog] = useState(false)
  const logout = async () => {
    await addDoc(collection(db, 'logs'), {
      uid: user?.uid,
      name: user?.displayName,
      loginTime: '',
      logoutTime: moment().toISOString()
    })

    signOut(auth)
      .then(() => {
        setCurrentLog(false)
        return 'Successfull Logout'
      })
      .catch(error => console.log(error))
  }
  const handleTimeLog = (out?: boolean): void => {
    if (out && user) {
      logout().then(msg => console.log(msg))
    } else {
      signInWithPopup(auth, provider)
        .then(async result => {
          // Insert logs here
          const currentTime = moment().toISOString()

          await addDoc(collection(db, 'logs'), {
            uid: result.user.uid,
            name: result.user.displayName,
            loginTime: currentTime,
            logoutTime: ''
          })
          setCurrentLog(true)
        })
        .catch(error => console.log(error))
    }
  }
  const getLogs = async () => {
    const q = query(
      collection(db, 'logs'),
      where('uid', '==', user ? user.uid : ''),
      orderBy('loginTime'),
      limitToLast(1)
    )
    const snapshot = await getDocs(q)

    snapshot.forEach(doc => {
      const lastLogin = moment(doc.data().loginTime)
      const diff = moment(new Date()).diff(lastLogin, 'days')
      setCurrentLog(diff <= 0)
    })
  }
  // Get the doc based on user
  // Compare login date if same day or not
  getLogs()
  return (
    <>
      <Head>
        <title>23point5 Timer log</title>
        <meta name='description' content='23point5 Timer log' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <div className='container top10'>
          <BrandLogo />
          <h1 className={`superLargeText`}>
            <Clock format={'HH:mm:ss'} ticking={true} />
          </h1>
          {loading ? (
            <span>Loading...</span>
          ) : (
            <LogButton user={user} hasCurrentLog={hasCurrentLog} clickHandler={handleTimeLog} />
          )}
        </div>
      </main>
    </>
  )
}
