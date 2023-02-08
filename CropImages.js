import * as ImageManipulator from 'expo-image-manipulator';

async function CropImages(uri,json) {
    return new Promise(async (resolve, reject) => {
        try{
            let result = []
            var index = 0 
            await json.responses[0].logoAnnotations.forEach(async (logoAnnotation)=>{
                boundingPoly = logoAnnotation.boundingPoly
                x = boundingPoly.vertices[0].x
                y = boundingPoly.vertices[0].y
                width = boundingPoly.vertices[2].y - boundingPoly.vertices[0].y
                height = boundingPoly.vertices[2].x - boundingPoly.vertices[0].x
                const res = await Crop(uri,x,y,width,height);
                const description = logoAnnotation.description
                result.push({"uri":res.uri,"description":description});
                if((json.responses[0].logoAnnotations.length-1)===index){
                    resolve(result)
                }
                index = index + 1
            })
        } catch (e) {
            reject([])
        }
    });
}

Crop = async (uri,x,y,width,height) => {
    const { saveOptions } = {
        compress: 1,
        format: 'png',
        base64: true
    }
    const manipResult = await ImageManipulator.manipulateAsync(uri, [{
        crop : {
            height: height, 
            originX: x, 
            originY: y, 
            width: width
          }
    }, {
        resize: {
            width: 50,
            height: 50,
        },
    }], saveOptions)
    return manipResult
}



export default CropImages;