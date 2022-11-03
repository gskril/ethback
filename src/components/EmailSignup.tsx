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

export default function EmailSignup({
  contractAddress: contract,
}: {
  contractAddress: string
}) {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  return (
    <StyledHelper type="warning" alignment="horizontal">
      <form
        onSubmit={(e) => handleSubmit(e, contract, isSubmitted, setIsSubmitted)}
      >
        <p>
          This contract is currently limited to 7 days of transaction history.
          Sign up to request historial data and get notified when it&apos;s
          ready.
        </p>
        <EmailSubmission submitted={isSubmitted}>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            parentStyles={inputStyles}
            disabled={isSubmitted}
            hideLabel
            required
            label=""
          />
          {isSubmitted ? (
            <Button size="extraSmall" tone="green" variant="secondary">
              We will be in touch!
            </Button>
          ) : (
            <Button size="extraSmall" type="submit">
              Submit
            </Button>
          )}
        </EmailSubmission>
      </form>
    </StyledHelper>
  )
}

function handleSubmit(
  e: any,
  contract: string,
  isSubmitted: boolean,
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>
) {
  e.preventDefault()
  if (isSubmitted) return
  const email = e.target.email.value

  // Validate email
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    alert('Please enter a valid email address')
    return
  }

  fetch('/api/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      contract,
    }),
  })

  setIsSubmitted(true)
}
