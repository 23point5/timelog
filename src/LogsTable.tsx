import { DocumentData, QuerySnapshot } from 'firebase/firestore'
import moment from 'moment'
import React, { ReactElement } from 'react'

interface iProps {
  data: QuerySnapshot<DocumentData> | undefined
}
const EmptyRow: React.FC = () => (
  <tr>
    <td colSpan={3}>No Data to show</td>
  </tr>
)
const LogsTable: React.FC<iProps> = ({ data }) => {
  const DataBody: React.FC<any> = () => {
    if (data?.empty) {
      return <EmptyRow />
    }
    const rowElements: [ReactElement<any>] = [<></>]
    data?.forEach(doc => {
      const loginDate = moment(doc.data().loginTime)
      const timeLog = loginDate.format('hh:mm A')
      const dateFormat = 'YYYY-MM-DD'

      const isOut =
        doc.data().logoutTime !== '' || loginDate.format(dateFormat) !== moment().format(dateFormat)
      rowElements.push(
        <tr key={doc.data().uid}>
          <th scope='row'>{doc.data().name}</th>
          <td>{timeLog}</td>
          <td>
            <span className={`badge ${isOut ? 'bg-danger' : 'bg-success'}`}>
              {isOut ? 'Out' : 'Online'}
            </span>
          </td>
        </tr>
      )
    })

    return <>{rowElements}</>
  }

  return (
    <table className='table table-hover'>
      <thead>
        <tr>
          <th scope='col'>Name</th>
          <th scope='col'>Time In</th>
          <th scope='col'>Status</th>
        </tr>
      </thead>
      <tbody>
        <DataBody />
      </tbody>
    </table>
  )
}

export default LogsTable
