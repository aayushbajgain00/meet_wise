import React, { useState } from 'react'
import AuthLayout from './authLayout'
import Button from '../component/button'

const VerifyCode = () => {

  const [loading, setLoading] = useState(false);
  return (
    <AuthLayout>
        <div className='flex flex-col items-start gap-14'>
            <div className='flex flex-col gap-4'>
                <p className='text-lg font-semibold text-gray-900'>
                    Check your email
                </p>
                <p className='text-gray-500 text-sm'>
                    We sent a reset link to <span className='font-bold'>contact@gmail.com</span> enter 5 digit code that is mentioned in the email
                </p>
            </div>

            <div className="flex items-center justify-center gap-4">
            {[...Array(5)].map((_, index) => (
                <input
                key={index}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            ))}
            </div>

          <Button loading={loading} name={"Verify Code"} loadingName={"Verifying"}/>
        </div>

    </AuthLayout>
  )
}

export default VerifyCode