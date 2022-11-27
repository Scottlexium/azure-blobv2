# :point_up_2: Azure Storage Blob Upload

## Installation

```

yarn add azure-blobv2

```

or

```

npm i azure-blobv2

```

### Code

```js
const { upload } = require('azure-blobv2');
const bunny = './big_buck_bunny.mp4';

const main = async () => {
  const result = await upload({
    containerName: 'videos',
    fileName: 'big_buck_bunny', // optional
    filePath: bunny, // required
    useConnectionString: true, //Boolean
    connectionString: '', // Azure connection string if useConnectionString is set to true
    accountName: 'youtube',
    metaData: { size: '1234567890', type: 'video' }, // optional object
  });
  console.log(result);
  // returns upload url and file upload data
};

main();
```

## Props

| Prop                           | Default | Type     | Description                                                                                                                                                                                                                     |
| ------------------------------ | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| containerName (required)       | null    | string   | The name of the container to hold the blob file uploads. eg: Videos.                                                                                                                                                            |
| fileName (optional)            | null    | string   | The name of the file being uploaded, this can be named anything actually, if not provided a random UUID will be assigned to the file's name.                                                                                    |
| filePath (required)            | null    | string   | The path to the file being uploaded. eg: '../videos/bunny.mp4'.                                                                                                                                                                 |
| useConnectionString (required) | false   | boolean  | If set to true you are required to provide an azure connection string which should be stored in an env, else Passwordless would be used which requires DefaultAzureCredential by assigning roles to your Azure AD user account. |
| connectionString (optional)    | null    | string   | A connection string includes the storage account access key and uses it to authorize requests. Always be careful to never expose the keys in an unsecure location.                                                              |
| accountName (required)         | null    | string   | This is the name of your azure blob storage bucket created, make sure it matches the one on your account as it is being validated.                                                                                              |
| metaData (optional)            | null    | Metadata | A set of data that describes and gives information about your data.                                                                                                                                                             |

## Author

Scott Lexium
