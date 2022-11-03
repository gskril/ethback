import { Button, Helper, Input } from '@ensdomains/thorin'
import { useState } from 'react'
import styled, { css } from 'styled-components'

import { inputStyles } from '../pages'

const StyledHelper = styled(Helper)`
  line-height: 1.3;
  margin-bottom: 1rem;

  & > svg {
    display: none;
  }

  & > form {
    display: flex;
    gap: 1rem;
    margin-bottom: 0;
    flex-direction: column;
  }
`

const EmailSubmission = styled.div(
  ({ submitted }: { submitted: boolean }) => css`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    pointer-events: ${submitted ? 'none' : 'auto'};
    position: relative;
  `
)

type FormState = 'idle' | 'loading' | 'error' | 'success'

export default function EmailSignup({
  contractAddress: contract,
}: {
  contractAddress: string
}) {
  const [state, setState] = useState<FormState>('idle')

  return (
    <StyledHelper type="warning" alignment="horizontal">
      <form onSubmit={(e) => handleSubmit(e, contract, state, setState)}>
        <p>
          This contract is currently limited to 7 days of transaction history.
          Sign up to request historial data and get notified when it&apos;s
          ready.
        </p>
        <EmailSubmission submitted={state === 'success'}>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            parentStyles={inputStyles}
            disabled={state === 'success'}
            hideLabel
            required
            label=""
          />
          <SubmitButton state={state} />
        </EmailSubmission>
      </form>
    </StyledHelper>
  )
}

function SubmitButton({ state }: { state: FormState }) {
  if (state === 'success') {
    return (
      <Button size="extraSmall" tone="green" variant="secondary">
        We will be in touch!
      </Button>
    )
  }

  if (state === 'error') {
    return (
      <Button size="extraSmall" tone="red" type="submit" variant="secondary">
        Error submitting form
      </Button>
    )
  }

  return (
    <Button size="extraSmall" type="submit" loading={state === 'loading'}>
      {state === 'loading' ? 'Submitting' : 'Submit'}
    </Button>
  )
}

async function handleSubmit(
  e: any,
  contract: string,
  state: FormState,
  setState: React.Dispatch<React.SetStateAction<FormState>>
) {
  e.preventDefault()
  if (state === 'success' || state === 'loading') return
  const email = e.target.email.value

  // Validate email
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    alert('Please enter a valid email address')
    return
  }

  setState('loading')

  const res = await fetch('/api/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      contract,
    }),
  })

  setState(res.status === 200 ? 'success' : 'error')
}
