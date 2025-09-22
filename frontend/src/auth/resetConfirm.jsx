import React, { useState } from 'react'
import AuthLayout from './authLayout'
import Button from '../component/button'

const ResetConfirm = () => {

  const [loading, setLoading] = useState(false);

  return (
    <AuthLayout>
        <div className='flex flex-col items-start gap-14'>
            <div className='flex flex-col gap-6'>
                <p className='text-lg font-semibold text-gray-900'>
                    Password Reset
                </p>
                <p className='text-gray-500 text-sm'>
                    Your password has been successfully reset. Click confirm to set a new password.
                </p>
            </div>
          <Button loading={loading} name={"Confirm"} loadingName={"Confirming"}/>
        </div>

    </AuthLayout>
  )
}

export default ResetConfirm;