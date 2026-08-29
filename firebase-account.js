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
  setDoc,
  runTransaction,
  serverTimestamp,
  collection,
  query,
  where,
  onSnapshot
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js';
import {
  getFunctions,
  httpsCallable
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-functions.js';

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

const cloudPanel = byId('froggyCloudPanel');
const cloudBadge = byId('froggyCloudBadge');
const cloudLocalSummary = byId('froggyCloudLocalSummary');
const cloudRemoteSummary = byId('froggyCloudRemoteSummary');
const cloudRevisionLabel = byId('froggyCloudRevision');
const cloudUpdatedLabel = byId('froggyCloudUpdated');
const cloudConflict = byId('froggyCloudConflict');
const cloudUploadButton = byId('froggyCloudUploadButton');
const cloudLoadButton = byId('froggyCloudLoadButton');
const cloudKeepLocalButton = byId('froggyCloudKeepLocalButton');
const cloudSyncButton = byId('froggyCloudSyncButton');
const cloudStatus = byId('froggyCloudStatus');

const economyPanel = byId('froggyEconomyPanel');
const economyBadge = byId('froggyEconomyBadge');
const economyWallet = byId('froggyEconomyWallet');
const economyCases = byId('froggyEconomyCases');
const economyMigration = byId('froggyEconomyMigration');
const economyTransfer = byId('froggyEconomyTransfer');
const economyCheckButton = byId('froggyEconomyCheckButton');
const economyMigrateButton = byId('froggyEconomyMigrateButton');
const ownerConsoleButton = byId('froggyOwnerConsoleButton');
const economyStatus = byId('froggyEconomyStatus');

const GAME_STORAGE_KEY = 'froggy-leap-deluxe-v3';
const CLOUD_DEVICE_KEY = 'froggy-cloud-device-v1';
const CLOUD_META_PREFIX = 'froggy-cloud-meta-v1:';
const CLOUD_BUILD_VERSION = 'v114.0';
const CLOUD_AUTOSAVE_DELAY_MS = 12000;

let auth;
let db;
let functionsApi;
let activeProfile = null;
let profileLoadToken = 0;
let socialUnsubs = [];
let incomingRequests = new Map();
let outgoingRequests = new Map();
let friendships = new Map();
let searchedProfile = null;

let cloudUid = '';
let cloudSaveRef = null;
let cloudUnsub = null;
let cloudUploadTimer = 0;
let cloudRemote = null;
let cloudRemoteRevision = 0;
let cloudBaseRevision = 0;
let cloudSyncedSignature = '';
let cloudLastObservedSignature = '';
let cloudInitialized = false;
let cloudBusy = false;

let serverEconomySnapshot = null;
let serverEconomyBusy = false;
let serverEconomyUnsub = null;
const SERVER_ECONOMY_VERSION = 'v114-bank-piggy-plinko';

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
  friendsPanel?.classList.remove('hidden');

  if (hasProfile) {
    const label = `@${profile.username}`;
    if (publicUsername) publicUsername.textContent = label;
    if (usernameMeta) usernameMeta.textContent = label;
    setUsernameHint('Username claimed.', 'success');
  } else {
    if (publicUsername) publicUsername.textContent = '@—';
    if (usernameMeta) usernameMeta.textContent = 'NOT SET';
    if (friendsMeta) friendsMeta.textContent = 'FRIENDS v1';
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
    setStatus('Sign in to reconnect your Froggy identity, friends, and private Cloud Save.', 'info');
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
  setFriendsStatus('Firestore is blocking Friends v1. Publish the included v101 Firestore rules, then reload.', 'error');
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
      setStatus(`Froggy account connected as @${profile.username}. Cloud Save v1 is available below.`, 'success');
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
      setStatus('Firestore is blocking player profiles. Publish the included v101 Firestore rules, then reload.', 'error');
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
      setStatus('Publish the included v101 Firestore rules in Firebase, then try claiming the username again.', 'error');
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

  // A single participant query matches the Firestore read rule exactly.
  // This avoids collection-query permission failures caused by fromUid/toUid OR rules.
  const requestsQuery = query(collection(db, 'friendRequests'), where('participants', 'array-contains', user.uid));
  const friendsQuery = query(collection(db, 'friendships'), where('members', 'array-contains', user.uid));

  socialUnsubs.push(onSnapshot(requestsQuery, (snapshot) => {
    incomingRequests = new Map();
    outgoingRequests = new Map();
    snapshot.forEach((snap) => {
      const data = snap.data();
      if (data.status !== 'pending') return;
      if (data.toUid === user.uid) incomingRequests.set(data.fromUid, { id: snap.id, ...data });
      else if (data.fromUid === user.uid) outgoingRequests.set(data.toUid, { id: snap.id, ...data });
    });
    renderSocialLists();
  }, (error) => {
    console.error('Friend requests listener failed', error);
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
    // Create directly. Firestore rules atomically reject reverse requests or existing friendships,
    // so the client never needs permission to probe missing private documents first.
    await setDoc(directRef, {
      fromUid: user.uid,
      toUid: targetProfile.uid,
      participants: [user.uid, targetProfile.uid],
      fromUsername: activeProfile.username,
      toUsername: targetProfile.username,
      status: 'pending',
      createdAt: serverTimestamp(),
      schemaVersion: 2
    });
    setFriendsStatus(`Friend request sent to @${targetProfile.username}.`, 'success');
  } catch (error) {
    console.error('Friend request send failed', error);
    if (error?.froggyCode === 'already-friends') setFriendsStatus(`You are already friends with @${targetProfile.username}.`, 'warning');
    else if (error?.froggyCode === 'request-exists') setFriendsStatus('A friend request between these players already exists.', 'warning');
    else if (String(error?.code || '').includes('permission-denied')) setFriendsStatus('Request blocked: you may already have a request/friendship with this player, or v101 Firestore rules are not published yet.', 'warning');
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
      if (!requestSnap.exists()) throw Object.assign(new Error('missing-request'), { froggyCode: 'missing-request' });
      const current = requestSnap.data();
      if (current.status !== 'pending' || current.toUid !== user.uid) throw Object.assign(new Error('request-changed'), { froggyCode: 'request-changed' });
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

function setCloudStatus(message, state = 'info') {
  if (!cloudStatus) return;
  cloudStatus.textContent = message || '';
  cloudStatus.dataset.state = state;
}

function setCloudBadge(label, state = 'info') {
  if (!cloudBadge) return;
  cloudBadge.textContent = label;
  cloudBadge.dataset.state = state;
}

function toggleCloudButton(button, visible) {
  button?.classList.toggle('hidden', !visible);
}

function clearCloudActions() {
  toggleCloudButton(cloudUploadButton, false);
  toggleCloudButton(cloudLoadButton, false);
  toggleCloudButton(cloudKeepLocalButton, false);
  toggleCloudButton(cloudSyncButton, false);
  cloudConflict?.classList.add('hidden');
}

function getCloudDeviceId() {
  let id = localStorage.getItem(CLOUD_DEVICE_KEY) || '';
  if (!id) {
    try { id = crypto.randomUUID(); }
    catch { id = `device-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`; }
    localStorage.setItem(CLOUD_DEVICE_KEY, id);
  }
  return id;
}

function cloudMetaKey(uid) {
  return `${CLOUD_META_PREFIX}${uid}`;
}

function readCloudMeta(uid) {
  try {
    const raw = JSON.parse(localStorage.getItem(cloudMetaKey(uid)) || 'null');
    return raw && typeof raw === 'object' ? raw : null;
  } catch {
    return null;
  }
}

function writeCloudMeta(uid, revision, signature) {
  localStorage.setItem(cloudMetaKey(uid), JSON.stringify({
    revision: Math.max(0, Math.floor(Number(revision) || 0)),
    signature: String(signature || ''),
    deviceId: getCloudDeviceId(),
    syncedAt: Date.now()
  }));
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    const result = {};
    for (const key of Object.keys(value).sort()) result[key] = canonicalize(value[key]);
    return result;
  }
  return value;
}

function saveSignature(save) {
  const text = JSON.stringify(canonicalize(save || {}));
  let a = 2166136261;
  let b = 2246822519;
  for (let i = 0; i < text.length; i += 1) {
    const c = text.charCodeAt(i);
    a ^= c;
    a = Math.imul(a, 16777619) >>> 0;
    b ^= c + (i & 255);
    b = Math.imul(b, 3266489917) >>> 0;
  }
  return `${a.toString(16).padStart(8, '0')}${b.toString(16).padStart(8, '0')}`;
}

function readLocalGameSave({ ensure = true } = {}) {
  try {
    const raw = localStorage.getItem(GAME_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.warn('Local Froggy save could not be parsed', error);
  }
  if (ensure) {
    try {
      const exported = window.FroggyGame?.exportSave?.();
      if (exported && typeof exported === 'object' && !Array.isArray(exported)) return exported;
    } catch (error) {
      console.warn('Could not export current Froggy save', error);
    }
  }
  return null;
}

function compactCloudMoney(value) {
  const n = Math.max(0, Number(value) || 0);
  if (n >= 1e12) return `${(n / 1e12).toFixed(n >= 1e13 ? 1 : 2).replace(/\.0+$/, '')}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(n >= 1e10 ? 1 : 2).replace(/\.0+$/, '')}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e7 ? 1 : 2).replace(/\.0+$/, '')}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(n >= 1e4 ? 1 : 2).replace(/\.0+$/, '')}K`;
  return Math.floor(n).toLocaleString();
}

function summarizeSave(save) {
  if (!save) return 'No save found';
  const level = Math.max(1, Math.floor(Number(save.level) || 1));
  const wallet = compactCloudMoney(save.balance);
  const frogs = Array.isArray(save.unlockedFrogs) ? save.unlockedFrogs.length : 1;
  const cases = save.caseInventory && typeof save.caseInventory === 'object'
    ? Object.values(save.caseInventory).reduce((sum, value) => sum + Math.max(0, Math.floor(Number(value) || 0)), 0)
    : 0;
  return `Lv. ${level} · ${wallet} F · ${frogs} frogs · ${cases} cases`;
}

function formatCloudUpdated(value) {
  try {
    const date = value?.toDate?.();
    if (!date) return 'Pending sync';
    return date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  } catch {
    return 'Cloud save';
  }
}

function renderCloudSummaries() {
  const local = readLocalGameSave();
  if (cloudLocalSummary) cloudLocalSummary.textContent = summarizeSave(local);
  if (cloudRemoteSummary) cloudRemoteSummary.textContent = cloudRemote?.save ? summarizeSave(cloudRemote.save) : 'No cloud save yet';
  if (cloudRevisionLabel) cloudRevisionLabel.textContent = cloudRemoteRevision > 0 ? `#${cloudRemoteRevision}` : '—';
  if (cloudUpdatedLabel) cloudUpdatedLabel.textContent = cloudRemote ? formatCloudUpdated(cloudRemote.updatedAt) : '—';
}

function stopCloudSave({ hide = true } = {}) {
  if (cloudUploadTimer) clearTimeout(cloudUploadTimer);
  cloudUploadTimer = 0;
  try { cloudUnsub?.(); } catch {}
  cloudUnsub = null;
  cloudUid = '';
  cloudSaveRef = null;
  cloudRemote = null;
  cloudRemoteRevision = 0;
  cloudBaseRevision = 0;
  cloudSyncedSignature = '';
  cloudLastObservedSignature = '';
  cloudInitialized = false;
  cloudBusy = false;
  clearCloudActions();
  if (hide) cloudPanel?.classList.add('hidden');
}

function renderCloudConnected(message = 'Cloud Save is connected. Local changes will sync automatically.') {
  clearCloudActions();
  setCloudBadge('SYNCED', 'success');
  toggleCloudButton(cloudSyncButton, true);
  setCloudStatus(message, 'success');
  renderCloudSummaries();
}

function renderCloudConflict(message = 'Both saves have changes. Choose which progress should win.') {
  if (cloudUploadTimer) { clearTimeout(cloudUploadTimer); cloudUploadTimer = 0; }
  clearCloudActions();
  cloudConflict?.classList.remove('hidden');
  toggleCloudButton(cloudLoadButton, true);
  toggleCloudButton(cloudKeepLocalButton, true);
  setCloudBadge('CONFLICT', 'warning');
  setCloudStatus(message, 'warning');
  renderCloudSummaries();
}

function renderRemoteNewer() {
  if (cloudUploadTimer) { clearTimeout(cloudUploadTimer); cloudUploadTimer = 0; }
  clearCloudActions();
  toggleCloudButton(cloudLoadButton, true);
  setCloudBadge('CLOUD NEWER', 'warning');
  setCloudStatus('A newer cloud save exists. Load it to continue from the latest synced progress.', 'warning');
  renderCloudSummaries();
}

function renderNoCloud() {
  if (cloudUploadTimer) { clearTimeout(cloudUploadTimer); cloudUploadTimer = 0; }
  clearCloudActions();
  toggleCloudButton(cloudUploadButton, true);
  setCloudBadge('LOCAL ONLY', 'warning');
  setCloudStatus('No cloud save exists yet. Upload this device once to start cross-device syncing.', 'warning');
  renderCloudSummaries();
}

function renderLocalDirty() {
  clearCloudActions();
  toggleCloudButton(cloudSyncButton, true);
  setCloudBadge('SYNC PENDING', 'warning');
  setCloudStatus('This device has newer local progress. It will auto-sync shortly, or press SYNC NOW.', 'warning');
  renderCloudSummaries();
}

function evaluateCloudState({ schedule = false } = {}) {
  if (!cloudInitialized || !cloudUid || cloudBusy) return;
  const local = readLocalGameSave();
  const localSignature = saveSignature(local);
  cloudLastObservedSignature = localSignature;

  if (!cloudRemote) {
    renderNoCloud();
    return;
  }

  const meta = readCloudMeta(cloudUid);
  cloudBaseRevision = Math.max(0, Math.floor(Number(meta?.revision) || 0));
  cloudSyncedSignature = String(meta?.signature || '');
  const localDirty = Boolean(cloudSyncedSignature) && localSignature !== cloudSyncedSignature;

  if (!meta) {
    renderCloudConflict('A cloud save already exists, but this device has never synced it. Choose the cloud save or keep this device.');
    return;
  }

  if (cloudRemoteRevision > cloudBaseRevision) {
    if (localDirty) renderCloudConflict('The cloud changed on another device and this device also has unsynced progress. Choose which save should win.');
    else renderRemoteNewer();
    return;
  }

  if (cloudRemoteRevision < cloudBaseRevision) {
    renderCloudConflict('This device has cloud metadata newer than the save currently returned by Firestore. Wait a moment or choose a save manually.');
    return;
  }

  if (localDirty) {
    renderLocalDirty();
    if (schedule) scheduleCloudUpload();
    return;
  }

  renderCloudConnected();
}

function scheduleCloudUpload() {
  if (cloudUploadTimer || !cloudInitialized || !cloudRemote || cloudBusy) return;
  cloudUploadTimer = setTimeout(() => {
    cloudUploadTimer = 0;
    void uploadLocalToCloud({ force: false, automatic: true });
  }, CLOUD_AUTOSAVE_DELAY_MS);
}

async function uploadLocalToCloud({ force = false, automatic = false } = {}) {
  const user = auth?.currentUser;
  if (!user || user.uid !== cloudUid || !cloudSaveRef || cloudBusy) return false;
  const local = readLocalGameSave();
  if (!local) {
    setCloudStatus('No local Froggy save was found on this device.', 'error');
    return false;
  }
  const serializedLocal = JSON.stringify(local);
  if (serializedLocal.length > 850000) {
    setCloudBadge('TOO LARGE', 'error');
    setCloudStatus('This local save is too large for a single Firestore document. Nothing was uploaded.', 'error');
    return false;
  }
  const localSignature = saveSignature(local);
  const expectedRevision = cloudBaseRevision;
  cloudBusy = true;
  clearCloudActions();
  setCloudBadge('SYNCING', 'info');
  setCloudStatus(automatic ? 'Autosaving this device to Froggy Cloud…' : 'Saving this device to Froggy Cloud…', 'loading');
  try {
    const nextRevision = await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(cloudSaveRef);
      const exists = snapshot.exists();
      const current = exists ? snapshot.data() : null;
      const currentRevision = exists ? Math.max(0, Math.floor(Number(current?.saveRevision) || 0)) : 0;
      if (!force && currentRevision !== expectedRevision) {
        const conflictError = new Error('cloud-revision-conflict');
        conflictError.froggyCode = 'cloud-revision-conflict';
        throw conflictError;
      }
      const revision = currentRevision + 1;
      transaction.set(cloudSaveRef, {
        save: local,
        saveRevision: revision,
        updatedAt: serverTimestamp(),
        schemaVersion: 1,
        gameVersion: CLOUD_BUILD_VERSION,
        deviceId: getCloudDeviceId()
      });
      return revision;
    });
    cloudBaseRevision = nextRevision;
    cloudRemoteRevision = nextRevision;
    cloudSyncedSignature = localSignature;
    writeCloudMeta(user.uid, nextRevision, localSignature);
    cloudRemote = { ...(cloudRemote || {}), save: local, saveRevision: nextRevision, gameVersion: CLOUD_BUILD_VERSION, deviceId: getCloudDeviceId() };
    renderCloudConnected(automatic ? 'Cloud autosave complete.' : 'This device is now saved to Froggy Cloud.');
    return true;
  } catch (error) {
    console.error('Cloud save upload failed', error);
    if (error?.froggyCode === 'cloud-revision-conflict' || String(error?.message || '').includes('cloud-revision-conflict')) {
      try {
        const latest = await getDoc(cloudSaveRef);
        cloudRemote = latest.exists() ? latest.data() : null;
        cloudRemoteRevision = cloudRemote ? Math.max(0, Math.floor(Number(cloudRemote.saveRevision) || 0)) : 0;
      } catch {}
      renderCloudConflict('Another device updated the cloud before this upload finished. Nothing was overwritten. Choose which save should win.');
    } else if (String(error?.code || '').includes('permission-denied')) {
      setCloudBadge('BLOCKED', 'error');
      setCloudStatus('Firestore is blocking Cloud Save. Confirm the current v112 Firestore rules are published.', 'error');
      toggleCloudButton(cloudSyncButton, true);
    } else {
      setCloudBadge('OFFLINE', 'error');
      setCloudStatus('Cloud Save could not sync. Your local progress is still safe on this device.', 'error');
      toggleCloudButton(cloudSyncButton, true);
    }
    return false;
  } finally {
    cloudBusy = false;
  }
}

async function loadCloudOntoDevice() {
  const user = auth?.currentUser;
  if (!user || user.uid !== cloudUid || !cloudRemote?.save || cloudBusy) return;
  if (!confirm('Replace this device\'s local Froggy progress with the cloud save?')) return;
  cloudBusy = true;
  clearCloudActions();
  setCloudBadge('LOADING', 'info');
  setCloudStatus('Loading your cloud progress onto this device…', 'loading');
  try {
    const cloudSave = cloudRemote.save;
    const signature = saveSignature(cloudSave);
    const prepared = window.FroggyGame?.prepareCloudRestore?.(cloudSave);
    if (!prepared) localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(cloudSave));
    writeCloudMeta(user.uid, cloudRemoteRevision, signature);
    setCloudStatus('Cloud progress loaded. Restarting Froggy Leap…', 'success');
    setTimeout(() => location.reload(), 250);
  } catch (error) {
    console.error('Cloud save load failed', error);
    cloudBusy = false;
    setCloudBadge('ERROR', 'error');
    setCloudStatus('Could not apply the cloud save to this device. Nothing was overwritten.', 'error');
    evaluateCloudState();
  }
}

async function keepThisDevice() {
  if (!cloudRemote) {
    await uploadLocalToCloud({ force: false });
    return;
  }
  if (!confirm('Overwrite the current cloud save with this device\'s progress? The cloud revision will advance so the older copy can still be detected on other devices.')) return;
  await uploadLocalToCloud({ force: true });
}

async function startCloudSave(user) {
  stopCloudSave({ hide: false });
  if (!user?.uid) return;
  cloudUid = user.uid;
  cloudSaveRef = doc(db, 'gameSaves', user.uid);
  cloudPanel?.classList.remove('hidden');
  setCloudBadge('CHECKING', 'info');
  setCloudStatus('Checking this device against Froggy Cloud…', 'loading');
  renderCloudSummaries();
  try {
    const snapshot = await getDoc(cloudSaveRef);
    if (auth.currentUser?.uid !== user.uid) return;
    cloudRemote = snapshot.exists() ? snapshot.data() : null;
    cloudRemoteRevision = cloudRemote ? Math.max(0, Math.floor(Number(cloudRemote.saveRevision) || 0)) : 0;
    cloudInitialized = true;
    evaluateCloudState({ schedule: true });

    cloudUnsub = onSnapshot(cloudSaveRef, (nextSnapshot) => {
      if (!cloudInitialized || auth.currentUser?.uid !== user.uid) return;
      const previousRevision = cloudRemoteRevision;
      cloudRemote = nextSnapshot.exists() ? nextSnapshot.data() : null;
      cloudRemoteRevision = cloudRemote ? Math.max(0, Math.floor(Number(cloudRemote.saveRevision) || 0)) : 0;
      renderCloudSummaries();
      if (!cloudBusy && cloudRemoteRevision !== previousRevision) evaluateCloudState({ schedule: false });
    }, (error) => {
      console.error('Cloud save listener failed', error);
      if (String(error?.code || '').includes('permission-denied')) {
        setCloudBadge('BLOCKED', 'error');
        setCloudStatus('Firestore is blocking Cloud Save. Confirm the current v112 Firestore rules are published.', 'error');
      }
    });
  } catch (error) {
    console.error('Cloud save initialization failed', error);
    cloudInitialized = false;
    setCloudBadge('ERROR', 'error');
    if (String(error?.code || '').includes('permission-denied')) {
      setCloudStatus('Firestore is blocking Cloud Save. Confirm the current v112 Firestore rules are published.', 'error');
    } else {
      setCloudStatus('Could not reach Froggy Cloud. Your local game still works normally.', 'error');
    }
  }
}

function setEconomyStatus(message, state = 'info') {
  if (!economyStatus) return;
  economyStatus.textContent = message || '';
  economyStatus.dataset.state = state;
}

async function refreshOwnerConsoleAccess({ migrated = Boolean(serverEconomySnapshot) } = {}) {
  ownerConsoleButton?.classList.add('hidden');
  document.documentElement.dataset.serverOwner = 'false';
  if (!auth?.currentUser || !migrated) return false;
  try {
    const result = await callable('adminStatus')({});
    const enabled = result?.data?.enabled === true;
    ownerConsoleButton?.classList.toggle('hidden', !enabled);
    document.documentElement.dataset.serverOwner = enabled ? 'true' : 'false';
    return enabled;
  } catch (error) {
    console.warn('Server Owner status check failed', error);
    return false;
  }
}

function setEconomyBadge(label, state = 'info') {
  if (!economyBadge) return;
  economyBadge.textContent = label || '';
  economyBadge.dataset.state = state;
}

function compactEconomyMoney(value) {
  const amount = Math.max(0, Math.floor(Number(value) || 0));
  if (amount >= 1e12) return `${(amount / 1e12).toFixed(amount >= 1e13 ? 1 : 2).replace(/\.0+$|(?<=\.[0-9])0+$/g, '')}T F`;
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(amount >= 1e10 ? 1 : 2).replace(/\.0+$|(?<=\.[0-9])0+$/g, '')}B F`;
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(amount >= 1e7 ? 1 : 2).replace(/\.0+$|(?<=\.[0-9])0+$/g, '')}M F`;
  return `${amount.toLocaleString()} F`;
}

function normalizeServerEconomySnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return null;
  const inv = snapshot.caseInventory && typeof snapshot.caseInventory === 'object' ? snapshot.caseInventory : {};
  return {
    schemaVersion: Math.max(1, Math.floor(Number(snapshot.schemaVersion) || 1)),
    economyPhase: Math.max(1, Math.floor(Number(snapshot.economyPhase) || 1)),
    backendVersion: String(snapshot.backendVersion || SERVER_ECONOMY_VERSION),
    wallet: Math.max(0, Math.floor(Number(snapshot.wallet) || 0)),
    piggyBalance: Math.max(0, Math.floor(Number(snapshot.piggyBalance) || 0)),
    level: Math.max(1, Math.floor(Number(snapshot.level) || 1)),
    xp: Math.max(0, Math.floor(Number(snapshot.xp) || 0)),
    jobLevel: Math.max(1, Math.floor(Number(snapshot.jobLevel) || 1)),
    jobXp: Math.max(0, Math.floor(Number(snapshot.jobXp) || 0)),
    caseInventory: { pond: Math.max(0, Math.floor(Number(inv.pond) || 0)), neon: Math.max(0, Math.floor(Number(inv.neon) || 0)), ultra: Math.max(0, Math.floor(Number(inv.ultra) || 0)) },
    unlockedFrogs: Array.isArray(snapshot.unlockedFrogs) ? snapshot.unlockedFrogs.map(String) : ['classic'],
    unlockedLakes: Array.isArray(snapshot.unlockedLakes) ? snapshot.unlockedLakes.map(String) : ['forest'],
    casesOpened: Math.max(0, Math.floor(Number(snapshot.casesOpened) || 0)),
    caseLuckMultiplier: Math.max(1, Math.min(100, Number(snapshot.caseLuckMultiplier) || 1)),
    piggyCycleElapsedMs: Math.max(0, Math.floor(Number(snapshot.piggyCycleElapsedMs) || 0)),
    piggyCycleInterest: Math.max(0, Number(snapshot.piggyCycleInterest) || 0),
    piggyLifetimeInterest: Math.max(0, Math.floor(Number(snapshot.piggyLifetimeInterest) || 0)),
    piggyCycles: Math.max(0, Math.floor(Number(snapshot.piggyCycles) || 0)),
    piggyInterestRateBonus: Math.max(0, Number(snapshot.piggyInterestRateBonus) || 0),
    piggyOpenRate: Math.max(0, Number(snapshot.piggyOpenRate) || 0.003),
    piggyClosedRate: Math.max(0, Number(snapshot.piggyClosedRate) || 0.002),
    debt: Math.max(0, Math.floor(Number(snapshot.debt) || 0)),
    debtTurns: Math.max(0, Math.floor(Number(snapshot.debtTurns) || 0)),
    debtDue: snapshot.debtDue === true,
    debtDueAmount: Math.max(0, Math.floor(Number(snapshot.debtDueAmount) || 0)),
    loanPrincipalOriginal: Math.max(0, Math.floor(Number(snapshot.loanPrincipalOriginal) || 0)),
    loanPrincipalRemaining: Math.max(0, Math.floor(Number(snapshot.loanPrincipalRemaining) || 0)),
    loanInterestTotal: Math.max(0, Math.floor(Number(snapshot.loanInterestTotal) || 0)),
    loanInterestPaid: Math.max(0, Math.floor(Number(snapshot.loanInterestPaid) || 0)),
    loanInstallment: Math.max(0, Math.floor(Number(snapshot.loanInstallment) || 0)),
    loanInstallmentsPaid: Math.max(0, Math.floor(Number(snapshot.loanInstallmentsPaid) || 0)),
    loanRate: Math.max(0, Number(snapshot.loanRate) || 0.08),
    pledgedPiggy: Math.max(0, Math.floor(Number(snapshot.pledgedPiggy) || 0)),
    pledgedFrogs: Array.isArray(snapshot.pledgedFrogs) ? snapshot.pledgedFrogs.map(String) : [],
    pledgedLakes: Array.isArray(snapshot.pledgedLakes) ? snapshot.pledgedLakes.map(String) : [],
    loanCollateralAtOrigination: Math.max(0, Math.floor(Number(snapshot.loanCollateralAtOrigination) || 0)),
    debtPayments: Math.max(0, Math.floor(Number(snapshot.debtPayments) || 0)),
    onTimeRepaid: Math.max(0, Math.floor(Number(snapshot.onTimeRepaid) || 0)),
    missedDebtDeadlines: Math.max(0, Math.floor(Number(snapshot.missedDebtDeadlines) || 0)),
    debtCycleMissed: snapshot.debtCycleMissed === true,
    plinkoDrops: Math.max(0, Math.floor(Number(snapshot.plinkoDrops) || 0)),
    plinkoWins: Math.max(0, Math.floor(Number(snapshot.plinkoWins) || 0)),
    plinkoLastMultiplier: Math.max(0, Number(snapshot.plinkoLastMultiplier) || 0),
    bestPlinkoMultiplier: Math.max(0, Number(snapshot.bestPlinkoMultiplier) || 0),
    bankInstallmentAmount: Math.max(0, Math.floor(Number(snapshot.bankInstallmentAmount) || 0)),
    bankPayoffAmount: Math.max(0, Math.floor(Number(snapshot.bankPayoffAmount) || 0)),
    bankPayoffSavings: Math.max(0, Math.floor(Number(snapshot.bankPayoffSavings) || 0)),
    loanDueInMs: Math.max(0, Math.floor(Number(snapshot.loanDueInMs) || 0)),
    bankRoundsRemaining: Math.max(0, Math.floor(Number(snapshot.bankRoundsRemaining) || 0)),
    transferState: String(snapshot.transferState || (Number(snapshot.economyPhase) >= 4 ? 'LOCKED_PHASE_4' : 'LOCKED_PHASE_3')),
    migrationSourceRevision: Math.max(0, Math.floor(Number(snapshot.migrationSourceRevision) || 0)),
    migrationSourceGameVersion: String(snapshot.migrationSourceGameVersion || '').slice(0, 32),
    phase3ImportedRevision: Math.max(0, Math.floor(Number(snapshot.phase3ImportedRevision) || 0))
  };
}

function renderServerEconomySnapshot(snapshot) {
  snapshot = normalizeServerEconomySnapshot(snapshot);
  const previousSnapshotJson = serverEconomySnapshot ? JSON.stringify(serverEconomySnapshot) : '';
  const nextSnapshotJson = snapshot ? JSON.stringify(snapshot) : '';
  if (previousSnapshotJson === nextSnapshotJson) return snapshot;
  serverEconomySnapshot = snapshot;
  if (!snapshot) {
    if (economyWallet) economyWallet.textContent = 'NOT MIGRATED';
    if (economyCases) economyCases.textContent = '—';
    if (economyMigration) economyMigration.textContent = '—';
    if (economyTransfer) economyTransfer.textContent = 'LOCKED';
    const economyJob = byId('froggyEconomyJob');
    const economyCollection = byId('froggyEconomyCollection');
    if (economyJob) economyJob.textContent = '—';
    if (economyCollection) economyCollection.textContent = '—';
    window.dispatchEvent(new CustomEvent('froggy-server-economy-snapshot', { detail: null }));
    return;
  }
  if (economyWallet) economyWallet.textContent = compactEconomyMoney(snapshot.wallet);
  if (economyCases) {
    const inv = snapshot.caseInventory || {};
    economyCases.textContent = `P ${Number(inv.pond)||0} · N ${Number(inv.neon)||0} · U ${Number(inv.ultra)||0}`;
  }
  if (economyMigration) economyMigration.textContent = `CLOUD r${Number(snapshot.migrationSourceRevision)||0}`;
  if (economyTransfer) economyTransfer.textContent = `LOCKED · PHASE ${snapshot.economyPhase >= 4 ? '4' : '3'}`;
  const economyJob = byId('froggyEconomyJob');
  const economyCollection = byId('froggyEconomyCollection');
  if (economyJob) economyJob.textContent = `JOB Lv ${Number(snapshot.jobLevel)||1} · SERVER`;
  if (economyCollection) economyCollection.textContent = `${(snapshot.unlockedFrogs||[]).length} frogs · ${(snapshot.unlockedLakes||[]).length} lakes`;
  window.dispatchEvent(new CustomEvent('froggy-server-economy-snapshot', { detail: snapshot }));
}

function serverEconomyRequestId(prefix = 'op') {
  const raw = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${raw}`.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 80);
}

function callable(name) {
  if (!functionsApi) throw new Error('functions-not-ready');
  return httpsCallable(functionsApi, name);
}

function economyErrorMessage(error) {
  const code = String(error?.code || '');
  const message = String(error?.message || '');
  if (code.includes('not-found') || code.includes('internal')) return 'Required Server Economy functions are not deployed yet. Deploy the matching Firebase backend package before this website build.';
  if (code.includes('unauthenticated')) return 'Sign in to your Froggy account first.';
  if (code.includes('failed-precondition')) return message.replace(/^FirebaseError:\s*/i, '') || 'Server Economy is not ready for this account yet.';
  if (code.includes('resource-exhausted')) return 'Too many economy actions. Wait a few seconds and try again.';
  return 'Could not reach Server Economy. The current local game is unchanged.';
}

async function fetchServerEconomySnapshot() {
  const result = await callable('getEconomySnapshot')({});
  const snapshot = result?.data?.economy || null;
  renderServerEconomySnapshot(snapshot);
  return snapshot;
}

function startServerEconomyLiveListener(uid) {
  if (serverEconomyUnsub) { try { serverEconomyUnsub(); } catch {} serverEconomyUnsub = null; }
  if (!uid || !db) return;
  const ref = doc(db, 'economies', uid);
  serverEconomyUnsub = onSnapshot(ref, (snap) => {
    if (auth.currentUser?.uid !== uid) return;
    if (snap.exists()) renderServerEconomySnapshot(snap.data());
  }, (error) => {
    console.warn('Server Economy live listener failed', error);
  });
}

function absorbServerEconomyResult(data) {
  if (!data || typeof data !== 'object') return data;
  if (data.economy && typeof data.economy === 'object') {
    renderServerEconomySnapshot(data.economy);
    return data;
  }
  const next = {...(serverEconomySnapshot || {})};
  if (Number.isFinite(Number(data.wallet))) next.wallet = Math.max(0, Math.floor(Number(data.wallet) || 0));
  if (data.caseInventory && typeof data.caseInventory === 'object') next.caseInventory = {...data.caseInventory};
  if (Array.isArray(data.unlockedFrogs)) next.unlockedFrogs = [...data.unlockedFrogs];
  if (Array.isArray(data.unlockedLakes)) next.unlockedLakes = [...data.unlockedLakes];
  if (Number.isFinite(Number(data.casesOpened))) next.casesOpened = Math.max(0, Math.floor(Number(data.casesOpened) || 0));
  if (Number.isFinite(Number(data.level))) next.level = Math.max(1, Math.floor(Number(data.level) || 1));
  if (Number.isFinite(Number(data.xp))) next.xp = Math.max(0, Math.floor(Number(data.xp) || 0));
  if (Number.isFinite(Number(data.jobLevel))) next.jobLevel = Math.max(1, Math.floor(Number(data.jobLevel) || 1));
  if (Number.isFinite(Number(data.jobXp))) next.jobXp = Math.max(0, Math.floor(Number(data.jobXp) || 0));
  if (Number.isFinite(Number(data.caseLuckMultiplier))) next.caseLuckMultiplier = Math.max(1, Math.min(100, Number(data.caseLuckMultiplier) || 1));
  const phase4NumberFields = ['piggyBalance','piggyCycleElapsedMs','piggyCycleInterest','piggyLifetimeInterest','piggyCycles','piggyInterestRateBonus','piggyOpenRate','piggyClosedRate','debt','debtTurns','debtDueAmount','loanPrincipalOriginal','loanPrincipalRemaining','loanInterestTotal','loanInterestPaid','loanInstallment','loanInstallmentsPaid','loanRate','pledgedPiggy','loanCollateralAtOrigination','debtPayments','onTimeRepaid','missedDebtDeadlines','plinkoDrops','plinkoWins','plinkoLastMultiplier','bestPlinkoMultiplier','bankInstallmentAmount','bankPayoffAmount','bankPayoffSavings','loanDueInMs','bankRoundsRemaining'];
  for (const key of phase4NumberFields) if (Number.isFinite(Number(data[key]))) next[key] = Number(data[key]);
  if ('debtDue' in data) next.debtDue = data.debtDue === true;
  if ('debtCycleMissed' in data) next.debtCycleMissed = data.debtCycleMissed === true;
  if (Array.isArray(data.pledgedFrogs)) next.pledgedFrogs = [...data.pledgedFrogs];
  if (Array.isArray(data.pledgedLakes)) next.pledgedLakes = [...data.pledgedLakes];
  next.economyPhase = Math.max(3, Number(data.economyPhase) || Number(next.economyPhase) || 3);
  next.backendVersion = SERVER_ECONOMY_VERSION;
  next.transferState = next.economyPhase >= 4 ? 'LOCKED_PHASE_4' : 'LOCKED_PHASE_3';
  renderServerEconomySnapshot(next);
  return data;
}

async function checkServerEconomy({quiet = false} = {}) {
  const user = auth?.currentUser;
  if (!user) return null;
  if (!quiet) { setEconomyBadge('CHECKING', 'info'); setEconomyStatus('Checking the private backend…', 'loading'); }
  try {
    const result = await callable('economyStatus')({});
    const data = result?.data || {};
    if (data.migrated) {
      const snapshot = await fetchServerEconomySnapshot();
      startServerEconomyLiveListener(user.uid);
      const phase4 = Number(snapshot?.economyPhase) >= 4;
      setEconomyBadge(phase4 ? 'PHASE 4 LIVE' : 'PHASE 3 LIVE', 'success');
      setEconomyStatus(phase4 ? 'Server-authoritative Cases, Frog/Lake purchases, Job, Bank, Piggy and Plinko are live. Crash, vehicles, selling and transfers remain locked for later migration.' : 'Server-authoritative Cases, Frog/Lake purchases, and Job rewards are live. v114 Bank, Piggy and Plinko remain disabled until the Phase 4 backend is deployed.', phase4 ? 'success' : 'warning');
      economyMigrateButton?.classList.add('hidden');
      await refreshOwnerConsoleAccess({ migrated: true });
      return snapshot;
    }
    renderServerEconomySnapshot(null);
    setEconomyBadge('READY TO MIGRATE', 'warning');
    setEconomyStatus('Backend is online. Create the one-time authoritative snapshot from your current Froggy Cloud Save when ready.', 'warning');
    economyMigrateButton?.classList.remove('hidden');
    await refreshOwnerConsoleAccess({ migrated: false });
    return null;
  } catch (error) {
    console.warn('Server Economy check failed', error);
    renderServerEconomySnapshot(null);
    setEconomyBadge('BACKEND OFFLINE', 'error');
    setEconomyStatus(economyErrorMessage(error), 'error');
    economyMigrateButton?.classList.add('hidden');
    await refreshOwnerConsoleAccess({ migrated: false });
    return null;
  }
}

async function migrateServerEconomy() {
  if (!auth?.currentUser || serverEconomyBusy) return;
  if (!confirm('Create the authoritative economy snapshot from your CURRENT CLOUD SAVE? This is a one-time migration. Cases, Frog/Lake purchases and Job rewards will be server-authoritative; transfers and trading remain locked.')) return;
  serverEconomyBusy = true;
  if (economyMigrateButton) economyMigrateButton.disabled = true;
  if (economyCheckButton) economyCheckButton.disabled = true;
  setEconomyBadge('MIGRATING', 'info');
  setEconomyStatus('Copying the current cloud wallet/progress into the protected server economy…', 'loading');
  try {
    const result = await callable('bootstrapEconomyFromCloud')({});
    const snapshot = result?.data?.economy || null;
    renderServerEconomySnapshot(snapshot);
    economyMigrateButton?.classList.add('hidden');
    const phase4 = Number(snapshot?.economyPhase) >= 4;
    setEconomyBadge(phase4 ? 'PHASE 4 LIVE' : 'PHASE 3 LIVE', phase4 ? 'success' : 'warning');
    setEconomyStatus(phase4 ? 'Server Economy is ready for v114 Phase 4. Bank, Piggy and Plinko may use authoritative state; transfers remain locked.' : 'Base Server Economy migration completed, but v114 Bank, Piggy and Plinko stay disabled until the backend upgrades this account to Phase 4.', phase4 ? 'success' : 'warning');
    await refreshOwnerConsoleAccess({ migrated: true });
  } catch (error) {
    console.error('Server Economy migration failed', error);
    setEconomyBadge('MIGRATION BLOCKED', 'error');
    setEconomyStatus(economyErrorMessage(error), 'error');
  } finally {
    serverEconomyBusy = false;
    if (economyMigrateButton) economyMigrateButton.disabled = false;
    if (economyCheckButton) economyCheckButton.disabled = false;
  }
}

function stopServerEconomy() {
  if (serverEconomyUnsub) { try { serverEconomyUnsub(); } catch {} serverEconomyUnsub = null; }
  serverEconomySnapshot = null;
  economyPanel?.classList.add('hidden');
  economyMigrateButton?.classList.add('hidden');
  ownerConsoleButton?.classList.add('hidden');
  document.documentElement.dataset.serverOwner = 'false';
  renderServerEconomySnapshot(null);
  setEconomyBadge('SIGNED OUT', 'info');
  setEconomyStatus('Sign in to check Server Economy Phase 3.', 'info');
}

async function startServerEconomy() {
  economyPanel?.classList.remove('hidden');
  await checkServerEconomy({quiet: false});
}

function installServerEconomyBridge() {
  window.FroggyServerEconomy = Object.freeze({
    backendVersion: SERVER_ECONOMY_VERSION,
    getCachedSnapshot: () => serverEconomySnapshot ? JSON.parse(JSON.stringify(serverEconomySnapshot)) : null,
    getSnapshot: async () => fetchServerEconomySnapshot(),
    check: async () => checkServerEconomy({quiet: true}),
    bootstrap: async () => callable('bootstrapEconomyFromCloud')({}).then(result => result.data),
    // Hot gameplay calls return their committed result directly. The game applies it once,
    // while the Firestore listener updates the Profile panel. This avoids duplicate full UI renders.
    buyCases: async (caseId, quantity = 1, requestId = serverEconomyRequestId('buy')) => callable('buyCasesAuthoritative')({caseId, quantity, requestId}).then(result => result.data),
    openCases: async (caseId, quantity = 1, requestId = serverEconomyRequestId('open')) => callable('openCasesAuthoritative')({caseId, quantity, requestId}).then(result => result.data),
    buyCollection: async (kind, itemId, requestId = serverEconomyRequestId('shop')) => callable('buyCollectionAuthoritative')({kind, itemId, requestId}).then(result => result.data),
    startJob: async (sessionId, frogId) => callable('startJobShiftAuthoritative')({sessionId, frogId}).then(result => result.data),
    jobAction: async (sessionId, action, requestId = serverEconomyRequestId('job')) => callable('jobActionAuthoritative')({sessionId, action, requestId}).then(result => result.data),
    endJob: async (sessionId, reason, requestId = serverEconomyRequestId('jobend')) => callable('endJobShiftAuthoritative')({sessionId, reason, requestId}).then(result => result.data),
    piggyTransfer: async (mode, amount, requestId = serverEconomyRequestId('piggy')) => callable('piggyTransferAuthoritative')({mode, amount, requestId}).then(result => absorbServerEconomyResult(result.data)),
    takeBankLoan: async (amount, collateral, requestId = serverEconomyRequestId('loan')) => callable('bankTakeLoanAuthoritative')({amount, collateral, requestId}).then(result => absorbServerEconomyResult(result.data)),
    repayBankLoan: async (mode, requestId = serverEconomyRequestId('repay')) => callable('bankRepayLoanAuthoritative')({mode, requestId}).then(result => absorbServerEconomyResult(result.data)),
    dropPlinko: async (bet, risk, requestId = serverEconomyRequestId('plinko')) => callable('dropPlinkoAuthoritative')({bet, risk, requestId}).then(result => absorbServerEconomyResult(result.data)),
    adminStatus: async () => callable('adminStatus')({}).then(result => result.data),
    adminOperate: async (action, operation, requestId = serverEconomyRequestId('admin')) => callable('adminEconomyOperation')({action, operation, requestId}).then(result => absorbServerEconomyResult(result.data)),
    requestId: serverEconomyRequestId
  });
  window.dispatchEvent(new CustomEvent('froggy-server-economy-bridge-ready'));
}

function handleLocalSaveEvent() {
  if (!cloudInitialized || !cloudUid || cloudBusy) return;
  const signature = saveSignature(readLocalGameSave());
  if (signature === cloudLastObservedSignature) return;
  cloudLastObservedSignature = signature;
  evaluateCloudState({ schedule: true });
}

try {
  const firebaseApp = initializeApp(firebaseConfig);
  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);
  functionsApi = getFunctions(firebaseApp, 'us-central1');
  installServerEconomyBridge();
  await setPersistence(auth, browserLocalPersistence);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  onAuthStateChanged(auth, async (user) => {
    renderUser(user);
    document.documentElement.dataset.froggyAccount = user ? 'signed-in' : 'signed-out';
    if (user) {
      await loadPublicProfile(user);
      await startCloudSave(user);
      await startServerEconomy(user);
    } else {
      stopCloudSave();
      stopServerEconomy();
    }
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

  cloudUploadButton?.addEventListener('click', () => { void uploadLocalToCloud({ force: false }); });
  cloudLoadButton?.addEventListener('click', () => { void loadCloudOntoDevice(); });
  cloudKeepLocalButton?.addEventListener('click', () => { void keepThisDevice(); });
  cloudSyncButton?.addEventListener('click', () => { void uploadLocalToCloud({ force: false }); });
  economyCheckButton?.addEventListener('click', () => { void checkServerEconomy({ quiet: false }); });
  economyMigrateButton?.addEventListener('click', () => { void migrateServerEconomy(); });
  ownerConsoleButton?.addEventListener('click', async () => {
    if (ownerConsoleButton.disabled) return;
    ownerConsoleButton.disabled = true;
    try {
      const allowed = await refreshOwnerConsoleAccess({ migrated: Boolean(serverEconomySnapshot) });
      if (!allowed) {
        setEconomyStatus('This account is not enabled as the protected Server Owner.', 'error');
        return;
      }
      const opener = window.FroggyGame?.openProtectedOwnerConsole;
      if (typeof opener !== 'function') {
        setEconomyStatus('Owner Console UI is not ready. Refresh Froggy Leap once and try again.', 'error');
        return;
      }
      const opened = await opener({serverVerified: true});
      if (!opened) setEconomyStatus('Owner role is valid, but the Owner Console frontend could not open. v113 includes the Owner runtime fix.', 'error');
    } finally {
      ownerConsoleButton.disabled = false;
    }
  });
  window.addEventListener('froggy:save', handleLocalSaveEvent);

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
      stopCloudSave();
      stopServerEconomy();
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
  cloudPanel?.classList.add('hidden');
  economyPanel?.classList.add('hidden');
  if (signInButton) signInButton.disabled = true;
  setStatus('Froggy Accounts could not load. The game itself still works normally.', 'error');
}
