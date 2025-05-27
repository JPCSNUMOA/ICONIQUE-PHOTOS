import React, { useState, useEffect } from 'react';
import axios from 'axios';
import mainlogo from '../assets/revised-title.png';
import cocologo from '../assets/coco-logo.png';
import fb from '../assets/fb-icon.png';
import email from '../assets/ig-icon.png';
import ig from '../assets/email-icon.png';
import uploadIcon from '../assets/upload-icon.png';
import { useNavigate } from 'react-router-dom';
const CLOUD_NAME = 'dalamwqck'; // replace with your cloud name
const UPLOAD_PRESET = 'cocophotos'; // replace with your unsigned upload preset
const FOLDER_NAME = 'Home'; // optional folder
import { firestore } from '../../firebaseConfig';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';


const DisplayPage = () => {

    const [images, setImages] = useState([]);
    const [Loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch approved images from Firestore

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            const q = query(collection(firestore, 'photos'), where('approved', '==', true));
            const snapshot = await getDocs(q);
            const imgs = snapshot.docs.map(doc => ({
                id: doc.id,
                url: doc.data().url
            }));
            setImages(imgs);
            setLoading(false);
        };
        fetchImages();
    }, []);

    return (
        <>
            <div className='bg-[#f7f7f7] flex flex-col p-5 justify-start items-center w-dvw h-dvh overflow-y-auto overflow-x-hidden'>
                {
                    Loading ? (
                        <div className="flex justify-center items-center w-full h-full">
                            <p className="text-xl font-bold">Loading Photos...</p>
                        </div >
                    ) : (
                        <div className='w-full flex flex-col lg:flex-row justify-center items-center md:justify-between'>
                            <img className='h-8 md:h-15 ' src={cocologo} /> <img className='h-15 md:h-15 w-auto' src={mainlogo} />
                        </div>
                    )}
                {
                    !Loading && (
                        <div className='w-full min-w-[400px] h-full p-5 flex flex-col items-center justify-start max-h-full gap-4 px-10 max-w-dvw pb-10'>
                            <div className='w-full flex justify-center items-center gap-4 flex-col flex-grow'>
                                {images.length === 0 ? (
                                    <p>NO IMAGES YET</p>
                                ) : (
                                    <div className='flex flex-wrap justify-center items-start gap-4 flex-grow overflow-y-auto overflow-x-hidden w-full max-h-[80vh] border-2 border-gray-300 p-4 rounded-lg shadow-lg'>
                                        {images.map((img, idx) => (

                                            <img
                                                key={idx}
                                                src={img.url}
                                                alt={img.caption || `Image ${idx + 1}`}
                                                className='w-[200px] h-[200px] max-h-60 object-cover rounded-lg border-2 border-gray-300 shadow-md cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105'
                                            />


                                        ))}
                                    </div>
                                )}
                            </div>



                            <button onClick={() => { navigate('/') }} className='border-1 border-black p-1 px-6 rounded-4xl font-semibold duration-300 transition-all ease-in-out  hover:bg-black hover:text-white mb-2 mt-0'>
                                Upload your own photo
                            </button>
                            <div className='w-full flex justify-center items-center gap-3 self-end '>
                                <img className='h-6 w-6' src={fb} onClick={() => { window.open('https://www.facebook.com/profile.php?id=61562872356464', '_blank') }} />
                                <img className='h-6 w-6' src={email} onClick={() => { window.open('https://www.instagram.com/numoa_coco?igsh=dnRwcjhoenZwcTM5', '_blank') }} />
                                <img onClick={() => { window.open('mailto:numoacoco@gmail.com', '_blank') }} className='h-6 w-6' src={ig} />
                            </div>
                        </div>
                    )
                }
            </div >

        </>

    )
}

export default DisplayPage