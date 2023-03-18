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
  DocumentData,
  doc
} from 'firebase/firestore'
import { getAuth, signInWithPopup, OAuthProvider, User, signOut } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import app from '../../firebase/clientApp'
import moment from 'moment'
import 'bootswatch/dist/flatly/bootstrap.min.css'
import 'react-datepicker/dist/react-datepicker.css'
import { useEffect, useState } from 'react'
import LogsTable from '@/LogsTable'
import BrandLogo from '@/BrandLogo'

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
  const [adminUser, setAdminAccess] = useState<boolean>(false)
  const logout = async () => {
    signOut(auth)
      .then(() => {
        return 'Successfull Logout'
      })
      .catch(error => console.log(error))
  }
  const handleAdminLogin = (): void => {
    signInWithPopup(auth, provider)
      .then(async result => {
        const q = query(collection(db, 'admins'), where('uid', '==', result.user.uid))
        const adminObject = await getDocs(q)
        const isAdmin = !adminObject.empty
        // Check if user if admin
        // True - GetLogs
        // False - Show not allowed
        console.log({ isAdmin, adminObject })
        setAdminAccess(isAdmin)

        if (isAdmin) {
          getLogs()
        }
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
          <BrandLogo />
          <div>
            {!user || !adminUser ? (
              <button onClick={() => handleAdminLogin()} className='btn btn-primary'>
                Admin Login
              </button>
            ) : (
              <button onClick={() => logout()} className='btn btn-danger'>
                Logout
              </button>
            )}
          </div>
          <h1 className={`superLargeText`}>
            <Clock format={'HH:mm:ss'} ticking={true} />
          </h1>
          {!adminUser && (
            <div>
              <h1>Sorry! You do not have access to view this page.</h1>
            </div>
          )}
          {user && !loading && adminUser && (
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
              {user && !loading && adminUser && <LogsTable data={userLogs} />}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
