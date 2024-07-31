const uploadTinyImage = async (blobInfo, success, failure) => {
    var xhr, formData;

    xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open('POST', 'http://localhost:5000/api/v1/admin/questions/image');
    // xhr.open('POST', 'https://answersheet.au/api/v1/admin/questions/image');

    xhr.onload = function () {
        var json;

        if (xhr.status !== 200) {
            failure('HTTP Error: ' + xhr.status);
            return;
        }

        json = JSON.parse(xhr.responseText);

        if (!json || typeof json.location !== 'string') {
            failure('Invalid JSON: ' + xhr.responseText);
            return;
        }

        success(json.location);
    };

    formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());

    xhr.send(formData);
}

export default uploadTinyImage;