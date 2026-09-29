const jwt=require('jsonwebtoken')
const {AdminRepository}=require('../repositories/admin.repository')
const {userRepository}=require('../repositories/user.repository')
const {librarianRepository}=require('../repositories/librarian.repository')

async function refreshAccessToken(req, res) {
    try {
        const { refreshToken } = req.body
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh Token Required' })
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET)

        let account
        if (decoded.role === 'admin') {
            account = await AdminRepository.findOneBy({ id: decoded.userId })
        } else if (decoded.role === 'librarian') {
            account = await librarianRepository.findOneBy({ id: decoded.userId })
        } else if (decoded.role === 'user') {
            account = await userRepository.findOneBy({ id: decoded.userId })
        }

        if (!account) {
            return res.status(404).json({ message: 'User Not Found' })
        }

        const newAccessToken = jwt.sign(
            { userID: account.id, role: decoded.role },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        )
        return res.status(200).json({ accessToken: newAccessToken })

    } catch (err) {
        console.log(err)
        return res.status(401).json({ message: 'Invalid or expired refresh token' })
    }
}

module.exports={refreshAccessToken}