const path = require('path')

const uploadPhoto = (model) => async (req, res, next) => {
    if (!req.files)
        return next(new ErrorResponse(`Please upload a file`, 400))

    const file = req.files.file

    // make sure image is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400))
    }
    // make sure image is  not lager than 1MB
    if (!file.filesize > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please an image file less than ${process.env.MAX_FILE_UPLOAD}`, 400))
    }

    // Create custom filename 
    file.name = `photo_${req.params.id}${path.parse(file.name).ext}`

    // Move file to path
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.log(err)
            return next(new ErrorResponse(`Error uploading file`, 500))
        }
        await model.findByIdAndUpdate(req.params.id, { photo: file.name })
        res.status(200).json({ success: true, data: file.name })

    })
}

module.exports = uploadPhoto