let baseUrl = ''

if(process.env.NODE_ENV === 'development'){
    baseUrl = 'http://127.0.0.1:8000'
} else {
    baseUrl = 'https://live.auto-zuerisee.ch'
}

export default baseUrl
