import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js';
import {
  getAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyDFNbEYaY395nVvGiO_JmqNc65aFWkTQso',
  authDomain: 'froggyleap-f59a8.firebaseapp.com',
  projectId: 'froggyleap-f59a8',
  storageBucket: 'froggyleap-f59a8.firebasestorage.app',
  messagingSenderId: '680130181675',
  appId: '1:680130181675:web:53002620fd8db50891c86e',
  measurementId: 'G-V8YHNL5J4S'
};

const byId = (id) => document.getElementById(id);
const signedOut = byId('froggyAccountSignedOut');
const signedIn = byId('froggyAccountSignedIn');
const signInButton = byId('froggyGoogleSignIn');
const signOutButton = byId('froggyAccountSignOut');
const nameLabel = byId('froggyAccountName');
const emailLabel = byId('froggyAccountEmail');
const uidLabel = byId('froggyAccountUid');
const avatar = byId('froggyAccountAvatar');
const status = byId('froggyAccountStatus');
const topDot = byId('accountStatusDot');

function setStatus(message, type = 'info') {
  if (!status) return;
  status.textContent = message || '';
  status.dataset.state = type;
}

function shortUid(uid) {
  if (!uid) return '—';
  return `${uid.slice(0, 7)}…${uid.slice(-5)}`;
}

function renderUser(user) {
  const isSignedIn = Boolean(user);
  signedOut?.classList.toggle('hidden', isSignedIn);
  signedIn?.classList.toggle('hidden', !isSignedIn);
  topDot?.classList.toggle('signed-in', isSignedIn);
  topDot?.setAttribute('aria-label', isSignedIn ? 'Froggy account connected' : 'Froggy account not connected');

  if (!user) {
    if (avatar) {
      avatar.removeAttribute('src');
      avatar.alt = '';
    }
    if (nameLabel) nameLabel.textContent = 'Not signed in';
    if (emailLabel) emailLabel.textContent = '';
    if (uidLabel) uidLabel.textContent = '—';
    setStatus('Sign in to create your permanent Froggy account ID. Your current game save stays on this device for now.', 'info');
    return;
  }

  if (nameLabel) nameLabel.textContent = user.displayName || 'Froggy Player';
  if (emailLabel) emailLabel.textContent = user.email || 'Google account connected';
  if (uidLabel) uidLabel.textContent = shortUid(user.uid);
  if (avatar) {
    if (user.photoURL) {
      avatar.src = user.photoURL;
      avatar.alt = `${user.displayName || 'Froggy player'} Google profile picture`;
    } else {
      avatar.removeAttribute('src');
      avatar.alt = '';
    }
  }
  setStatus('Google account connected. This v93 test only syncs your identity; wallet, frogs, cases, Bank, and saves are still local until the next cloud-save step.', 'success');
}

let auth;
try {
  const firebaseApp = initializeApp(firebaseConfig);
  auth = getAuth(firebaseApp);
  await setPersistence(auth, browserLocalPersistence);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  onAuthStateChanged(auth, (user) => {
    renderUser(user);
    document.documentElement.dataset.froggyAccount = user ? 'signed-in' : 'signed-out';
  });

  signInButton?.addEventListener('click', async () => {
    if (signInButton.disabled) return;
    signInButton.disabled = true;
    setStatus('Opening Google sign-in…', 'loading');
    try {
      const result = await signInWithPopup(auth, provider);
      renderUser(result.user);
    } catch (error) {
      console.error('Froggy account sign-in failed', error);
      const code = String(error?.code || '');
      if (code.includes('popup-closed-by-user')) {
        setStatus('Sign-in was closed before it finished. Nothing changed.', 'warning');
      } else if (code.includes('popup-blocked')) {
        setStatus('The browser blocked the Google sign-in window. Allow pop-ups for Froggy Leap and try again.', 'error');
      } else if (code.includes('unauthorized-domain')) {
        setStatus('This website domain is not authorized in Firebase Authentication yet.', 'error');
      } else {
        setStatus('Google sign-in failed. Check your connection and try again.', 'error');
      }
    } finally {
      signInButton.disabled = false;
    }
  });

  signOutButton?.addEventListener('click', async () => {
    if (!auth.currentUser || signOutButton.disabled) return;
    signOutButton.disabled = true;
    setStatus('Signing out…', 'loading');
    try {
      await signOut(auth);
      renderUser(null);
    } catch (error) {
      console.error('Froggy account sign-out failed', error);
      setStatus('Could not sign out. Try again.', 'error');
    } finally {
      signOutButton.disabled = false;
    }
  });
} catch (error) {
  console.error('Firebase account initialization failed', error);
  signedOut?.classList.remove('hidden');
  signedIn?.classList.add('hidden');
  if (signInButton) signInButton.disabled = true;
  setStatus('Froggy Accounts could not load. The game itself still works normally.', 'error');
}
