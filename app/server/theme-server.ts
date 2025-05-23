import { createCookieSessionStorage } from '@remix-run/node';
import { getRequiredServerEnvVar } from '~/utils/misc';
import { Theme, isTheme } from '~/providers/theme-provider';

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: 'deo_airport_theme',
    secure: true,
    secrets: [getRequiredServerEnvVar('APLIKASI_SESSION_SECRET')],
    sameSite: 'lax',
    path: '/',
    // no theme for you on Kent's 100th birthday! 😂
    expires: new Date('2088-10-18'),
    httpOnly: true,
  },
});

async function getThemeSession(request: Request) {
  const session = await themeStorage.getSession(request.headers.get('Cookie'));
  return {
    getTheme: () => {
      const themeValue = session.get('theme');
      return isTheme(themeValue) ? themeValue : Theme.DARK;
    },
    setTheme: (theme: Theme) => session.set('theme', theme),
    commit: () => themeStorage.commitSession(session),
  };
}

export { getThemeSession };