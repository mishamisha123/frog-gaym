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
  serverTimestamp,
  collection,
  query,
  where,
  onSnapshot
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

const friendsPanel = byId('froggyFriendsPanel');
const friendSearchForm = byId('froggyFriendSearchForm');
const friendSearchInput = byId('froggyFriendSearchInput');
const friendSearchButton = byId('froggyFriendSearchButton');
const friendSearchResult = byId('froggyFriendSearchResult');
const incomingList = byId('froggyIncomingRequests');
const outgoingList = byId('froggyOutgoingRequests');
const friendsList = byId('froggyFriendsList');
const incomingCount = byId('froggyIncomingCount');
const outgoingCount = byId('froggyOutgoingCount');
const friendsCount = byId('froggyFriendsCount');
const friendsStatus = byId('froggyFriendsStatus');

let auth;
let db;
let activeProfile = null;
let profileLoadToken = 0;
let socialUnsubs = [];
let incomingRequests = new Map();
let outgoingRequests = new Map();
let friendships = new Map();
let searchedProfile = null;

function setStatus(message, type = 'info') {
  if (!status) return;
  status.textContent = message || '';
  status.dataset.state = type;
}

function setFriendsStatus(message, type = 'info') {
  if (!friendsStatus) return;
  friendsStatus.textContent = message || '';
  friendsStatus.dataset.state = type;
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
  const username = String(raw || '').trim().replace(/^@+/, '');
  if (username.length < 3 || username.length > 16) {
    return { ok: false, message: 'Use 3–16 characters.' };
  }
  if (!/^[A-Za-z0-9_]+$/.test(username)) {
    return { ok: false, message: 'Use only letters, numbers, and underscores.' };
  }
  return { ok: true, username, normalized: normalizeUsername(username) };
}

function requestId(fromUid, toUid) {
  return `${fromUid}__${toUid}`;
}

function clearSocialSubscriptions() {
  for (const unsub of socialUnsubs) {
    try { unsub(); } catch {}
  }
  socialUnsubs = [];
  incomingRequests = new Map();
  outgoingRequests = new Map();
  friendships = new Map();
  searchedProfile = null;
  renderSocialLists();
  renderSearchResult(null);
}

function renderProfile(profile) {
  activeProfile = profile || null;
  const hasProfile = Boolean(profile?.username);
  usernameSetup?.classList.toggle('hidden', hasProfile);
  publicProfile?.classList.toggle('hidden', !hasProfile);
  friendsPanel?.classList.toggle('hidden', !hasProfile);

  if (hasProfile) {
    const label = `@${profile.username}`;
    if (publicUsername) publicUsername.textContent = label;
    if (usernameMeta) usernameMeta.textContent = label;
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
    clearSocialSubscriptions();
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

function formatJoined(value) {
  try {
    const date = value?.toDate?.();
    if (!date) return 'Froggy player';
    return `Joined ${date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}`;
  } catch {
    return 'Froggy player';
  }
}

function relationshipFor(uid) {
  if (!uid || !auth?.currentUser) return { type: 'none' };
  if (uid === auth.currentUser.uid) return { type: 'self' };
  if (friendships.has(uid)) return { type: 'friend', item: friendships.get(uid) };
  if (incomingRequests.has(uid)) return { type: 'incoming', item: incomingRequests.get(uid) };
  if (outgoingRequests.has(uid)) return { type: 'outgoing', item: outgoingRequests.get(uid) };
  return { type: 'none' };
}

function makeActionButton(label, className, handler, disabled = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `froggy-friend-action pressable ${className || ''}`.trim();
  button.textContent = label;
  button.disabled = disabled;
  if (!disabled && handler) button.addEventListener('click', handler);
  return button;
}

function makePlayerCard(profile, options = {}) {
  const card = document.createElement('article');
  card.className = `froggy-player-card ${options.compact ? 'compact' : ''}`.trim();

  const identity = document.createElement('div');
  identity.className = 'froggy-player-card-copy';
  const eyebrow = document.createElement('small');
  eyebrow.textContent = options.eyebrow || 'FROGGY PLAYER';
  const title = document.createElement('b');
  title.textContent = `@${profile.username || 'unknown'}`;
  const meta = document.createElement('span');
  meta.textContent = options.meta || formatJoined(profile.createdAt);
  identity.append(eyebrow, title, meta);
  card.appendChild(identity);

  const actions = document.createElement('div');
  actions.className = 'froggy-player-card-actions';
  card.appendChild(actions);
  return { card, actions };
}

function renderSearchResult(profile) {
  if (!friendSearchResult) return;
  friendSearchResult.replaceChildren();
  friendSearchResult.classList.toggle('hidden', !profile);
  searchedProfile = profile || null;
  if (!profile) return;

  const relationship = relationshipFor(profile.uid);
  const { card, actions } = makePlayerCard(profile, { eyebrow: 'PUBLIC PROFILE', meta: formatJoined(profile.createdAt) });

  if (relationship.type === 'self') {
    actions.appendChild(makeActionButton('THIS IS YOU', 'neutral', null, true));
  } else if (relationship.type === 'friend') {
    actions.appendChild(makeActionButton('FRIENDS ✓', 'success', null, true));
    actions.appendChild(makeActionButton('REMOVE', 'danger', () => removeFriend(relationship.item)));
  } else if (relationship.type === 'incoming') {
    actions.appendChild(makeActionButton('ACCEPT', 'success', () => acceptFriendRequest(relationship.item)));
    actions.appendChild(makeActionButton('DECLINE', 'danger', () => declineFriendRequest(relationship.item)));
  } else if (relationship.type === 'outgoing') {
    actions.appendChild(makeActionButton('REQUEST SENT', 'neutral', null, true));
    actions.appendChild(makeActionButton('CANCEL', 'danger', () => cancelFriendRequest(relationship.item)));
  } else {
    actions.appendChild(makeActionButton('ADD FRIEND', 'success', () => sendFriendRequest(profile)));
  }

  friendSearchResult.appendChild(card);
}

function renderEmpty(container, message) {
  if (!container) return;
  const empty = document.createElement('div');
  empty.className = 'froggy-friends-empty';
  empty.textContent = message;
  container.appendChild(empty);
}

function renderSocialLists() {
  incomingList?.replaceChildren();
  outgoingList?.replaceChildren();
  friendsList?.replaceChildren();

  const incoming = [...incomingRequests.values()];
  const outgoing = [...outgoingRequests.values()];
  const friendItems = [...friendships.values()];

  if (incomingCount) incomingCount.textContent = String(incoming.length);
  if (outgoingCount) outgoingCount.textContent = String(outgoing.length);
  if (friendsCount) friendsCount.textContent = String(friendItems.length);
  if (friendsMeta && activeProfile?.username) friendsMeta.textContent = `${friendItems.length} FRIEND${friendItems.length === 1 ? '' : 'S'}`;

  if (!incoming.length) renderEmpty(incomingList, 'No incoming requests.');
  for (const item of incoming) {
    const profile = { uid: item.fromUid, username: item.fromUsername };
    const { card, actions } = makePlayerCard(profile, { compact: true, eyebrow: 'WANTS TO CONNECT', meta: 'Incoming friend request' });
    actions.appendChild(makeActionButton('ACCEPT', 'success', () => acceptFriendRequest(item)));
    actions.appendChild(makeActionButton('DECLINE', 'danger', () => declineFriendRequest(item)));
    incomingList.appendChild(card);
  }

  if (!outgoing.length) renderEmpty(outgoingList, 'No sent requests.');
  for (const item of outgoing) {
    const profile = { uid: item.toUid, username: item.toUsername };
    const { card, actions } = makePlayerCard(profile, { compact: true, eyebrow: 'REQUEST SENT', meta: 'Waiting for a response' });
    actions.appendChild(makeActionButton('CANCEL', 'danger', () => cancelFriendRequest(item)));
    outgoingList.appendChild(card);
  }

  if (!friendItems.length) renderEmpty(friendsList, 'No friends yet. Search a Froggy username above.');
  for (const item of friendItems) {
    const currentUid = auth?.currentUser?.uid;
    const friendUid = item.fromUid === currentUid ? item.toUid : item.fromUid;
    const friendUsername = item.fromUid === currentUid ? item.toUsername : item.fromUsername;
    const profile = { uid: friendUid, username: friendUsername };
    const { card, actions } = makePlayerCard(profile, { compact: true, eyebrow: 'FRIEND', meta: 'Connected on Froggy Leap' });
    actions.appendChild(makeActionButton('VIEW', 'neutral', () => viewPublicProfile(friendUid)));
    actions.appendChild(makeActionButton('REMOVE', 'danger', () => removeFriend(item)));
    friendsList.appendChild(card);
  }

  if (searchedProfile) renderSearchResult(searchedProfile);
}

function socialPermissionMessage() {
  setFriendsStatus('Firestore is blocking Friends v1. Publish the included v96 Firestore rules, then reload.', 'error');
}

async function loadPublicProfile(user) {
  const token = ++profileLoadToken;
  clearSocialSubscriptions();
  renderProfile(null);
  setStatus('Loading your Froggy public profile…', 'loading');
  try {
    const snapshot = await getDoc(doc(db, 'profiles', user.uid));
    if (token !== profileLoadToken || auth.currentUser?.uid !== user.uid) return;
    if (snapshot.exists()) {
      const profile = { uid: user.uid, ...snapshot.data() };
      renderProfile(profile);
      setStatus(`Froggy account connected as @${profile.username}. Cloud game saves are still local in v96.`, 'success');
      subscribeSocial(user, profile);
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
      setStatus('Firestore is blocking player profiles. Publish the included v96 Firestore rules, then reload.', 'error');
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
        return { uid: user.uid, ...profileSnap.data() };
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
      return { uid: user.uid, ...profileData, createdAt: null, updatedAt: null };
    });

    renderProfile(claimedProfile);
    if (usernameInput) usernameInput.value = '';
    setStatus(`Username @${claimedProfile.username} is now linked to your Froggy account.`, 'success');
    subscribeSocial(user, claimedProfile);
  } catch (error) {
    console.error('Froggy username claim failed', error);
    const code = String(error?.code || '');
    if (error?.froggyCode === 'username-taken' || String(error?.message || '').includes('username-taken')) {
      setUsernameHint(`@${username} is already taken. Try another one.`, 'error');
      setStatus('That Froggy username belongs to another player.', 'warning');
    } else if (code.includes('permission-denied')) {
      setUsernameHint('Firestore rules have not been published yet.', 'error');
      setStatus('Publish the included v96 Firestore rules in Firebase, then try claiming the username again.', 'error');
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

function subscribeSocial(user, profile) {
  clearSocialSubscriptions();
  if (!user?.uid || !profile?.username) return;
  friendsPanel?.classList.remove('hidden');
  setFriendsStatus('Friends are live. Search an exact Froggy username to connect.', 'success');

  const incomingQuery = query(collection(db, 'friendRequests'), where('toUid', '==', user.uid));
  const outgoingQuery = query(collection(db, 'friendRequests'), where('fromUid', '==', user.uid));
  const friendsQuery = query(collection(db, 'friendships'), where('members', 'array-contains', user.uid));

  socialUnsubs.push(onSnapshot(incomingQuery, (snapshot) => {
    incomingRequests = new Map();
    snapshot.forEach((snap) => {
      const data = snap.data();
      if (data.status === 'pending') incomingRequests.set(data.fromUid, { id: snap.id, ...data });
    });
    renderSocialLists();
  }, (error) => {
    console.error('Incoming friend requests listener failed', error);
    if (String(error?.code || '').includes('permission-denied')) socialPermissionMessage();
  }));

  socialUnsubs.push(onSnapshot(outgoingQuery, (snapshot) => {
    outgoingRequests = new Map();
    snapshot.forEach((snap) => {
      const data = snap.data();
      if (data.status === 'pending') outgoingRequests.set(data.toUid, { id: snap.id, ...data });
    });
    renderSocialLists();
  }, (error) => {
    console.error('Outgoing friend requests listener failed', error);
    if (String(error?.code || '').includes('permission-denied')) socialPermissionMessage();
  }));

  socialUnsubs.push(onSnapshot(friendsQuery, (snapshot) => {
    friendships = new Map();
    snapshot.forEach((snap) => {
      const data = { id: snap.id, ...snap.data() };
      const friendUid = data.fromUid === user.uid ? data.toUid : data.fromUid;
      friendships.set(friendUid, data);
    });
    renderSocialLists();
  }, (error) => {
    console.error('Friends listener failed', error);
    if (String(error?.code || '').includes('permission-denied')) socialPermissionMessage();
  }));
}

async function searchPlayer(rawUsername) {
  const user = auth.currentUser;
  if (!user || !activeProfile?.username) return;
  const validation = validateUsername(rawUsername);
  if (!validation.ok) {
    setFriendsStatus('Enter a complete Froggy username: 3–16 letters, numbers, or underscores.', 'warning');
    renderSearchResult(null);
    return;
  }

  friendSearchButton.disabled = true;
  friendSearchInput.disabled = true;
  setFriendsStatus(`Searching for @${validation.username}…`, 'loading');
  try {
    const usernameSnap = await getDoc(doc(db, 'usernames', validation.normalized));
    if (!usernameSnap.exists()) {
      renderSearchResult(null);
      setFriendsStatus(`No Froggy player named @${validation.username} was found.`, 'warning');
      return;
    }
    const usernameData = usernameSnap.data();
    const profileSnap = await getDoc(doc(db, 'profiles', usernameData.uid));
    if (!profileSnap.exists()) {
      renderSearchResult(null);
      setFriendsStatus('That username reservation exists, but its public profile is unavailable.', 'error');
      return;
    }
    const profile = { uid: usernameData.uid, ...profileSnap.data() };
    renderSearchResult(profile);
    setFriendsStatus(`Found @${profile.username}.`, 'success');
  } catch (error) {
    console.error('Froggy player search failed', error);
    if (String(error?.code || '').includes('permission-denied')) socialPermissionMessage();
    else setFriendsStatus('Could not search players right now. Check your connection and try again.', 'error');
  } finally {
    friendSearchButton.disabled = false;
    friendSearchInput.disabled = false;
  }
}

async function viewPublicProfile(uid) {
  if (!uid) return;
  try {
    const snapshot = await getDoc(doc(db, 'profiles', uid));
    if (!snapshot.exists()) return;
    const profile = { uid, ...snapshot.data() };
    if (friendSearchInput) friendSearchInput.value = profile.username || '';
    renderSearchResult(profile);
    setFriendsStatus(`Viewing @${profile.username}.`, 'success');
    friendSearchResult?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (error) {
    console.error('Public profile load failed', error);
    setFriendsStatus('Could not open that public profile.', 'error');
  }
}

async function sendFriendRequest(targetProfile) {
  const user = auth.currentUser;
  if (!user || !activeProfile?.username || !targetProfile?.uid || targetProfile.uid === user.uid) return;
  const directId = requestId(user.uid, targetProfile.uid);
  const reverseId = requestId(targetProfile.uid, user.uid);
  const directRef = doc(db, 'friendRequests', directId);
  const reverseRef = doc(db, 'friendRequests', reverseId);
  const directFriendRef = doc(db, 'friendships', directId);
  const reverseFriendRef = doc(db, 'friendships', reverseId);

  setFriendsStatus(`Sending friend request to @${targetProfile.username}…`, 'loading');
  try {
    await runTransaction(db, async (transaction) => {
      const [directSnap, reverseSnap, directFriendSnap, reverseFriendSnap] = await Promise.all([
        transaction.get(directRef),
        transaction.get(reverseRef),
        transaction.get(directFriendRef),
        transaction.get(reverseFriendRef)
      ]);
      if (directFriendSnap.exists() || reverseFriendSnap.exists()) throw Object.assign(new Error('already-friends'), { froggyCode: 'already-friends' });
      if (directSnap.exists() || reverseSnap.exists()) throw Object.assign(new Error('request-exists'), { froggyCode: 'request-exists' });
      transaction.set(directRef, {
        fromUid: user.uid,
        toUid: targetProfile.uid,
        fromUsername: activeProfile.username,
        toUsername: targetProfile.username,
        status: 'pending',
        createdAt: serverTimestamp(),
        schemaVersion: 1
      });
    });
    setFriendsStatus(`Friend request sent to @${targetProfile.username}.`, 'success');
  } catch (error) {
    console.error('Friend request send failed', error);
    if (error?.froggyCode === 'already-friends') setFriendsStatus(`You are already friends with @${targetProfile.username}.`, 'warning');
    else if (error?.froggyCode === 'request-exists') setFriendsStatus('A friend request between these players already exists.', 'warning');
    else if (String(error?.code || '').includes('permission-denied')) socialPermissionMessage();
    else setFriendsStatus('Could not send that friend request.', 'error');
  }
}

async function acceptFriendRequest(item) {
  const user = auth.currentUser;
  if (!user || !item?.id || item.toUid !== user.uid) return;
  const requestRef = doc(db, 'friendRequests', item.id);
  const friendshipRef = doc(db, 'friendships', item.id);
  setFriendsStatus(`Accepting @${item.fromUsername}…`, 'loading');
  try {
    await runTransaction(db, async (transaction) => {
      const requestSnap = await transaction.get(requestRef);
      const friendshipSnap = await transaction.get(friendshipRef);
      if (!requestSnap.exists()) throw Object.assign(new Error('missing-request'), { froggyCode: 'missing-request' });
      const current = requestSnap.data();
      if (current.status !== 'pending' || current.toUid !== user.uid) throw Object.assign(new Error('request-changed'), { froggyCode: 'request-changed' });
      if (friendshipSnap.exists()) return;
      const now = serverTimestamp();
      transaction.update(requestRef, { status: 'accepted', respondedAt: now });
      transaction.set(friendshipRef, {
        requestId: item.id,
        members: [current.fromUid, current.toUid],
        fromUid: current.fromUid,
        toUid: current.toUid,
        fromUsername: current.fromUsername,
        toUsername: current.toUsername,
        createdAt: now,
        schemaVersion: 1
      });
    });
    setFriendsStatus(`You and @${item.fromUsername} are now friends.`, 'success');
  } catch (error) {
    console.error('Friend request accept failed', error);
    if (String(error?.code || '').includes('permission-denied')) socialPermissionMessage();
    else setFriendsStatus('Could not accept that request. It may have changed on another device.', 'error');
  }
}

async function declineFriendRequest(item) {
  const user = auth.currentUser;
  if (!user || !item?.id || item.toUid !== user.uid) return;
  const requestRef = doc(db, 'friendRequests', item.id);
  setFriendsStatus(`Declining @${item.fromUsername}…`, 'loading');
  try {
    await runTransaction(db, async (transaction) => {
      const requestSnap = await transaction.get(requestRef);
      if (!requestSnap.exists()) return;
      const current = requestSnap.data();
      if (current.status !== 'pending' || current.toUid !== user.uid) throw new Error('request-changed');
      transaction.delete(requestRef);
    });
    setFriendsStatus(`Declined @${item.fromUsername}'s request.`, 'success');
  } catch (error) {
    console.error('Friend request decline failed', error);
    if (String(error?.code || '').includes('permission-denied')) socialPermissionMessage();
    else setFriendsStatus('Could not decline that request.', 'error');
  }
}

async function cancelFriendRequest(item) {
  const user = auth.currentUser;
  if (!user || !item?.id || item.fromUid !== user.uid) return;
  const requestRef = doc(db, 'friendRequests', item.id);
  setFriendsStatus(`Canceling request to @${item.toUsername}…`, 'loading');
  try {
    await runTransaction(db, async (transaction) => {
      const requestSnap = await transaction.get(requestRef);
      if (!requestSnap.exists()) return;
      const current = requestSnap.data();
      if (current.status !== 'pending' || current.fromUid !== user.uid) throw new Error('request-changed');
      transaction.delete(requestRef);
    });
    setFriendsStatus(`Canceled the request to @${item.toUsername}.`, 'success');
  } catch (error) {
    console.error('Friend request cancel failed', error);
    if (String(error?.code || '').includes('permission-denied')) socialPermissionMessage();
    else setFriendsStatus('Could not cancel that request.', 'error');
  }
}

async function removeFriend(item) {
  const user = auth.currentUser;
  if (!user || !item?.id || !item.members?.includes(user.uid)) return;
  const otherUsername = item.fromUid === user.uid ? item.toUsername : item.fromUsername;
  const friendshipRef = doc(db, 'friendships', item.id);
  const requestRef = doc(db, 'friendRequests', item.requestId || item.id);
  setFriendsStatus(`Removing @${otherUsername}…`, 'loading');
  try {
    await runTransaction(db, async (transaction) => {
      const [friendshipSnap, requestSnap] = await Promise.all([
        transaction.get(friendshipRef),
        transaction.get(requestRef)
      ]);
      if (friendshipSnap.exists()) transaction.delete(friendshipRef);
      if (requestSnap.exists()) transaction.delete(requestRef);
    });
    setFriendsStatus(`@${otherUsername} was removed from your friends.`, 'success');
  } catch (error) {
    console.error('Friend removal failed', error);
    if (String(error?.code || '').includes('permission-denied')) socialPermissionMessage();
    else setFriendsStatus('Could not remove that friend.', 'error');
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

  friendSearchForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    await searchPlayer(friendSearchInput?.value || '');
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
      clearSocialSubscriptions();
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
  friendsPanel?.classList.add('hidden');
  if (signInButton) signInButton.disabled = true;
  setStatus('Froggy Accounts could not load. The game itself still works normally.', 'error');
}
