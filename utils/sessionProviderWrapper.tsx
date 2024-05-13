'use client';
import React from 'react'

import { SessionProvider } from 'next-auth/react';

const SessionProviderWrapper = ({children}: {children:any}) => {
  return (
    <SessionProvider>{children}</SessionProvider>
  )
}

export default SessionProviderWrapper