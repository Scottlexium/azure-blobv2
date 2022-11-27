import { BlobServiceClient }  from "@azure/storage-blob";
import { uuid }  from "uuidv4";
import { DefaultAzureCredential }  from "@azure/identity";
import fs  from "fs";


export const upload = async(
    {
        containerName,
        fileName,
        filePath,
        contentType,
        useConnectionString,
        connectionString,
        accountName,
        metaData,
    }: {
        containerName: string;
        fileName?: string;
        filePath: string;
        contentType: string;
        useConnectionString: boolean;
        connectionString?: string;
        accountName: string;
        metaData?: any;
    },
    
) => {
  console.table({containerName, fileName, filePath, contentType,useConnectionString, connectionString, accountName, metaData});
    console.log('upload started...');
    try{
      if(useConnectionString) {
        if (!connectionString) throw new Error("connectionString is required");
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        if(containerClient.accountName !== accountName) throw new Error("Storage account name does not match");
        const containerExists = await containerClient.exists();
        if (!containerExists) await containerClient.create({ access: "blob" });
        fileName? fileName: fileName = uuid();
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        const file = fs.readFileSync(filePath);
        console.log('uploading...');
        const uploadBlobResponse = await blockBlobClient.upload(file, file.length, {
            blobHTTPHeaders: {
                blobContentType: contentType,
            },
            metadata: metaData,
        });    
        console.log('file uploaded!');
        const url = `${containerClient.url}/${containerName}/${fileName}`;
        return { url, success: true, message: "Image uploaded successfully",uploadBlobResponse };
    } else {
        const sharedKeyCredential = new DefaultAzureCredential();
        const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`,sharedKeyCredential,);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const containerExists = await containerClient.exists();
        if (!containerExists) await containerClient.create({ access: "blob" });
        fileName? fileName: fileName = uuid();
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        const file = fs.readFileSync(filePath);
        const uploadBlobResponse = await blockBlobClient.upload(file, file.length, {
            blobHTTPHeaders: {
                blobContentType: contentType,
            },
            metadata: metaData,
        });
        const url = `${containerClient.url}/${containerName}/${fileName}`;
        console.log(url);
        return { url, success: true, message: "Image uploaded successfully",uploadBlobResponse };
    }
    }catch(err){
      const error = err as Error;
      console.log('upload failed!');
      console.log(error.message);
      return { success: false, message: error.message };
    }
}

