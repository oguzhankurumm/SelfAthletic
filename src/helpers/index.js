import ImagePicker from 'react-native-image-crop-picker';
import { firestore, storage } from '../config/config';

async function changeProfilePicture(email) {
    try {
        const picker = await ImagePicker.openPicker({
            cropperCircleOverlay: true,
            freeStyleCropEnabled: true,
            avoidEmptySpaceAroundImage: true,
            cropperToolbarTitle: "Fotoğraf Seçin",
            loadingLabelText: "Yükleniyor...",
            cropperChooseText: "Seç",
            cropperCancelText: "Vazgeç",
            mediaType: "photo",
            cropping: true,
            includeBase64: true,
            width: 500,
            height: 500,
            compressImageQuality: 0.5,
            compressImageMaxHeight: 500,
            compressImageMaxWidth: 500
        })

        const uploadUri = picker.path;
        const storagePath = `${'avatar'}/${email}/profile_picture.jpg`;
        const fileMetaData = { contentType: 'image/jpeg' };
        const task = await storage().ref().child(storagePath).putFile(uploadUri, fileMetaData)
        const imageRef = await storage().ref();
        const getDownloadUrl = await imageRef.child(task.metadata.fullPath).getDownloadURL()
        await firestore().collection('users').doc(email).update({
            profile_picture: getDownloadUrl
        })
        await task;
        return true;
    } catch (error) {
        return false;
    }
}


export { changeProfilePicture }