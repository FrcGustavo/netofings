import jwt from 'jsonwebtoken'

export const sign = (payload: string | object | Buffer, secret: jwt.Secret, callback: jwt.SignOptions | undefined) => {
  jwt.sign(payload, secret, callback)
}

export const verify = (token: string, secret: jwt.Secret, callback: jwt.VerifyOptions & { complete: true }) => {
  jwt.verify(token, secret, callback)
}
