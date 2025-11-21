// src/components/organisms/CreateModal.jsx
import React, { useState, useEffect } from 'react';
import DynamicInputs from '../molecules/DynamicInput';
import Button from '../atoms/Button';
import InputFile from '../atoms/InputFile';
import { uploadToImgBB } from '../../utils/uploadImage';

function CreateModal({ isOpen, onClose, onSubmit, inputsConfig = [], title = "Crear nuevo", submitText = "Guardar", loading = false, initialData = {},}) {
    const [formData, setFormData] = useState(initialData);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const initial = initialData && Object.keys(initialData).length > 0 ? { ...initialData } : {};

            if (!initialData || Object.keys(initialData).length === 0) {
                inputsConfig.forEach((input) => {
                    initial[input.name] = input.value || '';
                });
            }

            setFormData(initial);
            setImagePreview(initialData?.logo || null);
        }
    }, [isOpen, inputsConfig, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const { url, preview } = await uploadToImgBB(file);
            setFormData((prev) => ({ ...prev, logo: url }));
            setImagePreview(preview);
        } catch (error) {
            alert("Error al subir imagen: " + error.message);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 max-h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" disabled={loading || uploadingImage} >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {inputsConfig.map((input) => {
                        if (input.name === "logo") {
                            return (
                                <div key="logo" className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Logo</label>
                                    <InputFile onChange={handleImageChange} disabled={uploadingImage || loading} preview={imagePreview} />
                                    {uploadingImage && (
                                        <p className="text-xs text-blue-600 flex items-center gap-1">
                                            <span className="inline-block w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                                            Optimizando y subiendo...
                                        </p>
                                    )}
                                    {imagePreview && !uploadingImage && (
                                        <p className="text-xs text-green-600 flex items-center gap-1">
                                            Imagen lista
                                        </p>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <div key={input.name} className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 capitalize">
                                    {input.name}
                                </label>
                                <DynamicInputs
                                    Inputs={[{
                                        ...input,
                                        value: formData[input.name] || '',
                                        onChange: handleChange,
                                    }]}
                                    className=""
                                />
                            </div>
                        );
                    })}

                    <div className="flex gap-3 pt-4">
                        <Button
                            text={loading ? "Guardando..." : submitText}
                            className={`
                                flex-1 py-2.5 px-4 rounded-lg font-medium text-white transition-all
                                ${loading || uploadingImage ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}
                            `}
                            disabled={loading || uploadingImage}
                        />
                        <Button text="Cancelar" onClick={onClose} 
                                className="flex-1 py-2.5 px-4 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-95 transition-all"
                                disabled={loading || uploadingImage}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateModal;