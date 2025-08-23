import { NextResponse } from 'next/server';
import JSZip from 'jszip';
import path from 'node:path';
import { promises as fs } from 'node:fs';

const BASE = path.join(process.cwd(), 'public', 'demo-bundle', 'pf_demo_v1');
const NAMES = [
  'prompt.txt',
  'prompt.md',
  'prompt.json',
  'prompt.pdf',
  'telemetry.json',
  'manifest.json',
  'checksum.txt',
];

export async function GET() {
  try {
    const zip = new JSZip();

    // Add all files to the ZIP in canonical order
    for (const name of NAMES) {
      try {
        const filePath = path.join(BASE, name);
        const buffer = await fs.readFile(filePath);
        zip.file(name, buffer);
      } catch (error) {
        console.error(`Error reading file ${name}:`, error);
        // Continue with other files, don't fail entire ZIP
      }
    }

    // Generate the ZIP
    const zipBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6,
      },
    });

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="pf_demo_v1.zip"',
        'Content-Length': zipBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600, immutable',
        'X-Bundle-ID': 'pf-demo-v1',
        'X-Bundle-Version': '1.0.0',
      },
    });
  } catch (error) {
    console.error('Error generating demo bundle ZIP:', error);

    return new NextResponse(
      JSON.stringify({
        error: 'Failed to generate demo bundle',
        message: 'Unable to create ZIP file',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
