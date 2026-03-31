# Testing Summary

## Frontend

Verified with:

```bash
cd frontend
npm run build
```

Result: successful production build.

## Live API checks completed

The following flows were tested against the running backend:

- register user
- reject duplicate registration
- login user
- fetch user profile
- update charity and charity percentage
- activate subscription
- save score
- login as admin
- fetch admin users
- fetch admin winners
- fetch admin reports
- run draw simulation

## Known non-blocking note

Project-wide lint cleanup is not fully completed because several older legacy pages still contain unrelated lint issues. Functional build and main API flows are working.
