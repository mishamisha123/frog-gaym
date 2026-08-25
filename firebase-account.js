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
import {
  getFirestore,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js';

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
const usernameSetup = byId('froggyUsernameSetup');
const usernameForm = byId('froggyUsernameForm');
const usernameInput = byId('froggyUsernameInput');
const usernameClaim = byId('froggyUsernameClaim');
const usernameHint = byId('froggyUsernameHint');
const publicProfile = byId('froggyPublicProfile');
const publicUsername = byId('froggyPublicUsername');
const usernameMeta = byId('froggyAccountUsernameMeta');
const friendsMeta = byId('froggyFriendsMeta');

let auth;
let db;
let activeProfile = null;
let profileLoadToken = 0;

function setStatus(message, type = 'info') {
  if (!status) return;
  status.textContent = message || '';
  status.dataset.state = type;
}

function setUsernameHint(message, state = 'info') {
  if (!usernameHint) return;
  usernameHint.textContent = message || '';
  usernameHint.dataset.state = state;
}

function shortUid(uid) {
  if (!uid) return '—';
  return `${uid.slice(0, 7)}…${uid.slice(-5)}`;
}

function normalizeUsername(raw) {
  return String(raw || '').trim().toLowerCase();
}

function validateUsername(raw) {
  const username = String(raw || '').trim();
  if (username.length < 3 || username.length > 16) {
    return { ok: false, message: 'Use 3–16 characters.' };
  }
  if (!/^[A-Za-z0-9_]+$/.test(username)) {
    return { ok: false, message: 'Use only letters, numbers, and underscores.' };
  }
  return { ok: true, username, normalized: normalizeUsername(username) };
}

function renderProfile(profile) {
  activeProfile = profile || null;
  const hasProfile = Boolean(profile?.username);
  usernameSetup?.classList.toggle('hidden', hasProfile);
  publicProfile?.classList.toggle('hidden', !hasProfile);

  if (hasProfile) {
    const label = `@${profile.username}`;
    if (publicUsername) publicUsername.textContent = label;
    if (usernameMeta) usernameMeta.textContent = label;
    if (friendsMeta) friendsMeta.textContent = 'READY NEXT';
    setUsernameHint('Username claimed.', 'success');
  } else {
    if (publicUsername) publicUsername.textContent = '@—';
    if (usernameMeta) usernameMeta.textContent = 'NOT SET';
    if (friendsMeta) friendsMeta.textContent = 'USERNAME NEEDED';
    setUsernameHint('This is public. Your Google email stays private.', 'info');
  }
}

function renderUser(user) {
  const isSignedIn = Boolean(user);
  signedOut?.classList.toggle('hidden', isSignedIn);
  signedIn?.classList.toggle('hidden', !isSignedIn);
  topDot?.classList.toggle('signed-in', isSignedIn);
  topDot?.setAttribute('aria-label', isSignedIn ? 'Froggy account connected' : 'Froggy account not connected');

  if (!user) {
    renderProfile(null);
    if (avatar) {
      avatar.removeAttribute('src');
      avatar.alt = '';
    }
    if (nameLabel) nameLabel.textContent = 'Not signed in';
    if (emailLabel) emailLabel.textContent = '';
    if (uidLabel) uidLabel.textContent = '—';
    setStatus('Sign in to create your permanent Froggy account ID and public username. Your game save stays local for now.', 'info');
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
}

async function loadPublicProfile(user) {
  const token = ++profileLoadToken;
  renderProfile(null);
  setStatus('Loading your Froggy public profile…', 'loading');
  try {
    const snapshot = await getDoc(doc(db, 'profiles', user.uid));
    if (token !== profileLoadToken || auth.currentUser?.uid !== user.uid) return;
    if (snapshot.exists()) {
      const profile = snapshot.data();
      renderProfile(profile);
      setStatus(`Froggy account connected as @${profile.username}. Cloud game saves are still local in v95.`, 'success');
    } else {
      renderProfile(null);
      setStatus('Google login is connected. Claim a unique Froggy username to finish your public profile.', 'warning');
      usernameInput?.focus({ preventScroll: true });
    }
  } catch (error) {
    console.error('Froggy profile load failed', error);
    const code = String(error?.code || '');
    renderProfile(null);
    if (code.includes('permission-denied')) {
      setStatus('Firestore is blocking player profiles. Publish the included v95 Firestore rules, then reload.', 'error');
    } else if (code.includes('unavailable')) {
      setStatus('Could not reach Firestore. Check your connection and try again.', 'error');
    } else {
      setStatus('Could not load your Froggy public profile yet. Google login is still connected.', 'error');
    }
  }
}

async function claimUsername(user, rawUsername) {
  const validation = validateUsername(rawUsername);
  if (!validation.ok) {
    setUsernameHint(validation.message, 'error');
    usernameInput?.focus();
    return;
  }

  const { username, normalized } = validation;
  const profileRef = doc(db, 'profiles', user.uid);
  const usernameRef = doc(db, 'usernames', normalized);

  usernameClaim.disabled = true;
  usernameInput.disabled = true;
  setUsernameHint(`Checking @${username}…`, 'loading');
  setStatus('Reserving your Froggy username…', 'loading');

  try {
    const claimedProfile = await runTransaction(db, async (transaction) => {
      const profileSnap = await transaction.get(profileRef);
      if (profileSnap.exists()) {
        return profileSnap.data();
      }
      const usernameSnap = await transaction.get(usernameRef);
      if (usernameSnap.exists()) {
        const error = new Error('username-taken');
        error.froggyCode = 'username-taken';
        throw error;
      }

      const now = serverTimestamp();
      const profileData = {
        username,
        usernameLower: normalized,
        createdAt: now,
        updatedAt: now,
        schemaVersion: 1
      };
      transaction.set(usernameRef, {
        uid: user.uid,
        username,
        createdAt: now
      });
      transaction.set(profileRef, profileData);
      return { ...profileData, createdAt: null, updatedAt: null };
    });

    renderProfile(claimedProfile);
    if (usernameInput) usernameInput.value = '';
    setStatus(`Username @${claimedProfile.username} is now linked to your Froggy account.`, 'success');
  } catch (error) {
    console.error('Froggy username claim failed', error);
    const code = String(error?.code || '');
    if (error?.froggyCode === 'username-taken' || String(error?.message || '').includes('username-taken')) {
      setUsernameHint(`@${username} is already taken. Try another one.`, 'error');
      setStatus('That Froggy username belongs to another player.', 'warning');
    } else if (code.includes('permission-denied')) {
      setUsernameHint('Firestore rules have not been published yet.', 'error');
      setStatus('Publish the included v95 Firestore rules in Firebase, then try claiming the username again.', 'error');
    } else if (code.includes('unavailable')) {
      setUsernameHint('You must be online to claim a username.', 'error');
      setStatus('Username claiming requires an internet connection.', 'error');
    } else {
      setUsernameHint('Could not claim that username. Try again.', 'error');
      setStatus('The username claim failed without changing your account.', 'error');
    }
  } finally {
    usernameClaim.disabled = false;
    usernameInput.disabled = false;
  }
}

try {
  const firebaseApp = initializeApp(firebaseConfig);
  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);
  await setPersistence(auth, browserLocalPersistence);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  onAuthStateChanged(auth, async (user) => {
    renderUser(user);
    document.documentElement.dataset.froggyAccount = user ? 'signed-in' : 'signed-out';
    if (user) await loadPublicProfile(user);
  });

  usernameInput?.addEventListener('input', () => {
    const value = String(usernameInput.value || '');
    if (!value) {
      setUsernameHint('This is public. Your Google email stays private.', 'info');
      return;
    }
    const validation = validateUsername(value);
    setUsernameHint(validation.ok ? `Public username: @${validation.username}` : validation.message, validation.ok ? 'success' : 'warning');
  });

  usernameForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const user = auth.currentUser;
    if (!user || activeProfile?.username) return;
    await claimUsername(user, usernameInput?.value || '');
  });

  signInButton?.addEventListener('click', async () => {
    if (signInButton.disabled) return;
    signInButton.disabled = true;
    setStatus('Opening Google sign-in…', 'loading');
    try {
      const result = await signInWithPopup(auth, provider);
      renderUser(result.user);
      await loadPublicProfile(result.user);
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
      ++profileLoadToken;
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
