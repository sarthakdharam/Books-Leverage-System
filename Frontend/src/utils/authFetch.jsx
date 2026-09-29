async function authFetch(url, options = {}) {
    const token = localStorage.getItem('accessToken')

    let response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
            ...options.headers
        }
    })

    if (response.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken')

        const refreshResponse = await fetch('http://localhost:3000/api/refresh-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        })

        if (refreshResponse.ok) {
            const data = await refreshResponse.json()
            localStorage.setItem('accessToken', data.accessToken)

            response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${data.accessToken}`,
                    ...options.headers
                }
            })
        } else {
            localStorage.clear()
            window.location.href = '/login'
        }
    }

    return response
}

export default authFetch