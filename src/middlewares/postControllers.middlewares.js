export const middleware_CreatePost = async (req, resp, next) => {
    const size = parseInt(req.headers['content-length'])
    console.log(size);
    if (size > 3000000) {
        return resp.status(413).json({ message: 'El contenido supera las 3Mb' })
    }
    const data = req.files
    let media = data?.media
    if (media) {
        if (!Array.isArray(media)) {
            media = [media]
        }
        for (let file of media) {
            if (!['image/png', 'image/jpg', 'image/jpeg', 'video/mp4'].includes(file.mimetype)) {
                return resp.status(415).json({ message: 'El formato de algunos archivos es incorrecto' })
            }
        }
    }
    req.media = media
    next()
}