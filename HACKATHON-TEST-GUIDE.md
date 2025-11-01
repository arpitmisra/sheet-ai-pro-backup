# Quick Test Guide for Hackathon Demo

## What You Fixed
✅ WebSocket server stores sheet data in memory  
✅ Host syncs data to server on connect  
✅ Client loads data from server (not localStorage)  
✅ Real-time updates work bidirectionally  
✅ Online users presence tracking  
✅ Real-time chat  

## Test Steps (5 minutes)

### 1. Restart Server
```bash
# Kill any running servers
# Then start fresh:
npm run dev
```

### 2. Host Browser (Chrome)
1. Open `http://localhost:3000`
2. Login with account 1
3. Create NEW sheet (important: create NEW one!)
4. Type some data:
   - A1: "Hello"
   - A2: "World"
   - B1: "=A1&A2"
5. Click Share → Copy Link
6. Keep this tab open!

### 3. Client Browser (Edge or Incognito)
1. Open the copied link
2. Login with account 2 (DIFFERENT account)
3. You should see:
   - ✅ The data host entered (Hello, World, etc.)
   - ✅ Both users in "Online Users"
   - ✅ Sheet loads without errors

### 4. Test Real-Time Sync
**In Client Browser:**
- Type in cell C1: "Client was here"

**In Host Browser:**
- You should see "Client was here" appear instantly!
- Type in cell C2: "Host says hi"

**In Client Browser:**
- You should see "Host says hi" appear!

### 5. Test Chat
**In Host Browser:**
- Click "Chat" button
- Type message: "Can you see this?"

**In Client Browser:**
- Open chat
- You should see host's message
- Reply: "Yes I can!"

**Both should see all messages!**

## Expected Errors (Safe to Ignore)

### ❌ This Error is SAFE:
```
WebSocket connection to 'ws://localhost:3000/_next/webpack-hmr' failed
```
**Why:** Next.js tries to connect HMR, but we're using custom server. Harmless!

### ❌ This Error is SAFE (only if using OLD sheet):
```
Supabase error: Cannot coerce the result to a single JSON object
```
**Why:** Old Supabase sheets from before the migration. Create NEW sheet instead!

## What to Demo at Hackathon

### 1. Introduction (30 seconds)
"We built a real-time collaborative spreadsheet like Google Sheets, where multiple people can edit the same sheet simultaneously."

### 2. Show Create & Share (30 seconds)
- Create a sheet
- Add some formulas
- Click Share
- Copy link

### 3. Show Collaboration (1 minute)
- Open link on phone or another computer
- Show both screens
- Type in one → appears in other instantly
- Show online users presence
- Show chat

### 4. Technical Highlights (30 seconds)
"We use WebSockets for real-time sync, with server-side state management to enable cross-device collaboration."

## Troubleshooting During Demo

### Problem: Client sees "Loading..." forever
**Fix:** 
1. Host must open sheet FIRST
2. Wait for "Online Users" to show host
3. Then share link

### Problem: Changes not syncing
**Fix:**
1. Check both browsers show online users
2. Refresh both pages
3. Host reconnects first, then client

### Problem: Chat not working
**Fix:**
1. Ensure both users connected (check online users)
2. Try sending message from other user first

## Demo Script

**You:** "Let me show you real-time collaboration..."

**[Action]** Create sheet, add data, share link

**You:** "Now my friend opens this link on their device..."

**[Action]** Open link on second device/browser

**You:** "And boom! They see the same data instantly. Watch this..."

**[Action]** Type in one browser, show it appearing in other

**You:** "Multiple people can edit simultaneously, chat, see who's online... just like Google Sheets!"

**[Action]** Show online users, send chat message

**You:** "All built with Next.js and WebSockets!"

## What Makes This Cool

1. **No Database Required** - Works with WebSockets only
2. **Real-Time** - Changes sync instantly
3. **Cross-Device** - Works on any device with browser
4. **Presence** - See who's online
5. **Chat** - Communicate while collaborating
6. **Formulas** - Supports Excel-like formulas

## Key Features to Mention

- ✨ Real-time collaborative editing
- ✨ Formula engine (=SUM, =A1+B1, etc.)
- ✨ Online presence tracking
- ✨ Built-in chat
- ✨ Shareable links
- ✨ Works across devices
- ✨ No signup required for viewers

Good luck with your hackathon! 🚀
