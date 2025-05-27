import React, { useState } from 'react';
import axios from 'axios';
import mainlogo from '../assets/revised-title.png';
import cocologo from '../assets/coco-logo.png';
import fb from '../assets/fb-icon.png';
import email from '../assets/ig-icon.png';
import ig from '../assets/email-icon.png';
import uploadIcon from '../assets/upload-icon.png';
import { useNavigate } from 'react-router-dom';
import { ref, set } from 'firebase/database';
import { database, firestore } from '../../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';


const CLOUD_NAME = 'dalamwqck';
const UPLOAD_PRESET = 'cocophotos';
const FOLDER_NAME = 'Home';

const UploadPage = () => {
    const [image, setImage] = useState(null);
    const [Loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Upload to Cloudinary and then save URL to Firebase
    const handleUpload = async () => {
        if (!image) {
            alert('Please select an image to upload.');
            return;
        };
        setLoading(true);

        // Compress image to be 5MB or under
        const compressImage = async (file, maxSizeMB = 5) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new window.Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);

                        let quality = 0.92;
                        let dataUrl = canvas.toDataURL('image/jpeg', quality);

                        while (
                            dataUrl.length / 1024 / 1024 > maxSizeMB &&
                            quality > 0.1
                        ) {
                            quality -= 0.05;
                            dataUrl = canvas.toDataURL('image/jpeg', quality);
                        }

                        fetch(dataUrl)
                            .then((res) => res.blob())
                            .then((blob) => {
                                const compressedFile = new File([blob], file.name, {
                                    type: 'image/jpeg',
                                });
                                resolve(compressedFile);
                            });
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            });
        };

        try {
            const compressedImage = await compressImage(image);
            const formData = new FormData();
            formData.append('file', compressedImage);
            formData.append('upload_preset', UPLOAD_PRESET);
            formData.append('folder', FOLDER_NAME);

            // Upload to Cloudinary
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                formData
            );
            const url = res.data.secure_url;
            const collectionRef = collection(firestore, 'photos');
            const payload = {
                url: url,
                approved: false, // Initially set to false for admin approval
                timestamp: new Date().toISOString(),
            };
            const docRef = await addDoc(collectionRef, payload);
            setImage(null);
            alert('Image uploaded and sent for approval!');
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bg-[#f7f7f7] flex flex-col p-5 justify-start items-center w-dvw h-dvh overflow-y-auto overflow-x-hidden'>
            {
                Loading ? (
                    <div className="flex justify-center items-center w-full h-full">
                        <p className="text-xl font-bold">Uploading Photos...</p>
                    </div >
                ) : (
                    <div className='w-full flex justify-center md:justify-start'>
                        <img className='h-8 md:h-15' src={cocologo} />
                    </div>
                )}
            {
                !Loading && (
                    <div className='w-[40%] 2xl:w-2/5 min-w-[400px] h-full p-5 flex flex-col items-center justify-start max-h-full gap-4 px-10 max-w-dvw pb-10'>
                        <img className='max-w-[90%] w-full' src={mainlogo} />
                        <div className='w-[90%] flex flex-col-reverse lg:flex-row pb-7 lg:pb-5 border-2 border-gray-400 mt-5 p-5 rounded-xl items-center justify-center gap-6 lg:gap-10'>
                            <label htmlFor='fileInput' className='p-8 border-2 border-gray-400 rounded-xl'>
                                <img src={uploadIcon} alt="Upload Preview" className='w-12 h-12 object-contain object-center mb-2 rounded-full cursor-pointer' />
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                                className='hidden'
                                id="fileInput"
                            />
                            <div>
                                <p className='text-lg font-semibold w-full text-center lg:text-start'>Upload your photo</p>
                                <p className='text-sm text-gray-500 w-full text-center lg:text-start'>Select files from your local storage</p>
                                {image ? (
                                    <p className='text-sm text-gray-500 w-full text-center lg:text-start mt-2'>Selected: {image.name}</p>
                                ) : (
                                    <p className='text-sm text-gray-500 w-full text-center lg:text-start mt-2'>No file selected</p>
                                )}
                            </div>
                        </div>
                        <button onClick={handleUpload} className='border-1 border-black p-1 px-6 rounded-4xl font-semibold duration-300 transition-all ease-in-out bg-black text-white  hover:bg-white hover:text-black mb-2 mt-4'>
                            Upload Photo
                        </button>
                        <button onClick={() => { navigate('/display') }} className='border-1 border-black p-1 px-6 rounded-4xl font-semibold duration-300 transition-all ease-in-out  hover:bg-black hover:text-white mb-2 mt-0'>
                            View Photo Gallery
                        </button>
                        <div className='flex-grow'></div>
                        <div className='w-full flex justify-center items-center gap-3 self-end '>
                            <img className='h-6 w-6' src={fb} onClick={() => { window.open('https://www.facebook.com/profile.php?id=61562872356464', '_blank') }} />
                            <img className='h-6 w-6' src={email} onClick={() => { window.open('https://www.instagram.com/numoa_coco?igsh=dnRwcjhoenZwcTM5', '_blank') }} />
                            <img onClick={() => { window.open('mailto:numoacoco@gmail.com', '_blank') }} className='h-6 w-6' src={ig} />
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default UploadPage;
