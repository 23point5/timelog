import Head from 'next/head'
import Clock from 'react-live-clock'
import ReactDatePicker from 'react-datepicker'
import {
  getFirestore,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  limitToLast,
  orderBy,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore'
import { getAuth, signInWithPopup, OAuthProvider, User, signOut } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import app from '../../firebase/clientApp'
import moment from 'moment'
import 'bootswatch/dist/flatly/bootstrap.min.css'
import 'react-datepicker/dist/react-datepicker.css'
import { useEffect, useState } from 'react'
import LogsTable from '@/LogsTable'

const provider = new OAuthProvider('microsoft.com')
provider.setCustomParameters({
  tenant: '6374841c-9434-4eb2-8af0-e2620e50858f'
})
const auth = getAuth(app)
const db = getFirestore(app)
export default function Admin() {
  const [user, loading, error] = useAuthState(auth)
  const [startDate, setDate] = useState<Date | any>(new Date())
  const [userLogs, setUserLogs] = useState<QuerySnapshot<DocumentData> | undefined>(undefined)
  const logout = async () => {
    await addDoc(collection(db, 'logs'), {
      uid: user?.uid,
      name: user?.displayName,
      loginTime: '',
      logoutTime: moment().toISOString()
    })

    signOut(auth)
      .then(() => {
        return 'Successfull Logout'
      })
      .catch(error => console.log(error))
  }
  const handleAdminLogin = (): void => {
    signInWithPopup(auth, provider)
      .then(async result => {
        // Insert logs here
        getLogs()
      })
      .catch(error => console.log(error))
  }
  const getLogs = async () => {
    // Get current date in Date ISO
    const dateFormat = 'YYYY-MM-DD'
    const q = query(
      collection(db, 'logs'),
      where('loginTime', '>=', moment(startDate).format(dateFormat)),
      where('loginTime', '<=', moment(startDate).add(1, 'days').format(dateFormat))
    )
    const snapshot = await getDocs(q)
    setUserLogs(snapshot)
  }

  useEffect(() => {
    getLogs()
  }, [startDate])
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
          <img
            style={{ width: '200px', marginBottom: '1rem' }}
            src='https://www.23point5.com/imgs/app/23Point5_Logo_Black_RGB.svg'
            alt='23point'
          />
          <div>
            <button onClick={() => handleAdminLogin()} className='btn btn-primary'>
              Admin Login
            </button>
          </div>
          <h1 className={`superLargeText`}>
            <Clock format={'HH:mm:ss'} ticking={true} />
          </h1>
          <div>
            <div style={{ width: '20%', margin: '0 auto', marginBottom: '2rem' }}>
              <button
                type='button'
                className='btn btn-outline-info'
                style={{ marginBottom: '10px' }}
              >
                {moment(startDate).format('MMMM Do YYYY, dddd')}
              </button>
              <ReactDatePicker
                selected={startDate}
                onChange={date => setDate(date)}
                className='form-control-lg'
              />
            </div>

            {user && !loading && <LogsTable data={userLogs} />}
          </div>
        </div>
      </main>
    </>
  )
}
