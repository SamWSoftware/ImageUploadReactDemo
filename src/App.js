import React, { useState } from 'react';
import ImageUploader from 'react-images-upload';
import Axios from 'axios';

import './App.css';

const UploadComponent = props => (
    <form>
        <label>
            File Upload URL:
            <input id="urlInput" type="text" onChange={props.onUrlChange} value={props.url}></input>
        </label>
        <ImageUploader
            key="image-uploader"
            withIcon={true}
            singleImage={true}
            withPreview={true}
            label="Maximum size file: 5MB"
            buttonText="Choose an image"
            onChange={props.onImage}
            imgExtension={['.jpg', '.png', '.jpeg']}
            maxFileSize={5242880}
        ></ImageUploader>
    </form>
);

const App = () => {
    const [progress, setProgress] = useState('getUpload');
    const [url, setImageURL] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState('');

    const onUrlChange = e => {
        setImageURL(e.target.value);
    };

    const onImage = async (failedImages, successImages) => {
        if (!url) {
            console.log('missing Url');
            setErrorMessage('missing a url to upload to');
            setProgress('uploadError');
            return;
        }

        setProgress('uploading');

        try {
            console.log('successImages', successImages);
            const parts = successImages[0].split(';');
            const mime = parts[0].split(':')[1];
            const name = parts[1].split('=')[1];
            const data = parts[2];
            const res = await Axios.post(url, { mime, name, image: data });

            setImageURL(res.data.imageURL);
            setProgress('uploaded');
        } catch (error) {
            console.log('error in upload', error);
            setErrorMessage(error.message);
            setProgress('uploadError');
        }
    };

    const content = () => {
        switch (progress) {
            case 'getUpload':
                return <UploadComponent onUrlChange={onUrlChange} onImage={onImage} url={url} />;
            case 'uploading':
                return <h2>Uploading....</h2>;
            case 'uploaded':
                return <img src={url} alt="uploaded" />;
            case 'uploadError':
                return (
                    <>
                        <div>Error message = {errorMessage}</div>
                        <UploadComponent onUrlChange={onUrlChange} onImage={onImage} url={url} />
                    </>
                );
        }
    };

    return (
        <div className="App">
            <h1>Image Upload Website</h1>
            {content()}
        </div>
    );
};

export default App;
