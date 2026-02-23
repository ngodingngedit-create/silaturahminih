// Spotify Client Credentials flow
// Token is fetched server-to-server style using VITE_ env vars.
// Note: for a public read-only festival site, exposing Client ID+Secret in env is acceptable.

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET

let _token = null
let _tokenExpiry = 0

export async function getSpotifyToken() {
    if (_token && Date.now() < _tokenExpiry) return _token

    if (!CLIENT_ID || !CLIENT_SECRET) {
        throw new Error('Spotify env vars not set. Add VITE_SPOTIFY_CLIENT_ID and VITE_SPOTIFY_CLIENT_SECRET to .env')
    }

    const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
        },
        body: 'grant_type=client_credentials',
    })

    if (!res.ok) throw new Error('Failed to fetch Spotify token')

    const data = await res.json()
    _token = data.access_token
    _tokenExpiry = Date.now() + (data.expires_in - 60) * 1000 // refresh 1 min early
    return _token
}

export async function getPlaylist(playlistId) {
    const token = await getSpotifyToken()
    const res = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}?fields=id,name,description,images,tracks.total,external_urls`,
        { headers: { Authorization: `Bearer ${token}` } }
    )
    if (!res.ok) throw new Error(`Failed to fetch playlist ${playlistId}`)
    return res.json()
}
