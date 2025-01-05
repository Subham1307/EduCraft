"use server";

import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION || "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function getSignedURL(key: string, contentType: string, checksum: string) {
  try {
    if (!process.env.AWS_BUCKET_NAME) {
      throw new Error("AWS_BUCKET_NAME is not defined in the environment variables.");
    }

    if (!key) {
      throw new Error("Key is required to generate a signed URL.");
    }

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      Metadata: {
        checksum, // Pass checksum as metadata
      },
    });

    const signedUrl = await getSignedUrl(s3, putObjectCommand, {
      expiresIn: 60, // URL expiration time in seconds
    });

    return { success: { url: signedUrl } };
  } catch (error) {
    console.error("Error generating signed URL:", error.message);
    return { error: error.message || "Failed to generate signed URL." };
  }
}

export async function verifyChecksum(key: string, expectedChecksum: string) {
  try {
    const headObjectCommand = new HeadObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    const metadata = await s3.send(headObjectCommand);
    const uploadedChecksum = metadata.Metadata?.checksum;

    if (uploadedChecksum === expectedChecksum) {
      return { success: true, message: "Checksum verified successfully." };
    } else {
      return { success: false, message: "Checksum mismatch detected." };
    }
  } catch (error) {
    console.error("Error verifying checksum:", error.message);
    return { error: error.message || "Failed to verify checksum." };
  }
}
