import { createCookieSessionStorage } from '@remix-run/node';
import { getRequiredServerEnvVar } from '~/utils/misc';

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: 'temp_otp_deo',
    secure: process.env.NODE_ENV === "production",
    secrets: [getRequiredServerEnvVar('APLIKASI_SESSION_SECRET')],
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
  },
});



async function getOtpSession(request: Request) {
  const session = await themeStorage.getSession(request.headers.get('Cookie'));
  return {
    getToken: () => {
      const token = session.get('otpToken');
      const timer = session.get('otpTimer');
      const hasing = session.get('hasing');
      return {token, timer, hasing };
    },
    setToken: ({ token , timer, hasing }: any) => {
      session.set('otpToken', token);
      session.set('otpTimer', timer);
      session.set('hasing', hasing);
    },
    commit: () => themeStorage.commitSession(session),
    destroySession : () => themeStorage.destroySession(session)
  };
}

export { getOtpSession };