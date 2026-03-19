<template>
  <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
    <input 
      type="file" 
      @change="handleFileUpload" 
      class="hidden" 
      :id="props.inputId"
      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
    >
    <label :for="props.inputId" class="cursor-pointer">
      <p class="text-gray-500">Choose file or drag it here</p>
      <span class="block mt-2 px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200">
        Select File
      </span>
    </label>
    <p v-if="fileName" class="text-sm mt-2 text-gray-600 font-medium">📄 {{ fileName }}</p>
    <p v-if="uploading" class="text-sm mt-2 text-blue-600">Uploading...</p>
    <p v-if="errorMessage" class="text-sm mt-2 text-red-600">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

/* eslint-disable no-undef */

const props = defineProps({
  inputId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['file-uploaded'])
const fileName = ref('')
const uploading = ref(false)
const errorMessage = ref('')

const uploadToCloudinary = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'bookello_pics')
  
  try {
    const response = await fetch('https://api.cloudinary.com/v1_1/dpfkxvnln/image/upload', {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload file to Cloudinary')
  }
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  fileName.value = file.name
  uploading.value = true
  errorMessage.value = ''

  if (file.size > 10 * 1024 * 1024) {
    errorMessage.value = 'File size must be less than 10MB'
    uploading.value = false
    return
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  if (!allowedTypes.includes(file.type)) {
    errorMessage.value = 'Please upload a valid file (PDF, JPG, PNG, DOC, DOCX)'
    uploading.value = false
    return
  }

  try {
    const fileUrl = await uploadToCloudinary(file)
    emit('file-uploaded', fileUrl)
  } catch (error) {
    console.error('Upload error:', error)
    errorMessage.value = 'Failed to upload file. Please try again.'
  } finally {
    uploading.value = false
  }
}
</script>