import React from 'react'
import { View, Text } from 'react-native'
import ImageLayout from '../image-layout'
import FormikPostUploader from './FormikPostUploader'

const AddNewPost = () => {
    return (
        <ImageLayout showBack title="Gönderi Paylaş">
           <FormikPostUploader />
        </ImageLayout>
    )
}

export default AddNewPost
