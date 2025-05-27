import React, { useState, useEffect } from 'react';
import mainlogo from '../assets/revised-title.png';
import cocologo from '../assets/coco-logo.png';
import fb from '../assets/fb-icon.png';
import email from '../assets/ig-icon.png';
import ig from '../assets/email-icon.png';
import uploadIcon from '../assets/upload-icon.png';
import { firestore } from '../../firebaseConfig';
import { collection, getDocs, updateDoc, doc, query, where, deleteDoc } from 'firebase/firestore';
import { set } from 'firebase/database';

const AdminPage = () => {
    const [images, setImages] = useState([]);
    const [approved, setapproved] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [ActionLoading, setActionLoading] = useState();

    // Confirmation modal state
    const [confirm, setConfirm] = useState({
        open: false,
        action: null,
        img: null,
        message: ''
    });

    const fetchImages = async () => {
        setLoading(true);
        const q = query(collection(firestore, 'photos'), where('approved', '==', false));
        const snapshot = await getDocs(q);
        const imgs = snapshot.docs.map(doc => ({
            id: doc.id,
            url: doc.data().url
        }));
        setImages(imgs);
        setLoading(false);
    };

    const fetchApproved = async () => {
        setLoading(true);
        const q = query(collection(firestore, 'photos'), where('approved', '==', true));
        const snapshot = await getDocs(q);
        const imgs = snapshot.docs.map(doc => ({
            id: doc.id,
            url: doc.data().url
        }));
        setapproved(imgs);
        setLoading(false);
    };

    useEffect(() => {
        fetchImages();
        fetchApproved();
    }, []);

    // Action handlers with confirmation
    const handleApprove = async (img) => {
        setConfirm({
            open: true,
            action: 'approve',
            img,
            message: 'Are you sure you want to approve this image?'
        });
    };

    const handleDisapprove = async (img) => {
        setConfirm({
            open: true,
            action: 'disapprove',
            img,
            message: 'Are you sure you want to disapprove (delete) this image?'
        });
    };

    const handleDelete = async (img) => {
        setConfirm({
            open: true,
            action: 'delete',
            img,
            message: 'Are you sure you want to delete this approved image?'
        });
    };

    // Executes the confirmed action
    const executeAction = async () => {
        setActionLoading(true);
        const { action, img } = confirm;
        if (action === 'approve') {
            await updateDoc(doc(firestore, 'photos', img.id), { approved: true });
            setActionLoading(false);
        } else if (action === 'disapprove' || action === 'delete') {
            await deleteDoc(doc(firestore, 'photos', img.id));
            setActionLoading(false);
        }
        setConfirm({ open: false, action: null, img: null, message: '' });
        fetchApproved();
        fetchImages();
    };

    // Cancels the confirmation modal
    const cancelAction = () => {
        setConfirm({ open: false, action: null, img: null, message: '' });
    };

    return (
        <>

            {confirm.open && (
                <div className="fixed inset-0 bg-black/40  flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg backdrop-opacity-40 shadow-lg p-6 w-80 flex flex-col items-center">
                        <p className="mb-4 text-center">{confirm.message}</p>
                        <div className="flex gap-4">
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60"
                                onClick={executeAction}
                                disabled={ActionLoading}
                            >
                                {ActionLoading ? 'Processing...' : 'Yes'}
                            </button>
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                onClick={cancelAction}
                                disabled={ActionLoading}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[#f7f7f7] flex flex-col p-5 justify-start items-center w-screen h-screen overflow-x-hidden">
                {Loading ? (
                    <div className="flex justify-center items-center w-full h-full">
                        <p className="text-xl font-bold">Loading Photos...</p>
                    </div>
                ) : (
                    <div className="w-full flex flex-col lg:flex-row justify-center items-center md:justify-between">
                        <img className="h-8 md:h-15" src={cocologo} alt="Coco Logo" />
                        <img className="h-15 md:h-15 w-auto" src={mainlogo} alt="Main Logo" />
                    </div>
                )}
                {!Loading && (

                    <div className="p-8 font-sans w-full border-2 overflow-y-auto border-gray-400 mt-5 max-w-[1500px] rounded-xl flex flex-grow flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">

                        {Loading ? (
                            <p>Loading...</p>
                        ) : images.length === 0 ? (
                            <p className='flex-1'>No images to review.</p>
                        ) : (
                            <div className="flex flex-1 flex-col lg:flex-row h-full w-full flex-wrap gap-6">
                                <p className="text-lg font-semibold w-full text-center lg:text-start">Pending Images</p>
                                <div className="flex flex-1 flex-col lg:flex-row h-full flex-wrap gap-6 overflow-y-auto">
                                    {images.map((img, idx) => (
                                        <div
                                            key={img.id}
                                            className="border-2 border-gray-300 w-[180px] h-[250px] overflow-x-hidden overflow-y-auto rounded-md p-2 justify-center text-center bg-[#fafafa] flex flex-col items-center"
                                        >
                                            <img
                                                src={img.url}
                                                alt={`Pending ${idx}`}
                                                className="w-[140px] h-[140px] object-cover rounded"
                                            />
                                            <div className="mt-2 flex justify-between w-full gap-1 p-1">
                                                <button
                                                    className="bg-green-600 text-white rounded flex-1 text-sm hover:bg-green-700 transition-colors disabled:opacity-60"
                                                    onClick={() => handleApprove(img)}
                                                    disabled={ActionLoading}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="bg-red-600 text-white rounded flex-1 text-sm px-2 py-1 hover:bg-red-700 transition-colors disabled:opacity-60"
                                                    onClick={() => handleDisapprove(img)}
                                                    disabled={ActionLoading}
                                                >
                                                    Disapprove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className='h-[2px] w-full lg:h-full lg:w-[2px] lg:border-2 border-gray-300' />

                        {Loading ? (
                            <p>Loading...</p>
                        ) : approved.length === 0 ? (
                            <p className='flex-1'>No approved images.</p>
                        ) : (
                            <div className="flex flex-1 flex-col lg:flex-row h-full w-full flex-wrap gap-6">
                                <p className="text-lg font-semibold w-full text-center lg:text-start">Approved Images</p>
                                <div className="flex flex-1 flex-col lg:flex-row h-full w-full flex-wrap gap-6 overflow-y-auto">

                                    {approved.map((img, idx) => (
                                        <div
                                            key={img.id}
                                            className="border-2 border-gray-300 w-[180px] h-[250px] overflow-x-hidden overflow-y-auto rounded-md p-2 justify-center text-center bg-[#fafafa] flex flex-col items-center"
                                        >
                                            <img
                                                src={img.url}
                                                alt={`Approved ${idx}`}
                                                className="w-[140px] h-[140px] object-cover rounded"
                                            />
                                            <div className="mt-2 flex justify-between w-full gap-1 p-1">
                                                <button
                                                    className="bg-red-600 text-white rounded flex-1 text-sm hover:bg-red-700 transition-colors disabled:opacity-60"
                                                    onClick={() => handleDelete(img)}
                                                    disabled={ActionLoading}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}



                    </div>
                )}   <div className="w-full flex justify-center items-center mt-5 gap-3 self-end">
                    <img
                        className="h-6 w-6 cursor-pointer"
                        src={fb}
                        alt="Facebook"
                        onClick={() => { window.open('https://www.facebook.com/profile.php?id=61562872356464', '_blank'); }}
                    />
                    <img
                        className="h-6 w-6 cursor-pointer"
                        src={email}
                        alt="Instagram"
                        onClick={() => { window.open('https://www.instagram.com/numoa_coco?igsh=dnRwcjhoenZwcTM5', '_blank'); }}
                    />
                    <img
                        className="h-6 w-6 cursor-pointer"
                        src={ig}
                        alt="Email"
                        onClick={() => { window.open('mailto:numoacoco@gmail.com', '_blank'); }}
                    />
                </div>
            </div>
        </>
    )
}

export default AdminPage;
