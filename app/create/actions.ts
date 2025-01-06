"use server";

import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prismaClient } from "../lib/db";

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION || "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function getSignedURL(courseTitle:string, contentType: string, checksum: string, courseId:string, lessonTitle:string) {
  const key = `videos/${courseTitle}/${lessonTitle}.mp4`;
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

    console.log("signed url is ",signedUrl)

    await prismaClient.lesson.create({
      data: {
        title: lessonTitle,
        videoUrl: signedUrl,  // Store the presigned URL in the database
        course: {
          connect: {
            id: courseId,
          },
        },
      },
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
