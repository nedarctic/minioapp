import { NextResponse } from "next/server";
import { minioClient, ensureBucket } from "@/lib/minio";
import { db } from "@/lib/db";
import { files } from "@/db/schema";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const formData = await req.formData();

  const file = formData.get("file") as File;
  const userId = formData.get("userId") as string;

  if (!file || !userId) {
    return NextResponse.json({ error: "Missing file or userId" }, { status: 400 });
  }

  const bucket = "uploads";
  await ensureBucket(bucket);

  const buffer = Buffer.from(await file.arrayBuffer());
  await minioClient.putObject(bucket, file.name, buffer);

  const url = `http://localhost:9000/${bucket}/${file.name}`;

  await db.insert(files).values({
    user_id: parseInt(userId),
    filename: file.name,
    url,
  });

  return NextResponse.json({ url });
}