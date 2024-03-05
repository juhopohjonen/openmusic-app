import dotenv from 'dotenv'

interface values {
    port: number,
    environment: 'prod' | 'dev',
    MONGODB_URI: string,
    expiresIn: string,
    JWT_SECRET: string,
    UPLOADS_PATH: string,
    HCAPTCHA_SECRET: string
}



const getValues = (): values => {
    if (process.env.environment === 'dev') {
        dotenv.config()
    }


    const port = 
        process.env.PORT 
            ? Number(process.env.PORT) 
            : 5000


    const environment = 
        process.env.environment === 'prod' || process.env.environment === 'dev'
            ? process.env.environment
            : 'prod'
    
    if (typeof process.env.MONGODB_URI !== 'string') {
        throw new Error('No mongodb uri set.')
    }

    const MONGODB_URI = process.env.MONGODB_URI
    const expiresIn = process.env.EXPIRES_IN || '2 days'

    if (typeof process.env.JWT_SECRET !== 'string' || typeof process.env.HCAPTCHA_SECRET !== 'string') {
        throw new Error('No jwt or HCAPTCHA secret set.')
    }

    const JWT_SECRET = process.env.JWT_SECRET
    const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET

    if (typeof process.env.UPLOADS_PATH !== 'string') {
        throw new Error('No upload path set.')
    }

    const UPLOADS_PATH = process.env.UPLOADS_PATH
    
    return {
        port,
        environment,
        MONGODB_URI,
        expiresIn,
        JWT_SECRET,
        UPLOADS_PATH,
        HCAPTCHA_SECRET
    }

    
}

export default getValues