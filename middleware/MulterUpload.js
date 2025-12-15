const multer = require('multer')
const fs = require('fs')
const path = require('path')

const MulterUpload = () => {
    return multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                //destination evu define kare ke frontend mathi je data save thava mate ave che ene backend ma assets name na folder ni andar save karvu . jo assets name nu folder pele thi hase to eni andar save thai jase ane jo nai hoi to automatic create thai jase
                const folderpath = path.resolve('assets')
                fs.mkdirSync(folderpath, { recursive: true })

                cb(null, folderpath) // cb means call back ema first parameter always null nakhi devanu . tenathi   
            },
            filename: (req, file, cb) => {
                //ex : koi image nu name abc.png che ane bijo user again e j name thi image upload kare to conflig no mare atle ene niche ni jem save karavani
                cb(null, new Date().getTime() + '-' + file.originalname)
            }
        }),
        fileFilter: (req, file, cb) => {
            const allowtype = ['image/png', 'image/jpg', 'image/jpeg', 'audio/mp3', 'video/mp4', 'application/pdf', 'img/svg+xml', 'image/webp']
            if (allowtype.includes(file.mimetype)) {
                cb(null, true)
            } else {
                cb(new Error("Type not valid!"), false)
            }
        },
        // limits: {
        //     fileSize: 5 * 1024 * 1024
        // }
    })
}

module.exports = MulterUpload
