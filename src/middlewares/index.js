const { UserModel } = require('../app/models')
const admin = require('../firebase')

class Middleware {
    async decodeToken(req, res, next) {
        // console.log(req.headers)
        try {
            const dataAuthorization = req.headers.authorization.split(' ')
            const token = dataAuthorization[1]

            const decodeValue = await admin.auth().verifyIdToken(token)
            if (decodeValue) {
                // console.log(decodeValue)
                const id = decodeValue.firebase.identities['google.com']
                while (id[0].length < 24) {
                    id[0] += '1'
                }
                req.user = decodeValue
                return next()
            }

            return res.status(401).json({ message: 'Un authorize' })
        } catch (error) {
            console.log(error)
            return res.status(400).json({ message: 'Internal Error' })
        }
    }

    async findUser(req, res, next) {
        const dataUser = req.user
        let id = dataUser.firebase.identities['google.com'][0]

        try {
            let user = await UserModel.findById(id).exec()
            if (!user) {
                user = new UserModel({
                    ...dataUser,
                    _id: id,
                })
                await user.save()
            }
            req.user = { ...dataUser, ...user }
            return next()
        } catch (e) {
            console.log(e)
            return res.status(404).json({ message: 'Occurred an error' })
        }
    }

    async decodeTokenSocket(socket, next) {
        const req = socket.handshake
        const accessToken = req.auth.token || req.auth.access_token || req.auth.accessToken
        // console.log(accessToken)
        try {
            const decodeValue = await admin.auth().verifyIdToken(accessToken)
            if (decodeValue) {
                // console.log(decodeValue)
                let id = decodeValue.firebase.identities['google.com'][0]
                while (id.length < 24) {
                    id = id + '1'
                }
                socket.handshake.idPlayer = id
                const user = await UserModel.findById(id).lean()
                socket.handshake.namePlayer = user.name
                next()
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new Middleware()
